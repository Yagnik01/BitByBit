"use client";
import { useState } from "react";

const MyProjects = () => {
  const [viewAs, setViewAs] = useState("client");
  const [activeTab, setActiveTab] = useState("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [viewFilter, setViewFilter] = useState("all");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const clientTabs = [
    { id: "open", label: "Open Projects" },
    { id: "inprogress", label: "Work in Progress" },
    { id: "past", label: "Past Projects" },
  ];

  const freelancerTabs = [
    { id: "bids", label: "My Bids" },
    { id: "current", label: "Current Work" },
    { id: "past", label: "Past Work" },
  ];

  const tabs = viewAs === "client" ? clientTabs : freelancerTabs;

  const clientProjects = {
    open: [
      {
        id: 1,
        name: "Full-Stack AI Developer for Freelancer Gateway",
        date: "13/03/2026",
        totalBids: 22,
        avgBid: 977.50,
        budgetMin: 750,
        budgetMax: 1250,
        budgetType: "hour",
        bidEndDate: "7 days",
        status: "Open",
      },
      {
        id: 2,
        name: "E-commerce Website Development",
        date: "10/03/2026",
        totalBids: 35,
        avgBid: 1500.00,
        budgetMin: 1000,
        budgetMax: 2000,
        budgetType: "hour",
        bidEndDate: "5 days",
        status: "Open",
      },
      {
        id: 3,
        name: "Mobile App UI/UX Design",
        date: "08/03/2026",
        totalBids: 18,
        avgBid: 850.00,
        budgetMin: 500,
        budgetMax: 1000,
        budgetType: "fixed",
        bidEndDate: "3 days",
        status: "Open",
      },
      {
        id: 4,
        name: "Backend API Development",
        date: "05/03/2026",
        totalBids: 42,
        avgBid: 25630.95,
        budgetMin: 12500,
        budgetMax: 37500,
        budgetType: "fixed",
        bidEndDate: "6 days",
        status: "Open",
      },
    ],
    inprogress: [
      {
        id: 5,
        name: "React Dashboard Development",
        date: "01/03/2026",
        totalBids: 28,
        avgBid: 1200.00,
        budgetMin: 1000,
        budgetMax: 1500,
        budgetType: "hour",
        bidEndDate: "-",
        status: "In Progress",
        freelancer: "Rahul Sharma",
      },
      {
        id: 6,
        name: "WordPress Plugin Development",
        date: "25/02/2026",
        totalBids: 15,
        avgBid: 600.00,
        budgetMin: 400,
        budgetMax: 800,
        budgetType: "fixed",
        bidEndDate: "-",
        status: "In Progress",
        freelancer: "Priya Patel",
      },
    ],
    past: [
      {
        id: 7,
        name: "Logo Design Project",
        date: "15/02/2026",
        totalBids: 50,
        avgBid: 300.00,
        budgetMin: 200,
        budgetMax: 500,
        budgetType: "fixed",
        bidEndDate: "-",
        status: "Completed",
        freelancer: "Amit Kumar",
      },
      {
        id: 8,
        name: "SEO Optimization",
        date: "01/02/2026",
        totalBids: 22,
        avgBid: 450.00,
        budgetMin: 300,
        budgetMax: 600,
        budgetType: "hour",
        bidEndDate: "-",
        status: "Completed",
        freelancer: "Sneha Gupta",
      },
    ],
  };

  const freelancerProjects = {
    bids: [
      {
        id: 1,
        name: "Full-Stack AI Developer for Freelancer Gateway",
        clientName: "TechCorp Inc.",
        date: "13/03/2026",
        myBid: 950.00,
        budgetMin: 750,
        budgetMax: 1250,
        budgetType: "hour",
        bidEndDate: "7 days",
        status: "Pending",
      },
      {
        id: 2,
        name: "Node.js Backend Development",
        clientName: "StartupXYZ",
        date: "12/03/2026",
        myBid: 1100.00,
        budgetMin: 900,
        budgetMax: 1400,
        budgetType: "hour",
        bidEndDate: "4 days",
        status: "Pending",
      },
      {
        id: 3,
        name: "Database Optimization",
        clientName: "DataFlow Ltd.",
        date: "10/03/2026",
        myBid: 800.00,
        budgetMin: 600,
        budgetMax: 1000,
        budgetType: "fixed",
        bidEndDate: "2 days",
        status: "Shortlisted",
      },
    ],
    current: [
      {
        id: 4,
        name: "React Native App Development",
        clientName: "MobileFirst Co.",
        date: "05/03/2026",
        myBid: 1500.00,
        budgetMin: 1200,
        budgetMax: 1800,
        budgetType: "hour",
        deadline: "30/03/2026",
        status: "In Progress",
        progress: 65,
      },
      {
        id: 5,
        name: "API Integration Project",
        clientName: "ConnectHub",
        date: "01/03/2026",
        myBid: 700.00,
        budgetMin: 500,
        budgetMax: 900,
        budgetType: "fixed",
        deadline: "20/03/2026",
        status: "In Progress",
        progress: 40,
      },
    ],
    past: [
      {
        id: 6,
        name: "E-commerce Platform",
        clientName: "ShopEasy",
        date: "01/02/2026",
        myBid: 2000.00,
        budgetMin: 1500,
        budgetMax: 2500,
        budgetType: "fixed",
        completedDate: "25/02/2026",
        status: "Completed",
        rating: 5,
      },
      {
        id: 7,
        name: "CRM Dashboard",
        clientName: "SalesForce Ltd.",
        date: "15/01/2026",
        myBid: 1200.00,
        budgetMin: 1000,
        budgetMax: 1500,
        budgetType: "hour",
        completedDate: "10/02/2026",
        status: "Completed",
        rating: 4,
      },
    ],
  };

  const currentProjects = viewAs === "client" ? clientProjects[activeTab] : freelancerProjects[activeTab];

  const filteredProjects = currentProjects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const displayedProjects = filteredProjects.slice(0, showCount);

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "4px 12px",
      borderRadius: "4px",
      fontSize: "13px",
      fontWeight: "500",
      display: "inline-block",
    };
    switch (status) {
      case "Open":
        return { ...baseStyle, backgroundColor: "#e6f7ee", color: "#1e7e34" };
      case "In Progress":
        return { ...baseStyle, backgroundColor: "#fff3cd", color: "#856404" };
      case "Completed":
        return { ...baseStyle, backgroundColor: "#d4edda", color: "#155724" };
      case "Pending":
        return { ...baseStyle, backgroundColor: "#e7f1ff", color: "#0056b3" };
      case "Shortlisted":
        return { ...baseStyle, backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      default:
        return { ...baseStyle, backgroundColor: "#f0f0f0", color: "#666" };
    }
  };

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
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "16px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1a1a2e",
      margin: 0,
    },
    viewToggle: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    viewLabel: {
      fontSize: "14px",
      color: "#666",
      fontWeight: "500",
    },
    toggleButton: (isActive) => ({
      padding: "8px 20px",
      border: "1px solid #2563eb",
      backgroundColor: isActive ? "#2563eb" : "#fff",
      color: isActive ? "#fff" : "#2563eb",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }),
    toggleButtonLeft: {
      borderRadius: "6px 0 0 6px",
      borderRight: "none",
    },
    toggleButtonRight: {
      borderRadius: "0 6px 6px 0",
    },
    tabsContainer: {
      backgroundColor: "#fff",
      borderBottom: "1px solid #e0e0e0",
      padding: "0 40px",
    },
    tabsContent: {
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      gap: "0",
      overflowX: "auto",
    },
    tab: (isActive) => ({
      padding: "16px 24px",
      fontSize: "14px",
      fontWeight: "500",
      color: isActive ? "#2563eb" : "#666",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
      cursor: "pointer",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    }),
    mainContent: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "24px 40px",
    },
    filterBar: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "16px 20px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    searchContainer: {
      position: "relative",
      flex: "1",
      minWidth: "250px",
      maxWidth: "500px",
    },
    searchIcon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
    },
    searchInput: {
      width: "100%",
      padding: "10px 16px 10px 42px",
      border: "1px solid #e0e0e0",
      borderRadius: "24px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s ease",
    },
    filterControls: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    selectGroup: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    selectLabel: {
      fontSize: "14px",
      color: "#666",
    },
    select: {
      padding: "8px 32px 8px 12px",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#fff",
      cursor: "pointer",
      outline: "none",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
    },
    tableContainer: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e0e0e0",
    },
    th: {
      padding: "14px 16px",
      textAlign: "left",
      fontSize: "13px",
      fontWeight: "600",
      color: "#4a5568",
      whiteSpace: "nowrap",
    },
    tr: (isHovered) => ({
      backgroundColor: isHovered ? "#f8fafc" : "#fff",
      borderBottom: "1px solid #f0f0f0",
      transition: "background-color 0.15s ease",
    }),
    td: {
      padding: "16px",
      fontSize: "14px",
      color: "#1a1a2e",
      verticalAlign: "middle",
    },
    projectName: {
      fontWeight: "500",
      color: "#2563eb",
      cursor: "pointer",
      maxWidth: "280px",
    },
    projectDate: {
      fontSize: "12px",
      color: "#9ca3af",
      marginTop: "4px",
    },
    currency: {
      fontWeight: "500",
      color: "#1a1a2e",
    },
    actionsCell: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    editButton: {
      padding: "6px 16px",
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      fontSize: "13px",
      color: "#4a5568",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    dropdownButton: {
      padding: "6px 10px",
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      fontSize: "13px",
      color: "#4a5568",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      transition: "all 0.2s ease",
    },
    dropdownMenu: {
      position: "absolute",
      right: "0",
      top: "100%",
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      zIndex: 100,
      minWidth: "150px",
      marginTop: "4px",
    },
    dropdownItem: {
      padding: "10px 16px",
      fontSize: "14px",
      color: "#4a5568",
      cursor: "pointer",
      transition: "background-color 0.15s ease",
      border: "none",
      backgroundColor: "transparent",
      width: "100%",
      textAlign: "left",
      display: "block",
    },
    emptyState: {
      padding: "60px 20px",
      textAlign: "center",
    },
    emptyIcon: {
      width: "80px",
      height: "80px",
      margin: "0 auto 20px",
      backgroundColor: "#f0f4f8",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1a1a2e",
      marginBottom: "8px",
    },
    emptyText: {
      fontSize: "14px",
      color: "#9ca3af",
    },
    progressBar: {
      width: "100%",
      height: "6px",
      backgroundColor: "#e0e0e0",
      borderRadius: "3px",
      overflow: "hidden",
      marginTop: "4px",
    },
    progressFill: (progress) => ({
      width: `${progress}%`,
      height: "100%",
      backgroundColor: "#2563eb",
      borderRadius: "3px",
      transition: "width 0.3s ease",
    }),
    starContainer: {
      display: "flex",
      gap: "2px",
    },
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={star <= rating ? "#fbbf24" : "#e0e0e0"}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderClientTable = () => (
    <table style={styles.table}>
      <thead style={styles.tableHeader}>
        <tr>
          <th style={styles.th}>Project Name</th>
          <th style={{ ...styles.th, textAlign: "center" }}>Total Bids</th>
          <th style={styles.th}>Average Bid</th>
          <th style={styles.th}>Budget</th>
          <th style={styles.th}>Bid End Date</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {displayedProjects.map((project) => (
          <tr
            key={project.id}
            style={styles.tr(hoveredRow === project.id)}
            onMouseEnter={() => setHoveredRow(project.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <td style={styles.td}>
              <div style={styles.projectName}>{project.name}</div>
              <div style={styles.projectDate}>{project.date}</div>
            </td>
            <td style={{ ...styles.td, textAlign: "center" }}>{project.totalBids}</td>
            <td style={styles.td}>
              <span style={styles.currency}>₹{project.avgBid.toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR</span>
            </td>
            <td style={styles.td}>
              <span style={styles.currency}>
                ₹{project.budgetMin.toLocaleString("en-IN", { minimumFractionDigits: 2 })} – {project.budgetMax.toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR / {project.budgetType}
              </span>
            </td>
            <td style={styles.td}>
              {project.bidEndDate === "-" ? "-" : `in ${project.bidEndDate}`}
            </td>
            <td style={styles.td}>
              <span style={getStatusStyle(project.status)}>{project.status}</span>
            </td>
            <td style={styles.td}>
              <div style={{ ...styles.actionsCell, position: "relative" }}>
                <button style={styles.editButton}>Edit</button>
                <button
                  style={styles.dropdownButton}
                  onClick={() => setOpenDropdown(openDropdown === project.id ? null : project.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openDropdown === project.id && (
                  <div style={styles.dropdownMenu}>
                    <button
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      View Details
                    </button>
                    <button
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      View Bids
                    </button>
                    <button
                      style={styles.dropdownItem}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      Close Project
                    </button>
                    <button
                      style={{ ...styles.dropdownItem, color: "#dc2626" }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#fef2f2")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderFreelancerTable = () => {
    if (activeTab === "bids") {
      return (
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>Project Name</th>
              <th style={styles.th}>Client</th>
              <th style={styles.th}>My Bid</th>
              <th style={styles.th}>Budget</th>
              <th style={styles.th}>Bid End Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProjects.map((project) => (
              <tr
                key={project.id}
                style={styles.tr(hoveredRow === project.id)}
                onMouseEnter={() => setHoveredRow(project.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>
                  <div style={styles.projectName}>{project.name}</div>
                  <div style={styles.projectDate}>{project.date}</div>
                </td>
                <td style={styles.td}>{project.clientName}</td>
                <td style={styles.td}>
                  <span style={styles.currency}>₹{project.myBid.toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.currency}>
                    ₹{project.budgetMin.toLocaleString("en-IN", { minimumFractionDigits: 2 })} – {project.budgetMax.toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR / {project.budgetType}
                  </span>
                </td>
                <td style={styles.td}>in {project.bidEndDate}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(project.status)}>{project.status}</span>
                </td>
                <td style={styles.td}>
                  <div style={{ ...styles.actionsCell, position: "relative" }}>
                    <button style={styles.editButton}>Edit Bid</button>
                    <button
                      style={styles.dropdownButton}
                      onClick={() => setOpenDropdown(openDropdown === project.id ? null : project.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {openDropdown === project.id && (
                      <div style={styles.dropdownMenu}>
                        <button
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                        >
                          View Project
                        </button>
                        <button
                          style={{ ...styles.dropdownItem, color: "#dc2626" }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#fef2f2")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                        >
                          Withdraw Bid
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === "current") {
      return (
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.th}>Project Name</th>
              <th style={styles.th}>Client</th>
              <th style={styles.th}>Agreed Amount</th>
              <th style={styles.th}>Deadline</th>
              <th style={styles.th}>Progress</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProjects.map((project) => (
              <tr
                key={project.id}
                style={styles.tr(hoveredRow === project.id)}
                onMouseEnter={() => setHoveredRow(project.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>
                  <div style={styles.projectName}>{project.name}</div>
                  <div style={styles.projectDate}>Started: {project.date}</div>
                </td>
                <td style={styles.td}>{project.clientName}</td>
                <td style={styles.td}>
                  <span style={styles.currency}>₹{project.myBid.toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR / {project.budgetType}</span>
                </td>
                <td style={styles.td}>{project.deadline}</td>
                <td style={styles.td}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: "500" }}>{project.progress}%</span>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(project.progress)} />
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={getStatusStyle(project.status)}>{project.status}</span>
                </td>
                <td style={styles.td}>
                  <div style={{ ...styles.actionsCell, position: "relative" }}>
                    <button style={styles.editButton}>Update</button>
                    <button
                      style={styles.dropdownButton}
                      onClick={() => setOpenDropdown(openDropdown === project.id ? null : project.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {openDropdown === project.id && (
                      <div style={styles.dropdownMenu}>
                        <button
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                        >
                          View Details
                        </button>
                        <button
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                        >
                          Message Client
                        </button>
                        <button
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                        >
                          Submit Work
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>Project Name</th>
            <th style={styles.th}>Client</th>
            <th style={styles.th}>Earned Amount</th>
            <th style={styles.th}>Completed Date</th>
            <th style={styles.th}>Rating</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedProjects.map((project) => (
            <tr
              key={project.id}
              style={styles.tr(hoveredRow === project.id)}
              onMouseEnter={() => setHoveredRow(project.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td style={styles.td}>
                <div style={styles.projectName}>{project.name}</div>
                <div style={styles.projectDate}>Started: {project.date}</div>
              </td>
              <td style={styles.td}>{project.clientName}</td>
              <td style={styles.td}>
                <span style={styles.currency}>₹{project.myBid.toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR</span>
              </td>
              <td style={styles.td}>{project.completedDate}</td>
              <td style={styles.td}>{renderStars(project.rating)}</td>
              <td style={styles.td}>
                <span style={getStatusStyle(project.status)}>{project.status}</span>
              </td>
              <td style={styles.td}>
                <div style={styles.actionsCell}>
                  <button style={styles.editButton}>View</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.container} onClick={() => setOpenDropdown(null)}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Projects, Contests and Quotes</h1>
          <div style={styles.viewToggle}>
            <span style={styles.viewLabel}>View as</span>
            <div>
              <button
                style={{ ...styles.toggleButton(viewAs === "client"), ...styles.toggleButtonLeft }}
                onClick={() => {
                  setViewAs("client");
                  setActiveTab("open");
                }}
              >
                Client
              </button>
              <button
                style={{ ...styles.toggleButton(viewAs === "freelancer"), ...styles.toggleButtonRight }}
                onClick={() => {
                  setViewAs("freelancer");
                  setActiveTab("bids");
                }}
              >
                Freelancer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tabsContainer}>
        <div style={styles.tabsContent}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={styles.tab(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.filterBar}>
          <div style={styles.searchContainer}>
            <svg style={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search Projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>
          <div style={styles.filterControls}>
            <div style={styles.selectGroup}>
              <span style={styles.selectLabel}>Show:</span>
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                style={styles.select}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div style={styles.selectGroup}>
              <span style={styles.selectLabel}>View:</span>
              <select
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value)}
                style={styles.select}
              >
                <option value="all">All</option>
                <option value="hourly">Hourly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
          </div>
        </div>

        <div style={styles.tableContainer}>
          {displayedProjects.length > 0 ? (
            viewAs === "client" ? renderClientTable() : renderFreelancerTable()
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>No projects found</h3>
              <p style={styles.emptyText}>
                {searchQuery
                  ? "Try adjusting your search terms"
                  : viewAs === "client"
                  ? "You haven't posted any projects yet"
                  : "You don't have any projects in this category"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
