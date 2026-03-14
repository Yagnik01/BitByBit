"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

// ── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);
const CloseIcon  = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const ChevronDownIcon = ({isOpen}) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}><path d="m6 9 6 6 6-6"/></svg>);
const FilterIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const ClockIcon  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);

const SkeletonCard = () => (
  <div style={{background:"white",padding:"24px",borderRadius:"16px",marginBottom:"16px",border:"1px solid #e5e7eb"}}>
    {[1,2,3].map(i=><div key={i} style={{height:"16px",background:"linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",borderRadius:"6px",marginBottom:"10px"}}/>)}
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

export default function Browse() {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem("user");
  const user     = userStr ? JSON.parse(userStr) : null;

  const [projects,    setProjects]    = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [budgetRange, setBudgetRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy,      setSortBy]      = useState("latest");
  const [savedProjects, setSavedProjects] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [applying,    setApplying]    = useState(null); // projectId being applied to
  const [applyModal,  setApplyModal]  = useState(null); // project to apply to
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount,   setBidAmount]   = useState("");

  const categoryOptions = ["Web Development","Mobile Development","AI & Machine Learning","E-commerce","Web Design","Data Science"];

  // ── Fetch from DB ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAllProjects();
        // getAllProjects now returns { projects, total, page, pages }
        setProjects(data.projects || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Filter / sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = projects.filter(p => {
      const title = p.title || p.description?.slice(0,60) || "";
      const matchSearch = !search || title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
      const matchBudget = p.total_budget >= budgetRange[0] && p.total_budget <= budgetRange[1];
      const matchCat    = selectedCategories.length === 0 || selectedCategories.some(c => (p.domain||"").toLowerCase().includes(c.toLowerCase()));
      return matchSearch && matchBudget && matchCat;
    });
    if (sortBy === "budget-high") result.sort((a,b) => b.total_budget - a.total_budget);
    else if (sortBy === "budget-low") result.sort((a,b) => a.total_budget - b.total_budget);
    return result;
  }, [projects, search, budgetRange, selectedCategories, sortBy]);

  const handleApply = async () => {
    if (!user) { navigate("/login"); return; }
    if (!applyModal) return;
    setApplying(applyModal._id);
    try {
      await api.applyToProject(applyModal._id, coverLetter, Number(bidAmount) || applyModal.total_budget);
      alert("✅ Application submitted! The client will be notified.");
      setApplyModal(null); setCoverLetter(""); setBidAmount("");
      // Refresh so this project shows updated application count
      const data = await api.getAllProjects();
      setProjects(data.projects || data);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setApplying(null);
    }
  };

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",background:"#f3f4f6",minHeight:"100vh"}}>

      {/* Header */}
      <header style={{background:"linear-gradient(135deg,#064e3b 0%,#047857 100%)",color:"white",padding:"40px 24px 0"}}>
        <div style={{maxWidth:"1400px",margin:"0 auto"}}>
          <h1 style={{fontSize:"36px",fontWeight:"800",margin:"0 0 8px",letterSpacing:"-0.02em"}}>Browse Projects</h1>
          <p style={{fontSize:"16px",opacity:"0.9",margin:"0 0 32px"}}>Find your next opportunity — {filtered.length} project{filtered.length!==1?"s":""} available</p>
          <div style={{position:"relative",maxWidth:"700px",marginBottom:"24px"}}>
            <span style={{position:"absolute",left:"20px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af",display:"flex"}}><SearchIcon/></span>
            <input type="text" placeholder="Search projects by title, description or domain…" value={search} onChange={e=>setSearch(e.target.value)}
              style={{width:"100%",padding:"16px 50px",borderRadius:"50px",border:"none",fontSize:"16px",background:"white",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",boxSizing:"border-box"}}/>
            {search && <button onClick={()=>setSearch("")} style={{position:"absolute",right:"16px",top:"50%",transform:"translateY(-50%)",background:"#e5e7eb",border:"none",borderRadius:"50%",width:"28px",height:"28px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><CloseIcon/></button>}
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button style={{background:"transparent",border:"none",color:"white",padding:"16px 24px",fontWeight:"600",borderBottom:"3px solid white",cursor:"pointer"}}>
              Projects <span style={{background:"rgba(255,255,255,0.2)",padding:"2px 10px",borderRadius:"12px",fontSize:"13px",marginLeft:"6px"}}>{filtered.length}</span>
            </button>
          </div>
        </div>
      </header>

      <main style={{display:"flex",maxWidth:"1400px",margin:"0 auto",padding:"32px 24px",gap:"32px"}}>

        {/* Sidebar filters */}
        <aside style={{width:"280px",background:"white",padding:"24px",borderRadius:"16px",height:"fit-content",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",paddingBottom:"16px",borderBottom:"1px solid #e5e7eb"}}>
            <span style={{fontWeight:"700",fontSize:"18px",color:"#111827"}}>Filters</span>
            {(selectedCategories.length>0) && <button onClick={()=>setSelectedCategories([])} style={{background:"none",border:"none",color:"#059669",fontSize:"13px",cursor:"pointer"}}>Clear</button>}
          </div>

          <div style={{marginBottom:"20px"}}>
            <p style={{fontWeight:"600",fontSize:"14px",marginBottom:"12px",color:"#374151"}}>Budget Range</p>
            <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"10px"}}>
              <input type="number" value={budgetRange[0]} onChange={e=>setBudgetRange([Number(e.target.value),budgetRange[1]])}
                style={{width:"80px",padding:"8px",border:"1px solid #e5e7eb",borderRadius:"8px",fontSize:"13px"}}/>
              <span style={{color:"#9ca3af"}}>—</span>
              <input type="number" value={budgetRange[1]} onChange={e=>setBudgetRange([budgetRange[0],Number(e.target.value)])}
                style={{width:"80px",padding:"8px",border:"1px solid #e5e7eb",borderRadius:"8px",fontSize:"13px"}}/>
            </div>
            <input type="range" min="0" max="100000" step="1000" value={budgetRange[1]} onChange={e=>setBudgetRange([budgetRange[0],Number(e.target.value)])}
              style={{width:"100%",accentColor:"#059669"}}/>
          </div>

          <div>
            <p style={{fontWeight:"600",fontSize:"14px",marginBottom:"12px",color:"#374151"}}>Category</p>
            {categoryOptions.map(cat => (
              <label key={cat} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",cursor:"pointer"}}>
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={()=>setSelectedCategories(prev=>prev.includes(cat)?prev.filter(c=>c!==cat):[...prev,cat])}
                  style={{accentColor:"#059669"}}/>
                <span style={{fontSize:"14px",color:"#374151"}}>{cat}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Project list */}
        <section style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
            <span style={{fontWeight:"600",color:"#111827",fontSize:"16px"}}>{filtered.length} project{filtered.length!==1?"s":""} found</span>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <label style={{fontSize:"14px",color:"#6b7280"}}>Sort by:</label>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{padding:"10px 16px",border:"1px solid #e5e7eb",borderRadius:"10px",fontSize:"14px",background:"white",cursor:"pointer"}}>
                <option value="latest">Latest</option>
                <option value="budget-high">Highest Budget</option>
                <option value="budget-low">Lowest Budget</option>
              </select>
            </div>
          </div>

          {error && <div style={{padding:"16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",color:"#b91c1c",marginBottom:"16px"}}>⚠ {error}</div>}

          {isLoading ? (
            <>{[1,2,3].map(i=><SkeletonCard key={i}/>)}</>
          ) : filtered.length === 0 ? (
            <div style={{textAlign:"center",padding:"80px 40px",background:"white",borderRadius:"16px"}}>
              <div style={{fontSize:"64px",marginBottom:"16px"}}>🔍</div>
              <h3 style={{fontSize:"20px",color:"#111827"}}>No projects found</h3>
              <p style={{color:"#6b7280"}}>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filtered.map(project => {
              const title = project.title || project.description?.slice(0,60) || "Untitled Project";
              const skills = project.requiredSkills || [];
              const owner  = project.employerId;
              const isOwn  = user && (String(project.employerId?._id || project.employerId) === String(user.id));
              const alreadyApplied = project.applications?.some(a => String(a.freelancerId?._id||a.freelancerId) === String(user?.id));

              return (
                <article key={project._id}
                  style={{background:"white",padding:"24px",borderRadius:"16px",marginBottom:"16px",cursor:"pointer",border: hoveredCard===project._id?"1px solid #059669":"1px solid #e5e7eb",transition:"all 0.3s",transform:hoveredCard===project._id?"translateY(-4px)":"none",boxShadow:hoveredCard===project._id?"0 10px 40px rgba(5,150,105,0.12)":"none"}}
                  onMouseEnter={()=>setHoveredCard(project._id)} onMouseLeave={()=>setHoveredCard(null)}>

                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"16px",marginBottom:"12px"}}>
                    <div style={{flex:1}} onClick={()=>navigate(`/project/${project._id}`)}>
                      <span style={{display:"inline-block",background:"#f0fdf4",color:"#059669",padding:"4px 12px",borderRadius:"20px",fontSize:"12px",fontWeight:"500",marginBottom:"8px"}}>
                        {project.domain || "General"}
                      </span>
                      <h3 style={{fontSize:"18px",fontWeight:"700",color:"#111827",margin:0,lineHeight:"1.4"}}>{title}</h3>
                    </div>
                    <button onClick={e=>{e.stopPropagation();setSavedProjects(prev=>prev.includes(project._id)?prev.filter(p=>p!==project._id):[...prev,project._id])}}
                      style={{background:"none",border:"none",cursor:"pointer",color:savedProjects.includes(project._id)?"#059669":"#9ca3af",padding:"8px"}}>
                      {savedProjects.includes(project._id)?"🔖":"🏷"}
                    </button>
                  </div>

                  <div style={{display:"flex",alignItems:"center",gap:"20px",marginBottom:"16px"}}>
                    <span style={{fontSize:"22px",fontWeight:"700",color:"#059669"}}>Rs.{project.total_budget?.toLocaleString()}</span>
                    <span style={{display:"flex",alignItems:"center",gap:"6px",color:"#6b7280",fontSize:"14px"}}>
                      <ClockIcon/> {project.timeline || "Flexible"}
                    </span>
                    {project.milestones?.length > 0 && (
                      <span style={{fontSize:"13px",color:"#6b7280"}}>{project.milestones.length} milestone{project.milestones.length!==1?"s":""}</span>
                    )}
                  </div>

                  <p style={{color:"#4b5563",lineHeight:"1.6",margin:"0 0 16px",fontSize:"15px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                    {project.description}
                  </p>

                  {skills.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"16px"}}>
                      {skills.slice(0,5).map((s,i)=>(
                        <span key={i} style={{background:"#f3f4f6",color:"#374151",padding:"6px 14px",borderRadius:"20px",fontSize:"13px",fontWeight:"500"}}>{s}</span>
                      ))}
                      {skills.length>5 && <span style={{background:"#e5e7eb",color:"#6b7280",padding:"6px 14px",borderRadius:"20px",fontSize:"13px"}}>+{skills.length-5}</span>}
                    </div>
                  )}

                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"16px",borderTop:"1px solid #f3f4f6",flexWrap:"wrap",gap:"8px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                      {owner && <span style={{fontSize:"13px",color:"#6b7280"}}>by <strong>{owner.name || "Client"}</strong></span>}
                      {project.applications?.length > 0 && (
                        <span style={{fontSize:"13px",color:"#6b7280"}}>{project.applications.length} applicant{project.applications.length!==1?"s":""}</span>
                      )}
                    </div>
                    <div style={{display:"flex",gap:"8px"}}>
                      <button onClick={()=>navigate(`/project/${project._id}`)}
                        style={{padding:"8px 16px",border:"1px solid #059669",background:"white",color:"#059669",borderRadius:"8px",cursor:"pointer",fontWeight:"500",fontSize:"14px"}}>
                        View Details
                      </button>
                      {!isOwn && (
                        alreadyApplied ? (
                          <span style={{padding:"8px 16px",background:"#f0fdf4",color:"#059669",borderRadius:"8px",fontSize:"14px",fontWeight:"500"}}>✓ Applied</span>
                        ) : (
                          <button onClick={e=>{e.stopPropagation(); if(!user){navigate("/login");return;} setApplyModal(project); setBidAmount(project.total_budget||"");}}
                            style={{padding:"8px 16px",background:"linear-gradient(135deg,#10b981,#059669)",color:"white",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:"600",fontSize:"14px"}}>
                            Apply Now
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      {/* Apply Modal */}
      {applyModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"20px"}}
          onClick={()=>setApplyModal(null)}>
          <div style={{background:"white",borderRadius:"20px",padding:"32px",maxWidth:"500px",width:"100%",boxShadow:"0 25px 80px rgba(0,0,0,0.2)"}}
            onClick={e=>e.stopPropagation()}>
            <h2 style={{fontSize:"22px",fontWeight:"700",marginBottom:"8px",color:"#111827"}}>Apply for Project</h2>
            <p style={{color:"#6b7280",fontSize:"14px",marginBottom:"24px"}}>{applyModal.title||applyModal.description?.slice(0,60)}</p>

            <div style={{marginBottom:"16px"}}>
              <label style={{display:"block",fontSize:"14px",fontWeight:"600",color:"#374151",marginBottom:"8px"}}>Your Bid Amount (Rs.)</label>
              <input type="number" value={bidAmount} onChange={e=>setBidAmount(e.target.value)}
                style={{width:"100%",padding:"12px 16px",border:"2px solid #e5e7eb",borderRadius:"10px",fontSize:"15px",outline:"none",boxSizing:"border-box"}}/>
            </div>

            <div style={{marginBottom:"24px"}}>
              <label style={{display:"block",fontSize:"14px",fontWeight:"600",color:"#374151",marginBottom:"8px"}}>Cover Letter</label>
              <textarea value={coverLetter} onChange={e=>setCoverLetter(e.target.value)}
                placeholder="Explain why you're a great fit for this project…"
                style={{width:"100%",padding:"12px 16px",border:"2px solid #e5e7eb",borderRadius:"10px",fontSize:"14px",minHeight:"120px",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            </div>

            <div style={{display:"flex",gap:"12px"}}>
              <button onClick={()=>setApplyModal(null)}
                style={{flex:1,padding:"14px",border:"1px solid #e5e7eb",background:"white",borderRadius:"10px",cursor:"pointer",fontWeight:"600"}}>
                Cancel
              </button>
              <button onClick={handleApply} disabled={applying===applyModal._id}
                style={{flex:2,padding:"14px",background:"linear-gradient(135deg,#10b981,#059669)",color:"white",border:"none",borderRadius:"10px",cursor:"pointer",fontWeight:"600",fontSize:"15px",opacity:applying===applyModal._id?0.7:1}}>
                {applying===applyModal._id ? "Submitting…" : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
