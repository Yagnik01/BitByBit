"use client"

import { ArrowLeft, Clock, Users, Star, Calendar, Zap, Briefcase, DollarSign } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

const projectsData = [
  {
    id: 1,
    title: "HVAC Inspection Reporting Engine",
    description:
      "I own an HVAC service company and I am building a premium maintenance inspection reporting system for customers. Need a developer who can create a comprehensive mobile-friendly reporting dashboard with data visualization capabilities.",
    tech: ["HTML", "MySQL", "Mobile App Development", "Data Visualization"],
    budget: 250,
    timeline: "2 Weeks",
    posted: "2 minutes ago",
    bids: 0,
    clientRating: 4.8,
    category: "Web Development",
    isUrgent: true,
  },
  {
    id: 2,
    title: "AI Chatbot SaaS Platform",
    description:
      "Build an AI chatbot web application with OpenAI API integration. The platform should support multiple chatbots, conversation history, and analytics dashboard for business users.",
    tech: ["React", "Node.js", "OpenAI", "MongoDB"],
    budget: 800,
    timeline: "3 Weeks",
    posted: "10 minutes ago",
    bids: 3,
    clientRating: 4.9,
    category: "AI & Machine Learning",
    isUrgent: false,
  },
]

// Color palette - Green theme matching freelancers page
const colors = {
  background: "#f9fafb",
  card: "#ffffff",
  cardBorder: "#e5e7eb",
  primary: "#10b981",
  primaryLight: "#d1fae5",
  primaryLighter: "#ecfdf5",
  primaryDark: "#059669",
  primaryDarker: "#047857",
  text: "#111827",
  textMuted: "#6b7280",
  textDark: "#374151",
  secondary: "#f3f4f6",
  destructive: "#ef4444",
  destructiveLight: "#fef2f2",
  greenText: "#065f46",
}

// Inline styles
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: colors.background,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    borderBottom: `1px solid ${colors.cardBorder}`,
    backgroundColor: colors.card,
  },
  headerInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "24px 24px",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    marginBottom: "16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    color: colors.textMuted,
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  titleRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: colors.text,
    margin: 0,
    lineHeight: 1.2,
  },
  urgentBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    backgroundColor: colors.destructiveLight,
    color: colors.destructive,
    fontSize: "12px",
    fontWeight: 600,
    borderRadius: "9999px",
    border: `1px solid ${colors.destructive}20`,
  },
  categoryRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
  },
  categoryBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 12px",
    backgroundColor: colors.primaryLight,
    color: colors.primaryDarker,
    fontSize: "13px",
    fontWeight: 500,
    borderRadius: "9999px",
  },
  postedText: {
    fontSize: "14px",
    color: colors.textMuted,
  },
  main: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "32px",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: "16px",
    border: `1px solid ${colors.cardBorder}`,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  cardHeader: {
    padding: "20px 24px 0",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  },
  cardContent: {
    padding: "16px 24px 24px",
  },
  description: {
    fontSize: "15px",
    lineHeight: 1.7,
    color: colors.textMuted,
    margin: 0,
  },
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillBadge: {
    padding: "8px 16px",
    backgroundColor: colors.secondary,
    color: colors.textDark,
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "8px",
    border: `1px solid ${colors.cardBorder}`,
    transition: "all 0.2s",
    cursor: "default",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  detailBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #f3f4f6",
  },
  detailIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    backgroundColor: colors.primaryLighter,
    borderRadius: "10px",
    color: colors.primaryDark,
  },
  detailLabel: {
    fontSize: "13px",
    color: colors.textMuted,
    margin: 0,
  },
  detailValue: {
    fontSize: "15px",
    fontWeight: 600,
    color: colors.text,
    margin: "4px 0 0",
  },
  sidebar: {
    position: "sticky",
    top: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  budgetHeader: {
    padding: "24px",
    background: "linear-gradient(90deg, #ecfdf5 0%, #f0fdfa 100%)",
    borderBottom: `1px solid ${colors.primaryLight}`,
  },
  budgetLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: colors.greenText,
    fontWeight: 500,
    margin: 0,
  },
  budgetAmount: {
    fontSize: "40px",
    fontWeight: 700,
    color: colors.primary,
    margin: "8px 0 0",
    lineHeight: 1,
  },
  budgetType: {
    fontSize: "14px",
    color: colors.textMuted,
    margin: "4px 0 0",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
    padding: "12px 0",
  },
  infoLabel: {
    color: colors.textMuted,
  },
  infoValue: {
    fontWeight: 500,
    color: colors.text,
  },
  separator: {
    height: "1px",
    backgroundColor: colors.cardBorder,
    margin: "0",
    border: "none",
  },
  applyButton: {
    width: "100%",
    padding: "14px 24px",
    backgroundColor: colors.primary,
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 600,
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "8px",
  },
  applyNote: {
    fontSize: "12px",
    color: colors.textMuted,
    textAlign: "center",
    marginTop: "16px",
  },
  statsTitle: {
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.textMuted,
    margin: "0 0 16px",
  },
  statRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
  },
  notFound: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  notFoundCard: {
    textAlign: "center",
    padding: "48px",
  },
  notFoundTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  },
  notFoundText: {
    fontSize: "14px",
    color: colors.textMuted,
    marginTop: "8px",
  },
}

