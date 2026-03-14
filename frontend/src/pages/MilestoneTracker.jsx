/**
 * MilestoneTracker.jsx
 *
 * Fully dynamic milestone submission + AI verification + payment page.
 * - Freelancer: submits GitHub link per milestone → AI verifies → payment auto-released
 * - Client: sees live milestone progress, AI scores, payment history
 *
 * Uses uploaded project-milestone.jsx as the foundation, extended with:
 *   - Real API calls to /api/milestones/*
 *   - AI verification result display (score, feedback, status)
 *   - Wallet balance + transaction panel
 *   - Socket.IO live updates on milestone_updated
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { connectSocket } from "../socket";

/* ── constants ─────────────────────────────────────────────────────────────── */
const STATUS_META = {
  pending:     { label:"Pending",      bg:"#fefce8", color:"#92400e", dot:"#f59e0b", border:"#fde68a" },
  submitted:   { label:"Under Review", bg:"#eff6ff", color:"#1d4ed8", dot:"#3b82f6", border:"#bfdbfe" },
  "in-review": { label:"AI Reviewing", bg:"#f5f3ff", color:"#6d28d9", dot:"#8b5cf6", border:"#c4b5fd" },
  completed:   { label:"Completed",    bg:"#f0fdf4", color:"#166534", dot:"#10b981", border:"#a7f3d0" },
  paid:        { label:"Paid",         bg:"#ecfdf5", color:"#065f46", dot:"#059669", border:"#6ee7b7" },
  rejected:    { label:"Needs Revision",bg:"#fef2f2",color:"#991b1b", dot:"#ef4444", border:"#fecaca" },
};

const AI_STATUS_META = {
  approved:       { icon:"✅", color:"#059669", bg:"#ecfdf5" },
  needs_revision: { icon:"⚠️", color:"#d97706", bg:"#fffbeb" },
  rejected:       { icon:"❌", color:"#dc2626", bg:"#fef2f2" },
  pending:        { icon:"🔄", color:"#6366f1", bg:"#eef2ff" },
};

