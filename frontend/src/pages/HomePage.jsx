import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { connectSocket, getSocket } from "../socket";

/* ── icon helper ── */
const TechIcon = ({ name }) => {
  const map = { react:"⚛️","react.js":"⚛️","next.js":"▲",node:"🟢","node.js":"🟢",python:"🐍",typescript:"🔷",mongodb:"🍃",postgresql:"🐘",aws:"☁️",docker:"🐳",graphql:"◈",firebase:"🔥",stripe:"💳",tailwind:"🌊" };
  return <span style={{ fontSize:"13px" }}>{map[name?.toLowerCase()] || "🔧"}</span>;
};

/* ── stat card ── */
const StatCard = ({ icon, value, label, color }) => (
  <div style={{ background:"white", borderRadius:"16px", padding:"20px 24px", border:"1px solid #f3f4f6", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", display:"flex", alignItems:"center", gap:"16px" }}>
    <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{icon}</div>
    <div>
      <p style={{ fontSize:"24px", fontWeight:"800", color:"#0f172a", margin:0, letterSpacing:"-0.02em" }}>{value}</p>
      <p style={{ fontSize:"13px", color:"#64748b", margin:0, fontWeight:"500" }}>{label}</p>
    </div>
  </div>
);

/* ── project card ── */
const ProjectCard = ({ project, onClick, currentUserId }) => {
  const skills = project.requiredSkills || [];
  const title = project.title || project.description?.slice(0, 60) || "Untitled";
  const owner = project.employerId;
  const isOwn = owner && String(owner._id || owner) === String(currentUserId);
  const appCount = project.applications?.length || 0;

  const statusColor = { open:"#10b981", "in-progress":"#f59e0b", completed:"#6366f1" };
  const sc = statusColor[project.status] || "#9ca3af";

  return (
    <div onClick={onClick} style={{
      background:"white", borderRadius:"18px", padding:"22px 24px",
      border:"1px solid #f3f4f6", boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
      cursor:"pointer", transition:"all 0.22s",
      position:"relative", overflow:"hidden",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.14)"; e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.transform = "translateY(0)"; }}>

      {/* Coloured top accent bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:`linear-gradient(90deg, ${sc}, ${sc}88)`, borderRadius:"18px 18px 0 0" }}/>

      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
        <div style={{ flex:1, minWidth:0 }}>
          {project.domain && (
            <span style={{ fontSize:"11px", fontWeight:"700", color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.06em", background:"#eef2ff", padding:"3px 9px", borderRadius:"6px", display:"inline-block", marginBottom:"6px" }}>
              {project.domain}
            </span>
          )}
          <h3 style={{ fontSize:"15px", fontWeight:"700", color:"#0f172a", margin:0, lineHeight:"1.3", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {title}
          </h3>
        </div>
        <span style={{ fontSize:"11px", fontWeight:"600", padding:"4px 10px", borderRadius:"20px", background:`${sc}15`, color:sc, flexShrink:0, marginLeft:"10px" }}>
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize:"13px", color:"#64748b", margin:"0 0 12px", lineHeight:"1.6", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
        {project.description}
      </p>

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"14px" }}>
          {skills.slice(0, 4).map((s, i) => (
            <span key={i} style={{ padding:"3px 10px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"12px", color:"#475569", fontWeight:"500", display:"flex", alignItems:"center", gap:"4px" }}>
              <TechIcon name={s}/> {s}
            </span>
          ))}
          {skills.length > 4 && <span style={{ padding:"3px 10px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"12px", color:"#9ca3af" }}>+{skills.length - 4}</span>}
        </div>
      )}

      {/* Footer */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"12px", borderTop:"1px solid #f8fafc" }}>
        <div style={{ display:"flex", gap:"14px" }}>
          <span style={{ fontSize:"16px", fontWeight:"800", color:"#059669" }}>
            Rs.{Number(project.total_budget || 0).toLocaleString()}
          </span>
          {project.timeline && (
            <span style={{ fontSize:"12px", color:"#94a3b8", display:"flex", alignItems:"center", gap:"4px" }}>
              ⏱ {project.timeline}
            </span>
          )}
        </div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          {project.milestones?.length > 0 && (
            <span style={{ fontSize:"11px", color:"#8b5cf6", background:"#f5f3ff", padding:"3px 8px", borderRadius:"6px", fontWeight:"600" }}>
              {project.milestones.length} milestones
            </span>
          )}
          {appCount > 0 && (
            <span style={{ fontSize:"11px", color:"#0ea5e9", background:"#f0f9ff", padding:"3px 8px", borderRadius:"6px", fontWeight:"600" }}>
              {appCount} applicant{appCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════════ */
export default function HomePage({ onLogout }) {
  const navigate     = useNavigate();
  const userStr      = localStorage.getItem("user");
  const user         = userStr ? JSON.parse(userStr) : null;

  const [allProjects,    setAllProjects]    = useState([]);
  const [myProjects,     setMyProjects]     = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [activeSection,  setActiveSection]  = useState("marketplace");
  const [stats,          setStats]          = useState({ open:0, inProgress:0, myPosted:0, assigned:0 });

  /* ── fetch all data ── */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allRes, myPostedRes, assignedRes] = await Promise.all([
        api.getAllProjects({ limit: 20 }),
        user ? api.getEmployerProjects(user.id).catch(() => []) : Promise.resolve([]),
        user ? api.getMyProjects(user.id).catch(() => []) : Promise.resolve([]),
      ]);

      const allArr      = allRes.projects || allRes || [];
      const postedArr   = Array.isArray(myPostedRes) ? myPostedRes : [];
      const assignedArr = Array.isArray(assignedRes) ? assignedRes : [];

      setAllProjects(allArr);
      setMyProjects(postedArr);
      setAssignedProjects(assignedArr);

      setStats({
        open:       allArr.filter(p => p.status === "open").length,
        inProgress: allArr.filter(p => p.status === "in-progress").length,
        myPosted:   postedArr.length,
        assigned:   assignedArr.length,
      });
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Socket: refresh when client accepts freelancer ── */
  useEffect(() => {
    if (!user) return;
    const sock = connectSocket(user.id);

    // When this user's application is accepted → refresh assigned projects
    sock.on("new_notification", async (notif) => {
      if (notif.type === "application_accepted") {
        // Reload assigned projects
        try {
          const data = await api.getMyProjects(user.id);
          setAssignedProjects(Array.isArray(data) ? data : []);
          setStats(prev => ({ ...prev, assigned: Array.isArray(data) ? data.length : 0 }));
        } catch (err) {}
      }
      // When a freelancer applies to client's project → refresh my projects
      if (notif.type === "freelancer_applied") {
        try {
          const data = await api.getEmployerProjects(user.id);
          setMyProjects(Array.isArray(data) ? data : []);
        } catch (err) {}
      }
    });

    return () => sock.off("new_notification");
  }, [user?.id]);

  const sections = [
    { id:"marketplace", label:"Marketplace", count:allProjects.length },
    { id:"my-projects", label:"My Posted",   count:myProjects.length },
    { id:"assigned",    label:"My Work",      count:assignedProjects.length },
  ];

  const displayedProjects =
    activeSection === "marketplace" ? allProjects :
    activeSection === "my-projects" ? myProjects :
    assignedProjects;

  const SkeletonCard = () => (
    <div style={{ background:"white", borderRadius:"18px", padding:"22px 24px", border:"1px solid #f3f4f6" }}>
      {[1,2,3].map(i => <div key={i} style={{ height:"14px", background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize:"200% 100%", animation:"shimmerH 1.5s infinite", borderRadius:"6px", marginBottom:"10px", width: i===2?"60%":"100%" }}/>)}
      <style>{`@keyframes shimmerH{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans', -apple-system, sans-serif" }}>
      <Navbar onLogout={onLogout}/>

      {/* ── Hero section ── */}
      <div style={{ position:"relative", overflow:"hidden", background:"#0f172a", padding:"56px 10% 80px" }}>
        {/* NASA video background */}
        <video
          autoPlay loop muted playsInline
          style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0, opacity:0.45 }}>
          <source src="https://www.f-cdn.com/assets/main/en/assets/home/video/nasa-v3.mp4" type="video/mp4"/>
        </video>
        {/* Dark gradient overlay so text stays readable */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(15,23,42,0.82) 0%, rgba(30,27,75,0.75) 50%, rgba(49,46,129,0.68) 100%)", zIndex:1 }}/>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(99,102,241,0.12)", pointerEvents:"none", zIndex:1 }}/>
        <div style={{ position:"absolute", bottom:"-60px", left:"30%", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(139,92,246,0.1)", pointerEvents:"none", zIndex:1 }}/>

        <div style={{ position:"relative", zIndex:2 }}>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"12px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px" }}>
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </p>
          <h1 style={{ color:"white", fontSize:"2.6rem", fontWeight:"800", margin:"0 0 12px", letterSpacing:"-0.025em", lineHeight:"1.2" }}>
            Your Project Dashboard
          </h1>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"16px", margin:"0 0 36px", maxWidth:"520px" }}>
            Browse live projects, track your active work, and manage everything in one place.
          </p>

          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"14px", maxWidth:"800px" }}>
            {[
              { icon:"📂", value: stats.open,       label:"Open Projects",  color:"#10b981" },
              { icon:"⚙️", value: stats.inProgress,  label:"In Progress",   color:"#f59e0b" },
              { icon:"📝", value: stats.myPosted,    label:"I Posted",       color:"#6366f1" },
              { icon:"✅", value: stats.assigned,    label:"Assigned to Me", color:"#8b5cf6" },
            ].map((s, i) => (
              <div key={i} style={{
                background:"rgba(255,255,255,0.08)", backdropFilter:"blur(12px)",
                borderRadius:"14px", padding:"16px 18px", border:"1px solid rgba(255,255,255,0.12)",
              }}>
                <p style={{ fontSize:"24px", margin:"0 0 2px" }}>{s.icon}</p>
                <p style={{ fontSize:"22px", fontWeight:"800", color:"white", margin:"0 0 2px", letterSpacing:"-0.02em" }}>{isLoading ? "—" : s.value}</p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.55)", margin:0, fontWeight:"500" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding:"0 10% 60px", marginTop:"-24px", position:"relative", zIndex:1 }}>

        {/* Section tabs */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center", gap:"4px", background:"white", borderRadius:"14px", padding:"6px", border:"1px solid #e5e7eb", boxShadow:"0 4px 20px rgba(0,0,0,0.06)", marginBottom:"28px", width:"fit-content", marginLeft:"auto", marginRight:"auto" }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                padding:"10px 20px", borderRadius:"10px", border:"none", cursor:"pointer",
                fontWeight:"600", fontSize:"14px", transition:"all 0.2s",
                background: activeSection === s.id ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent",
                color: activeSection === s.id ? "white" : "#64748b",
                boxShadow: activeSection === s.id ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
              }}>
              {s.label}
              <span style={{
                marginLeft:"6px", padding:"2px 8px", borderRadius:"20px", fontSize:"11px",
                background: activeSection === s.id ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                color: activeSection === s.id ? "white" : "#94a3b8",
              }}>{s.count}</span>
            </button>
          ))}
          <button onClick={loadData}
            style={{ padding:"10px 14px", borderRadius:"10px", border:"none", cursor:"pointer", color:"#64748b", background:"transparent", fontSize:"14px", marginLeft:"4px" }}
            title="Refresh">⟳</button>
        </div>

        {/* Project grid */}
        {isLoading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:"18px" }}>
            {[1,2,3,4].map(i => <SkeletonCard key={i}/>)}
          </div>
        ) : displayedProjects.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 20px", background:"white", borderRadius:"20px", border:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:"56px", marginBottom:"16px" }}>
              {activeSection === "marketplace" ? "🔍" : activeSection === "my-projects" ? "📝" : "💼"}
            </div>
            <h3 style={{ fontSize:"18px", fontWeight:"700", color:"#0f172a", margin:"0 0 8px" }}>
              {activeSection === "marketplace" ? "No open projects yet" : activeSection === "my-projects" ? "You haven't posted any projects" : "No projects assigned to you yet"}
            </h3>
            <p style={{ color:"#64748b", margin:"0 0 24px", fontSize:"14px" }}>
              {activeSection === "marketplace" ? "Be the first to post a project!" : activeSection === "my-projects" ? "Post a project and find the perfect freelancer." : "Browse the marketplace and apply to projects."}
            </p>
            <button onClick={() => navigate(activeSection === "assigned" ? "/browse" : "/post-project")}
              style={{ padding:"12px 28px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"white", border:"none", borderRadius:"12px", cursor:"pointer", fontWeight:"700", fontSize:"14px" }}>
              {activeSection === "assigned" ? "Browse Projects" : "Post a Project"}
            </button>
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:"18px" }}>
              {displayedProjects.map(p => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  currentUserId={user?.id}
                  onClick={() => navigate(`/project/${p._id}`)}
                />
              ))}
            </div>
            {activeSection === "marketplace" && allProjects.length >= 20 && (
              <div style={{ textAlign:"center", marginTop:"32px" }}>
                <button onClick={() => navigate("/browse")}
                  style={{ padding:"13px 32px", background:"white", color:"#4f46e5", border:"2px solid #c7d2fe", borderRadius:"12px", cursor:"pointer", fontWeight:"700", fontSize:"14px" }}>
                  View All Projects →
                </button>
              </div>
            )}
          </>
        )}

        {/* Quick actions row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"14px", marginTop:"40px" }}>
          {[
            { icon:"🚀", title:"Post a Project", desc:"Describe your need and AI creates the brief.", action:() => navigate("/post-project"), color:"#6366f1" },
            { icon:"🔍", title:"Browse Marketplace", desc:"Find projects that match your skill set.", action:() => navigate("/browse"), color:"#8b5cf6" },
            { icon:"💬", title:"Messages", desc:"Chat with clients and freelancers.", action:() => navigate("/chat"), color:"#06b6d4" },
          ].map((a, i) => (
            <button key={i} onClick={a.action}
              style={{ padding:"20px 22px", background:"white", border:"1px solid #e5e7eb", borderRadius:"16px", cursor:"pointer", textAlign:"left", transition:"all 0.2s", display:"flex", gap:"14px", alignItems:"flex-start" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 4px 20px ${a.color}22`; e.currentTarget.style.borderColor=`${a.color}44`; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:`${a.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{a.icon}</div>
              <div>
                <p style={{ fontWeight:"700", fontSize:"14px", color:"#0f172a", margin:"0 0 3px" }}>{a.title}</p>
                <p style={{ fontSize:"12px", color:"#64748b", margin:0 }}>{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
