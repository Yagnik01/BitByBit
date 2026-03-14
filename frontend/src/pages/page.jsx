import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Code2, Palette, ShoppingCart,
  Smartphone, Brain, Database,
  ChevronRight, ChevronLeft, X, Check
} from "lucide-react";
import { api } from "../api";

const STEPS = [
  { id:1, title:"Basics" },
  { id:2, title:"Category" },
  { id:3, title:"Tech Stack" },
  { id:4, title:"Milestones" },
  { id:5, title:"Review" },
];

const CATEGORIES = [
  { id:"web",       icon:Code2,       label:"Web Development" },
  { id:"mobile",    icon:Smartphone,  label:"Mobile App" },
  { id:"design",    icon:Palette,     label:"UI/UX Design" },
  { id:"ai",        icon:Brain,       label:"AI & ML" },
  { id:"ecommerce", icon:ShoppingCart,label:"E-Commerce" },
  { id:"data",      icon:Database,    label:"Data & Backend" },
];

const TECH_OPTIONS = [
  "React.js","Next.js","Node.js","Python","TypeScript",
  "MongoDB","PostgreSQL","AWS","Docker","GraphQL",
  "Vue.js","Django","FastAPI","Redis","Flutter",
  "React Native","Firebase","Stripe","Tailwind CSS",
];

// Map AI domain string → category id
function domainToCategory(domain) {
  if (!domain) return null;
  const d = domain.toLowerCase();
  if (d.includes("mobile"))                    return "mobile";
  if (d.includes("ai") || d.includes("ml") || d.includes("machine")) return "ai";
  if (d.includes("ecommerce") || d.includes("shop") || d.includes("commerce")) return "ecommerce";
  if (d.includes("data") || d.includes("backend") || d.includes("api")) return "data";
  if (d.includes("design") || d.includes("ui") || d.includes("ux")) return "design";
  return "web";
}

