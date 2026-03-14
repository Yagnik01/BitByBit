import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { connectSocket } from "../socket";

/* ── tech icon ── */
const TechIcon = ({ name }) => {
  const m = { react:"⚛️","react.js":"⚛️","next.js":"▲",node:"🟢","node.js":"🟢",python:"🐍",typescript:"🔷",mongodb:"🍃",postgresql:"🐘",aws:"☁️",docker:"🐳",graphql:"◈",firebase:"🔥",stripe:"💳" };
  return <span>{m[name?.toLowerCase()] || "🔧"}</span>;
};

/* ── milestone progress bar ── */
const MilestoneBar = ({ milestones = [] }) => {
  if (!milestones.length) return null;
  const done = milestones.filter(m => m.status === "completed" || m.status === "paid").length;
  const pct  = Math.round((done / milestones.length) * 100);
  return (
    <div style={{ marginTop:"10px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
        <span style={{ fontSize:"11px", color:"#6b7280", fontWeight:"600" }}>Milestones</span>
        <span style={{ fontSize:"11px", color:"#6b7280" }}>{done}/{milestones.length}</span>
      </div>
      <div style={{ height:"6px", background:"#f3f4f6", borderRadius:"6px", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:"6px", transition:"width 0.4s" }}/>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MY PROJECTS PAGE
══════════════════════════════════════════════════════════ */
const MyProjects = () => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem("user");
  const user     = userStr ? JSON.parse(userStr) : null;

  const [viewAs,      setViewAs]      = useState("client");
  const [activeTab,   setActiveTab]   = useState("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects,    setProjects]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [justAssigned,setJustAssigned]= useState(null); // newly assigned project id for highlight

  const tabs = viewAs === "client"
    ? [{ id:"open", label:"Open" },{ id:"in-progress", label:"In Progress" },{ id:"completed", label:"Completed" }]
    : [{ id:"in-progress", label:"Active Work" },{ id:"completed", label:"Completed" }];

  /* ── fetch ── */
  const loadProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const data = viewAs === "client"
        ? await api.getEmployerProjects(user.id)
        : await api.getMyProjects(user.id);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [viewAs, user?.id]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  /* ── Socket: real-time refresh when project is assigned ── */
  useEffect(() => {
    if (!user) return;
    const sock = connectSocket(user.id);

    // Freelancer: project assigned → immediately reload and highlight
    sock.on("project_assigned", async ({ projectId }) => {
      setJustAssigned(projectId);
      setViewAs("freelancer");
      setActiveTab("in-progress");
      try {
        const data = await api.getMyProjects(user.id);
        setProjects(Array.isArray(data) ? data : []);
      } catch {}
      // Clear highlight after 4s
      setTimeout(() => setJustAssigned(null), 4000);
    });

    // Client: new application → refresh my posted projects
    sock.on("new_notification", async (notif) => {
      if (notif.type === "freelancer_applied" && viewAs === "client") {
        try {
          const data = await api.getEmployerProjects(user.id);
          setProjects(Array.isArray(data) ? data : []);
        } catch {}
      }
    });

    return () => {
      sock.off("project_assigned");
      sock.off("new_notification");
    };
  }, [user?.id, viewAs]);

  const displayed = projects.filter(p => {
    const matchTab    = p.status === activeTab;
    const matchSearch = !searchQuery || (p.title || p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleOpenChat = async (projectId, otherUserId) => {
    try {
      const conv = await api.getOrCreateConversation(projectId, otherUserId);
      navigate(`/chat/${conv._id}`);
    } catch (err) {
      alert("Could not open chat: " + err.message);
    }
  };

  const statusMeta = (s) => ({
    open:         { bg:"#ecfdf5", color:"#065f46", dot:"#10b981", label:"Open" },
    "in-progress":{ bg:"#fffbeb", color:"#92400e", dot:"#f59e0b", label:"In Progress" },
    completed:    { bg:"#f0fdf4", color:"#166534", dot:"#22c55e", label:"Completed" },
    cancelled:    { bg:"#fef2f2", color:"#991b1b", dot:"#ef4444", label:"Cancelled" },
  }[s] || { bg:"#f9fafb", color:"#374151", dot:"#9ca3af", label:s });

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',-apple-system,sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#0f172a,#1e1b4b)", padding:"32px 40px 40px" }}>
        <h1 style={{ fontSize:"26px", fontWeight:"800", color:"white", margin:"0 0 6px", letterSpacing:"-0.02em" }}>
          Projects & Work
        </h1>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"14px", margin:"0 0 24px" }}>
          Manage everything you've posted or been assigned to.
        </p>

        {/* View toggle */}
        <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.08)", borderRadius:"12px", padding:"4px" }}>
          {["client","freelancer"].map(v => (
            <button key={v} onClick={() => { setViewAs(v); setActiveTab(v==="client"?"open":"in-progress"); }}
              style={{ padding:"8px 20px", borderRadius:"10px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"14px", transition:"all 0.2s",
                background: viewAs===v ? "white" : "transparent",
                color:      viewAs===v ? "#4f46e5" : "rgba(255,255,255,0.7)",
                boxShadow:  viewAs===v ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              }}>
              {v === "client" ? "👔 As Client" : "💼 As Freelancer"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background:"white", borderBottom:"1px solid #e5e7eb", padding:"0 40px", display:"flex", gap:"0" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding:"16px 24px", fontSize:"14px", fontWeight:"600", background:"transparent", border:"none", borderBottom: activeTab===t.id ? "2px solid #4f46e5" : "2px solid transparent", color: activeTab===t.id ? "#4f46e5" : "#64748b", cursor:"pointer", transition:"all 0.2s" }}>
            {t.label}
            <span style={{ marginLeft:"8px", padding:"2px 8px", borderRadius:"20px", fontSize:"11px", background: activeTab===t.id ? "#eef2ff" : "#f1f5f9", color: activeTab===t.id ? "#4f46e5" : "#94a3b8" }}>
              {projects.filter(p => p.status === t.id).length}
            </span>
          </button>
        ))}
        <button onClick={loadProjects} style={{ marginLeft:"auto", padding:"12px 16px", background:"transparent", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:"16px", alignSelf:"center" }} title="Refresh">⟳</button>
      </div>

      {/* ── Content ── */}
      <div style={{ padding:"24px 40px" }}>

        {/* Search */}
        <div style={{ position:"relative", maxWidth:"400px", marginBottom:"20px" }}>
          <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:"16px" }}>🔍</span>
          <input type="text" placeholder="Search projects…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width:"100%", padding:"11px 14px 11px 40px", border:"1.5px solid #e5e7eb", borderRadius:"12px", fontSize:"14px", outline:"none", boxSizing:"border-box", background:"white" }}/>
        </div>

        {error && <div style={{ padding:"14px 18px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", color:"#b91c1c", fontSize:"14px", marginBottom:"16px" }}>⚠ {error}</div>}

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"16px" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background:"white", borderRadius:"16px", padding:"22px", border:"1px solid #f3f4f6", height:"180px" }}>
                {[90,60,40].map((w,j)=><div key={j} style={{ height:"12px", width:`${w}%`, background:"#f1f5f9", borderRadius:"6px", marginBottom:"10px" }}/>)}
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign:"center", padding:"70px 20px", background:"white", borderRadius:"20px", border:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:"48px", marginBottom:"12px" }}>📂</div>
            <h3 style={{ fontSize:"17px", fontWeight:"700", color:"#0f172a", margin:"0 0 8px" }}>No projects here yet</h3>
            <p style={{ color:"#64748b", margin:"0 0 20px", fontSize:"14px" }}>
              {viewAs==="client" ? "Post a project to get started." : "Apply to projects to see them here."}
            </p>
            <button onClick={() => navigate(viewAs==="client" ? "/post-project" : "/browse")}
              style={{ padding:"11px 24px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"white", border:"none", borderRadius:"12px", cursor:"pointer", fontWeight:"700", fontSize:"14px" }}>
              {viewAs==="client" ? "Post a Project" : "Browse Projects"}
            </button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:"16px" }}>
            {displayed.map(p => {
              const sm     = statusMeta(p.status);
              const title  = p.title || p.description?.slice(0, 60) || "Untitled";
              const isNew  = justAssigned && String(p._id) === String(justAssigned);
              const skills = p.requiredSkills || [];
              const clientId = p.employerId?._id || p.employerId;
              const flId     = p.freelancerId?._id || p.freelancerId;

              return (
                <div key={p._id} style={{
                  background:"white", borderRadius:"18px", padding:"20px 22px",
                  border: isNew ? "2px solid #6366f1" : "1px solid #f3f4f6",
                  boxShadow: isNew ? "0 0 0 4px rgba(99,102,241,0.15)" : "0 2px 10px rgba(0,0,0,0.04)",
                  position:"relative", overflow:"hidden",
                  animation: isNew ? "newProjectPulse 0.6s ease" : "none",
                  transition:"all 0.2s",
                }}>
                  <style>{`@keyframes newProjectPulse{0%{transform:scale(1.02)}100%{transform:scale(1)}}`}</style>

                  {isNew && (
                    <div style={{ position:"absolute", top:"10px", right:"10px", background:"#6366f1", color:"white", fontSize:"11px", fontWeight:"700", padding:"3px 10px", borderRadius:"20px" }}>
                      ✨ Just Assigned!
                    </div>
                  )}

                  {/* Status dot + label */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                    <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600", background:sm.bg, color:sm.color, display:"flex", alignItems:"center", gap:"6px" }}>
                      <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:sm.dot }}/>
                      {sm.label}
                    </span>
                    {p.applications?.length > 0 && viewAs === "client" && (
                      <span style={{ fontSize:"12px", color:"#0ea5e9", background:"#f0f9ff", padding:"4px 10px", borderRadius:"20px", fontWeight:"600" }}>
                        {p.applications.length} applicant{p.applications.length!==1?"s":""}
                      </span>
                    )}
                  </div>

                  {/* Title + description */}
                  <h3 onClick={() => navigate(`/project/${p._id}`)}
                    style={{ fontSize:"15px", fontWeight:"700", color:"#0f172a", margin:"0 0 6px", cursor:"pointer" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize:"13px", color:"#64748b", margin:"0 0 10px", lineHeight:"1.5", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {p.description}
                  </p>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"10px" }}>
                      {skills.slice(0,4).map((s,i) => (
                        <span key={i} style={{ padding:"3px 10px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"12px", color:"#475569", display:"flex", alignItems:"center", gap:"4px" }}>
                          <TechIcon name={s}/> {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Milestone progress */}
                  <MilestoneBar milestones={p.milestones}/>

                  {/* Footer */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"14px", paddingTop:"12px", borderTop:"1px solid #f8fafc" }}>
                    <div>
                      <span style={{ fontSize:"17px", fontWeight:"800", color:"#059669" }}>Rs.{Number(p.total_budget||0).toLocaleString()}</span>
                      {p.timeline && <span style={{ fontSize:"12px", color:"#94a3b8", marginLeft:"10px" }}>⏱ {p.timeline}</span>}
                      {viewAs==="freelancer" && p.employerId?.name && (
                        <p style={{ fontSize:"12px", color:"#64748b", margin:"3px 0 0" }}>Client: <strong>{p.employerId.name}</strong></p>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button onClick={() => navigate(`/project/${p._id}`)}
                        style={{ padding:"7px 14px", border:"1.5px solid #e5e7eb", background:"white", color:"#374151", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>
                        View
                      </button>
                      {p.milestones?.length > 0 && p.status === "in-progress" && (
                        <button onClick={() => navigate(`/milestones/${p._id}`)}
                          style={{ padding:"7px 14px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>
                          📋 Milestones
                        </button>
                      )}
                      {/* Client: chat with assigned freelancer */}
                      {viewAs==="client" && flId && (
                        <button onClick={() => handleOpenChat(p._id, flId)}
                          style={{ padding:"7px 14px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>
                          💬 Chat
                        </button>
                      )}
                      {/* Freelancer: chat with client */}
                      {viewAs==="freelancer" && clientId && (
                        <button onClick={() => handleOpenChat(p._id, clientId)}
                          style={{ padding:"7px 14px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>
                          💬 Chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