export default function ProjectDetails() {


  const { projectId } = useParams();
const navigate = useNavigate()
const { id } = useParams()
const project = projectsData.find((p) => p.id === Number(id))

  if (!project) {
    return (
      <div style={styles.notFound}>
        <div style={{ ...styles.card, ...styles.notFoundCard }}>
          <h2 style={styles.notFoundTitle}>Project not found</h2>
          <p style={styles.notFoundText}>{"The project you're looking for doesn't exist."}</p>
          <button 
            onClick={() => navigate(-1)}
            style={{ ...styles.backButton, marginTop: "16px", border: `1px solid ${colors.cardBorder}` }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleApply = () => {
    alert("Application submitted!")
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button
            onClick={() => navigate(-1)}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.secondary
              e.currentTarget.style.color = colors.text
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = colors.textMuted
            }}
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          <div style={styles.titleSection}>
            <div style={styles.titleRow}>
              <h1 style={styles.title}>{project.title}</h1>
              {project.isUrgent && (
                <span style={styles.urgentBadge}>
                  <Zap size={12} />
                  Urgent
                </span>
              )}
            </div>
            <div style={styles.categoryRow}>
              <span style={styles.categoryBadge}>
                <Briefcase size={14} />
                {project.category}
              </span>
              <span style={styles.postedText}>Posted {project.posted}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={{ 
          ...styles.grid, 
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
        }}>
          {/* Left Section - Project Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Description Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Project Description</h2>
              </div>
              <div style={styles.cardContent}>
                <p style={styles.description}>{project.description}</p>
              </div>
            </div>

            {/* Skills Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Required Skills</h2>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.skillsGrid}>
                  {project.tech.map((tech, i) => (
                    <span key={i} style={styles.skillBadge}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Details Grid */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Project Details</h2>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailBox}>
                    <div style={styles.detailIcon}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <p style={styles.detailLabel}>Timeline</p>
                      <p style={styles.detailValue}>{project.timeline}</p>
                    </div>
                  </div>

                  <div style={styles.detailBox}>
                    <div style={styles.detailIcon}>
                      <Users size={20} />
                    </div>
                    <div>
                      <p style={styles.detailLabel}>Current Bids</p>
                      <p style={styles.detailValue}>{project.bids} bids</p>
                    </div>
                  </div>

                  <div style={styles.detailBox}>
                    <div style={styles.detailIcon}>
                      <Star size={20} />
                    </div>
                    <div>
                      <p style={styles.detailLabel}>Client Rating</p>
                      <p style={styles.detailValue}>{project.clientRating} / 5.0</p>
                    </div>
                  </div>

                  <div style={styles.detailBox}>
                    <div style={styles.detailIcon}>
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p style={styles.detailLabel}>Posted</p>
                      <p style={styles.detailValue}>{project.posted}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Budget & Apply */}
          <div style={styles.sidebar}>
            <div style={styles.card}>
              <div style={styles.budgetHeader}>
                <p style={styles.budgetLabel}>
                  <DollarSign size={18} />
                  Budget
                </p>
                <p style={styles.budgetAmount}>${project.budget}</p>
                <p style={styles.budgetType}>Fixed Price</p>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Project Type</span>
                  <span style={styles.infoValue}>Fixed Price</span>
                </div>
                <hr style={styles.separator} />
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Experience Level</span>
                  <span style={styles.infoValue}>Intermediate</span>
                </div>
                <hr style={styles.separator} />
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Category</span>
                  <span style={styles.infoValue}>{project.category}</span>
                </div>

                <button
                  onClick={handleApply}
                  style={styles.applyButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark
                    e.currentTarget.style.transform = "translateY(-1px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  Apply for Project
                </button>

                <p style={styles.applyNote}>
                  {"Submit your proposal and let the client know you're interested"}
                </p>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div style={styles.card}>
              <div style={{ padding: "24px" }}>
                <h3 style={styles.statsTitle}>Quick Stats</h3>
                <div style={styles.statRow}>
                  <span style={styles.infoLabel}>Avg. bid</span>
                  <span style={styles.infoValue}>${Math.round(project.budget * 0.9)}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.infoLabel}>Proposals</span>
                  <span style={styles.infoValue}>{project.bids}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.infoLabel}>Interviewing</span>
                  <span style={styles.infoValue}>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .project-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}



