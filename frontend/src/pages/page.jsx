import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Code2, Palette, ShoppingCart,
  Smartphone, Brain, Database,
  ChevronRight, ChevronLeft, X
} from "lucide-react";

const steps = [
  { id: 1, title: "Basics" },
  { id: 2, title: "Category" },
  { id: 3, title: "Tech Stack" },
  { id: 4, title: "Milestones" },
  { id: 5, title: "Review" }
];

const categories = [
  { id: "web", icon: Code2, label: "Web Development" },
  { id: "mobile", icon: Smartphone, label: "Mobile App" },
  { id: "design", icon: Palette, label: "UI/UX Design" },
  { id: "ai", icon: Brain, label: "AI & ML" },
  { id: "ecommerce", icon: ShoppingCart, label: "E-Commerce" },
  { id: "data", icon: Database, label: "Data & Backend" },
];

const techStackOptions = [
  "React.js","Next.js","Node.js","Python","TypeScript",
  "MongoDB","PostgreSQL","AWS","Docker","GraphQL",
  "Vue.js","Django","FastAPI","Redis"
];

export default function ProjectBriefingWizard({ initialDescription = "", initialBudget = 5000, initialTimeline = "" }) {

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState(initialDescription);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [milestones, setMilestones] = useState([]);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneBudget, setMilestoneBudget] = useState("");

  const [budget, setBudget] = useState(initialBudget);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [submitError, setSubmitError] = useState('');

  // Sync props if they change
  useEffect(() => { if (initialDescription) setProjectDescription(initialDescription); }, [initialDescription]);
  useEffect(() => { setBudget(Number(initialBudget) || 5000); }, [initialBudget]);

  const addMilestone = () => {
    if (!milestoneTitle.trim() || !milestoneBudget) return;
    const newMilestone = {
      id: Date.now(),
      title: milestoneTitle.trim(),
      budget: Number(milestoneBudget),
      completed: false
    };
    setMilestones([...milestones, newMilestone]);
    setBudget(prev => prev + Number(milestoneBudget));
    setMilestoneTitle("");
    setMilestoneBudget("");
  };

  const removeMilestone = (id) => {
    const milestone = milestones.find(m => m.id === id);
    setMilestones(milestones.filter(m => m.id !== id));
    if (milestone) setBudget(prev => prev - milestone.budget);
  };

  const goToStep = (step) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
    if (step === 5) handleAnalyzeWithAI();
  };

  const nextStep = () => { if (currentStep < 5) goToStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) goToStep(currentStep - 1); };

  const addTech = (tech) => {
    if (!selectedTech.includes(tech)) setSelectedTech([...selectedTech, tech]);
  };
  const removeTech = (tech) => setSelectedTech(selectedTech.filter(t => t !== tech));

  const filteredTechOptions = techStackOptions.filter(
    tech => tech.toLowerCase().includes(techInput.toLowerCase())
  );

  const handleAnalyzeWithAI = async () => {
    const desc = projectDescription || initialDescription;
    if (!desc) return;
    setIsAnalyzing(true);
    setAiSuggestion(null);
    try {
      const res = await fetch('/api/projects/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc, budget, timeline: initialTimeline }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data);
      }
    } catch (err) {
      console.error('AI analyze error:', err);
    }
    setIsAnalyzing(false);
  };

  const handleSubmitProject = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setSubmitStatus('error'); setSubmitError('You must be logged in to post a project.'); return; }

    const desc = projectDescription || initialDescription;
    if (!desc.trim()) { setSubmitStatus('error'); setSubmitError('Project description is required.'); return; }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: desc,
          domain: selectedCategory,
          total_budget: budget,
          timeline: initialTimeline,
          milestones: milestones.map(m => ({ title: m.title, budget_allocation: m.budget })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setSubmitError(data.message || 'Failed to post project.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitError('Server error. Please try again.');
    }
    setIsSubmitting(false);
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  const styles = {
    container: { minHeight: "100vh", display: "flex", color: "#1a1a1a", background: "#f8f9fb", fontFamily: "'Inter', -apple-system, sans-serif" },
    sidebar: { width: "100px", background: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "40px", zIndex: 10 },
    stepButton: { width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.3s ease", border: "none" },
    main: { flex: 1, display: "flex", justifyContent: "center" },
    content: { flex: 1, padding: "60px 80px", maxWidth: "850px", background: "#ffffff", margin: "20px", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
    input: { width: "100%", padding: "16px", border: "1.5px solid #eef0f2", borderRadius: "12px", marginBottom: "20px", fontSize: "16px", background: "#fcfcfd", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" },
    textarea: { width: "100%", padding: "16px", border: "1.5px solid #eef0f2", borderRadius: "12px", minHeight: "160px", fontSize: "16px", background: "#fcfcfd", outline: "none", resize: "none", boxSizing: "border-box" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" },
    card: { padding: "30px 20px", border: "1px solid #eef0f2", borderRadius: "16px", cursor: "pointer", textAlign: "center", background: "#ffffff", transition: "all 0.2s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
    cardSelected: { padding: "30px 20px", border: "2px solid #6366f1", borderRadius: "16px", cursor: "pointer", textAlign: "center", background: "#f5f3ff", color: "#4338ca", fontWeight: "600", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.2)" },
    techTag: { padding: "8px 14px", background: "#6366f1", color: "#fff", borderRadius: "10px", display: "inline-flex", alignItems: "center", margin: "6px", fontSize: "14px" },
    techBtn: { margin: "4px", padding: "8px 16px", background: "#f3f4f6", border: "none", borderRadius: "8px", cursor: "pointer", color: "#4b5563", fontSize: "14px" },
    navButtons: { display: "flex", justifyContent: "space-between", marginTop: "60px", paddingTop: "30px", borderTop: "1px solid #f3f4f6" },
    navBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", border: "none", background: "#1a1a1a", color: "#ffffff", cursor: "pointer", fontWeight: "500" },
    submitBtn: { width: "100%", marginTop: "30px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#ffffff", padding: "16px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: "600", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)" },
    milestoneInput: { padding: "10px 14px", border: "1.5px solid #eef0f2", borderRadius: "10px", fontSize: "14px", outline: "none", background: "#fcfcfd" },
    milestoneCard: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", border: "1px solid #e5e7eb", borderRadius: "12px", marginBottom: "10px", background: "#fafafa" },
  };

  return (
    <div style={styles.container}>

      {/* STEP SIDEBAR */}
      <div style={styles.sidebar}>
        {steps.map(step => (
          <div key={step.id} onClick={() => goToStep(step.id)}
            style={{ ...styles.stepButton, background: step.id <= currentStep ? "#ff4da6" : "#f3f3f3", color: step.id <= currentStep ? "white" : "black" }}>
            {step.id}
          </div>
        ))}
      </div>

      <div style={styles.main}>
        <div style={styles.content}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentStep} custom={direction} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>

              {/* STEP 1 — BASICS */}
              {currentStep === 1 && (
                <div>
                  <h2 style={{ marginBottom: "24px" }}>Project Basics</h2>
                  <input style={styles.input} placeholder="Project Name"
                    value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                  <textarea style={styles.textarea} placeholder="Project Description"
                    value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
                  {initialTimeline && (
                    <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "8px" }}>
                      Timeline: <strong>{initialTimeline}</strong> · Budget: <strong>${budget}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* STEP 2 — CATEGORY */}
              {currentStep === 2 && (
                <div>
                  <h2 style={{ marginBottom: "8px" }}>Project Category</h2>
                  <p style={{ color: "#6b7280", marginBottom: "8px" }}>Select the domain that best fits your project.</p>
                  <div style={styles.grid}>
                    {categories.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <div key={cat.id}
                          style={selectedCategory === cat.id ? styles.cardSelected : styles.card}
                          onClick={() => setSelectedCategory(cat.id)}>
                          <Icon size={28} />
                          <p>{cat.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3 — TECH STACK */}
              {currentStep === 3 && (
                <div>
                  <h2 style={{ marginBottom: "8px" }}>Tech Stack</h2>
                  <p style={{ color: "#6b7280", marginBottom: "16px" }}>Select or search the technologies needed.</p>
                  <input style={styles.input} placeholder="Search tech..."
                    value={techInput} onChange={(e) => setTechInput(e.target.value)} />
                  <div style={{ marginBottom: "16px" }}>
                    {filteredTechOptions.map(tech => (
                      <button key={tech} onClick={() => addTech(tech)} style={styles.techBtn}>{tech}</button>
                    ))}
                  </div>
                  <div>
                    {selectedTech.map(tech => (
                      <span key={tech} style={styles.techTag}>
                        {tech}
                        <X size={14} style={{ marginLeft: "6px", cursor: "pointer" }} onClick={() => removeTech(tech)} />
                      </span>
                    ))}
                  </div>
                  {selectedTech.length === 0 && <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "12px" }}>No tech selected yet.</p>}
                </div>
              )}

              {/* STEP 4 — MILESTONES */}
              {currentStep === 4 && (
                <div>
                  <h2 style={{ marginBottom: "8px" }}>Milestones</h2>
                  <p style={{ color: "#6b7280", marginBottom: "20px" }}>Break your project into milestones. Budget updates automatically.</p>

                  {/* Add milestone row */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      style={{ ...styles.milestoneInput, flex: "1", minWidth: "180px" }}
                    />
                    <input
                      type="number"
                      placeholder="Budget ($)"
                      value={milestoneBudget}
                      onChange={(e) => setMilestoneBudget(e.target.value)}
                      style={{ ...styles.milestoneInput, width: "120px" }}
                    />
                    <button onClick={addMilestone}
                      style={{ padding: "10px 20px", background: "#6366f1", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
                      Add
                    </button>
                  </div>

                  {/* Milestone list */}
                  {milestones.length === 0 && (
                    <p style={{ color: "#9ca3af", fontSize: "14px" }}>No milestones added yet. You can skip this step.</p>
                  )}
                  {milestones.map((m, index) => (
                    <div key={m.id} style={styles.milestoneCard}>
                      <div>
                        <p style={{ fontWeight: "600", margin: 0 }}>{index + 1}. {m.title}</p>
                        <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>Budget: ${m.budget}</p>
                      </div>
                      <button onClick={() => removeMilestone(m.id)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "20px" }}>×</button>
                    </div>
                  ))}

                  <p style={{ fontWeight: "700", marginTop: "20px", fontSize: "16px" }}>
                    Total Budget: ${budget}
                  </p>
                </div>
              )}

              {/* STEP 5 — REVIEW & SUBMIT */}
              {currentStep === 5 && (
                <div>
                  <h2 style={{ marginBottom: "20px" }}>Review & Submit</h2>

                  <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "20px", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
                    <p><strong>Project Name:</strong> {projectName || '—'}</p>
                    <p><strong>Description:</strong> {projectDescription || initialDescription || '—'}</p>
                    <p><strong>Category:</strong> {selectedCategory || '—'}</p>
                    <p><strong>Tech Stack:</strong> {selectedTech.length > 0 ? selectedTech.join(', ') : '—'}</p>
                    <p><strong>Timeline:</strong> {initialTimeline || '—'}</p>
                    <p><strong>Total Budget:</strong> ${budget}</p>
                    <p><strong>Milestones:</strong> {milestones.length}</p>
                  </div>

                  {/* AI Analysis */}
                  {isAnalyzing && (
                    <div style={{ padding: "14px", background: "#f5f3ff", borderRadius: "10px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <Sparkles size={16} color="#6366f1" />
                      <span style={{ color: "#6366f1", fontSize: "14px" }}>Getting AI analysis...</span>
                    </div>
                  )}
                  {aiSuggestion && !isAnalyzing && (
                    <div style={{ padding: "16px", background: "#f5f3ff", borderRadius: "12px", border: "1px solid #c4b5fd", marginBottom: "20px" }}>
                      <p style={{ fontWeight: "600", color: "#4c1d95", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Sparkles size={14} /> AI Suggestions
                      </p>
                      <pre style={{ fontSize: "13px", color: "#5b21b6", whiteSpace: "pre-wrap", margin: 0 }}>
                        {typeof aiSuggestion === 'string' ? aiSuggestion : JSON.stringify(aiSuggestion, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Submit */}
                  {submitStatus === 'success' ? (
                    <div style={{ padding: "20px", background: "#dcfce7", borderRadius: "12px", textAlign: "center" }}>
                      <p style={{ color: "#166534", fontWeight: "700", fontSize: "18px", margin: 0 }}>✅ Project posted successfully!</p>
                      <p style={{ color: "#166534", fontSize: "14px", marginTop: "8px" }}>Freelancers can now browse and acquire your project.</p>
                    </div>
                  ) : (
                    <>
                      <button
                        style={{ ...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                        onClick={handleSubmitProject}
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Project'}
                      </button>
                      {submitStatus === 'error' && (
                        <p style={{ color: "#ef4444", marginTop: "12px", fontSize: "14px" }}>❌ {submitError}</p>
                      )}
                    </>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          <div style={styles.navButtons}>
            <button style={{ ...styles.navBtn, visibility: currentStep > 1 ? 'visible' : 'hidden' }} onClick={prevStep}>
              <ChevronLeft size={18} /> Back
            </button>
            {currentStep < 5 && (
              <button style={styles.navBtn} onClick={nextStep}>
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
