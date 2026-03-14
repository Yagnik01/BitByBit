import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects/');
        if (res.ok) {
          const data = await res.json();
          // Show latest 4 open projects
          const latest = data
            .filter(p => p.status === 'open')
            .slice(0, 4)
            .map(p => ({
              id: p._id,
              name: p.description ? p.description.slice(0, 80) + (p.description.length > 80 ? '...' : '') : 'Untitled Project',
              description: p.description || '',
              tech: p.domain ? [p.domain] : [],
              budget: p.total_budget ? `$${p.total_budget.toLocaleString()}` : 'Open Budget',
              timeline: p.timeline || 'Flexible',
            }));
          setProjects(latest);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fallback demo projects when DB is empty
  const fallbackProjects = [
    { id: 'demo1', name: "AI Chatbot Web App", description: "Build a ChatGPT-like chatbot using React and Node.js.", tech: ["React", "Node.js", "OpenAI"], budget: "$500 - $800", timeline: "2 Weeks" },
    { id: 'demo2', name: "E-commerce Website", description: "Create a full stack ecommerce website with payment integration.", tech: ["Next.js", "MongoDB", "Stripe"], budget: "$1200 - $2000", timeline: "1 Month" },
    { id: 'demo3', name: "Fitness Mobile App", description: "Fitness tracking mobile app with workout dashboard.", tech: ["React Native", "Firebase"], budget: "$700 - $1200", timeline: "3 Weeks" },
    { id: 'demo4', name: "Developer Portfolio", description: "Modern animated portfolio website for developers.", tech: ["React", "Tailwind", "Framer Motion"], budget: "$200 - $400", timeline: "1 Week" },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  return (
    <div id="home" className="home-page">
      <Navbar onLogout={onLogout} />

      <div style={styles.heroContainer}>
        <video autoPlay loop muted playsInline style={styles.video}>
          <source src="https://www.f-cdn.com/assets/main/en/assets/home/video/nasa-v3.mp4" type="video/mp4" />
        </video>
        <div style={styles.overlay}></div>
        <div style={styles.content}>
          <h1 style={styles.heroTitle}>Build Your Dream Project</h1>
          <p style={styles.heroText}>Hire the best freelancers or showcase your skills to the world.</p>
        </div>
      </div>

      <div style={styles.projectSection}>
        <h2 style={styles.sectionTitle}>
          {isLoading ? 'Loading Projects...' : projects.length > 0 ? 'Latest Projects' : 'Featured Projects'}
        </h2>
        <div style={styles.cardContainer}>
          {displayProjects.map((project) => (
            <div
              key={project.id}
              style={styles.card}
              onClick={() => navigate('/browse')}
            >
              <div style={styles.cardLeft}>
                <h3 style={styles.projectTitle}>{project.name}</h3>
                <p style={styles.projectDescription}>{project.description}</p>
                <div style={styles.techContainer}>
                  {project.tech.map((tech, index) => (
                    <span key={index} style={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
              <div style={styles.cardRight}>
                <p style={styles.budget}>{project.budget}</p>
                <p style={styles.timeline}>{project.timeline}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.exploreWrapper}>
          <button style={styles.exploreButton} onClick={() => navigate("/browse")}>
            Explore More Projects
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  heroContainer: { position: "relative", width: "100%", height: "100vh", overflow: "hidden" },
  video: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" },
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)" },
  content: { position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white", textAlign: "center" },
  heroTitle: { fontSize: "48px", fontWeight: "700" },
  heroText: { fontSize: "20px", marginTop: "10px" },
  projectSection: { padding: "80px 10%", backgroundColor: "#f9f9f9" },
  sectionTitle: { fontSize: "32px", fontWeight: "700", marginBottom: "40px", color: "#093395" },
  cardContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { display: "flex", justifyContent: "space-between", backgroundColor: "white", padding: "25px", borderRadius: "12px", cursor: "pointer", transition: "0.3s", border: "1px solid #eee" },
  cardLeft: { maxWidth: "70%" },
  projectTitle: { marginBottom: "10px", color: "#2d19ca" },
  projectDescription: { color: "#555", marginBottom: "12px" },
  techContainer: { display: "flex", gap: "8px", flexWrap: "wrap" },
  techTag: { backgroundColor: "#eef2ff", color: "#4f46e5", padding: "4px 10px", borderRadius: "6px", fontSize: "13px" },
  cardRight: { textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "center" },
  budget: { fontSize: "18px", fontWeight: "600", color: "#16a34a" },
  timeline: { fontSize: "14px", color: "#777" },
  exploreWrapper: { marginTop: "40px", textAlign: "center" },
  exploreButton: { backgroundColor: "#4f46e5", color: "white", padding: "12px 30px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" },
};

export default HomePage;
