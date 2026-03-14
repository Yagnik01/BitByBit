import React, { useState, useEffect } from "react";
import { api } from "../api";
import ProjectBriefingWizard from "./page.jsx";

/* ── debounce ────────────────────────────────────────────────────────────── */
function useDebounce(value, delay) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

/* ── tech stack icon map ────────────────────────────────────────────────── */
const TECH_ICONS = {
  "react": "⚛️", "react.js": "⚛️", "next.js": "▲", "nextjs": "▲",
  "node.js": "🟢", "nodejs": "🟢", "python": "🐍", "typescript": "🔷",
  "mongodb": "🍃", "postgresql": "🐘", "postgres": "🐘", "mysql": "🐬",
  "aws": "☁️", "docker": "🐳", "graphql": "◈", "vue.js": "💚", "vuejs": "💚",
  "django": "🎸", "fastapi": "⚡", "redis": "🔴", "firebase": "🔥",
  "stripe": "💳", "flutter": "🦋", "tailwind": "🌊", "figma": "🎨",
  "tensorflow": "🧠", "react native": "📱", "socket.io": "🔌",
};
const getTechIcon = (name) => {
  const key = name.toLowerCase();
  return TECH_ICONS[key] || "🔧";
};

/* ── milestone status colours ───────────────────────────────────────────── */
const MILESTONE_COLORS = ["#6366f1","#8b5cf6","#a855f7","#c026d3","#db2777"];

