"use client"

import { useState } from "react"

// Mock freelancer data
const mockFreelancers = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "RS",
    title: "Full Stack Developer",
    rating: 4.9,
    reviewCount: 156,
    successRate: 98,
    hourlyRate: 1500,
    location: "Mumbai, India",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    about: "Passionate full-stack developer with 6+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud technologies. I believe in writing clean, maintainable code and delivering projects on time.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
    isAvailable: true,
    totalProjects: 89,
    memberSince: "2019"
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "PP",
    title: "UI/UX Designer",
    rating: 5.0,
    reviewCount: 203,
    successRate: 100,
    hourlyRate: 2000,
    location: "Bangalore, India",
    email: "priya.patel@email.com",
    phone: "+91 87654 32109",
    about: "Creative UI/UX designer focused on creating intuitive and beautiful user experiences. I work closely with clients to understand their vision and translate it into stunning designs that drive engagement and conversions.",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
    isAvailable: true,
    totalProjects: 124,
    memberSince: "2018"
  },
  {
    id: 3,
    name: "Amit Kumar",
    avatar: "AK",
    title: "Mobile App Developer",
    rating: 4.7,
    reviewCount: 89,
    successRate: 95,
    hourlyRate: 1800,
    location: "Delhi, India",
    email: "amit.kumar@email.com",
    phone: "+91 76543 21098",
    about: "Expert mobile developer specializing in React Native and Flutter. I've built apps for startups and enterprises alike, focusing on performance, user experience, and code quality.",
    skills: ["React Native", "Flutter", "iOS", "Android", "Firebase", "Redux"],
    isAvailable: false,
    totalProjects: 67,
    memberSince: "2020"
  },
  {
    id: 4,
    name: "Sneha Reddy",
    avatar: "SR",
    title: "Backend Engineer",
    rating: 4.8,
    reviewCount: 112,
    successRate: 97,
    hourlyRate: 1600,
    location: "Hyderabad, India",
    email: "sneha.reddy@email.com",
    phone: "+91 65432 10987",
    about: "Backend specialist with expertise in building robust APIs and microservices. I have extensive experience with Python, Java, and cloud infrastructure. Security and scalability are my top priorities.",
    skills: ["Python", "Java", "PostgreSQL", "Redis", "Kubernetes", "GraphQL"],
    isAvailable: true,
    totalProjects: 78,
    memberSince: "2019"
  },
  {
    id: 5,
    name: "Vikram Singh",
    avatar: "VS",
    title: "DevOps Engineer",
    rating: 4.6,
    reviewCount: 64,
    successRate: 94,
    hourlyRate: 2200,
    location: "Pune, India",
    email: "vikram.singh@email.com",
    phone: "+91 54321 09876",
    about: "DevOps engineer helping teams automate their infrastructure and deployment pipelines. I specialize in CI/CD, containerization, and cloud-native technologies. Let me help you ship faster and more reliably.",
    skills: ["AWS", "Terraform", "Jenkins", "Docker", "Kubernetes", "Linux"],
    isAvailable: true,
    totalProjects: 45,
    memberSince: "2021"
  },
  {
    id: 6,
    name: "Ananya Gupta",
    avatar: "AG",
    title: "Data Scientist",
    rating: 4.9,
    reviewCount: 87,
    successRate: 96,
    hourlyRate: 2500,
    location: "Chennai, India",
    email: "ananya.gupta@email.com",
    phone: "+91 43210 98765",
    about: "Data scientist with a passion for turning data into actionable insights. I work with machine learning, deep learning, and statistical analysis to solve complex business problems.",
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Tableau", "Machine Learning"],
    isAvailable: true,
    totalProjects: 56,
    memberSince: "2020"
  }
]

