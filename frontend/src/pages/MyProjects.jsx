"use client";
import { useState, useEffect } from "react";

const MyProjects = ({ onProjectClick }) => {
  const [viewAs, setViewAs] = useState("client");
  const [activeTab, setActiveTab] = useState("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [viewFilter, setViewFilter] = useState("all");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [apiProjects, setApiProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch real projects when viewAs changes
  useEffect(() => {
    const fetchMyProjects = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      setIsLoadingProjects(true);
      try {
        if (viewAs === 'freelancer') {
          const res = await fetch(`/api/projects/my-projects/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const mapped = data.map((p) => ({
              id: p._id,
              name: p.description ? p.description.slice(0, 80) : 'Untitled',
              clientName: p.employerId || 'Client',
              date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : '-',
              myBid: p.total_budget || 0,
              budgetMin: p.total_budget || 0,
              budgetMax: p.total_budget || 0,
              budgetType: 'fixed',
              bidEndDate: '-',
              status: p.status === 'in-progress' ? 'In Progress' : p.status === 'open' ? 'Open' : 'Completed',
              progress: p.status === 'in-progress' ? 50 : 100,
              deadline: p.timeline || '-',
              completedDate: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-IN') : '-',
              rating: 5,
              milestones: p.milestones || [],
            }));
            setApiProjects(mapped);
          }
        } else {
          // Client: fetch projects posted by this employer
          const res = await fetch(`/api/projects/employer-projects/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const mapped = data.map((p) => ({
              id: p._id,
              name: p.description ? p.description.slice(0, 80) : 'Untitled',
              date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : '-',
              totalBids: 0,
              avgBid: p.total_budget || 0,
              budgetMin: p.total_budget || 0,
              budgetMax: p.total_budget || 0,
              budgetType: 'fixed',
              bidEndDate: p.timeline || '-',
              status: p.status === 'in-progress' ? 'In Progress' : p.status === 'open' ? 'Open' : 'Completed',
              milestones: p.milestones || [],
            }));
            setApiProjects(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch my projects:', err);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchMyProjects();
  }, [viewAs]);

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
        milestones: [
          { id: 1, title: "Project Setup & Architecture", amount: 200, status: "pending", githubLink: "" },
          { id: 2, title: "Frontend Development", amount: 300, status: "pending", githubLink: "" },
          { id: 3, title: "Backend API Development", amount: 350, status: "pending", githubLink: "" },
          { id: 4, title: "Testing & Deployment", amount: 150, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "UI/UX Design", amount: 400, status: "pending", githubLink: "" },
          { id: 2, title: "Product Catalog", amount: 500, status: "pending", githubLink: "" },
          { id: 3, title: "Payment Integration", amount: 400, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "Wireframes", amount: 250, status: "pending", githubLink: "" },
          { id: 2, title: "High Fidelity Designs", amount: 350, status: "pending", githubLink: "" },
          { id: 3, title: "Prototype", amount: 250, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "Database Schema Design", amount: 5000, status: "pending", githubLink: "" },
          { id: 2, title: "Core API Endpoints", amount: 10000, status: "pending", githubLink: "" },
          { id: 3, title: "Authentication & Security", amount: 7500, status: "pending", githubLink: "" },
          { id: 4, title: "Documentation & Testing", amount: 5000, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "Dashboard Layout", amount: 300, status: "completed", githubLink: "https://github.com/user/dashboard-layout" },
          { id: 2, title: "Charts & Analytics", amount: 400, status: "completed", githubLink: "https://github.com/user/charts-analytics" },
          { id: 3, title: "User Management", amount: 350, status: "pending", githubLink: "" },
          { id: 4, title: "Settings & Profile", amount: 200, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "Plugin Architecture", amount: 150, status: "completed", githubLink: "https://github.com/user/plugin-arch" },
          { id: 2, title: "Core Features", amount: 250, status: "pending", githubLink: "" },
          { id: 3, title: "Admin Panel", amount: 200, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "Concept Design", amount: 100, status: "completed", githubLink: "https://github.com/user/logo-concepts" },
          { id: 2, title: "Final Design", amount: 150, status: "completed", githubLink: "https://github.com/user/logo-final" },
        ],
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
        milestones: [
          { id: 1, title: "SEO Audit", amount: 150, status: "completed", githubLink: "https://github.com/user/seo-audit" },
          { id: 2, title: "On-Page Optimization", amount: 200, status: "completed", githubLink: "https://github.com/user/on-page-seo" },
          { id: 3, title: "Off-Page Strategy", amount: 150, status: "completed", githubLink: "https://github.com/user/off-page-seo" },
        ],
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
        milestones: [],
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
        milestones: [],
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
        milestones: [],
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
        milestones: [
          { id: 1, title: "App Setup & Navigation", amount: 300, status: "completed", githubLink: "https://github.com/user/app-setup" },
          { id: 2, title: "Core Features", amount: 500, status: "completed", githubLink: "https://github.com/user/core-features" },
          { id: 3, title: "API Integration", amount: 400, status: "pending", githubLink: "" },
          { id: 4, title: "Testing & Polish", amount: 300, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "API Research & Planning", amount: 150, status: "completed", githubLink: "https://github.com/user/api-planning" },
          { id: 2, title: "Integration Development", amount: 350, status: "pending", githubLink: "" },
          { id: 3, title: "Testing & Documentation", amount: 200, status: "pending", githubLink: "" },
        ],
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
        milestones: [
          { id: 1, title: "Store Setup", amount: 500, status: "completed", githubLink: "https://github.com/user/store-setup" },
          { id: 2, title: "Product Management", amount: 600, status: "completed", githubLink: "https://github.com/user/product-mgmt" },
          { id: 3, title: "Checkout & Payment", amount: 500, status: "completed", githubLink: "https://github.com/user/checkout" },
          { id: 4, title: "Deployment", amount: 400, status: "completed", githubLink: "https://github.com/user/deployment" },
        ],
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
        milestones: [
          { id: 1, title: "Dashboard Design", amount: 400, status: "completed", githubLink: "https://github.com/user/crm-design" },
          { id: 2, title: "CRM Features", amount: 500, status: "completed", githubLink: "https://github.com/user/crm-features" },
          { id: 3, title: "Reports & Analytics", amount: 300, status: "completed", githubLink: "https://github.com/user/crm-reports" },
        ],
      },
    ],
  };

  // Handle project click to show milestones
  const handleProjectClick = (project) => {
    if (onProjectClick) {
      onProjectClick(project, viewAs);
    } else {
      setSelectedProject({ ...project, viewAs });
    }
  };

  // Use API projects, fall back to static demo data
  const getStaticProjects = () => {
    if (viewAs === "client") return clientProjects[activeTab] || [];
    return freelancerProjects[activeTab] || [];
  };
  const currentProjects = apiProjects.length > 0
    ? apiProjects.filter(p => {
        if (viewAs === "freelancer") {
          if (activeTab === "bids") return p.status === "Open";
          if (activeTab === "current") return p.status === "In Progress";
          if (activeTab === "past") return p.status === "Completed";
        } else {
          if (activeTab === "open") return p.status === "Open";
          if (activeTab === "inprogress") return p.status === "In Progress";
          if (activeTab === "past") return p.status === "Completed";
        }
        return true;
      })
    : getStaticProjects();

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
      cursor: "pointer",
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
    viewMilestonesButton: {
      padding: "6px 16px",
      backgroundColor: "#2563eb",
      border: "1px solid #2563eb",
      borderRadius: "4px",
      fontSize: "13px",
      color: "#fff",
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
            <td style={styles.td} onClick={() => handleProjectClick(project)}>
              <div style={styles.projectName}>{project.name}</div>
              <div style={styles.projectDate}>{project.date}</div>
            </td>
            <td style={{ ...styles.td, textAlign: "center" }}>{project.totalBids}</td>
            <td style={styles.td}>
              <span style={styles.currency}>₹{project.avgBid?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR</span>
            </td>
            <td style={styles.td}>
              <span style={styles.currency}>
                ₹{project.budgetMin?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} – {project.budgetMax?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR / {project.budgetType}
              </span>
            </td>
            <td style={styles.td}>
              {project.bidEndDate === "-" ? "-" : `in ${project.bidEndDate}`}
            </td>
            <td style={styles.td}>
              <span style={getStatusStyle(project.status)}>{project.status}</span>
            </td>
            <td style={styles.td}>
              <div style={{ ...styles.actionsCell, position: "relative" }} onClick={(e) => e.stopPropagation()}>
                <button style={styles.viewMilestonesButton} onClick={() => handleProjectClick(project)}>
                  Milestones
                </button>
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
                  <span style={styles.currency}>₹{project.myBid?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.currency}>
                    ₹{project.budgetMin?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} – {project.budgetMax?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR / {project.budgetType}
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
                <td style={styles.td} onClick={() => handleProjectClick(project)}>
                  <div style={styles.projectName}>{project.name}</div>
                  <div style={styles.projectDate}>Started: {project.date}</div>
                </td>
                <td style={styles.td}>{project.clientName}</td>
                <td style={styles.td}>
                  <span style={styles.currency}>₹{project.myBid?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR / {project.budgetType}</span>
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
                  <div style={{ ...styles.actionsCell, position: "relative" }} onClick={(e) => e.stopPropagation()}>
                    <button style={styles.viewMilestonesButton} onClick={() => handleProjectClick(project)}>
                      Milestones
                    </button>
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
              <td style={styles.td} onClick={() => handleProjectClick(project)}>
                <div style={styles.projectName}>{project.name}</div>
                <div style={styles.projectDate}>Started: {project.date}</div>
              </td>
              <td style={styles.td}>{project.clientName}</td>
              <td style={styles.td}>
                <span style={styles.currency}>₹{project.myBid?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR</span>
              </td>
              <td style={styles.td}>{project.completedDate}</td>
              <td style={styles.td}>{renderStars(project.rating)}</td>
              <td style={styles.td}>
                <span style={getStatusStyle(project.status)}>{project.status}</span>
              </td>
              <td style={styles.td}>
                <div style={styles.actionsCell}>
                  <button style={styles.viewMilestonesButton} onClick={() => handleProjectClick(project)}>
                    Milestones
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // If a project is selected, show milestones
  if (selectedProject) {
    return (
      <ProjectMilestones 
        project={selectedProject} 
        viewAs={selectedProject.viewAs} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

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
          {isLoadingProjects ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Loading projects...</p>
            </div>
          ) : displayedProjects.length > 0 ? (
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

// ProjectMilestones component embedded in the same file
const ProjectMilestones = ({ project, viewAs, onBack }) => {
  const [milestones, setMilestones] = useState(project.milestones || []);
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitMilestone = async (milestoneId) => {
    if (!githubLink.trim()) {
      alert("Please enter a valid GitHub link");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMilestones(prev => 
      prev.map(m => 
        m.id === milestoneId 
          ? { ...m, status: "completed", githubLink: githubLink.trim() }
          : m
      )
    );

    setShowSubmitModal(null);
    setGithubLink("");
    setIsSubmitting(false);
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
      backgroundColor: "#2563eb",
      borderRadius: "6px",
      transition: "width 0.5s ease",
      width: `${progressPercent}%`,
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
      border: status === "completed" ? "2px solid #10b981" : "2px solid transparent",
      transition: "all 0.2s ease",
    }),
    milestoneHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    milestoneInfo: {
      flex: 1,
    },
    milestoneNumber: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#9ca3af",
      marginBottom: "4px",
    },
    milestoneTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1a1a2e",
      marginBottom: "8px",
    },
    milestoneAmount: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#2563eb",
    },
    statusBadge: (status) => ({
      padding: "6px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "500",
      backgroundColor: status === "completed" ? "#d4edda" : "#fff3cd",
      color: status === "completed" ? "#155724" : "#856404",
    }),
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
    },
    githubLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#2563eb",
      textDecoration: "none",
      wordBreak: "break-all",
    },
    submitButton: {
      padding: "10px 24px",
      backgroundColor: "#2563eb",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "16px",
    },
    submitButtonDisabled: {
      padding: "10px 24px",
      backgroundColor: "#9ca3af",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#fff",
      cursor: "not-allowed",
      marginTop: "16px",
    },
    noGithubText: {
      fontSize: "14px",
      color: "#9ca3af",
      fontStyle: "italic",
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
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "32px",
      maxWidth: "500px",
      width: "90%",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1a1a2e",
      marginBottom: "8px",
    },
    modalSubtitle: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "24px",
    },
    inputLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#4a5568",
      marginBottom: "8px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s ease",
      boxSizing: "border-box",
    },
    modalButtons: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
      justifyContent: "flex-end",
    },
    cancelButton: {
      padding: "10px 24px",
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#4a5568",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    confirmButton: {
      padding: "10px 24px",
      backgroundColor: "#10b981",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    emptyMilestones: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button 
            style={styles.backButton}
            onClick={onBack}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e9ecef";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f8f9fa";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
          <h1 style={styles.projectTitle}>{project.name}</h1>
          <div style={styles.projectMeta}>
            <span style={styles.viewBadge}>
              {viewAs === "client" ? "Client View" : "Freelancer View"}
            </span>
            <span>Project ID: {project.id}</span>
            <span>Started: {project.date}</span>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Progress Overview */}
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <h2 style={styles.progressTitle}>Project Progress</h2>
            <span style={styles.progressStats}>
              {completedCount} of {totalCount} milestones completed ({progressPercent}%)
            </span>
          </div>
          <div style={styles.progressBarContainer}>
            <div style={styles.progressBarFill} />
          </div>
        </div>

        {/* Milestones List */}
        {milestones.length > 0 ? (
          <div style={styles.milestonesGrid}>
            {milestones.map((milestone, index) => (
              <div key={milestone.id} style={styles.milestoneCard(milestone.status)}>
                <div style={styles.milestoneHeader}>
                  <div style={styles.milestoneInfo}>
                    <div style={styles.milestoneNumber}>MILESTONE {index + 1}</div>
                    <h3 style={styles.milestoneTitle}>{milestone.title}</h3>
                    <div style={styles.milestoneAmount}>
                      ₹{milestone.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || '0.00'} INR
                    </div>
                  </div>
                  <span style={styles.statusBadge(milestone.status)}>
                    {milestone.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>

                {/* GitHub Link Section */}
                {milestone.status === "completed" && milestone.githubLink ? (
                  <div style={styles.githubSection}>
                    <div style={styles.githubLabel}>GitHub Repository</div>
                    <a 
                      href={milestone.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.githubLink}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      {milestone.githubLink}
                    </a>
                  </div>
                ) : viewAs === "client" && milestone.status === "pending" ? (
                  <div style={styles.githubSection}>
                    <div style={styles.githubLabel}>GitHub Repository</div>
                    <span style={styles.noGithubText}>Awaiting submission from freelancer</span>
                  </div>
                ) : null}

                {/* Submit Button for Freelancer */}
                {viewAs === "freelancer" && milestone.status === "pending" && (
                  <button 
                    style={styles.submitButton}
                    onClick={() => setShowSubmitModal(milestone.id)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#2563eb";
                    }}
                  >
                    Submit Milestone
                  </button>
                )}

                {viewAs === "freelancer" && milestone.status === "completed" && (
                  <button style={styles.submitButtonDisabled} disabled>
                    Submitted
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyMilestones}>
            <div style={styles.emptyIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 style={styles.emptyTitle}>No milestones yet</h3>
            <p style={styles.emptyText}>Milestones will appear here once they are created for this project.</p>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSubmitModal(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Submit Milestone</h2>
            <p style={styles.modalSubtitle}>
              Please provide the GitHub repository link for this milestone. This will mark the milestone as completed.
            </p>
            <label style={styles.inputLabel}>GitHub Repository URL</label>
            <input
              type="url"
              placeholder="https://github.com/username/repository"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
            <div style={styles.modalButtons}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowSubmitModal(null);
                  setGithubLink("");
                }}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmButton}
                onClick={() => handleSubmitMilestone(showSubmitModal)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit & Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
export { ProjectMilestones };
