import React, { useState } from "react"
import ProjectBriefingWizard from "./page.jsx"

function PostProjectPage() {

  const [description, setDescription] = useState("")
  const [showWizard, setShowWizard] = useState(false)

  const [budget,setBudget] = useState(5000)
  const [timeline,setTimeline] = useState("")
  const [files,setFiles] = useState([])
const [customTimeline, setCustomTimeline] = useState("")

  const handleSubmit = () => {
    console.log("Description:",description)
    console.log("Budget:",budget)
    console.log("Timeline:",timeline)
    console.log("Files:",files)

    setShowWizard(true)
  }

  const handleFileUpload = (e)=>{
    const uploaded = Array.from(e.target.files)
    setFiles(uploaded)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div style={{
      display:"flex",
      minHeight:"100vh",
      fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor:"#f6f8fb"
    }}>

      {/* LEFT CONTENT */}
      <div style={{
        flex:1,
        backgroundColor:"#fff",
        padding:"3rem 4rem",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        maxWidth:"60%",
        boxShadow:"0 10px 40px rgba(0,0,0,0.08)",
        borderRight:"1px solid #eef1f6"
      }}>

        {/* HEADING */}
        <h1 style={{
          fontSize:"2.6rem",
          fontWeight:"700",
          color:"#111827",
          marginBottom:"1rem"
        }}>
          Tell us what you need <span style={{color:"#e91e63"}}>done.</span>
        </h1>

        <p style={{color:"#6b7280",marginBottom:"1.5rem"}}>
          We'll guide you to create the perfect brief.
        </p>

        {/* DESCRIPTION BOX */}
        <textarea
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter project description..."
          style={{
            width:"100%",
            maxWidth:"520px",
            minHeight:"120px",
            padding:"1rem",
            border:"1px solid #e5e7eb",
            borderRadius:"8px",
            fontSize:"1rem",
            marginBottom:"1.2rem",
            color:"#111"
          }}
        />

        {/* TIMELINE */}
        <select
          value={timeline}
          onChange={(e)=>setTimeline(e.target.value)}
          style={{
            width:"220px",
            padding:"10px",
            borderRadius:"6px",
            border:"1px solid #ddd",
            marginBottom:"1rem"
          }}
        >
          <option value="">Select timeline</option>
          <option>1-3 days</option>
          <option>1 week</option>
          <option>2 weeks</option>
          <option>1 month+</option>
          <option value="custom">Custom timeline</option>
        </select>
        {timeline === "custom" && (
  <input
    type="text"
    placeholder="Enter custom timeline"
    value={customTimeline}
    onChange={(e) => setCustomTimeline(e.target.value)}
    style={{
      marginTop: "10px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      width: "220px",
      color: "#000"
    }}
  />
)}

        {/* BUDGET */}
        <div style={{marginBottom:"1.2rem"}}>
          <p style={{fontWeight:"500",
            color:"#111827",
            marginBottom:"0.5rem"
          }}>Budget: ${budget}</p>

          <input
            type="range"
            min="500"
            max="100000"
            step="500"
            value={budget}
            onChange={(e)=>setBudget(e.target.value)}
            style={{width:"320px"}}
          />
        </div>

        {/* FILE UPLOAD */}
        <div style={{
          border:"2px dashed #e91e63",
          padding:"20px",
          width:"320px",
          borderRadius:"8px",
          marginBottom:"1.5rem"
        }}>
          <p style={{fontSize:"0.9rem",
            color:"#111827",
          }}>Upload reference files</p>

          <input
            type="file"
            multiple
            onChange={handleFileUpload}
          />
        </div>

        {/* ENTER BUTTON */}
        <button
          onClick={handleSubmit}
          style={{
            background:"linear-gradient(135deg,#e91e63,#ff4d8d)",
            color:"white",
            border:"none",
            padding:"0.9rem 2.6rem",
            fontSize:"1rem",
            fontWeight:"600",
            borderRadius:"6px",
            cursor:"pointer",
            width:"160px"
          }}
        >
          Enter
        </button>

        {/* WIZARD */}
        {showWizard && (
          <div style={{marginTop:"2rem"}}>
            <ProjectBriefingWizard />
          </div>
        )}

      </div>

      {/* RIGHT IMAGE */}
      <div style={{
        flex:1,
        backgroundImage:"url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')",
        backgroundSize:"cover",
        backgroundPosition:"center"
      }}/>

    </div>
  )
}

export default PostProjectPage
export  const budget=5000