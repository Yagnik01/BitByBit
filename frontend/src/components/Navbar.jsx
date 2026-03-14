import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { connectSocket, getSocket } from "../socket";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem("user");
  const user     = userStr ? JSON.parse(userStr) : null;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [unreadMsgs,    setUnreadMsgs]    = useState(0);
  const [pulse,         setPulse]         = useState(false);
  const notifRef = useRef(null);

  /* ── fetch on mount ── */
  useEffect(() => {
    if (!user) return;
    api.getNotifications().then(data => {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }).catch(() => {});
  }, []);

  /* ── socket listeners ── */
  useEffect(() => {
    if (!user) return;
    const sock = connectSocket(user.id);

    sock.on("new_notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
      // Bell pulse animation
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    });

    sock.on("unread_count",             ({ count }) => setUnreadCount(count));
    sock.on("new_message_notification", ()           => setUnreadMsgs(prev => prev + 1));

    return () => {
      sock.off("new_notification");
      sock.off("unread_count");
      sock.off("new_message_notification");
    };
  }, [user?.id]);

  /* ── close on outside click ── */
  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleMarkAllRead = async () => {
    await api.markAllRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotifClick = async (n) => {
    if (!n.read) {
      await api.markNotifRead(n._id).catch(() => {});
      setNotifications(prev => prev.map(x => x._id === n._id ? { ...x, read:true } : x));
      setUnreadCount(c => Math.max(0, c - 1));
    }
    setShowNotifs(false);
    if (n.projectId) navigate(`/project/${n.projectId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/", { replace: true });
  };

  const ICONS = { freelancer_applied:"🙋", application_accepted:"✅", application_rejected:"❌", new_message:"💬", milestone_updated:"📋", project_completed:"🎉" };

  return (
    <>
      <style>{`
        @keyframes bellPulse { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-12deg)} 75%{transform:rotate(12deg)} }
        @keyframes badgePop  { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .notif-item:hover { background:#f9fafb !important; }
        .nav-link-custom:hover { color:#4f46e5 !important; }
      `}</style>

      <header className="navbar">
        <div className="navbar__inner">
          <div className="navbar__start">
            <a className="navbar__logo" href="/dashboard">
              <img src="nexlance-logo.svg" alt="NexLance" cursor="pointer" />
            </a>
            <nav className="navbar__menu">
              <Link to="/dashboard"   className="navbar__link is-active">Dashboard</Link>
              <Link to="/browse"      className="navbar__link">Browse</Link>
              <Link to="/freelancers" className="navbar__link">Freelancers</Link>
              <Link to="/MyProjects"  className="navbar__link">My Projects</Link>
              <Link to="/chat"        className="navbar__link">Messages</Link>
            </nav>
          </div>

          <div className="navbar__end">
            <Link to="/post-project" className="btn btn-primary" style={{ textDecoration:"none" }}>
              + Post Project
            </Link>

            {/* ── Notification bell ── */}
            <div ref={notifRef} style={{ position:"relative" }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{
                  background:"none", border:"none", cursor:"pointer", padding:"8px",
                  fontSize:"20px", position:"relative",
                  animation: pulse ? "bellPulse 0.5s ease" : "none",
                }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position:"absolute", top:"-2px", right:"-2px",
                    background:"#ef4444", color:"white",
                    width:"18px", height:"18px", borderRadius:"50%",
                    fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center",
                    animation:"badgePop 0.3s ease", border:"2px solid white",
                  }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </button>

              {showNotifs && (
                <div style={{
                  position:"absolute", right:0, top:"52px", width:"380px",
                  background:"white", borderRadius:"16px",
                  boxShadow:"0 20px 60px rgba(0,0,0,0.15)", border:"1px solid #e5e7eb",
                  zIndex:9999, maxHeight:"500px", display:"flex", flexDirection:"column",
                  overflow:"hidden",
                }}>
                  {/* Dropdown header */}
                  <div style={{ padding:"16px 20px", background:"linear-gradient(135deg,#0f172a,#1e1b4b)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <span style={{ fontWeight:"700", fontSize:"14px", color:"white" }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{ marginLeft:"8px", padding:"2px 8px", background:"#ef4444", borderRadius:"20px", fontSize:"11px", color:"white", fontWeight:"700" }}>{unreadCount} new</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead}
                        style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"rgba(255,255,255,0.8)", cursor:"pointer", fontSize:"12px", fontWeight:"600", padding:"5px 10px", borderRadius:"6px" }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ overflowY:"auto", flex:1 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding:"40px 20px", textAlign:"center", color:"#9ca3af" }}>
                        <div style={{ fontSize:"36px", marginBottom:"10px" }}>🔔</div>
                        <p style={{ margin:0, fontSize:"14px", fontWeight:"600", color:"#374151" }}>All caught up!</p>
                        <p style={{ margin:"4px 0 0", fontSize:"12px" }}>No new notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 20).map((n, i) => (
                        <div key={n._id || i} className="notif-item"
                          onClick={() => handleNotifClick(n)}
                          style={{ padding:"14px 20px", borderBottom:"1px solid #f8fafc", cursor:"pointer", background: n.read ? "white" : "#f5f3ff", transition:"background 0.15s" }}>
                          <div style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                            <div style={{ width:"36px", height:"36px", borderRadius:"10px", background: n.read ? "#f3f4f6" : "#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>
                              {ICONS[n.type] || "🔔"}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ margin:0, fontWeight:"700", fontSize:"13px", color:"#0f172a" }}>{n.title}</p>
                              <p style={{ margin:"3px 0 0", fontSize:"12px", color:"#6b7280", lineHeight:"1.4" }}>{n.message}</p>
                              <p style={{ margin:"4px 0 0", fontSize:"11px", color:"#9ca3af" }}>
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!n.read && (
                              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#6366f1", flexShrink:0, marginTop:"4px" }}/>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div style={{ padding:"12px 20px", borderTop:"1px solid #f3f4f6", textAlign:"center" }}>
                      <button onClick={() => setShowNotifs(false)}
                        style={{ background:"none", border:"none", color:"#6366f1", cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <Link to="/chat" style={{ position:"relative", fontSize:"20px", padding:"8px", textDecoration:"none" }}>
              💬
              {unreadMsgs > 0 && (
                <span style={{ position:"absolute", top:"-2px", right:"-2px", background:"#ef4444", color:"white", width:"18px", height:"18px", borderRadius:"50%", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid white" }}>
                  {unreadMsgs > 9 ? "9+" : unreadMsgs}
                </span>
              )}
            </Link>

            <div className="user-chip" style={{ display:"flex", alignItems:"center", gap:"8px", marginLeft:"1rem", color:"white", fontWeight:"500" }}>
              <img src="https://www.freelancer.com/img/unknown.png?image-optimizer=force&format=webply&width=120" alt="Avatar"/>
              <Link to="/Profile"style={{color:"white", textDecoration:"none"}}  className="username">{user?.name || "User"}</Link>
            </div>
            <button onClick={handleLogout} className="btn outline" style={{ marginLeft:"0.75rem" }}>Log Out</button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
