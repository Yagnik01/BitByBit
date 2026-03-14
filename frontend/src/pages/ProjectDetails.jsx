import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { ArrowLeft, Clock, Users, DollarSign, Briefcase, Zap, CheckCircle } from "lucide-react";

const colors = {
  primary:"#10b981", primaryDark:"#059669", primaryDarker:"#047857",
  primaryLight:"#d1fae5", primaryLighter:"#ecfdf5",
  text:"#111827", textMuted:"#6b7280", textDark:"#374151",
  card:"#ffffff", cardBorder:"#e5e7eb", background:"#f9fafb",
  destructive:"#ef4444", destructiveLight:"#fef2f2", greenText:"#065f46",
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user    = userStr ? JSON.parse(userStr) : null;

  const [project,     setProject]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [showApply,   setShowApply]   = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount,   setBidAmount]   = useState("");
  const [applying,    setApplying]    = useState(false);
  const [applyMsg,    setApplyMsg]    = useState("");
  const [accepting,   setAccepting]   = useState(null);

  useEffect(() => {
    if (!id) return;
    api.getProjectById(id)
      .then(data => { setProject(data); setBidAmount(data.total_budget || ""); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner       = user && project && String(project.employerId?._id || project.employerId) === String(user.id);
  const alreadyApplied = project?.applications?.some(a => String(a.freelancerId?._id || a.freelancerId) === String(user?.id));

  const handleApply = async () => {
    if (!user) { navigate("/login"); return; }
    setApplying(true); setApplyMsg("");
    try {
      await api.applyToProject(id, coverLetter, Number(bidAmount));
      setApplyMsg("✅ Application submitted! The client has been notified.");
      setShowApply(false);
      const updated = await api.getProjectById(id);
      setProject(updated);
    } catch (err) {
      setApplyMsg("❌ " + err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleAccept = async (applicationId) => {
    if (!window.confirm("Accept this freelancer for the project?")) return;
    setAccepting(applicationId);
    try {
      await api.acceptApplication(id, applicationId);
      const updated = await api.getProjectById(id);
      setProject(updated);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setAccepting(null);
    }
  };

  const handleOpenChat = async (otherUserId) => {
    try {
      const conv = await api.getOrCreateConversation(id, otherUserId);
      navigate(`/chat/${conv._id}`);
    } catch (err) {
      alert("Could not open chat: " + err.message);
    }
  };

  if (loading) return (
    <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",background:colors.background}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:"48px",height:"48px",border:"4px solid #e2e8f0",borderTopColor:colors.primary,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
        <p style={{color:colors.textMuted}}>Loading project…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error || !project) return (
    <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",background:colors.background}}>
      <div style={{textAlign:"center",padding:"48px"}}>
        <h2 style={{color:colors.text}}>Project not found</h2>
        <p style={{color:colors.textMuted}}>{error}</p>
        <button onClick={()=>navigate("/browse")} style={{marginTop:"16px",padding:"10px 24px",background:colors.primary,color:"white",border:"none",borderRadius:"8px",cursor:"pointer"}}>
          Back to Browse
        </button>
      </div>
    </div>
  );

  const title = project.title || project.description?.slice(0, 60) || "Untitled Project";
  const owner = project.employerId;

  const s = {
    page:{minHeight:"100vh",backgroundColor:colors.background,fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"},
    header:{borderBottom:`1px solid ${colors.cardBorder}`,backgroundColor:colors.card},
    headerInner:{maxWidth:"1280px",margin:"0 auto",padding:"24px"},
    backBtn:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"8px 16px",marginBottom:"16px",backgroundColor:"transparent",border:"none",borderRadius:"8px",color:colors.textMuted,fontSize:"14px",fontWeight:500,cursor:"pointer"},
    card:{backgroundColor:colors.card,borderRadius:"16px",border:`1px solid ${colors.cardBorder}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},
    cardHeader:{padding:"20px 24px 0"},
    cardTitle:{fontSize:"16px",fontWeight:600,color:colors.text,margin:0},
    cardContent:{padding:"16px 24px 24px"},
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <button onClick={()=>navigate("/browse")} style={s.backBtn}><ArrowLeft size={16}/> Back to Browse</button>
          <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"12px",marginBottom:"8px"}}>
            <h1 style={{fontSize:"28px",fontWeight:700,color:colors.text,margin:0}}>{title}</h1>
            {project.status === "open" && <span style={{padding:"4px 12px",background:colors.primaryLight,color:colors.primaryDarker,borderRadius:"20px",fontSize:"12px",fontWeight:600}}>Open</span>}
            {project.status === "in-progress" && <span style={{padding:"4px 12px",background:"#fef3c7",color:"#92400e",borderRadius:"20px",fontSize:"12px",fontWeight:600}}>In Progress</span>}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"12px",alignItems:"center"}}>
            {project.domain && <span style={{display:"inline-flex",alignItems:"center",gap:"4px",padding:"6px 12px",background:colors.primaryLight,color:colors.primaryDarker,borderRadius:"20px",fontSize:"13px"}}><Briefcase size={14}/>{project.domain}</span>}
            <span style={{fontSize:"14px",color:colors.textMuted}}>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <main style={{maxWidth:"1280px",margin:"0 auto",padding:"32px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,2fr) minmax(0,1fr)",gap:"32px"}}>

          {/* Left */}
          <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>

            {/* Description */}
            <div style={s.card}>
              <div style={s.cardHeader}><h2 style={s.cardTitle}>Project Description</h2></div>
              <div style={s.cardContent}><p style={{fontSize:"15px",lineHeight:"1.7",color:colors.textMuted,margin:0}}>{project.description}</p></div>
            </div>

            {/* Required Skills */}
            {(project.requiredSkills?.length > 0) && (
              <div style={s.card}>
                <div style={s.cardHeader}><h2 style={s.cardTitle}>Required Skills</h2></div>
                <div style={s.cardContent}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                    {project.requiredSkills.map((skill,i)=>(
                      <span key={i} style={{padding:"8px 16px",background:"#f3f4f6",color:colors.textDark,fontSize:"14px",fontWeight:500,borderRadius:"8px",border:`1px solid ${colors.cardBorder}`}}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Milestones */}
            {project.milestones?.length > 0 && (
              <div style={s.card}>
                <div style={s.cardHeader}><h2 style={s.cardTitle}>Project Milestones</h2></div>
                <div style={s.cardContent}>
                  {project.milestones.map((m,i)=>(
                    <div key={m._id||i} style={{display:"flex",gap:"16px",alignItems:"flex-start",padding:"16px",background:"#f9fafb",borderRadius:"10px",marginBottom:"12px",border:"1px solid #f3f4f6"}}>
                      <div style={{width:"32px",height:"32px",borderRadius:"50%",background:m.status==="completed"?"#dcfce7":"#e0e7ff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"14px",fontWeight:700,color:m.status==="completed"?"#166534":"#4338ca"}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <p style={{fontWeight:600,margin:0,color:colors.text}}>{m.title}</p>
                        {m.description && <p style={{fontSize:"13px",color:colors.textMuted,margin:"4px 0 0"}}>{m.description}</p>}
                        <div style={{display:"flex",gap:"16px",marginTop:"8px",flexWrap:"wrap"}}>
                          {m.timeline && <span style={{fontSize:"12px",color:colors.textMuted}}>⏱ {m.timeline}</span>}
                          {m.budget_allocation > 0 && <span style={{fontSize:"12px",color:colors.primaryDark,fontWeight:600}}>💰 Rs.{m.budget_allocation.toLocaleString()}</span>}
                          <span style={{fontSize:"12px",padding:"2px 8px",borderRadius:"12px",background:m.status==="completed"?"#dcfce7":"#f3f4f6",color:m.status==="completed"?"#166534":"#374151"}}>{m.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {project.aiAnalysis?.suggestedSkills?.length > 0 && (
              <div style={{...s.card,border:"1px solid #c4b5fd"}}>
                <div style={{...s.cardHeader,background:"linear-gradient(135deg,#f5f3ff,#ede9fe)"}}><h2 style={{...s.cardTitle,color:"#4c1d95"}}>✨ AI Analysis</h2></div>
                <div style={s.cardContent}>
                  {project.aiAnalysis.domain && <p style={{fontSize:"14px",marginBottom:"8px"}}><strong>Domain:</strong> {project.aiAnalysis.domain}</p>}
                  {project.aiAnalysis.suggestedSkills.length > 0 && (
                    <div style={{marginBottom:"12px"}}>
                      <p style={{fontSize:"13px",fontWeight:600,color:"#6b21a8",marginBottom:"8px"}}>Suggested Skills:</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                        {project.aiAnalysis.suggestedSkills.map((s,i)=>(
                          <span key={i} style={{background:"#ede9fe",color:"#7c3aed",padding:"4px 10px",borderRadius:"12px",fontSize:"13px"}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.aiAnalysis.note && <p style={{fontSize:"13px",color:"#6b7280",fontStyle:"italic"}}>{project.aiAnalysis.note}</p>}
                </div>
              </div>
            )}

            {/* Applications (owner only) */}
            {isOwner && project.applications?.length > 0 && (
              <div style={s.card}>
                <div style={s.cardHeader}><h2 style={s.cardTitle}>Applications ({project.applications.length})</h2></div>
                <div style={s.cardContent}>
                  {project.applications.map((app,i)=>(
                    <div key={app._id||i} style={{padding:"16px",border:"1px solid #e5e7eb",borderRadius:"12px",marginBottom:"12px",background:app.status==="accepted"?"#f0fdf4":app.status==="rejected"?"#fef2f2":"white"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px"}}>
                        <div>
                          <p style={{fontWeight:600,margin:0,color:colors.text}}>{app.freelancerName}</p>
                          <p style={{fontSize:"13px",color:colors.textMuted,margin:"4px 0 0"}}>Bid: Rs.{app.bidAmount?.toLocaleString()}</p>
                          {app.coverLetter && <p style={{fontSize:"14px",color:"#374151",margin:"8px 0 0",lineHeight:"1.5"}}>{app.coverLetter}</p>}
                          <p style={{fontSize:"12px",color:"#9ca3af",margin:"4px 0 0"}}>{new Date(app.appliedAt).toLocaleString()}</p>
                        </div>
                        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                          {app.status === "pending" && project.status === "open" && (
                            <>
                              <button onClick={()=>handleAccept(app._id)} disabled={accepting===app._id}
                                style={{padding:"8px 16px",background:colors.primary,color:"white",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:600,fontSize:"13px",opacity:accepting===app._id?0.7:1}}>
                                {accepting===app._id ? "Accepting…" : "✓ Accept"}
                              </button>
                              <button onClick={()=>handleOpenChat(app.freelancerId?._id||app.freelancerId)}
                                style={{padding:"8px 16px",border:`1px solid ${colors.primary}`,background:"white",color:colors.primary,borderRadius:"8px",cursor:"pointer",fontWeight:600,fontSize:"13px"}}>
                                💬 Chat
                              </button>
                            </>
                          )}
                          {app.status === "accepted" && <span style={{padding:"8px 16px",background:"#dcfce7",color:"#166534",borderRadius:"8px",fontSize:"13px",fontWeight:600}}>✅ Accepted</span>}
                          {app.status === "rejected" && <span style={{padding:"8px 16px",background:"#fee2e2",color:"#991b1b",borderRadius:"8px",fontSize:"13px",fontWeight:600}}>❌ Rejected</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{position:"sticky",top:"32px",display:"flex",flexDirection:"column",gap:"24px"}}>
            <div style={s.card}>
              <div style={{padding:"24px",background:"linear-gradient(90deg,#ecfdf5,#f0fdfa)",borderBottom:`1px solid ${colors.primaryLight}`}}>
                <p style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"14px",color:colors.greenText,fontWeight:500,margin:0}}><DollarSign size={18}/> Budget</p>
                <p style={{fontSize:"40px",fontWeight:700,color:colors.primary,margin:"8px 0 0",lineHeight:1}}>Rs.{project.total_budget?.toLocaleString()}</p>
                <p style={{fontSize:"14px",color:colors.textMuted,margin:"4px 0 0"}}>Fixed Price</p>
              </div>

              <div style={{padding:"24px"}}>
                {[["Timeline", project.timeline||"Flexible"], ["Category", project.domain||"General"], ["Status", project.status], ["Posted by", owner?.name||"Client"]].map(([label,val])=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f3f4f6",fontSize:"14px"}}>
                    <span style={{color:colors.textMuted}}>{label}</span>
                    <span style={{fontWeight:500,color:colors.text}}>{val}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:"14px"}}>
                  <span style={{color:colors.textMuted}}>Applications</span>
                  <span style={{fontWeight:500,color:colors.text}}>{project.applications?.length || 0}</span>
                </div>

                {applyMsg && <div style={{padding:"12px",borderRadius:"8px",background:applyMsg.startsWith("✅")?"#dcfce7":"#fee2e2",color:applyMsg.startsWith("✅")?"#166534":"#991b1b",fontSize:"14px",marginTop:"12px"}}>{applyMsg}</div>}

                {!isOwner && project.status === "open" && (
                  alreadyApplied ? (
                    <div style={{padding:"14px",background:"#f0fdf4",borderRadius:"10px",textAlign:"center",marginTop:"16px",color:"#166534",fontWeight:600}}>✓ Already Applied</div>
                  ) : (
                    <button onClick={()=>{ if(!user){navigate("/login");return;} setShowApply(!showApply); }}
                      style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${colors.primary},${colors.primaryDark})`,color:"white",border:"none",borderRadius:"10px",cursor:"pointer",fontWeight:600,fontSize:"15px",marginTop:"16px"}}>
                      Apply for Project
                    </button>
                  )
                )}

                {isOwner && project.freelancerId && (
                  <button onClick={()=>handleOpenChat(project.freelancerId?._id||project.freelancerId)}
                    style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"white",border:"none",borderRadius:"10px",cursor:"pointer",fontWeight:600,fontSize:"15px",marginTop:"16px"}}>
                    💬 Chat with Freelancer
                  </button>
                )}
                {project.status === "in-progress" && project.milestones?.length > 0 && (
                  <button onClick={()=>navigate(`/milestones/${project._id}`)}
                    style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#10b981,#059669)",color:"white",border:"none",borderRadius:"10px",cursor:"pointer",fontWeight:600,fontSize:"14px",marginTop:"10px"}}>
                    📋 Track Milestones & Payments
                  </button>
                )}
              </div>
            </div>

            {/* Apply form (inline) */}
            {showApply && !alreadyApplied && (
              <div style={s.card}>
                <div style={{padding:"20px"}}>
                  <h3 style={{fontWeight:700,marginBottom:"16px",color:colors.text}}>Your Application</h3>
                  <div style={{marginBottom:"14px"}}>
                    <label style={{display:"block",fontSize:"13px",fontWeight:600,color:colors.textDark,marginBottom:"6px"}}>Bid Amount (Rs.)</label>
                    <input type="number" value={bidAmount} onChange={e=>setBidAmount(e.target.value)}
                      style={{width:"100%",padding:"10px 14px",border:"2px solid #e5e7eb",borderRadius:"8px",fontSize:"14px",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div style={{marginBottom:"16px"}}>
                    <label style={{display:"block",fontSize:"13px",fontWeight:600,color:colors.textDark,marginBottom:"6px"}}>Cover Letter</label>
                    <textarea value={coverLetter} onChange={e=>setCoverLetter(e.target.value)}
                      placeholder="Why are you the right person for this project?"
                      style={{width:"100%",padding:"10px 14px",border:"2px solid #e5e7eb",borderRadius:"8px",fontSize:"14px",minHeight:"100px",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <button onClick={handleApply} disabled={applying}
                    style={{width:"100%",padding:"12px",background:`linear-gradient(135deg,${colors.primary},${colors.primaryDark})`,color:"white",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:600,opacity:applying?0.7:1}}>
                    {applying ? "Submitting…" : "Submit Application"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
