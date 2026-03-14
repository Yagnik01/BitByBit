import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {budget} from "./postpage.jsx"
import {
  Sparkles,
  Code2,
  Palette,
  ShoppingCart,
  Smartphone,
  Brain,
  Database,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Upload,
  X
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

export default function ProjectBriefingWizard() {

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]);
  const [techInput, setTechInput] = useState("");
  const [milestones, setMilestones] = useState([])
const [milestoneTitle, setMilestoneTitle] = useState("")
const [milestoneBudget, setMilestoneBudget] = useState("")
 const addMilestone = () => {
  if (!milestoneTitle || !milestoneBudget) return

  const newMilestone = {
    id: Date.now(),
    title: milestoneTitle,
    budget: Number(milestoneBudget),
    completed: false
  }

  setMilestones([...milestones, newMilestone])
  setBudget(budget + Number(milestoneBudget))

  setMilestoneTitle("")
  setMilestoneBudget("")
}
const removeMilestone = (id) => {
  const milestone = milestones.find(m => m.id === id)

  setMilestones(milestones.filter(m => m.id !== id))

  if (milestone) {
    setBudget(budget - milestone.budget)
  }
}

  const goToStep = (step) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < 5) goToStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const addTech = (tech) => {
    if (!selectedTech.includes(tech)) {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const removeTech = (tech) => {
    setSelectedTech(selectedTech.filter(t => t !== tech));
  };

  const filteredTechOptions = techStackOptions.filter(
    tech => tech.toLowerCase().includes(techInput.toLowerCase())
  );

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

 
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    color: "#1a1a1a",
    background: "#f8f9fb", // Softer off-white background
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  /* Left Sidebar - Steps */
  sidebar: {
    width: "100px",
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40px",
    zIndex: 10,
  },

  stepButton: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    border: "none",
  },

  /* Main Content Area */
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    padding: "60px 80px",
    maxWidth: "850px",
    background: "#ffffff",
    margin: "20px",
    borderRadius: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },

  /* Form Elements */
  input: {
    width: "100%",
    padding: "16px",
    border: "1.5px solid #eef0f2",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "16px",
    background: "#fcfcfd",
    outline: "none",
    transition: "border-color 0.2s",
  },

  textarea: {
    width: "100%",
    padding: "16px",
    border: "1.5px solid #eef0f2",
    borderRadius: "12px",
    minHeight: "160px",
    fontSize: "16px",
    background: "#fcfcfd",
    outline: "none",
    resize: "none",
  },

  /* Category Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    padding: "30px 20px",
    border: "1px solid #eef0f2",
    borderRadius: "16px",
    cursor: "pointer",
    textAlign: "center",
    background: "#ffffff",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },

  cardSelected: {
    padding: "30px 20px",
    border: "2px solid #6366f1", // Modern Indigo instead of Pink
    borderRadius: "16px",
    cursor: "pointer",
    textAlign: "center",
    background: "#f5f3ff",
    color: "#4338ca",
    fontWeight: "600",
    boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.2)",
  },

  /* Tech Stack Tags */
  techTag: {
    padding: "8px 14px",
    background: "#6366f1",
    color: "#fff",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    margin: "6px",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)",
  },

  techBtn: {
    margin: "4px",
    padding: "8px 16px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#4b5563",
    fontSize: "14px",
    transition: "background 0.2s",
  },

  /* Budget Slider */
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "5px",
    background: "#e5e7eb",
    appearance: "none",
    marginTop: "30px",
    accentColor: "#6366f1",
  },

  /* Navigation Buttons */
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "60px",
    paddingTop: "30px",
    borderTop: "1px solid #f3f4f6",
  },

  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    background: "#1a1a1a",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "500",
    transition: "transform 0.1s, opacity 0.2s",
  },

  /* Right Sidebar - AI Tips */
  sidebarRight: {
    width: "320px",
    padding: "40px 30px",
    background: "#ffffff",
    borderLeft: "1px solid #e5e7eb",
  },

  tipCard: {
    background: "#f9fafb",
    padding: "16px",
    borderRadius: "12px",
    marginTop: "16px",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#4b5563",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    border: "1px solid #f1f5f9",
  },

  uploadBox: {
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    marginTop: "24px",
    background: "#f8fafc",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },

  submitBtn: {
    width: "100%",
    marginTop: "30px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#ffffff",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
  }
};

  return (
    <div style={styles.container}>

      {/* STEP SIDEBAR */}
      <div style={styles.sidebar}>
        {steps.map(step=>(
          <div
            key={step.id}
            onClick={()=>goToStep(step.id)}
            style={{
              ...styles.stepButton,
              background:step.id<=currentStep?"#ff4da6":"#f3f3f3",
              color:step.id<=currentStep?"white":"black"
            }}
          >
            {step.id}
          </div>
        ))}
      </div>

      <div style={styles.main}>

        <div style={styles.content}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{type:"spring",stiffness:300,damping:30}}
            >

              {/* STEP 1 */}
              {currentStep===1 && (
                <div>
                  <h2>Project Basics</h2>

                  <input
                    style={styles.input}
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e)=>setProjectName(e.target.value)}
                  />

                  <textarea
                    style={styles.textarea}
                    placeholder="Project Description"
                    value={projectDescription}
                    onChange={(e)=>setProjectDescription(e.target.value)}
                  />
                </div>
              )}

              {/* STEP 2 */}
              {currentStep===2 && (
                <div style={styles.grid}>
                  {categories.map(cat=>{
                    const Icon=cat.icon;
                    return(
                      <div
                        key={cat.id}
                        style={selectedCategory===cat.id?styles.cardSelected:styles.card}
                        onClick={()=>setSelectedCategory(cat.id)}
                      >
                        <Icon size={28}/>
                        <p>{cat.label}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* STEP 3 */}
              {currentStep===3 && (
                <div>

                  <input
                    style={styles.input}
                    placeholder="Search tech..."
                    value={techInput}
                    onChange={(e)=>setTechInput(e.target.value)}
                  />

                  {filteredTechOptions.map(tech=>(
                    <button
                      key={tech}
                      onClick={()=>addTech(tech)}
                      style={styles.techBtn}
                    >
                      {tech}
                    </button>
                  ))}

                  <div>
                    {selectedTech.map(tech=>(
                      <span key={tech} style={styles.techTag}>
                        {tech}
                        <X
                          size={14}
                          style={{marginLeft:"6px",cursor:"pointer"}}
                          onClick={()=>removeTech(tech)}
                        />
                      </span>
                    ))}
                  </div>

                </div>
              )}

              {/* STEP 4 */}
              {currentStep===5 && (
                <div>

                  <h2>Review</h2>

                  <p><b>Name:</b> {projectName}</p>
                  <p><b>Category:</b> {selectedCategory}</p>
                  <p><b>Budget:</b> ${budget}</p>

                  <button
                    style={styles.submitBtn}
                    onClick={()=>alert("Project Submitted")}
                  >
                    Submit Project
                  </button>

                </div>
              )}
              {currentStep===4 && (
<div className="space-y-6">

<h2 className="text-xl font-bold">Milestones</h2>

{/* Add milestone */}
<div className="flex gap-3">

{/* <input
type="text"
placeholder="Milestone title"
value={milestoneTitle}
onChange={(e)=>setMilestoneTitle(e.target.value)}
className="border p-2 rounded w-full"
/>

<input
type="number"
placeholder="Budget"
value={milestoneBudget}
onChange={(e)=>setMilestoneBudget(e.target.value)}
className="border p-2 rounded w-32"
/> */}

{/* <button
onClick={addMilestone}
className="bg-violet-500 text-white px-4 py-2 rounded"
>
Add
</button> */}

</div>


{/* Milestone List */}
<div className="space-y-3">

{milestones.map((m,index)=>(

<div
key={m.id}
className="flex items-center justify-between border rounded-lg p-3"
>

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={m.completed}
onChange={()=>toggleMilestone(m.id)}
/>

<div>

<p className="font-medium">
{index+1}. {m.title}
</p>

<p className="text-sm text-gray-500">
Budget: ${m.budget}
</p>

</div>

</div>

<button
onClick={()=>removeMilestone(m.id)}
className="text-red-500"
>
Remove
</button>

</div>

))}

</div>


{/* Total Budget */}
<div className="font-bold text-lg">
Total Budget: ${budget}
</div>

</div>
)}

            </motion.div>
          </AnimatePresence>

          <div style={styles.navButtons}>
            <button style={styles.navBtn} onClick={prevStep}>
              <ChevronLeft size={18}/>
            </button>

            <button style={styles.navBtn} onClick={nextStep}>
              <ChevronRight size={18}/>
            </button>
          </div>

        </div>

        {/* AI SIDEBAR */}
        {/* <div style={styles.sidebarRight}>

          <h3 style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <Lightbulb/> AI Tips
          </h3>

          <div style={styles.tipCard}>
            <Sparkles size={14}/> Describe your project clearly.
          </div>

          <div style={styles.tipCard}>
            <Sparkles size={14}/> Choose accurate tech stack.
          </div>

          <div style={styles.tipCard}>
            <Sparkles size={14}/> Higher budget attracts better freelancers.
          </div>

        </div> */}

      </div>
    </div>
  );
}