// Star Rating Component
function StarRating({ rating, size = 16 }) {
  const starStyle = {
    width: size,
    height: size,
  }
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating)
        const partial = star === Math.ceil(rating) && rating % 1 !== 0
        const percentage = partial ? (rating % 1) * 100 : 0
        
        return (
          <div key={star} style={{ position: "relative" }}>
            <svg style={{ ...starStyle, color: "#d1d5db" }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {(filled || partial) && (
              <svg
                style={{
                  ...starStyle,
                  color: "#fbbf24",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  clipPath: partial ? `inset(0 ${100 - percentage}% 0 0)` : undefined,
                }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Freelancer Card Component
function FreelancerCard({ freelancer, isLiked, onToggleLike, onContact }) {
  const [expanded, setExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [likeHovered, setLikeHovered] = useState(false)
  
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    border: isHovered ? "1px solid #a7f3d0" : "1px solid #e5e7eb",
    overflow: "hidden",
    transition: "all 0.3s ease",
    boxShadow: isHovered ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
  }
  
  const avatarStyle = {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 600,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  }
  
  const availabilityDotStyle = {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "2px solid #ffffff",
    backgroundColor: freelancer.isAvailable ? "#10b981" : "#9ca3af",
  }
  
  const likeButtonStyle = {
    padding: 8,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: isLiked ? "#fef2f2" : likeHovered ? "#fef2f2" : "#f3f4f6",
    color: isLiked ? "#ef4444" : likeHovered ? "#f87171" : "#9ca3af",
  }
  
  const skillTagStyle = {
    padding: "6px 12px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 8,
    transition: "all 0.2s ease",
    cursor: "default",
  }
  
  const contactButtonStyle = {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#10b981",
    color: "#ffffff",
    fontWeight: 600,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 16,
    transition: "background-color 0.2s ease",
  }

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div style={{ padding: 24, paddingBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          {/* Avatar and Basic Info */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <div style={avatarStyle}>{freelancer.avatar}</div>
              <div style={availabilityDotStyle} title={freelancer.isAvailable ? "Available for work" : "Currently busy"} />
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>{freelancer.name}</h3>
                {freelancer.isAvailable && (
                  <span style={{
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: "#d1fae5",
                    color: "#047857",
                    borderRadius: 9999,
                  }}>
                    Available
                  </span>
                )}
              </div>
              <p style={{ color: "#4b5563", fontSize: 14, marginTop: 2, margin: 0 }}>{freelancer.title}</p>
              
              {/* Location */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "#6b7280", fontSize: 14 }}>
                <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{freelancer.location}</span>
              </div>
            </div>
          </div>
          
          {/* Like Button */}
          <button
            onClick={() => onToggleLike(freelancer.id)}
            onMouseEnter={() => setLikeHovered(true)}
            onMouseLeave={() => setLikeHovered(false)}
            style={likeButtonStyle}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <svg style={{ width: 20, height: 20 }} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Stats Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid #f3f4f6",
          flexWrap: "wrap",
        }}>
          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarRating rating={freelancer.rating} />
            <span style={{ fontWeight: 600, color: "#111827" }}>{freelancer.rating}</span>
            <span style={{ color: "#6b7280", fontSize: 14 }}>({freelancer.reviewCount} reviews)</span>
          </div>
          
          {/* Success Rate */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg style={{ width: 16, height: 16, color: "#10b981" }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ color: "#374151", fontSize: 14, fontWeight: 500 }}>{freelancer.successRate}% Success</span>
          </div>
          
          {/* Total Projects */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 14 }}>
            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{freelancer.totalProjects} projects</span>
          </div>
        </div>
      </div>
      
      {/* Hourly Rate Banner */}
      <div style={{
        padding: "12px 24px",
        background: "linear-gradient(90deg, #ecfdf5 0%, #f0fdfa 100%)",
        borderTop: "1px solid #a7f3d0",
        borderBottom: "1px solid #a7f3d0",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg style={{ width: 20, height: 20, color: "#059669" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ color: "#065f46", fontWeight: 600, fontSize: 18 }}>
              Rs. {freelancer.hourlyRate.toLocaleString('en-IN')}/hr
            </span>
          </div>
          <span style={{ color: "#6b7280", fontSize: 14 }}>Member since {freelancer.memberSince}</span>
        </div>
      </div>
      
      {/* About Section */}
      <div style={{ padding: "16px 24px" }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8, margin: 0, marginBottom: 8 }}>About</h4>
        <p style={{
          color: "#4b5563",
          fontSize: 14,
          lineHeight: 1.6,
          margin: 0,
          overflow: expanded ? "visible" : "hidden",
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
        }}>
          {freelancer.about}
        </p>
        {freelancer.about.length > 150 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none",
              border: "none",
              color: "#059669",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              marginTop: 4,
            }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
      
      {/* Skills/Tech Stack */}
      <div style={{ padding: "0 24px 16px" }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8, margin: 0, marginBottom: 8 }}>Tech Stack</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {freelancer.skills.map((skill) => (
            <span key={skill} style={skillTagStyle}>
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Contact Details */}
      <div style={{
        padding: "16px 24px",
        backgroundColor: "#f9fafb",
        borderTop: "1px solid #f3f4f6",
      }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12, margin: 0, marginBottom: 12 }}>Contact Details</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a 
            href={`mailto:${freelancer.email}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#4b5563",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{freelancer.email}</span>
          </a>
          <a 
            href={`tel:${freelancer.phone.replace(/\s/g, '')}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#4b5563",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{freelancer.phone}</span>
          </a>
        </div>
      </div>
      
      {/* Action Button */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6" }}>
        <button
          onClick={() => onContact(freelancer)}
          style={contactButtonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
        >
          <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Contact {freelancer.name.split(' ')[0]}
        </button>
      </div>
    </div>
  )
}

// Main Freelancers Component
export default function Freelancers() {
  const [likedFreelancers, setLikedFreelancers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  
  const toggleLike = (id) => {
    setLikedFreelancers(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    )
  }
  
  const handleContact = (freelancer) => {
    alert(`Opening chat with ${freelancer.name}...`)
  }
  
  // Filter freelancers based on search
  const filteredFreelancers = mockFreelancers.filter(freelancer => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      freelancer.name.toLowerCase().includes(query) ||
      freelancer.title.toLowerCase().includes(query) ||
      freelancer.skills.some(skill => skill.toLowerCase().includes(query)) ||
      freelancer.location.toLowerCase().includes(query)
    )
  })
  
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  }
  
  const headerStyle = {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 50,
  }
  
  const headerContentStyle = {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  }
  
  const logoStyle = {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
  
  const heroStyle = {
    background: "linear-gradient(135deg, #059669 0%, #047857 50%, #0f766e 100%)",
    color: "#ffffff",
    padding: "48px 16px",
  }
  
  const searchContainerStyle = {
    position: "relative",
    maxWidth: 576,
    margin: "0 auto",
  }
  
  const searchInputStyle = {
    width: "100%",
    padding: "16px 16px 16px 48px",
    borderRadius: 16,
    border: "none",
    fontSize: 16,
    outline: "none",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
  }
  
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: 24,
  }
  
  const emptyStateStyle = {
    textAlign: "center",
    padding: "64px 16px",
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={logoStyle}>
              <svg style={{ width: 24, height: 24, color: "#ffffff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Find Freelancers</h1>
          </div>
          
          {likedFreelancers.length > 0 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 500,
            }}>
              <svg style={{ width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>{likedFreelancers.length} saved</span>
            </div>
          )}
        </div>
      </header>
      
      {/* Hero Section */}
      <div style={heroStyle}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, margin: 0, marginBottom: 16 }}>
            Hire Top Freelance Talent
          </h2>
          <p style={{ color: "#a7f3d0", fontSize: 18, marginBottom: 32, margin: 0, marginBottom: 32 }}>
            Connect with skilled professionals ready to bring your projects to life
          </p>
          
          {/* Search Bar */}
          <div style={searchContainerStyle}>
            <div style={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}>
              <svg style={{ width: 20, height: 20, color: "#9ca3af" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill, or location..."
              style={searchInputStyle}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 16,
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  padding: 0,
                }}
              >
                <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 16px" }}>
        {/* Results Count */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            Showing <span style={{ fontWeight: 600, color: "#111827" }}>{filteredFreelancers.length}</span> freelancers
            {searchQuery && (
              <span> for "<span style={{ fontWeight: 600, color: "#111827" }}>{searchQuery}</span>"</span>
            )}
          </p>
        </div>
        
        {/* Freelancers Grid */}
        {filteredFreelancers.length > 0 ? (
          <div style={gridStyle}>
            {filteredFreelancers.map((freelancer) => (
              <FreelancerCard
                key={freelancer.id}
                freelancer={freelancer}
                isLiked={likedFreelancers.includes(freelancer.id)}
                onToggleLike={toggleLike}
                onContact={handleContact}
              />
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg style={{ width: 40, height: 40, color: "#9ca3af" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8, margin: 0, marginBottom: 8 }}>
              No freelancers found
            </h3>
            <p style={{ color: "#6b7280", marginBottom: 16, margin: 0, marginBottom: 16 }}>
              Try adjusting your search terms
            </p>
            <button
              onClick={() => setSearchQuery("")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#10b981",
                color: "#ffffff",
                fontWeight: 500,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