/* ── helpers ──────────────────────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position:"relative", width:"72px", height:"72px", flexShrink:0 }}>
      <svg width="72" height="72" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6"/>
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.8s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:"16px", fontWeight:"800", color }}>{score}</span>
      </div>
    </div>
  );
};

const Spinner = ({ size = 20, color = "#6366f1" }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", border:`2px solid ${color}33`, borderTopColor:color, animation:"ms-spin 0.7s linear infinite", flexShrink:0 }}/>
);

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function MilestoneTracker() {
  const { projectId } = useParams();
  const navigate      = useNavigate();
  const userStr       = localStorage.getItem("user");
  const user          = userStr ? JSON.parse(userStr) : null;

  /* ── state ── */
  const [project,      setProject]      = useState(null);
  const [milestones,   setMilestones]   = useState([]);
  const [wallet,       setWallet]       = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState("");

  /* submit modal */
  const [submitModal,    setSubmitModal]    = useState(null);  // milestone object
  const [githubLink,     setGithubLink]     = useState("");
  const [submitNotes,    setSubmitNotes]    = useState("");
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [submitResult,   setSubmitResult]   = useState(null);  // last AI result

  /* tabs */
  const [activeTab, setActiveTab] = useState("milestones");

  /* ── determine view ── */
  const viewAs = project
    ? (String(project.employerId?._id || project.employerId) === String(user?.id) ? "client" : "freelancer")
    : "freelancer";

  /* ── load project + milestones + wallet ── */
  const loadData = useCallback(async () => {
    if (!projectId || !user) return;
    setIsLoading(true);
    try {
      const [projRes, milRes, walletRes, txRes] = await Promise.all([
        api.getProjectById(projectId),
        api.getMilestones(projectId),
        api.getWallet(),
        api.getTransactions(),
      ]);
      setProject(projRes);
      setMilestones(milRes.milestones || []);
      setWallet(walletRes);
      setTransactions(txRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Socket: live milestone updates ── */
  useEffect(() => {
    if (!user) return;
    const sock = connectSocket(user.id);
    sock.on("milestone_updated", ({ projectId: pid }) => {
      if (String(pid) === String(projectId)) loadData();
    });
    return () => sock.off("milestone_updated");
  }, [user?.id, projectId, loadData]);

  /* ── computed stats ── */
  const totalMs    = milestones.length;
  const doneMs     = milestones.filter(m => ["completed","paid"].includes(m.status)).length;
  const pendingMs  = totalMs - doneMs;
  const pct        = totalMs > 0 ? Math.round((doneMs / totalMs) * 100) : 0;
  const totalPaid  = milestones
    .filter(m => ["completed","paid"].includes(m.status))
    .reduce((s, m) => s + (m.budget_allocation || 0), 0);
  const totalBudget= milestones.reduce((s, m) => s + (m.budget_allocation || 0), 0);

  /* ── submit handler ── */
  const handleSubmit = async () => {
    if (!githubLink.trim()) { alert("Please enter your GitHub repository URL."); return; }
    const ghPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/i;
    if (!ghPattern.test(githubLink.trim())) {
      alert("Please enter a valid GitHub URL (e.g. https://github.com/user/repo).");
      return;
    }
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const result = await api.submitMilestone(projectId, submitModal._id, {
        githubLink: githubLink.trim(),
        notes:      submitNotes.trim(),
      });
      setSubmitResult(result);
      // Refresh milestones immediately
      const fresh = await api.getMilestones(projectId);
      setMilestones(fresh.milestones || []);
      // Refresh wallet if payment was released
      if (result.paymentReleased) {
        const w = await api.getWallet();
        setWallet(w);
        const tx = await api.getTransactions();
        setTransactions(tx);
      }
    } catch (err) {
      alert("Submission failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSubmitModal(null);
    setGithubLink("");
    setSubmitNotes("");
    setSubmitResult(null);
  };

  /* ════════════ RENDER ════════════ */
  if (!user) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"'DM Sans',-apple-system,sans-serif" }}>
      <p>Please log in to view milestones.</p>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',-apple-system,sans-serif" }}>
      <style>{`
        @keyframes ms-spin { to { transform: rotate(360deg); } }
        @keyframes ms-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ms-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .ms-card:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.12) !important; border-color: #c7d2fe !important; transform: translateY(-1px); }
        .ms-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .ms-tab:hover { background: #f1f5f9 !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#0f172a,#1e1b4b)", padding:"0" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"20px 32px" }}>
          <button onClick={() => navigate(-1)}
            style={{ display:"flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.8)", padding:"8px 16px", borderRadius:"8px", cursor:"pointer", fontSize:"13px", marginBottom:"16px" }}>
            ← Back
          </button>
          {isLoading ? (
            <div style={{ height:"24px", width:"300px", background:"rgba(255,255,255,0.1)", borderRadius:"6px" }}/>
          ) : (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap", marginBottom:"6px" }}>
                <h1 style={{ fontSize:"22px", fontWeight:"800", color:"white", margin:0, letterSpacing:"-0.02em" }}>
                  {project?.title || project?.description?.slice(0,60) || "Project"}
                </h1>
                <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"700",
                  background: viewAs==="client" ? "rgba(99,102,241,0.3)" : "rgba(16,185,129,0.3)",
                  color: viewAs==="client" ? "#a5b4fc" : "#6ee7b7",
                  border: viewAs==="client" ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(16,185,129,0.4)",
                }}>
                  {viewAs === "client" ? "👔 Client View" : "💼 Freelancer View"}
                </span>
              </div>
              <div style={{ display:"flex", gap:"20px", fontSize:"13px", color:"rgba(255,255,255,0.55)", flexWrap:"wrap" }}>
                <span>Budget: <strong style={{ color:"#6ee7b7" }}>Rs.{Number(project?.total_budget||0).toLocaleString()}</strong></span>
                {project?.timeline && <span>Timeline: <strong style={{ color:"rgba(255,255,255,0.8)" }}>{project.timeline}</strong></span>}
                <span>Status: <strong style={{ color:"#f59e0b" }}>{project?.status}</strong></span>
              </div>
            </>
          )}
        </div>

        {/* Stat bar */}
        <div style={{ background:"rgba(0,0,0,0.2)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"14px 32px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0" }}>
            {[
              { label:"Total",     value: totalMs,    color:"#a5b4fc" },
              { label:"Completed", value: doneMs,     color:"#6ee7b7" },
              { label:"Pending",   value: pendingMs,  color:"#fcd34d" },
              { label:"Progress",  value: `${pct}%`,  color: pct===100?"#34d399":"#a5b4fc" },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:"center", borderRight: i<3?"1px solid rgba(255,255,255,0.08)":"none", padding:"4px 0" }}>
                <p style={{ fontSize:"22px", fontWeight:"800", color:s.color, margin:"0 0 2px", letterSpacing:"-0.02em" }}>{isLoading?"—":s.value}</p>
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)", margin:0, fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"28px 32px" }}>

        {error && (
          <div style={{ padding:"14px 18px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", color:"#b91c1c", marginBottom:"20px", fontSize:"14px" }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"24px", alignItems:"start" }}>

          {/* ── Left: milestones ── */}
          <div>
            {/* Tabs */}
            <div style={{ display:"flex", gap:"4px", background:"white", borderRadius:"12px", padding:"5px", border:"1px solid #e5e7eb", marginBottom:"20px", width:"fit-content", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              {[
                { id:"milestones",   label:"Milestones" },
                { id:"transactions", label:"Transactions" },
              ].map(t => (
                <button key={t.id} className="ms-tab" onClick={() => setActiveTab(t.id)}
                  style={{ padding:"8px 18px", borderRadius:"8px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"600", transition:"all 0.15s",
                    background: activeTab===t.id ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent",
                    color:      activeTab===t.id ? "white" : "#64748b",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Progress bar ── */}
            {activeTab === "milestones" && (
              <div style={{ background:"white", borderRadius:"16px", padding:"20px 24px", marginBottom:"20px", border:"1px solid #f3f4f6", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                  <span style={{ fontWeight:"700", color:"#0f172a", fontSize:"14px" }}>Overall Progress</span>
                  <span style={{ fontSize:"13px", color:"#64748b" }}>{doneMs}/{totalMs} milestones done</span>
                </div>
                <div style={{ height:"10px", background:"#f1f5f9", borderRadius:"10px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background: pct===100 ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:"10px", transition:"width 0.6s ease" }}/>
                </div>
                {totalBudget > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:"10px", fontSize:"12px", color:"#94a3b8" }}>
                    <span>Released: <strong style={{ color:"#059669" }}>Rs.{totalPaid.toLocaleString()}</strong></span>
                    <span>Total: <strong style={{ color:"#374151" }}>Rs.{totalBudget.toLocaleString()}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* ── Milestones list ── */}
            {activeTab === "milestones" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {isLoading ? (
                  [1,2,3].map(i => (
                    <div key={i} style={{ background:"white", borderRadius:"16px", padding:"22px 24px", border:"1px solid #f3f4f6", height:"120px" }}>
                      {[80,60].map((w,j) => <div key={j} style={{ height:"14px", width:`${w}%`, background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize:"200% 100%", animation:"ms-shimmer 1.5s infinite", borderRadius:"6px", marginBottom:"10px" }}/>)}
                    </div>
                  ))
                ) : milestones.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 20px", background:"white", borderRadius:"16px", border:"1px solid #f3f4f6" }}>
                    <div style={{ fontSize:"48px", marginBottom:"12px" }}>📋</div>
                    <p style={{ fontWeight:"700", color:"#0f172a", margin:"0 0 6px" }}>No milestones yet</p>
                    <p style={{ color:"#94a3b8", fontSize:"14px", margin:0 }}>Milestones will appear once added to this project.</p>
                  </div>
                ) : (
                  milestones.map((m, idx) => {
                    const sm     = STATUS_META[m.status] || STATUS_META.pending;
                    const aiVer  = m.submission?.aiVerification;
                    const aiMeta = aiVer ? (AI_STATUS_META[aiVer.status] || AI_STATUS_META.pending) : null;

                    return (
                      <div key={m._id} className="ms-card" style={{
                        background:"white", borderRadius:"18px", padding:"22px 24px",
                        border:`1.5px solid ${m.status==="completed"||m.status==="paid" ? "#a7f3d0" : m.status==="rejected" ? "#fecaca" : "#f3f4f6"}`,
                        boxShadow:"0 2px 10px rgba(0,0,0,0.04)", transition:"all 0.2s",
                        animation:"ms-fadein 0.3s ease",
                      }}>
                        {/* ── Milestone header ── */}
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px", marginBottom:"12px" }}>
                          <div style={{ display:"flex", gap:"14px", alignItems:"flex-start", flex:1 }}>
                            {/* Number bubble */}
                            <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:`linear-gradient(135deg,#6366f1,#8b5cf6)`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"800", fontSize:"14px", flexShrink:0 }}>
                              {idx + 1}
                            </div>
                            <div style={{ flex:1 }}>
                              <p style={{ fontSize:"10px", fontWeight:"700", color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 4px" }}>
                                Milestone {idx + 1}
                              </p>
                              <h3 style={{ fontSize:"16px", fontWeight:"700", color:"#0f172a", margin:"0 0 4px" }}>{m.title}</h3>
                              {m.description && <p style={{ fontSize:"13px", color:"#64748b", margin:0, lineHeight:"1.5" }}>{m.description}</p>}
                            </div>
                          </div>
                          {/* Status badge */}
                          <span style={{ padding:"5px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:"700", background:sm.bg, color:sm.color, border:`1px solid ${sm.border}`, display:"flex", alignItems:"center", gap:"6px", flexShrink:0, whiteSpace:"nowrap" }}>
                            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:sm.dot }}/>
                            {sm.label}
                          </span>
                        </div>

                        {/* ── Meta row ── */}
                        <div style={{ display:"flex", gap:"16px", flexWrap:"wrap", marginBottom:"14px" }}>
                          {m.budget_allocation > 0 && (
                            <span style={{ fontSize:"14px", fontWeight:"700", color:"#059669", background:"#ecfdf5", padding:"4px 12px", borderRadius:"8px", border:"1px solid #a7f3d0" }}>
                              💰 Rs.{Number(m.budget_allocation).toLocaleString()}
                            </span>
                          )}
                          {m.timeline && (
                            <span style={{ fontSize:"13px", color:"#6b7280", display:"flex", alignItems:"center", gap:"4px" }}>
                              ⏱ {m.timeline}
                            </span>
                          )}
                          {m.paidAt && (
                            <span style={{ fontSize:"12px", color:"#059669" }}>
                              Paid: {new Date(m.paidAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* ── AI Verification Result ── */}
                        {aiVer && (
                          <div style={{ background: aiMeta?.bg || "#f9fafb", borderRadius:"12px", padding:"14px 16px", marginBottom:"14px", border:`1px solid ${aiVer.status==="approved"?"#a7f3d0":aiVer.status==="rejected"?"#fecaca":"#e0e7ff"}` }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                              <ScoreRing score={aiVer.score || 0}/>
                              <div style={{ flex:1 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                                  <span style={{ fontSize:"13px", fontWeight:"700", color: aiMeta?.color }}>
                                    {aiMeta?.icon} AI Verification — {(aiVer.status||"").replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
                                  </span>
                                  {aiVer._fallback && <span style={{ fontSize:"11px", color:"#94a3b8", background:"#f1f5f9", padding:"2px 8px", borderRadius:"6px" }}>Fallback</span>}
                                </div>
                                <p style={{ fontSize:"13px", color:"#374151", margin:0, lineHeight:"1.5" }}>{aiVer.feedback}</p>
                                {aiVer.verifiedAt && (
                                  <p style={{ fontSize:"11px", color:"#9ca3af", margin:"6px 0 0" }}>
                                    Verified: {new Date(aiVer.verifiedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── GitHub link (if submitted) ── */}
                        {m.submission?.githubLink && (
                          <div style={{ background:"#f8fafc", borderRadius:"10px", padding:"12px 14px", marginBottom:"14px", border:"1px solid #e2e8f0" }}>
                            <p style={{ fontSize:"12px", fontWeight:"700", color:"#374151", margin:"0 0 8px", display:"flex", alignItems:"center", gap:"6px" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                              GitHub Repository
                            </p>
                            <a href={m.submission.githubLink} target="_blank" rel="noopener noreferrer"
                              style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"13px", color:"#4f46e5", textDecoration:"none", wordBreak:"break-all" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                              {m.submission.githubLink}
                            </a>
                            {m.submission.notes && (
                              <p style={{ fontSize:"12px", color:"#6b7280", margin:"8px 0 0", fontStyle:"italic" }}>"{m.submission.notes}"</p>
                            )}
                          </div>
                        )}

                        {/* ── Client: awaiting freelancer ── */}
                        {viewAs === "client" && ["pending","in-review"].includes(m.status) && !m.submission && (
                          <div style={{ padding:"10px 14px", background:"#f9fafb", borderRadius:"8px", border:"1px solid #e5e7eb", fontSize:"13px", color:"#9ca3af", display:"flex", gap:"8px", alignItems:"center" }}>
                            <span>🕐</span> Awaiting freelancer submission
                          </div>
                        )}

                        {/* ── Freelancer: submit button ── */}
                        {viewAs === "freelancer" && m.status === "pending" && (
                          <button
                            className="ms-btn-primary"
                            onClick={() => { setSubmitModal(m); setGithubLink(""); setSubmitNotes(""); setSubmitResult(null); }}
                            style={{ padding:"10px 22px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"white", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"700", fontSize:"14px", display:"flex", alignItems:"center", gap:"8px", transition:"all 0.2s", boxShadow:"0 4px 14px rgba(99,102,241,0.3)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Submit Milestone
                          </button>
                        )}

                        {/* Freelancer: re-submit if rejected */}
                        {viewAs === "freelancer" && m.status === "rejected" && (
                          <button
                            className="ms-btn-primary"
                            onClick={() => { setSubmitModal(m); setGithubLink(m.submission?.githubLink||""); setSubmitNotes(""); setSubmitResult(null); }}
                            style={{ padding:"10px 22px", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"white", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"700", fontSize:"14px", display:"flex", alignItems:"center", gap:"8px", transition:"all 0.2s" }}>
                            🔄 Resubmit Milestone
                          </button>
                        )}

                        {/* Freelancer: submitted confirmation */}
                        {viewAs === "freelancer" && ["completed","paid"].includes(m.status) && (
                          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 16px", background:"#ecfdf5", border:"1px solid #a7f3d0", borderRadius:"8px", fontSize:"13px", color:"#059669", fontWeight:"600" }}>
                            ✅ Submitted & Paid
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── Transactions tab ── */}
            {activeTab === "transactions" && (
              <div style={{ background:"white", borderRadius:"18px", border:"1px solid #f3f4f6", overflow:"hidden" }}>
                <div style={{ padding:"18px 24px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:"700", color:"#0f172a", fontSize:"15px" }}>Transaction History</span>
                  <span style={{ fontSize:"12px", color:"#9ca3af" }}>{transactions.length} transactions</span>
                </div>
                {transactions.length === 0 ? (
                  <div style={{ padding:"50px 20px", textAlign:"center", color:"#9ca3af" }}>
                    <div style={{ fontSize:"36px", marginBottom:"8px" }}>💳</div>
                    <p style={{ margin:0, fontSize:"14px" }}>No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx, i) => {
                    const isIncoming = String(tx.toUserId) === String(user?.id);
                    return (
                      <div key={tx._id || i} style={{ padding:"16px 24px", borderBottom:"1px solid #f8fafc", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" }}>
                        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                          <div style={{ width:"36px", height:"36px", borderRadius:"10px", background: isIncoming?"#ecfdf5":"#fef2f2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>
                            {isIncoming ? "↓" : "↑"}
                          </div>
                          <div>
                            <p style={{ fontWeight:"600", color:"#0f172a", margin:"0 0 2px", fontSize:"14px" }}>{tx.description || tx.type}</p>
                            <p style={{ fontSize:"12px", color:"#94a3b8", margin:0 }}>
                              {tx.milestoneTitle && `${tx.milestoneTitle} · `}
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize:"16px", fontWeight:"800", color: isIncoming?"#059669":"#dc2626" }}>
                          {isIncoming ? "+" : "-"}Rs.{Number(tx.amount).toLocaleString()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* ── Right sidebar: wallet ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"16px", position:"sticky", top:"24px" }}>

            {/* Wallet card */}
            <div style={{ background:"linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius:"18px", padding:"22px 24px", color:"white", boxShadow:"0 8px 32px rgba(49,46,129,0.3)" }}>
              <p style={{ fontSize:"11px", fontWeight:"700", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Your Wallet</p>
              <p style={{ fontSize:"32px", fontWeight:"800", margin:"0 0 2px", letterSpacing:"-0.02em" }}>
                Rs.{Number(wallet?.balance || 0).toLocaleString()}
              </p>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", margin:"0 0 16px" }}>Available balance</p>
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div>
                  <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", margin:"0 0 3px", fontWeight:"600" }}>EARNED</p>
                  <p style={{ fontSize:"16px", fontWeight:"700", color:"#6ee7b7", margin:0 }}>Rs.{Number(wallet?.totalEarned||0).toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", margin:"0 0 3px", fontWeight:"600" }}>SPENT</p>
                  <p style={{ fontSize:"16px", fontWeight:"700", color:"#fca5a5", margin:0 }}>Rs.{Number(wallet?.totalSpent||0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Project budget card */}
            <div style={{ background:"white", borderRadius:"16px", padding:"20px 22px", border:"1px solid #f3f4f6", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <p style={{ fontWeight:"700", color:"#0f172a", fontSize:"14px", margin:"0 0 14px" }}>Project Budget</p>
              {milestones.map((m, i) => {
                const done = ["completed","paid"].includes(m.status);
                return (
                  <div key={m._id} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                    <div style={{ width:"8px", height:"8px", borderRadius:"50%", background: done?"#10b981":"#e2e8f0", flexShrink:0 }}/>
                    <span style={{ fontSize:"12px", color: done?"#0f172a":"#94a3b8", flex:1, fontWeight: done?"600":"400" }}>
                      {m.title.length > 24 ? m.title.slice(0,24)+"…" : m.title}
                    </span>
                    <span style={{ fontSize:"12px", fontWeight:"700", color: done?"#059669":"#94a3b8" }}>
                      Rs.{Number(m.budget_allocation||0).toLocaleString()}
                    </span>
                  </div>
                );
              })}
              {milestones.length > 0 && (
                <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:"10px", marginTop:"6px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"12px", fontWeight:"700", color:"#374151" }}>Total</span>
                  <span style={{ fontSize:"14px", fontWeight:"800", color:"#0f172a" }}>Rs.{totalBudget.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div style={{ background:"white", borderRadius:"16px", padding:"20px 22px", border:"1px solid #f3f4f6", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <p style={{ fontWeight:"700", color:"#0f172a", fontSize:"14px", margin:"0 0 12px" }}>Payment Status</p>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f8fafc", fontSize:"13px" }}>
                <span style={{ color:"#64748b" }}>Released</span>
                <span style={{ fontWeight:"700", color:"#059669" }}>Rs.{totalPaid.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", fontSize:"13px" }}>
                <span style={{ color:"#64748b" }}>Remaining</span>
                <span style={{ fontWeight:"700", color:"#0f172a" }}>Rs.{(totalBudget - totalPaid).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ SUBMIT MODAL ════════════ */}
      {submitModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.65)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"20px" }}
          onClick={() => !isSubmitting && closeModal()}>
          <div style={{ background:"white", borderRadius:"20px", padding:"32px", maxWidth:"520px", width:"100%", boxShadow:"0 32px 80px rgba(0,0,0,0.3)", animation:"ms-fadein 0.3s ease" }}
            onClick={e => e.stopPropagation()}>

            {/* If no result yet — submission form */}
            {!submitResult ? (
              <>
                <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"18px", fontSize:"24px" }}>
                  🚀
                </div>
                <h2 style={{ fontSize:"20px", fontWeight:"800", color:"#0f172a", margin:"0 0 6px" }}>Submit Milestone</h2>
                <p style={{ fontSize:"14px", color:"#64748b", margin:"0 0 6px" }}>
                  <strong style={{ color:"#4f46e5" }}>{submitModal.title}</strong>
                </p>
                <p style={{ fontSize:"13px", color:"#9ca3af", margin:"0 0 24px", lineHeight:"1.5" }}>
                  Provide your GitHub repository link. Our AI will verify the work and, if approved (score ≥ 70), automatically release
                  {submitModal.budget_allocation > 0 && <strong style={{ color:"#059669" }}> Rs.{Number(submitModal.budget_allocation).toLocaleString()}</strong>} to your wallet.
                </p>

                <label style={{ fontSize:"13px", fontWeight:"700", color:"#374151", display:"block", marginBottom:"6px" }}>
                  GitHub Repository URL *
                </label>
                <div style={{ position:"relative", marginBottom:"8px" }}>
                  <svg style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }} width="18" height="18" viewBox="0 0 24 24" fill="#9ca3af">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <input
                    type="url"
                    value={githubLink}
                    onChange={e => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    disabled={isSubmitting}
                    style={{ width:"100%", padding:"13px 14px 13px 44px", border:"2px solid #e5e7eb", borderRadius:"12px", fontSize:"14px", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s", fontFamily:"inherit" }}
                    onFocus={e => e.target.style.borderColor="#6366f1"}
                    onBlur={e => e.target.style.borderColor="#e5e7eb"}
                  />
                </div>
                <p style={{ fontSize:"12px", color:"#9ca3af", margin:"0 0 18px" }}>e.g. https://github.com/yourusername/project-repo</p>

                <label style={{ fontSize:"13px", fontWeight:"700", color:"#374151", display:"block", marginBottom:"6px" }}>
                  Notes (optional)
                </label>
                <textarea
                  value={submitNotes}
                  onChange={e => setSubmitNotes(e.target.value)}
                  placeholder="Any notes about your implementation or what was completed…"
                  disabled={isSubmitting}
                  style={{ width:"100%", padding:"12px 14px", border:"2px solid #e5e7eb", borderRadius:"12px", fontSize:"14px", outline:"none", resize:"vertical", minHeight:"80px", boxSizing:"border-box", fontFamily:"inherit" }}
                  onFocus={e => e.target.style.borderColor="#6366f1"}
                  onBlur={e => e.target.style.borderColor="#e5e7eb"}
                />

                <div style={{ display:"flex", gap:"10px", marginTop:"24px", justifyContent:"flex-end" }}>
                  <button onClick={closeModal} disabled={isSubmitting}
                    style={{ padding:"11px 22px", border:"2px solid #e5e7eb", background:"white", borderRadius:"10px", cursor:"pointer", fontWeight:"600", fontSize:"14px", color:"#374151" }}>
                    Cancel
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting || !githubLink.trim()}
                    style={{ padding:"11px 24px", background: isSubmitting||!githubLink.trim() ? "#e5e7eb" : "linear-gradient(135deg,#10b981,#059669)", color: isSubmitting||!githubLink.trim() ? "#9ca3af" : "white", border:"none", borderRadius:"10px", cursor: isSubmitting||!githubLink.trim() ? "not-allowed" : "pointer", fontWeight:"700", fontSize:"14px", display:"flex", alignItems:"center", gap:"8px", transition:"all 0.2s" }}>
                    {isSubmitting ? (
                      <><Spinner size={16} color="white"/> Verifying with AI…</>
                    ) : (
                      <>✓ Submit & Verify</>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* ── Result panel after AI verification ── */
              <div style={{ animation:"ms-fadein 0.4s ease" }}>
                <div style={{ textAlign:"center", marginBottom:"20px" }}>
                  <div style={{ fontSize:"56px", marginBottom:"8px" }}>
                    {submitResult.paymentReleased ? "🎉" : submitResult.aiVerification?.status === "needs_revision" ? "⚠️" : "❌"}
                  </div>
                  <h2 style={{ fontSize:"20px", fontWeight:"800", color:"#0f172a", margin:"0 0 6px" }}>
                    {submitResult.paymentReleased ? "Milestone Approved!" : "Revision Required"}
                  </h2>
                  <p style={{ fontSize:"14px", color:"#64748b", margin:0 }}>{submitResult.message}</p>
                </div>

                {/* Score display */}
                {submitResult.aiVerification && (
                  <div style={{ background:"#f9fafb", borderRadius:"14px", padding:"18px 20px", marginBottom:"16px", display:"flex", gap:"16px", alignItems:"flex-start" }}>
                    <ScoreRing score={submitResult.aiVerification.score || 0}/>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:"700", color:"#0f172a", margin:"0 0 6px", fontSize:"14px" }}>
                        AI Score: {submitResult.aiVerification.score}/100
                      </p>
                      <p style={{ fontSize:"13px", color:"#374151", margin:0, lineHeight:"1.5" }}>
                        {submitResult.aiVerification.feedback}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment confirmed */}
                {submitResult.paymentReleased && submitResult.amount > 0 && (
                  <div style={{ background:"#ecfdf5", border:"1px solid #a7f3d0", borderRadius:"12px", padding:"14px 18px", marginBottom:"16px", display:"flex", alignItems:"center", gap:"12px" }}>
                    <span style={{ fontSize:"24px" }}>💸</span>
                    <div>
                      <p style={{ fontWeight:"700", color:"#065f46", margin:"0 0 2px" }}>Payment Released</p>
                      <p style={{ fontSize:"14px", color:"#059669", margin:0 }}>
                        <strong>Rs.{Number(submitResult.amount).toLocaleString()}</strong> added to your wallet
                      </p>
                    </div>
                  </div>
                )}

                <button onClick={closeModal}
                  style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"white", border:"none", borderRadius:"12px", cursor:"pointer", fontWeight:"700", fontSize:"15px" }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