/* ══════════════════════════════════════════════════════════════════════════
   AI SUGGESTIONS PANEL  — premium SaaS card UI
═══════════════════════════════════════════════════════════════════════════ */
const AIPanel = ({ aiData, isAnalyzing, error, onOpenWizard }) => {
  const [expanded, setExpanded] = useState(true);

  if (!isAnalyzing && !aiData && !error) return null;

  return (
    <div style={{
      marginTop: "28px",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.06)",
      border: "1px solid rgba(99,102,241,0.2)",
      fontFamily: "'Sora', 'DM Sans', -apple-system, sans-serif",
      animation: "aiPanelIn 0.45s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <style>{`
        @keyframes aiPanelIn { from { opacity:0; transform:translateY(12px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes shimmerAI { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin2 { to { transform: rotate(360deg); } }
        .tech-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,102,241,0.25) !important; }
        .wizard-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4) !important; }
        .milestone-card:hover { border-color: #6366f1 !important; box-shadow: 0 4px 20px rgba(99,102,241,0.12) !important; }
      `}</style>

      {/* ── Header bar ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
        padding: "18px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{
            width:"36px", height:"36px", borderRadius:"10px",
            background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px",
          }}>✨</div>
          <div>
            <p style={{ color:"white", fontWeight:"700", fontSize:"15px", margin:0, letterSpacing:"-0.01em" }}>
              AI Project Intelligence
            </p>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"12px", margin:0 }}>
              {isAnalyzing ? "Analyzing your description…" : aiData?._fallback ? "Smart defaults applied" : "Powered by Gemini 2.5 Flash"}
            </p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          {isAnalyzing && (
            <div style={{ width:"18px", height:"18px", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", animation:"spin2 0.7s linear infinite" }}/>
          )}
          {aiData && !isAnalyzing && (
            <span style={{ padding:"4px 10px", background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.4)", color:"#6ee7b7", borderRadius:"20px", fontSize:"11px", fontWeight:"600" }}>
              ● Live
            </span>
          )}
          <button onClick={() => setExpanded(!expanded)}
            style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", borderRadius:"8px", padding:"6px 10px", cursor:"pointer", fontSize:"14px" }}>
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* ── Loading skeleton ── */}
          {isAnalyzing && (
            <div style={{ padding:"24px", background:"#fafafe" }}>
              {[
                { w:"60%", h:"20px" }, { w:"40%", h:"14px" },
                { w:"100%", h:"14px" }, { w:"80%", h:"14px" }, { w:"90%", h:"14px" },
              ].map((s, i) => (
                <div key={i} style={{
                  height: s.h, width: s.w,
                  background: "linear-gradient(90deg, #ede9fe 25%, #c4b5fd 50%, #ede9fe 75%)",
                  backgroundSize: "200% 100%", animation: "shimmerAI 1.8s infinite",
                  borderRadius: "8px", marginBottom: "12px",
                }}/>
              ))}
            </div>
          )}

          {/* ── Error state ── */}
          {error && !isAnalyzing && (
            <div style={{ padding:"20px 24px", background:"#fff8f8", borderTop:"1px solid #fecaca", display:"flex", gap:"12px", alignItems:"flex-start" }}>
              <span style={{ fontSize:"20px" }}>⚠️</span>
              <div>
                <p style={{ fontWeight:"600", color:"#991b1b", margin:"0 0 4px", fontSize:"14px" }}>AI Analysis Unavailable</p>
                <p style={{ color:"#b91c1c", fontSize:"13px", margin:0 }}>{error}</p>
                <p style={{ color:"#9ca3af", fontSize:"12px", margin:"6px 0 0" }}>You can still fill in the details manually using the wizard.</p>
              </div>
            </div>
          )}

          {/* ══════════ RESULTS ══════════ */}
          {aiData && !isAnalyzing && (
            <div style={{ background:"#fafafe" }}>

              {/* ── Meta row: name / domain / budget ── */}
              <div style={{ padding:"20px 24px 0", display:"grid", gridTemplateColumns:"1fr auto auto", gap:"12px", alignItems:"start" }}>

                {/* Project name */}
                <div style={{ background:"white", borderRadius:"14px", padding:"16px 18px", border:"1px solid #e5e7eb", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <p style={{ fontSize:"10px", fontWeight:"700", color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 6px" }}>Suggested Title</p>
                  <p style={{ fontSize:"16px", fontWeight:"700", color:"#111827", margin:0, lineHeight:"1.3" }}>
                    {aiData.project_name || "—"}
                  </p>
                </div>

                {/* Domain */}
                <div style={{ background:"linear-gradient(135deg,#ede9fe,#f5f3ff)", borderRadius:"14px", padding:"16px 18px", border:"1px solid #c4b5fd", minWidth:"130px" }}>
                  <p style={{ fontSize:"10px", fontWeight:"700", color:"#7c3aed", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 6px" }}>Domain</p>
                  <p style={{ fontSize:"14px", fontWeight:"600", color:"#4c1d95", margin:0 }}>
                    📂 {aiData.domain || "General"}
                  </p>
                </div>

                {/* Budget */}
                {aiData.total_budget > 0 && (
                  <div style={{ background:"linear-gradient(135deg,#ecfdf5,#f0fdf4)", borderRadius:"14px", padding:"16px 18px", border:"1px solid #a7f3d0", minWidth:"120px" }}>
                    <p style={{ fontSize:"10px", fontWeight:"700", color:"#065f46", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 6px" }}>Budget</p>
                    <p style={{ fontSize:"14px", fontWeight:"700", color:"#059669", margin:0 }}>
                      Rs.{Number(aiData.total_budget).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Divider ── */}
              <div style={{ margin:"20px 24px 0", height:"1px", background:"linear-gradient(90deg, transparent, #e5e7eb, transparent)" }}/>

              {/* ── Tech Stack ── */}
              {Array.isArray(aiData.tech_stack) && aiData.tech_stack.length > 0 && (
                <div style={{ padding:"20px 24px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
                    <div style={{ width:"20px", height:"20px", borderRadius:"6px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px" }}>🛠</div>
                    <p style={{ fontSize:"12px", fontWeight:"700", color:"#374151", textTransform:"uppercase", letterSpacing:"0.06em", margin:0 }}>
                      Recommended Tech Stack
                    </p>
                    <span style={{ marginLeft:"auto", fontSize:"11px", color:"#9ca3af" }}>{aiData.tech_stack.length} technologies</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                    {aiData.tech_stack.map((t, i) => (
                      <span key={i} className="tech-chip" style={{
                        padding:"7px 14px", borderRadius:"20px",
                        background:"white", border:"1px solid #e5e7eb",
                        fontSize:"13px", fontWeight:"600", color:"#4b5563",
                        display:"flex", alignItems:"center", gap:"6px",
                        cursor:"default", transition:"all 0.2s",
                        boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
                      }}>
                        <span style={{ fontSize:"14px" }}>{getTechIcon(t)}</span>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Milestones ── */}
              {Array.isArray(aiData.milestones) && aiData.milestones.length > 0 && (
                <div style={{ padding:"20px 24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                    <div style={{ width:"20px", height:"20px", borderRadius:"6px", background:"linear-gradient(135deg,#8b5cf6,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px" }}>🗓</div>
                    <p style={{ fontSize:"12px", fontWeight:"700", color:"#374151", textTransform:"uppercase", letterSpacing:"0.06em", margin:0 }}>
                      Project Milestones
                    </p>
                    <span style={{ marginLeft:"auto", fontSize:"11px", color:"#9ca3af" }}>{aiData.milestones.length} phases</span>
                  </div>

                  {/* Timeline connector layout */}
                  <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
                    {aiData.milestones.map((m, i) => {
                      const accent = MILESTONE_COLORS[i % MILESTONE_COLORS.length];
                      const isLast = i === aiData.milestones.length - 1;
                      return (
                        <div key={i} style={{ display:"flex", gap:"0", alignItems:"stretch" }}>
                          {/* Connector column */}
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"32px", flexShrink:0 }}>
                            <div style={{
                              width:"28px", height:"28px", borderRadius:"50%",
                              background:`linear-gradient(135deg, ${accent}, ${accent}aa)`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              color:"white", fontWeight:"700", fontSize:"12px",
                              boxShadow:`0 2px 8px ${accent}44`, flexShrink:0, zIndex:1,
                            }}>{i + 1}</div>
                            {!isLast && <div style={{ width:"2px", flex:1, minHeight:"12px", background:`linear-gradient(${accent}, ${MILESTONE_COLORS[(i+1) % MILESTONE_COLORS.length]})`, opacity:0.3 }}/>}
                          </div>

                          {/* Card */}
                          <div className="milestone-card" style={{
                            flex:1, marginLeft:"12px", marginBottom: isLast ? "0" : "10px",
                            background:"white", borderRadius:"14px",
                            border:`1px solid #f0f0f0`,
                            padding:"14px 16px", transition:"all 0.2s",
                            boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
                          }}>
                            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px" }}>
                              <p style={{ fontWeight:"700", fontSize:"14px", color:"#111827", margin:"0 0 4px", lineHeight:"1.3" }}>{m.title}</p>
                              <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                                {m.timeline && (
                                  <span style={{ padding:"3px 10px", background:"#f3f4f6", borderRadius:"20px", fontSize:"11px", fontWeight:"600", color:"#6b7280", whiteSpace:"nowrap" }}>
                                    ⏱ {m.timeline}
                                  </span>
                                )}
                                {m.budget_allocation > 0 && (
                                  <span style={{ padding:"3px 10px", background:"#ecfdf5", border:"1px solid #a7f3d0", borderRadius:"20px", fontSize:"11px", fontWeight:"700", color:"#059669", whiteSpace:"nowrap" }}>
                                    Rs.{Number(m.budget_allocation).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {m.description && (
                              <p style={{ fontSize:"13px", color:"#6b7280", margin:0, lineHeight:"1.5" }}>{m.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total budget footer */}
                  {aiData.milestones.some(m => m.budget_allocation > 0) && (
                    <div style={{ marginTop:"14px", padding:"12px 16px", background:"linear-gradient(135deg,#ecfdf5,#f0fdf4)", borderRadius:"12px", border:"1px solid #a7f3d0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:"13px", color:"#065f46", fontWeight:"600" }}>💰 Total Budget Allocation</span>
                      <span style={{ fontSize:"16px", fontWeight:"800", color:"#059669" }}>
                        Rs.{aiData.milestones.reduce((s, m) => s + (Number(m.budget_allocation)||0), 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ── Fallback note ── */}
              {aiData._fallback && (
                <div style={{ margin:"0 24px 16px", padding:"10px 14px", background:"#fefce8", border:"1px solid #fde68a", borderRadius:"10px", fontSize:"12px", color:"#92400e" }}>
                  ℹ️ {aiData.note || "AI offline — smart defaults used based on your description."}
                </div>
              )}

              {/* ── CTA ── */}
              <div style={{ padding:"0 24px 24px", display:"flex", gap:"10px" }}>
                <button className="wizard-btn" onClick={onOpenWizard} style={{
                  flex:1, padding:"14px 20px",
                  background:"linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color:"white", border:"none", borderRadius:"12px",
                  cursor:"pointer", fontWeight:"700", fontSize:"14px",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                  boxShadow:"0 4px 16px rgba(99,102,241,0.3)", transition:"all 0.2s",
                }}>
                  ✏️ Edit & Post This Project
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   POST PROJECT PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function PostProjectPage() {
  const [description,    setDescription]    = useState("");
  const [budget,         setBudget]         = useState(5000);
  const [timeline,       setTimeline]       = useState("");
  const [customTimeline, setCustomTimeline] = useState("");
  const [files,          setFiles]          = useState([]);
  const [isAnalyzing,    setIsAnalyzing]    = useState(false);
  const [aiData,         setAiData]         = useState(null);
  const [aiError,        setAiError]        = useState("");
  const [showWizard,     setShowWizard]     = useState(false);
  const [charCount,      setCharCount]      = useState(0);

  const debouncedDesc = useDebounce(description, 900);
  const getFinalTimeline = () => (timeline === "custom" ? customTimeline : timeline);

  const triggerAI = async (desc, bud, tl) => {
    setIsAnalyzing(true); setAiError("");
    try {
      const data = await api.analyzeProject(desc, bud, tl || "flexible");
      setAiData(data);
    } catch (err) {
      setAiError(err.message || "AI analysis failed.");
      setAiData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!debouncedDesc.trim() || debouncedDesc.trim().length < 20) { setAiData(null); setAiError(""); return; }
    triggerAI(debouncedDesc, budget, getFinalTimeline());
  }, [debouncedDesc]);

  useEffect(() => {
    if (!debouncedDesc.trim() || debouncedDesc.length < 20) return;
    triggerAI(debouncedDesc, budget, getFinalTimeline());
  }, [budget, timeline, customTimeline]);

  const handleEnter = () => {
    if (!description.trim()) { alert("Please enter a project description."); return; }
    if (!timeline) { alert("Please select a timeline."); return; }
    setShowWizard(true);
  };

  const aiReady = !isAnalyzing && aiData;
  const minReached = description.trim().length >= 20;

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans', -apple-system, sans-serif", background:"#f6f8fb" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ flex:"0 0 56%", background:"#fff", padding:"3.5rem 4rem", display:"flex", flexDirection:"column", justifyContent:"flex-start", boxShadow:"0 0 60px rgba(0,0,0,0.06)", overflowY:"auto", maxHeight:"100vh" }}>

        {/* Heading */}
        <div style={{ marginBottom:"2rem" }}>
          <p style={{ fontSize:"12px", fontWeight:"700", color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 8px" }}>AI-Powered Brief</p>
          <h1 style={{ fontSize:"2.4rem", fontWeight:"800", color:"#0f172a", lineHeight:"1.2", margin:"0 0 10px", letterSpacing:"-0.02em" }}>
            Tell us what you need <span style={{ color:"#e91e63" }}>done.</span>
          </h1>
          <p style={{ color:"#64748b", fontSize:"15px", margin:0, lineHeight:"1.6" }}>
            Describe your project — our AI auto-generates a title, tech stack, and milestone breakdown.
          </p>
        </div>

        {/* Description textarea */}
        <div style={{ position:"relative", marginBottom:"1.2rem" }}>
          <textarea
            value={description}
            onChange={e => { setDescription(e.target.value); setCharCount(e.target.value.length); }}
            placeholder="e.g. Build a freelancing platform with AI project analysis, real-time notifications, and a chat system between clients and freelancers…"
            style={{
              width:"100%", minHeight:"140px", padding:"16px",
              border:`2px solid ${minReached ? "#6366f1" : "#e5e7eb"}`,
              borderRadius:"12px", fontSize:"15px", color:"#111", boxSizing:"border-box",
              resize:"vertical", lineHeight:"1.7", outline:"none", transition:"border-color 0.2s",
              fontFamily:"inherit",
            }}
          />
          <div style={{ position:"absolute", bottom:"10px", right:"12px", fontSize:"11px", color: charCount < 20 ? "#f59e0b" : "#10b981", fontWeight:"600" }}>
            {charCount < 20 ? `${20 - charCount} more chars for AI` : "✓ AI active"}
          </div>
        </div>

        {/* Timeline + Budget row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"1.2rem" }}>
          <div>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#374151", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:"6px" }}>Timeline</label>
            <select value={timeline} onChange={e => setTimeline(e.target.value)}
              style={{ width:"100%", padding:"11px 14px", borderRadius:"10px", border:"1.5px solid #e5e7eb", fontSize:"14px", background:"white", outline:"none", cursor:"pointer" }}>
              <option value="">Select…</option>
              <option value="1-3 days">1-3 days</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2-3 months">2-3 months</option>
              <option value="custom">Custom…</option>
            </select>
            {timeline === "custom" && (
              <input type="text" placeholder="e.g. 6 weeks" value={customTimeline}
                onChange={e => setCustomTimeline(e.target.value)}
                style={{ marginTop:"8px", width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:"10px", fontSize:"14px", boxSizing:"border-box", outline:"none" }}
              />
            )}
          </div>
          <div>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#374151", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:"6px" }}>
              Budget: <span style={{ color:"#059669", fontWeight:"800", fontSize:"14px" }}>Rs.{budget.toLocaleString()}</span>
            </label>
            <input type="range" min="500" max="100000" step="500" value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              style={{ width:"100%", accentColor:"#6366f1", marginTop:"10px" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
              <span style={{ fontSize:"11px", color:"#9ca3af" }}>Rs.500</span>
              <span style={{ fontSize:"11px", color:"#9ca3af" }}>Rs.100k</span>
            </div>
          </div>
        </div>

        {/* File upload */}
        <div style={{ border:"2px dashed #e91e63", padding:"14px 18px", borderRadius:"10px", marginBottom:"1.5rem", cursor:"pointer" }}
          onClick={() => document.getElementById("fileInput").click()}>
          <input id="fileInput" type="file" multiple style={{ display:"none" }} onChange={e => setFiles(Array.from(e.target.files))}/>
          <p style={{ fontSize:"13px", color:"#374151", margin:0 }}>
            📎 {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} attached` : "Attach reference files (optional)"}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:"12px", marginBottom:"8px" }}>
          <button onClick={handleEnter}
            style={{ flex:1, padding:"14px", background:"linear-gradient(135deg,#e91e63,#f43f5e)", color:"white", border:"none", borderRadius:"12px", cursor:"pointer", fontWeight:"700", fontSize:"15px", boxShadow:"0 4px 16px rgba(233,30,99,0.3)", transition:"all 0.2s" }}>
            Enter & Build Brief →
          </button>
          {aiReady && (
            <button onClick={handleEnter}
              style={{ padding:"14px 20px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"white", border:"none", borderRadius:"12px", cursor:"pointer", fontWeight:"700", fontSize:"14px", boxShadow:"0 4px 16px rgba(99,102,241,0.3)", whiteSpace:"nowrap" }}>
              ✨ Open Wizard
            </button>
          )}
        </div>

        {/* AI Panel */}
        <AIPanel
          aiData={aiData}
          isAnalyzing={isAnalyzing}
          error={aiError}
          onOpenWizard={() => {
            if (!description.trim()) { alert("Please enter a description."); return; }
            if (!timeline) { alert("Please select a timeline."); return; }
            setShowWizard(true);
          }}
        />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, backgroundImage:"url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')", backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(79,70,229,0.5) 100%)" }}/>
        <div style={{ position:"relative", zIndex:1, padding:"4rem 3rem", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"11px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>How it works</p>
          {[
            { n:"1", t:"Describe your project", d:"Write what you need in plain language." },
            { n:"2", t:"AI generates the brief", d:"Get instant title, tech stack & milestones." },
            { n:"3", t:"Edit & publish", d:"Tweak the suggestions and post to the marketplace." },
          ].map(step => (
            <div key={step.n} style={{ display:"flex", gap:"14px", marginBottom:"20px", alignItems:"flex-start" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"800", fontSize:"14px", flexShrink:0 }}>{step.n}</div>
              <div>
                <p style={{ color:"white", fontWeight:"700", fontSize:"14px", margin:"0 0 3px" }}>{step.t}</p>
                <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"13px", margin:0 }}>{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WIZARD OVERLAY ── */}
      {showWizard && (
        <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(15,23,42,0.6)", backdropFilter:"blur(4px)", overflow:"auto" }}>
          <button onClick={() => setShowWizard(false)}
            style={{ position:"fixed", top:"20px", right:"20px", zIndex:1100, background:"white", border:"none", borderRadius:"50%", width:"40px", height:"40px", fontSize:"20px", cursor:"pointer", boxShadow:"0 4px 16px rgba(0,0,0,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ×
          </button>
          <ProjectBriefingWizard
            initialDescription={description}
            initialBudget={budget}
            initialTimeline={getFinalTimeline()}
            initialAiData={aiData}
          />
        </div>
      )}
    </div>
  );
}