export default function ProjectBriefingWizard({
  initialDescription = "",
  initialBudget      = 5000,
  initialTimeline    = "",
  initialAiData      = null,   // ← pre-loaded from postpage
}) {
  const navigate = useNavigate();

  const [step,      setStep]      = useState(1);
  const [direction, setDirection] = useState(0);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [projectName,   setProjectName]   = useState("");
  const [description,   setDescription]   = useState(initialDescription);
  const [category,      setCategory]      = useState(null);
  const [selectedTech,  setSelectedTech]  = useState([]);
  const [techInput,     setTechInput]     = useState("");
  const [milestones,    setMilestones]    = useState([]);
  const [mTitle,        setMTitle]        = useState("");
  const [mDesc,         setMDesc]         = useState("");
  const [mBudget,       setMBudget]       = useState("");
  const [mTimeline,     setMTimeline]     = useState("");
  const [budget,        setBudget]        = useState(Number(initialBudget) || 5000);

  // ── AI state ───────────────────────────────────────────────────────────────
  const [isAnalyzing,  setIsAnalyzing]  = useState(false);
  const [aiData,       setAiData]       = useState(initialAiData);
  const [aiApplied,    setAiApplied]    = useState(false);
  const [aiError,      setAiError]      = useState("");

  // ── Submit state ───────────────────────────────────────────────────────────
  const [submitting,   setSubmitting]   = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError,  setSubmitError]  = useState("");

  // ── Sync props → state ─────────────────────────────────────────────────────
  useEffect(() => { if (initialDescription) setDescription(initialDescription); }, [initialDescription]);
  useEffect(() => { setBudget(Number(initialBudget) || 5000); }, [initialBudget]);

  // If AI data was passed in from postpage, auto-apply it immediately
  useEffect(() => {
    if (initialAiData && !aiApplied) {
      applyAiData(initialAiData);
    }
  }, [initialAiData]);

  // ── AI call ────────────────────────────────────────────────────────────────
  const runAI = async () => {
    const desc = description || initialDescription;
    if (!desc.trim()) return;
    setIsAnalyzing(true);
    setAiError("");
    try {
      const data = await api.analyzeProject(desc, budget, initialTimeline || "flexible");
      setAiData(data);
    } catch (err) {
      setAiError("AI analysis failed — you can still fill in details manually.");
      console.error("AI error:", err);
    }
    setIsAnalyzing(false);
  };

  // ── Apply AI suggestions to form fields ────────────────────────────────────
  const applyAiData = (data) => {
    if (!data) return;

    if (data.project_name && !projectName) setProjectName(data.project_name);

    if (data.domain) {
      const catId = domainToCategory(data.domain);
      if (catId) setCategory(catId);
    }

    if (Array.isArray(data.tech_stack) && data.tech_stack.length > 0) {
      setSelectedTech(data.tech_stack);
    }

    if (Array.isArray(data.milestones) && data.milestones.length > 0) {
      const mapped = data.milestones.map((m, i) => ({
        id:          Date.now() + i,
        title:       m.title       || `Milestone ${i + 1}`,
        description: m.description || "",
        timeline:    m.timeline    || "",
        budget:      Number(m.budget_allocation) || 0,
      }));
      setMilestones(mapped);
      const total = mapped.reduce((s, m) => s + m.budget, 0);
      if (total > 0) setBudget(total);
    }

    setAiApplied(true);
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = (s) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
    // Auto-run AI if we reach review and still have no AI data
    if (s === 5 && !aiData && !isAnalyzing) runAI();
  };
  const next = () => { if (step < 5) goTo(step + 1); };
  const prev = () => { if (step > 1) goTo(step - 1); };

  // ── Tech helpers ───────────────────────────────────────────────────────────
  const addTech = (t) => { if (!selectedTech.includes(t)) setSelectedTech([...selectedTech, t]); };
  const removeTech = (t) => setSelectedTech(selectedTech.filter(x => x !== t));
  const filteredTech = TECH_OPTIONS.filter(t =>
    t.toLowerCase().includes(techInput.toLowerCase()) && !selectedTech.includes(t)
  );

  // ── Milestone helpers ──────────────────────────────────────────────────────
  const addMilestone = () => {
    if (!mTitle.trim()) return;
    const budgetNum = Number(mBudget) || 0;
    setMilestones(prev => [...prev, { id: Date.now(), title: mTitle.trim(), description: mDesc, timeline: mTimeline, budget: budgetNum }]);
    setBudget(prev => prev + budgetNum);
    setMTitle(""); setMDesc(""); setMBudget(""); setMTimeline("");
  };
  const removeMilestone = (id) => {
    const m = milestones.find(x => x.id === id);
    setMilestones(prev => prev.filter(x => x.id !== id));
    if (m) setBudget(prev => prev - m.budget);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setSubmitStatus("error"); setSubmitError("You must be logged in to post a project."); return; }
    const desc = description || initialDescription;
    if (!desc.trim()) { setSubmitStatus("error"); setSubmitError("Project description is required."); return; }

    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const payload = {
        title:          projectName || aiData?.project_name || desc.slice(0, 80),
        description:    desc,
        domain:         CATEGORIES.find(c => c.id === category)?.label || aiData?.domain || "",
        requiredSkills: selectedTech,
        total_budget:   budget,
        timeline:       initialTimeline,
        milestones:     milestones.map(m => ({
          title:             m.title,
          description:       m.description,
          timeline:          m.timeline,
          budget_allocation: m.budget,
        })),
        // Persist full AI analysis to DB
        aiAnalysis: aiData ? {
          domain:            aiData.domain            || "",
          suggestedSkills:   aiData.tech_stack        || [],
          suggestedTimeline: aiData.timeline          || initialTimeline,
          note:              aiData.note              || (aiData._fallback ? "AI offline — smart fallback used." : ""),
        } : undefined,
      };

      const project = await api.createProject(payload);
      setSubmitStatus("success");
      setTimeout(() => navigate(`/project/${project._id}`), 1800);
    } catch (err) {
      setSubmitStatus("error");
      setSubmitError(err.message || "Failed to post project.");
    }
    setSubmitting(false);
  };

  // ── Animation variants ─────────────────────────────────────────────────────
  const slideVariants = {
    enter:  d => ({ x: d > 0 ? 280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   d => ({ x: d < 0 ? 280 : -280, opacity: 0 }),
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    container:  { minHeight:"100vh", display:"flex", color:"#1a1a1a", background:"#f8f9fb", fontFamily:"'Inter',-apple-system,sans-serif" },
    sidebar:    { width:"100px", background:"#fff", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"40px", zIndex:10 },
    stepBtn:    { width:"48px", height:"48px", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"24px", cursor:"pointer", fontWeight:"600", fontSize:"15px", border:"none", transition:"all 0.2s" },
    main:       { flex:1, display:"flex", justifyContent:"center", overflowY:"auto" },
    content:    { flex:1, padding:"48px 64px", maxWidth:"860px", background:"#fff", margin:"20px", borderRadius:"24px", boxShadow:"0 4px 24px rgba(0,0,0,0.05)" },
    input:      { width:"100%", padding:"14px 16px", border:"1.5px solid #eef0f2", borderRadius:"12px", marginBottom:"16px", fontSize:"15px", background:"#fcfcfd", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" },
    textarea:   { width:"100%", padding:"14px 16px", border:"1.5px solid #eef0f2", borderRadius:"12px", minHeight:"140px", fontSize:"15px", background:"#fcfcfd", outline:"none", resize:"none", boxSizing:"border-box" },
    grid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"16px", marginTop:"16px" },
    card:       { padding:"28px 16px", border:"1.5px solid #eef0f2", borderRadius:"16px", cursor:"pointer", textAlign:"center", background:"#fff", transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:"10px" },
    cardSel:    { padding:"28px 16px", border:"2px solid #6366f1", borderRadius:"16px", cursor:"pointer", textAlign:"center", background:"#f5f3ff", color:"#4338ca", fontWeight:"600", display:"flex", flexDirection:"column", alignItems:"center", gap:"10px", boxShadow:"0 4px 20px rgba(99,102,241,0.15)" },
    techTag:    { padding:"8px 14px", background:"#6366f1", color:"#fff", borderRadius:"20px", display:"inline-flex", alignItems:"center", margin:"4px", fontSize:"13px", fontWeight:"500" },
    techBtn:    { margin:"4px", padding:"7px 14px", background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:"8px", cursor:"pointer", color:"#4b5563", fontSize:"13px", transition:"all 0.15s" },
    navBtns:    { display:"flex", justifyContent:"space-between", marginTop:"48px", paddingTop:"24px", borderTop:"1px solid #f3f4f6" },
    navBtn:     { display:"flex", alignItems:"center", gap:"8px", padding:"11px 22px", borderRadius:"12px", border:"none", background:"#1a1a1a", color:"#fff", cursor:"pointer", fontWeight:"500", fontSize:"14px" },
    submitBtn:  { width:"100%", marginTop:"24px", background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"#fff", padding:"16px", borderRadius:"12px", border:"none", fontSize:"16px", fontWeight:"600", cursor:"pointer", boxShadow:"0 4px 20px rgba(99,102,241,0.3)" },
    mInput:     { padding:"10px 14px", border:"1.5px solid #eef0f2", borderRadius:"10px", fontSize:"14px", outline:"none", background:"#fcfcfd" },
    mCard:      { display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"14px 16px", border:"1px solid #e5e7eb", borderRadius:"12px", marginBottom:"10px", background:"#fafafa", gap:"12px" },
    aiBadge:    { display:"inline-flex", alignItems:"center", gap:"6px", padding:"4px 10px", background:"#ede9fe", color:"#6d28d9", borderRadius:"20px", fontSize:"12px", fontWeight:"600" },
    reviewRow:  { display:"flex", borderBottom:"1px solid #f3f4f6", padding:"10px 0", gap:"12px" },
    reviewLabel:{ fontSize:"13px", color:"#9ca3af", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.04em", minWidth:"120px" },
    reviewValue:{ fontSize:"14px", color:"#1f2937", flex:1 },
  };

  const aiSuggestedLabel = (aiApplied || initialAiData) ? (
    <span style={S.aiBadge}><Sparkles size={11}/> AI Suggested</span>
  ) : null;

  return (
    <div style={S.container}>

      {/* ── Step sidebar ── */}
      <div style={S.sidebar}>
        {STEPS.map(s => (
          <div key={s.id} title={s.title} onClick={() => goTo(s.id)}
            style={{ ...S.stepBtn, background: s.id < step ? "#10b981" : s.id === step ? "#ff4da6" : "#f3f3f3", color: s.id <= step ? "white" : "#9ca3af" }}>
            {s.id < step ? <Check size={18}/> : s.id}
          </div>
        ))}
        {/* AI status dot */}
        <div style={{ marginTop:"auto", marginBottom:"24px", textAlign:"center" }}>
          <div style={{ width:"10px", height:"10px", borderRadius:"50%", background: isAnalyzing ? "#f59e0b" : aiData ? "#10b981" : "#e5e7eb", margin:"0 auto", boxShadow: isAnalyzing ? "0 0 0 4px rgba(245,158,11,0.2)" : aiData ? "0 0 0 4px rgba(16,185,129,0.2)" : "none" }}/>
          <p style={{ fontSize:"10px", color:"#9ca3af", marginTop:"4px" }}>AI</p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={S.main}>
        <div style={S.content}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ type:"spring", stiffness:320, damping:32 }}>

              {/* ── STEP 1: Basics ── */}
              {step === 1 && (
                <div>
                  <h2 style={{ marginBottom:"6px", fontSize:"22px" }}>Project Basics</h2>
                  <p style={{ color:"#6b7280", marginBottom:"24px", fontSize:"14px" }}>Give your project a name and describe what you need built.</p>

                  <label style={{ fontSize:"13px", fontWeight:"600", color:"#374151", display:"block", marginBottom:"6px" }}>
                    Project Name {aiSuggestedLabel}
                  </label>
                  <input style={S.input} placeholder="e.g. Freelancer Marketplace Platform"
                    value={projectName} onChange={e => setProjectName(e.target.value)} />

                  <label style={{ fontSize:"13px", fontWeight:"600", color:"#374151", display:"block", marginBottom:"6px" }}>
                    Description
                  </label>
                  <textarea style={S.textarea} placeholder="Describe your project in detail…"
                    value={description} onChange={e => setDescription(e.target.value)} />

                  {initialTimeline && (
                    <p style={{ color:"#6b7280", fontSize:"13px", marginTop:"10px" }}>
                      Timeline: <strong>{initialTimeline}</strong> · Budget: <strong style={{ color:"#059669" }}>Rs.{budget.toLocaleString()}</strong>
                    </p>
                  )}

                  {/* Show inline AI loading if not yet done */}
                  {isAnalyzing && (
                    <div style={{ marginTop:"16px", display:"flex", alignItems:"center", gap:"8px", color:"#6366f1", fontSize:"14px" }}>
                      <span style={{ width:"14px", height:"14px", border:"2px solid #c4b5fd", borderTopColor:"#6366f1", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                      AI is analyzing your project…
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 2: Category ── */}
              {step === 2 && (
                <div>
                  <h2 style={{ marginBottom:"6px", fontSize:"22px" }}>Project Category</h2>
                  <p style={{ color:"#6b7280", marginBottom:"16px", fontSize:"14px" }}>
                    Select the domain that best fits your project.
                    {aiData?.domain && !aiApplied && " AI has pre-selected a suggestion below."}
                  </p>

                  {/* AI domain suggestion banner */}
                  {aiData?.domain && (
                    <div style={{ padding:"12px 16px", background:"#f5f3ff", borderRadius:"10px", marginBottom:"16px", display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid #c4b5fd" }}>
                      <span style={{ fontSize:"14px", color:"#5b21b6" }}>
                        <Sparkles size={14} style={{ verticalAlign:"middle", marginRight:"6px" }}/>
                        AI suggests: <strong>{aiData.domain}</strong>
                      </span>
                      {!aiApplied && (
                        <button onClick={() => applyAiData(aiData)}
                          style={{ padding:"6px 14px", background:"#6366f1", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>
                          Apply All AI
                        </button>
                      )}
                    </div>
                  )}

                  <div style={S.grid}>
                    {CATEGORIES.map(cat => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <div key={cat.id} style={isSelected ? S.cardSel : S.card} onClick={() => setCategory(cat.id)}>
                          <Icon size={28} color={isSelected ? "#6366f1" : "#6b7280"}/>
                          <p style={{ margin:0, fontSize:"14px" }}>{cat.label}</p>
                          {isSelected && <Check size={16} color="#6366f1"/>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── STEP 3: Tech Stack ── */}
              {step === 3 && (
                <div>
                  <h2 style={{ marginBottom:"6px", fontSize:"22px" }}>Tech Stack</h2>
                  <p style={{ color:"#6b7280", marginBottom:"16px", fontSize:"14px" }}>
                    Select technologies required for the project.
                  </p>

                  {/* AI tech stack */}
                  {Array.isArray(aiData?.tech_stack) && aiData.tech_stack.length > 0 && (
                    <div style={{ padding:"14px 16px", background:"#f5f3ff", borderRadius:"10px", marginBottom:"16px", border:"1px solid #c4b5fd" }}>
                      <p style={{ fontSize:"13px", fontWeight:"600", color:"#6d28d9", margin:"0 0 10px", display:"flex", alignItems:"center", gap:"6px" }}>
                        <Sparkles size={13}/> AI-Recommended Tech Stack
                        {aiApplied && <span style={{ color:"#10b981", fontSize:"12px" }}>(applied ✓)</span>}
                      </p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                        {aiData.tech_stack.map((t, i) => (
                          <button key={i} onClick={() => addTech(t)}
                            style={{ ...S.techBtn, background: selectedTech.includes(t) ? "#ede9fe" : "#f3f4f6", color: selectedTech.includes(t) ? "#5b21b6" : "#4b5563", borderColor: selectedTech.includes(t) ? "#c4b5fd" : "#e5e7eb" }}>
                            {selectedTech.includes(t) ? "✓ " : ""}{t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <input style={S.input} placeholder="Search or add custom tech…"
                    value={techInput} onChange={e => setTechInput(e.target.value)} />

                  <div style={{ marginBottom:"16px" }}>
                    {filteredTech.slice(0, 12).map(t => (
                      <button key={t} onClick={() => addTech(t)} style={S.techBtn}>{t}</button>
                    ))}
                  </div>

                  {/* Selected tags */}
                  <div style={{ minHeight:"40px" }}>
                    {selectedTech.length === 0 ? (
                      <p style={{ color:"#9ca3af", fontSize:"14px" }}>No tech selected yet.</p>
                    ) : (
                      selectedTech.map(t => (
                        <span key={t} style={S.techTag}>
                          {t}
                          <X size={13} style={{ marginLeft:"6px", cursor:"pointer" }} onClick={() => removeTech(t)}/>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP 4: Milestones ── */}
              {step === 4 && (
                <div>
                  <h2 style={{ marginBottom:"6px", fontSize:"22px" }}>Milestones</h2>
                  <p style={{ color:"#6b7280", marginBottom:"16px", fontSize:"14px" }}>
                    Break the project into milestones — this enables milestone-based payments.
                  </p>

                  {/* AI milestone suggestion (if not yet applied) */}
                  {Array.isArray(aiData?.milestones) && aiData.milestones.length > 0 && !aiApplied && (
                    <div style={{ padding:"16px", background:"#f5f3ff", borderRadius:"12px", marginBottom:"20px", border:"1px solid #c4b5fd" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
                        <span style={{ fontSize:"14px", fontWeight:"700", color:"#5b21b6", display:"flex", alignItems:"center", gap:"6px" }}>
                          <Sparkles size={14}/> AI-Generated Milestones
                        </span>
                        <button onClick={() => applyAiData(aiData)}
                          style={{ padding:"8px 16px", background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontWeight:"600" }}>
                          Use These Milestones
                        </button>
                      </div>
                      {aiData.milestones.map((m, i) => (
                        <div key={i} style={{ fontSize:"13px", color:"#5b21b6", padding:"6px 8px", borderRadius:"6px", marginBottom:"4px", background:"rgba(255,255,255,0.6)", display:"flex", justifyContent:"space-between" }}>
                          <span><strong>{i+1}. {m.title}</strong> — {m.description?.slice(0,60)}</span>
                          <span style={{ color:"#059669", fontWeight:"600", whiteSpace:"nowrap", marginLeft:"12px" }}>
                            Rs.{Number(m.budget_allocation||0).toLocaleString()} · {m.timeline}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add milestone form */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 120px auto", gap:"8px", marginBottom:"16px", alignItems:"start" }}>
                    <input type="text" placeholder="Milestone title *" value={mTitle} onChange={e => setMTitle(e.target.value)}
                      style={{ ...S.mInput, width:"100%" }}/>
                    <input type="text" placeholder="Timeline" value={mTimeline} onChange={e => setMTimeline(e.target.value)}
                      style={{ ...S.mInput, width:"100%" }}/>
                    <input type="number" placeholder="Budget (Rs.)" value={mBudget} onChange={e => setMBudget(e.target.value)}
                      style={{ ...S.mInput, width:"100%" }}/>
                    <button onClick={addMilestone}
                      style={{ padding:"10px 18px", background:"#6366f1", color:"white", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"600", whiteSpace:"nowrap" }}>
                      + Add
                    </button>
                  </div>
                  {/* Description for new milestone */}
                  <input type="text" placeholder="Milestone description (optional)" value={mDesc} onChange={e => setMDesc(e.target.value)}
                    style={{ ...S.mInput, width:"100%", marginBottom:"16px" }}/>

                  {milestones.length === 0 ? (
                    <p style={{ color:"#9ca3af", fontSize:"14px", textAlign:"center", padding:"24px 0" }}>
                      No milestones yet. Add one above or apply AI suggestions.
                    </p>
                  ) : (
                    milestones.map((m, i) => (
                      <div key={m.id} style={S.mCard}>
                        <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"13px", flexShrink:0 }}>
                          {i + 1}
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontWeight:"700", margin:"0 0 4px", fontSize:"14px", color:"#1f2937" }}>{m.title}</p>
                          {m.description && <p style={{ fontSize:"13px", color:"#6b7280", margin:"0 0 6px" }}>{m.description}</p>}
                          <div style={{ display:"flex", gap:"16px" }}>
                            {m.timeline && <span style={{ fontSize:"12px", color:"#6b7280" }}>⏱ {m.timeline}</span>}
                            {m.budget > 0 && <span style={{ fontSize:"12px", color:"#059669", fontWeight:"600" }}>💰 Rs.{m.budget.toLocaleString()}</span>}
                          </div>
                        </div>
                        <button onClick={() => removeMilestone(m.id)}
                          style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"20px", padding:"0 4px" }}>×</button>
                      </div>
                    ))
                  )}

                  <div style={{ marginTop:"16px", padding:"14px 16px", background:"#f9fafb", borderRadius:"10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"14px", color:"#6b7280" }}>{milestones.length} milestone{milestones.length!==1?"s":""}</span>
                    <span style={{ fontSize:"16px", fontWeight:"700", color:"#059669" }}>
                      Total: Rs.{budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Review & Submit ── */}
              {step === 5 && (
                <div>
                  <h2 style={{ marginBottom:"6px", fontSize:"22px" }}>Review & Submit</h2>
                  <p style={{ color:"#6b7280", marginBottom:"24px", fontSize:"14px" }}>
                    Review your project details before posting to the marketplace.
                  </p>

                  {/* Summary card */}
                  <div style={{ background:"#f9fafb", borderRadius:"14px", padding:"20px 24px", marginBottom:"20px", border:"1px solid #e5e7eb" }}>
                    {[
                      ["Project Name",  projectName || aiData?.project_name || description.slice(0,60) || "—"],
                      ["Description",   description || "—"],
                      ["Category",      CATEGORIES.find(c=>c.id===category)?.label || aiData?.domain || "—"],
                      ["Tech Stack",    selectedTech.length > 0 ? selectedTech.join(", ") : "—"],
                      ["Timeline",      initialTimeline || "—"],
                      ["Total Budget",  `Rs.${budget.toLocaleString()}`],
                      ["Milestones",    `${milestones.length} milestone${milestones.length!==1?"s":""}`],
                    ].map(([label, val]) => (
                      <div key={label} style={S.reviewRow}>
                        <span style={S.reviewLabel}>{label}</span>
                        <span style={S.reviewValue}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Milestone list in review */}
                  {milestones.length > 0 && (
                    <div style={{ marginBottom:"20px" }}>
                      <p style={{ fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"10px" }}>Milestone Breakdown</p>
                      {milestones.map((m, i) => (
                        <div key={m.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:"white", borderRadius:"10px", marginBottom:"8px", border:"1px solid #e5e7eb" }}>
                          <span style={{ width:"24px", height:"24px", borderRadius:"50%", background:"#6366f1", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"700", flexShrink:0 }}>{i+1}</span>
                          <span style={{ flex:1, fontSize:"14px", color:"#1f2937" }}>{m.title}</span>
                          {m.timeline && <span style={{ fontSize:"12px", color:"#6b7280" }}>⏱ {m.timeline}</span>}
                          {m.budget > 0 && <span style={{ fontSize:"13px", color:"#059669", fontWeight:"600" }}>${m.budget.toLocaleString()}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI analysis (collapsible summary) */}
                  {isAnalyzing && (
                    <div style={{ padding:"14px 16px", background:"#f5f3ff", borderRadius:"10px", marginBottom:"16px", display:"flex", alignItems:"center", gap:"10px" }}>
                      <span style={{ width:"14px", height:"14px", border:"2px solid #c4b5fd", borderTopColor:"#6366f1", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>
                      <span style={{ color:"#6366f1", fontSize:"14px" }}>Fetching AI analysis…</span>
                    </div>
                  )}
                  {aiData && !isAnalyzing && (
                    <div style={{ padding:"14px 16px", background:"#f5f3ff", borderRadius:"10px", marginBottom:"16px", border:"1px solid #c4b5fd", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontSize:"13px", color:"#5b21b6", display:"flex", alignItems:"center", gap:"8px" }}>
                        <Sparkles size={14}/>
                        AI analysis {aiData._fallback ? "(smart fallback)" : "(Gemini AI)"} will be stored with the project.
                      </span>
                      <span style={{ fontSize:"12px", color:"#10b981", fontWeight:"600" }}>✓ Ready</span>
                    </div>
                  )}
                  {aiError && (
                    <div style={{ padding:"12px 16px", background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:"10px", marginBottom:"16px", fontSize:"13px", color:"#92400e" }}>
                      ⚠ {aiError} — project will be posted without AI analysis.
                    </div>
                  )}

                  {/* Submit */}
                  {submitStatus === "success" ? (
                    <div style={{ padding:"28px", background:"#dcfce7", borderRadius:"14px", textAlign:"center", border:"1px solid #bbf7d0" }}>
                      <div style={{ fontSize:"40px", marginBottom:"8px" }}>✅</div>
                      <p style={{ color:"#166534", fontWeight:"700", fontSize:"18px", margin:"0 0 6px" }}>Project posted successfully!</p>
                      <p style={{ color:"#166534", fontSize:"14px", margin:0 }}>Redirecting to your project page…</p>
                    </div>
                  ) : (
                    <>
                      <button
                        style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                        onClick={handleSubmit}
                        disabled={submitting}>
                        {submitting ? (
                          <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                            <span style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                            Posting Project…
                          </span>
                        ) : "🚀 Post Project to Marketplace"}
                      </button>
                      {submitStatus === "error" && (
                        <div style={{ marginTop:"12px", padding:"12px 16px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", color:"#b91c1c", fontSize:"14px" }}>
                          ❌ {submitError}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ── Navigation buttons ── */}
          <div style={S.navBtns}>
            <button style={{ ...S.navBtn, visibility: step > 1 ? "visible" : "hidden" }} onClick={prev}>
              <ChevronLeft size={16}/> Back
            </button>
            {step < 5 && (
              <button style={S.navBtn} onClick={next}>
                Next <ChevronRight size={16}/>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
