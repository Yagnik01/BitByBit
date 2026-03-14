"use client";
import { useState, useEffect } from "react";

const ProjectMilestones = ({ project, viewAs, onBack }) => {
  const [milestones, setMilestones] = useState(project?.milestones || []);
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch milestones from API if project has an ID
  useEffect(() => {
    const fetchMilestones = async () => {
      if (!project?.id) return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/projects/${project.id}/milestones`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.milestones && data.milestones.length > 0) {
            setMilestones(data.milestones);
          }
        }
      } catch (err) {
        console.error('Failed to fetch milestones:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  }, [project?.id]);

  const handleSubmitMilestone = async (milestoneId) => {
    if (!githubLink.trim()) {
      alert("Please enter a valid GitHub link");
      return;
    }

    // Validate GitHub URL format
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/i;
    if (!githubPattern.test(githubLink.trim())) {
      alert("Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Try to update via API
      if (token && project?.id) {
        const res = await fetch(`/api/projects/${project.id}/milestones/${milestoneId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'completed',
            githubLink: githubLink.trim(),
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to update milestone');
        }
      }

      // Update local state
      setMilestones(prev => 
        prev.map(m => 
          m.id === milestoneId 
            ? { ...m, status: "completed", githubLink: githubLink.trim() }
            : m
        )
      );

      setShowSubmitModal(null);
      setGithubLink("");
    } catch (err) {
      console.error('Failed to submit milestone:', err);
      // Still update locally for demo purposes
      setMilestones(prev => 
        prev.map(m => 
          m.id === milestoneId 
            ? { ...m, status: "completed", githubLink: githubLink.trim() }
            : m
        )
      );
      setShowSubmitModal(null);
      setGithubLink("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = milestones.filter(m => m.status === "completed").length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      backgroundColor: "#fff",
      borderBottom: "1px solid #e0e0e0",
      padding: "20px 40px",
    },
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      fontSize: "14px",
      color: "#4a5568",
      cursor: "pointer",
      marginBottom: "16px",
      transition: "all 0.2s ease",
    },
    projectTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1a1a2e",
      margin: "0 0 8px 0",
    },
    projectMeta: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      fontSize: "14px",
      color: "#666",
      flexWrap: "wrap",
    },
    viewBadge: {
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: viewAs === "client" ? "#e7f1ff" : "#e6f7ee",
      color: viewAs === "client" ? "#0056b3" : "#1e7e34",
    },
    mainContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "24px 40px",
    },
    progressCard: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    progressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      flexWrap: "wrap",
      gap: "12px",
    },
    progressTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1a1a2e",
    },
    progressStats: {
      fontSize: "14px",
      color: "#666",
    },
    progressBarContainer: {
      width: "100%",
      height: "12px",
      backgroundColor: "#e0e0e0",
      borderRadius: "6px",
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: progressPercent === 100 ? "#10b981" : "#2563eb",
      borderRadius: "6px",
      transition: "width 0.5s ease",
      width: `${progressPercent}%`,
    },
    summaryCards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    summaryCard: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      textAlign: "center",
    },
    summaryValue: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1a1a2e",
      marginBottom: "4px",
    },
    summaryLabel: {
      fontSize: "13px",
      color: "#666",
      fontWeight: "500",
    },
    milestonesGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    milestoneCard: (status) => ({
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      borderLeft: status === "completed" ? "4px solid #10b981" : "4px solid #fbbf24",
      transition: "all 0.2s ease",
    }),
    milestoneHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
      flexWrap: "wrap",
      gap: "16px",
    },
    milestoneInfo: {
      flex: 1,
      minWidth: "200px",
    },
    milestoneNumber: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#9ca3af",
      marginBottom: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    milestoneTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1a1a2e",
      marginBottom: "8px",
    },
    milestoneAmount: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2563eb",
    },
    statusBadge: (status) => ({
      padding: "6px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      backgroundColor: status === "completed" ? "#d4edda" : "#fff3cd",
      color: status === "completed" ? "#155724" : "#856404",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    }),
    checkIcon: {
      width: "14px",
      height: "14px",
    },
    githubSection: {
      marginTop: "16px",
      padding: "16px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
    },
    githubLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#4a5568",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    githubLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#2563eb",
      textDecoration: "none",
      wordBreak: "break-all",
      padding: "8px 12px",
      backgroundColor: "#fff",
      borderRadius: "6px",
      border: "1px solid #e0e0e0",
      transition: "all 0.2s ease",
    },
    submitButton: {
      padding: "12px 28px",
      backgroundColor: "#2563eb",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "16px",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
    submitButtonDisabled: {
      padding: "12px 28px",
      backgroundColor: "#d4edda",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#155724",
      cursor: "default",
      marginTop: "16px",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
    noGithubText: {
      fontSize: "14px",
      color: "#9ca3af",
      fontStyle: "italic",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    // Modal styles
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: "16px",
      padding: "32px",
      maxWidth: "500px",
      width: "100%",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    },
    modalIcon: {
      width: "56px",
      height: "56px",
      backgroundColor: "#e7f1ff",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "20px",
    },
    modalTitle: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#1a1a2e",
      marginBottom: "8px",
    },
    modalSubtitle: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "24px",
      lineHeight: "1.5",
    },
    inputLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#4a5568",
      marginBottom: "8px",
      display: "block",
    },
    inputWrapper: {
      position: "relative",
    },
    inputIcon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
    },
    input: {
      width: "100%",
      padding: "14px 16px 14px 44px",
      border: "2px solid #e0e0e0",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s ease",
      boxSizing: "border-box",
    },
    inputHint: {
      fontSize: "12px",
      color: "#9ca3af",
      marginTop: "8px",
    },
    modalButtons: {
      display: "flex",
      gap: "12px",
      marginTop: "28px",
      justifyContent: "flex-end",
    },
    cancelButton: {
      padding: "12px 24px",
      backgroundColor: "#fff",
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#4a5568",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    confirmButton: {
      padding: "12px 28px",
      backgroundColor: "#10b981",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    emptyMilestones: {
      textAlign: "center",
      padding: "80px 20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    emptyIcon: {
      width: "100px",
      height: "100px",
      margin: "0 auto 24px",
      backgroundColor: "#f0f4f8",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1a1a2e",
      marginBottom: "8px",
    },
    emptyText: {
      fontSize: "14px",
      color: "#9ca3af",
      maxWidth: "300px",
      margin: "0 auto",
      lineHeight: "1.5",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    loadingSpinner: {
      width: "40px",
      height: "40px",
      border: "3px solid #e0e0e0",
      borderTop: "3px solid #2563eb",
      borderRadius: "50%",
      margin: "0 auto 16px",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      fontSize: "14px",
      color: "#666",
    },
  };

  // Add keyframes for spinner animation
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
    try {
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (e) {
      // Keyframes might already exist
    }
  }, []);

  if (!project) {
    return (
      <div style={styles.container}>
        <div style={styles.mainContent}>
          <div style={styles.emptyMilestones}>
            <h3 style={styles.emptyTitle}>Project not found</h3>
            <p style={styles.emptyText}>The project you're looking for doesn't exist.</p>
            {onBack && (
              <button style={{ ...styles.submitButton, marginTop: "24px" }} onClick={onBack}>
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          {onBack && (
            <button 
              style={styles.backButton}
              onClick={onBack}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e9ecef";
                e.currentTarget.style.borderColor = "#d0d0d0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </button>
          )}
          <h1 style={styles.projectTitle}>{project.name}</h1>
          <div style={styles.projectMeta}>
            <span style={styles.viewBadge}>
              {viewAs === "client" ? "Client View" : "Freelancer View"}
            </span>
            <span>Project ID: {project.id}</span>
            <span>Started: {project.date}</span>
            {project.clientName && <span>Client: {project.clientName}</span>}
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Summary Cards */}
        <div style={styles.summaryCards}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryValue}>{totalCount}</div>
            <div style={styles.summaryLabel}>Total Milestones</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryValue, color: "#10b981" }}>{completedCount}</div>
            <div style={styles.summaryLabel}>Completed</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryValue, color: "#f59e0b" }}>{totalCount - completedCount}</div>
            <div style={styles.summaryLabel}>Pending</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryValue, color: "#2563eb" }}>{progressPercent}%</div>
            <div style={styles.summaryLabel}>Progress</div>
          </div>
        </div>

        {/* Progress Overview */}
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <h2 style={styles.progressTitle}>Overall Progress</h2>
            <span style={styles.progressStats}>
              {completedCount} of {totalCount} milestones completed
            </span>
          </div>
          <div style={styles.progressBarContainer}>
            <div style={styles.progressBarFill} />
          </div>
        </div>

        {/* Milestones List */}
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <p style={styles.loadingText}>Loading milestones...</p>
          </div>
        ) : milestones.length > 0 ? (
          <div style={styles.milestonesGrid}>
            {milestones.map((milestone, index) => (
              <div key={milestone.id} style={styles.milestoneCard(milestone.status)}>
                <div style={styles.milestoneHeader}>
                  <div style={styles.milestoneInfo}>
                    <div style={styles.milestoneNumber}>Milestone {index + 1}</div>
                    <h3 style={styles.milestoneTitle}>{milestone.title}</h3>
                    <div style={styles.milestoneAmount}>
                      ₹{milestone.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR
                    </div>
                  </div>
                  <span style={styles.statusBadge(milestone.status)}>
                    {milestone.status === "completed" && (
                      <svg style={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    {milestone.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>

                {/* GitHub Link Section - Show for completed milestones */}
                {milestone.status === "completed" && milestone.githubLink ? (
                  <div style={styles.githubSection}>
                    <div style={styles.githubLabel}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Repository
                    </div>
                    <a 
                      href={milestone.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.githubLink}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2563eb";
                        e.currentTarget.style.backgroundColor = "#f0f7ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e0e0e0";
                        e.currentTarget.style.backgroundColor = "#fff";
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {milestone.githubLink}
                    </a>
                  </div>
                ) : viewAs === "client" && milestone.status === "pending" ? (
                  <div style={styles.githubSection}>
                    <div style={styles.githubLabel}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Repository
                    </div>
                    <span style={styles.noGithubText}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      Awaiting submission from freelancer
                    </span>
                  </div>
                ) : null}

                {/* Submit Button for Freelancer on pending milestones */}
                {viewAs === "freelancer" && milestone.status === "pending" && (
                  <button 
                    style={styles.submitButton}
                    onClick={() => setShowSubmitModal(milestone.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1d4ed8";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Submit Milestone
                  </button>
                )}

                {/* Submitted indicator for freelancer on completed milestones */}
                {viewAs === "freelancer" && milestone.status === "completed" && (
                  <button style={styles.submitButtonDisabled} disabled>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Submitted
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyMilestones}>
            <div style={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <path d="M9 14l2 2 4-4" />
              </svg>
            </div>
            <h3 style={styles.emptyTitle}>No milestones yet</h3>
            <p style={styles.emptyText}>
              Milestones will appear here once they are created for this project.
            </p>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div style={styles.modalOverlay} onClick={() => !isSubmitting && setShowSubmitModal(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 style={styles.modalTitle}>Submit Milestone</h2>
            <p style={styles.modalSubtitle}>
              Please provide the GitHub repository link for this milestone. Once submitted, the milestone will be marked as completed and the client will be able to view your work.
            </p>
            <label style={styles.inputLabel}>GitHub Repository URL</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <input
                type="url"
                placeholder="https://github.com/username/repository"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                disabled={isSubmitting}
              />
            </div>
            <p style={styles.inputHint}>Example: https://github.com/yourusername/project-repo</p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowSubmitModal(null);
                  setGithubLink("");
                }}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
                onClick={() => handleSubmitMilestone(showSubmitModal)}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "#059669";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#10b981";
                }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ 
                      width: "14px", 
                      height: "14px", 
                      border: "2px solid #fff", 
                      borderTop: "2px solid transparent", 
                      borderRadius: "50%", 
                      animation: "spin 1s linear infinite",
                      display: "inline-block"
                    }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Submit & Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMilestones;
