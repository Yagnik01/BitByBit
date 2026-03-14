"use client";
import { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [likedProjects, setLikedProjects] = useState([]);

  const freelancer = {
    name: "Arjun Sharma",
    title: "Senior Full-Stack Developer & UI/UX Designer",
    tagline: "Turning ideas into elegant, scalable digital solutions",
    avatar: "https://media.licdn.com/dms/image/v2/D4D35AQEZ4EqVGZdzww/profile-framedphoto-shrink_400_400/B4DZoKENtIIAAg-/0/1761105468475?e=1774072800&v=beta&t=FrW78VJVfWFM60lWzszmOlt4xRFBmtfqHAdJXz4Tiiw",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop",
    location: "Mumbai, India",
    timezone: "IST (UTC+5:30)",
    languages: ["English (Fluent)", "Hindi (Native)", "Marathi"],
    memberSince: "January 2021",
    lastActive: "Online now",
    isVerified: true,
    isTopRated: true,
    availableForHire: true,
    rating: 4.9,
    totalReviews: 247,
    completedJobs: 189,
    successRate: 98,
    onTimeDelivery: 99,
    repeatClients: 45,
    totalEarnings: "₹45,00,000+",
    hourlyRate: 2500,
    responseTime: "Within 1 hour",
    about: `I'm a passionate Full-Stack Developer with 8+ years of experience building scalable web applications and beautiful user interfaces. I specialize in React, Node.js, and cloud technologies.

My approach combines clean code practices with user-centered design thinking. I believe that great software should not only work flawlessly but also provide an exceptional user experience.

I've worked with startups, enterprises, and everything in between - from MVPs that need to launch quickly to complex enterprise systems requiring robust architecture. My commitment to quality and communication has earned me a 98% success rate and numerous repeat clients.

When I'm not coding, you'll find me contributing to open-source projects, writing technical blogs, or mentoring aspiring developers.`,
    skills: [
      { name: "React.js", level: 98, category: "Frontend" },
      { name: "Node.js", level: 95, category: "Backend" },
      { name: "TypeScript", level: 92, category: "Language" },
      { name: "Next.js", level: 94, category: "Frontend" },
      { name: "MongoDB", level: 88, category: "Database" },
      { name: "PostgreSQL", level: 90, category: "Database" },
      { name: "AWS", level: 85, category: "Cloud" },
      { name: "Docker", level: 82, category: "DevOps" },
      { name: "GraphQL", level: 88, category: "API" },
      { name: "Figma", level: 80, category: "Design" },
      { name: "Python", level: 78, category: "Language" },
      { name: "Redis", level: 75, category: "Database" },
    ],
    portfolio: [
      {
        id: 1,
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        likes: 124,
        views: 2340,
      },
      {
        id: 2,
        title: "Healthcare Management System",
        description: "HIPAA-compliant healthcare platform for managing patient records, appointments, and telemedicine.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
        tags: ["Next.js", "PostgreSQL", "AWS", "WebRTC"],
        likes: 98,
        views: 1890,
      },
      {
        id: 3,
        title: "Real-time Collaboration Tool",
        description: "Slack-like collaboration platform with real-time messaging, file sharing, and video calls.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
        tags: ["React", "Socket.io", "Redis", "Docker"],
        likes: 156,
        views: 3120,
      },
      {
        id: 4,
        title: "AI-Powered Analytics Dashboard",
        description: "Business intelligence dashboard with ML-powered insights and predictive analytics.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        tags: ["Python", "React", "TensorFlow", "D3.js"],
        likes: 87,
        views: 1560,
      },
      {
        id: 5,
        title: "Social Media Mobile App",
        description: "Cross-platform social media app with stories, reels, and live streaming features.",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
        tags: ["React Native", "Firebase", "Node.js"],
        likes: 203,
        views: 4200,
      },
      {
        id: 6,
        title: "Fintech Payment Gateway",
        description: "Secure payment processing system with multi-currency support and fraud detection.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
        tags: ["Node.js", "PostgreSQL", "Stripe", "AWS"],
        likes: 145,
        views: 2780,
      },
    ],
    reviews: [
      {
        id: 1,
        client: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
        company: "TechStart Inc.",
        country: "United States",
        rating: 5,
        date: "2 weeks ago",
        project: "E-Commerce Platform Development",
        budget: "₹3,50,000",
        review: "Arjun is an exceptional developer! He delivered our e-commerce platform ahead of schedule and exceeded all expectations. His communication was excellent throughout the project, and he proactively suggested improvements that made our platform even better. Highly recommended!",
      },
      {
        id: 2,
        client: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        company: "HealthTech Solutions",
        country: "Singapore",
        rating: 5,
        date: "1 month ago",
        project: "Healthcare Management System",
        budget: "₹5,00,000",
        review: "Working with Arjun was a fantastic experience. He understood our complex requirements for a HIPAA-compliant system and delivered a robust, scalable solution. His expertise in both frontend and backend development is truly impressive.",
      },
      {
        id: 3,
        client: "Emma Williams",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        company: "Creative Agency",
        country: "United Kingdom",
        rating: 5,
        date: "2 months ago",
        project: "Real-time Collaboration Tool",
        budget: "₹4,25,000",
        review: "Arjun built an amazing collaboration tool for our team. The real-time features work flawlessly, and the UI is beautiful. He was always available to discuss ideas and made the development process smooth and enjoyable.",
      },
      {
        id: 4,
        client: "Rajesh Patel",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
        company: "FinServe India",
        country: "India",
        rating: 4,
        date: "3 months ago",
        project: "Payment Gateway Integration",
        budget: "₹2,75,000",
        review: "Great work on integrating multiple payment gateways into our system. Arjun's knowledge of security best practices gave us confidence in the solution. Minor delays due to scope changes, but overall excellent delivery.",
      },
    ],
    experience: [
      {
        title: "Senior Full-Stack Developer",
        company: "Freelance",
        period: "2021 - Present",
        description: "Building scalable web applications for clients worldwide.",
      },
      {
        title: "Lead Developer",
        company: "TechCorp Solutions",
        period: "2018 - 2021",
        description: "Led a team of 8 developers building enterprise SaaS products.",
      },
      {
        title: "Full-Stack Developer",
        company: "StartupHub",
        period: "2016 - 2018",
        description: "Developed MVPs and products for early-stage startups.",
      },
    ],
    education: [
      {
        degree: "B.Tech in Computer Science",
        institution: "IIT Bombay",
        year: "2016",
      },
    ],
    certifications: [
      { name: "AWS Solutions Architect", issuer: "Amazon Web Services", year: "2023" },
      { name: "Google Cloud Professional", issuer: "Google", year: "2022" },
      { name: "MongoDB Certified Developer", issuer: "MongoDB", year: "2021" },
    ],
    socialLinks: {
      github: "github.com/arjunsharma",
      linkedin: "linkedin.com/in/arjunsharma",
      twitter: "twitter.com/arjundev",
      website: "arjunsharma.dev",
    },
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    coverSection: {
      position: "relative",
      height: "320px",
      background: `linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(6, 95, 70, 0.95) 100%), url(${freelancer.coverImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    coverOverlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)",
    },
    coverContent: {
      position: "relative",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "24px",
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
    },
    profileCard: {
      maxWidth: "1200px",
      margin: "-80px auto 0",
      padding: "0 24px",
      position: "relative",
      zIndex: 10,
    },
    mainCard: {
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    profileHeader: {
      padding: "32px 40px",
      display: "flex",
      gap: "32px",
      alignItems: "flex-start",
      flexWrap: "wrap",
      borderBottom: "1px solid #e2e8f0",
    },
    avatarContainer: {
      position: "relative",
      flexShrink: 0,
    },
    avatar: {
      width: "160px",
      height: "160px",
      borderRadius: "24px",
      objectFit: "cover",
      border: "4px solid #ffffff",
      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    },
    onlineBadge: {
      position: "absolute",
      bottom: "8px",
      right: "8px",
      width: "24px",
      height: "24px",
      backgroundColor: "#10b981",
      borderRadius: "50%",
      border: "4px solid #ffffff",
      boxShadow: "0 2px 8px rgba(16,185,129,0.4)",
    },
    verifiedBadge: {
      position: "absolute",
      top: "-8px",
      right: "-8px",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
    },
    profileInfo: {
      flex: 1,
      minWidth: "280px",
    },
    nameRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "8px",
    },
    name: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#0f172a",
      margin: 0,
    },
    topRatedBadge: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#ffffff",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
    },
    title: {
      fontSize: "18px",
      color: "#475569",
      margin: "0 0 12px 0",
      fontWeight: "500",
    },
    tagline: {
      fontSize: "15px",
      color: "#64748b",
      margin: "0 0 16px 0",
      fontStyle: "italic",
    },
    metaRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      alignItems: "center",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#64748b",
      fontSize: "14px",
    },
    ratingContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#fef3c7",
      padding: "8px 16px",
      borderRadius: "12px",
    },
    ratingStars: {
      display: "flex",
      gap: "2px",
    },
    ratingText: {
      fontWeight: "700",
      color: "#92400e",
      fontSize: "16px",
    },
    reviewCount: {
      color: "#a16207",
      fontSize: "14px",
    },
    profileActions: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      alignItems: "flex-end",
    },
    primaryButton: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      border: "none",
      padding: "14px 32px",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
      transition: "all 0.3s ease",
    },
    secondaryButton: {
      backgroundColor: "#ffffff",
      color: "#10b981",
      border: "2px solid #10b981",
      padding: "12px 28px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    followButton: {
      backgroundColor: isFollowing ? "#10b981" : "#ffffff",
      color: isFollowing ? "#ffffff" : "#475569",
      border: isFollowing ? "2px solid #10b981" : "2px solid #e2e8f0",
      padding: "12px 28px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    statsSection: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "1px",
      backgroundColor: "#e2e8f0",
      borderBottom: "1px solid #e2e8f0",
    },
    statItem: {
      backgroundColor: "#ffffff",
      padding: "24px 16px",
      textAlign: "center",
    },
    statValue: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: "4px",
    },
    statLabel: {
      fontSize: "13px",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    contentSection: {
      display: "grid",
      gridTemplateColumns: "340px 1fr",
      gap: "0",
    },
    sidebar: {
      borderRight: "1px solid #e2e8f0",
      padding: "32px",
      backgroundColor: "#fafafa",
    },
    sidebarSection: {
      marginBottom: "32px",
    },
    sidebarTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    infoItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "12px 0",
      borderBottom: "1px solid #e5e7eb",
    },
    infoIcon: {
      color: "#10b981",
      marginTop: "2px",
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: "12px",
      color: "#9ca3af",
      marginBottom: "2px",
    },
    infoValue: {
      fontSize: "14px",
      color: "#1f2937",
      fontWeight: "500",
    },
    skillsGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    skillTag: {
      padding: "8px 14px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    languageItem: {
      padding: "10px 0",
      borderBottom: "1px solid #e5e7eb",
      fontSize: "14px",
      color: "#374151",
    },
    socialLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    socialLink: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "10px 14px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      color: "#475569",
      textDecoration: "none",
      fontSize: "14px",
      transition: "all 0.2s ease",
      border: "1px solid #e5e7eb",
    },
    mainContent: {
      padding: "32px 40px",
    },
    tabsContainer: {
      display: "flex",
      gap: "8px",
      borderBottom: "2px solid #e2e8f0",
      marginBottom: "32px",
      paddingBottom: "0",
    },
    tab: {
      padding: "14px 24px",
      border: "none",
      backgroundColor: "transparent",
      fontSize: "15px",
      fontWeight: "600",
      color: "#64748b",
      cursor: "pointer",
      position: "relative",
      transition: "all 0.2s ease",
    },
    activeTab: {
      color: "#10b981",
    },
    tabIndicator: {
      position: "absolute",
      bottom: "-2px",
      left: 0,
      right: 0,
      height: "3px",
      backgroundColor: "#10b981",
      borderRadius: "3px 3px 0 0",
    },
    aboutText: {
      fontSize: "15px",
      lineHeight: "1.8",
      color: "#475569",
      whiteSpace: "pre-line",
    },
    portfolioGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "24px",
    },
    portfolioCard: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      transition: "all 0.3s ease",
      border: "1px solid #e5e7eb",
      cursor: "pointer",
    },
    portfolioImage: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
    },
    portfolioContent: {
      padding: "20px",
    },
    portfolioTitle: {
      fontSize: "17px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "8px",
    },
    portfolioDesc: {
      fontSize: "14px",
      color: "#6b7280",
      lineHeight: "1.6",
      marginBottom: "16px",
    },
    portfolioTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "16px",
    },
    portfolioTag: {
      backgroundColor: "#ecfdf5",
      color: "#059669",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "500",
    },
    portfolioStats: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "16px",
      borderTop: "1px solid #f3f4f6",
    },
    portfolioStat: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "#9ca3af",
      fontSize: "13px",
    },
    reviewCard: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      border: "1px solid #e5e7eb",
    },
    reviewHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    reviewClient: {
      display: "flex",
      gap: "14px",
    },
    reviewAvatar: {
      width: "50px",
      height: "50px",
      borderRadius: "12px",
      objectFit: "cover",
    },
    reviewClientName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "2px",
    },
    reviewClientInfo: {
      fontSize: "13px",
      color: "#6b7280",
    },
    reviewMeta: {
      textAlign: "right",
    },
    reviewProject: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "4px",
    },
    reviewBudget: {
      fontSize: "13px",
      color: "#10b981",
      fontWeight: "600",
    },
    reviewText: {
      fontSize: "15px",
      color: "#475569",
      lineHeight: "1.7",
      marginBottom: "12px",
    },
    reviewDate: {
      fontSize: "13px",
      color: "#9ca3af",
    },
    experienceItem: {
      display: "flex",
      gap: "20px",
      paddingBottom: "28px",
      marginBottom: "28px",
      borderBottom: "1px solid #e5e7eb",
    },
    experienceIcon: {
      width: "48px",
      height: "48px",
      backgroundColor: "#ecfdf5",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#10b981",
      flexShrink: 0,
    },
    experienceTitle: {
      fontSize: "17px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "4px",
    },
    experienceCompany: {
      fontSize: "15px",
      color: "#10b981",
      fontWeight: "500",
      marginBottom: "4px",
    },
    experiencePeriod: {
      fontSize: "13px",
      color: "#9ca3af",
      marginBottom: "8px",
    },
    experienceDesc: {
      fontSize: "14px",
      color: "#6b7280",
      lineHeight: "1.6",
    },
    certItem: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px",
      backgroundColor: "#f9fafb",
      borderRadius: "12px",
      marginBottom: "12px",
    },
    certIcon: {
      width: "44px",
      height: "44px",
      backgroundColor: "#fef3c7",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#d97706",
    },
    certName: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "2px",
    },
    certIssuer: {
      fontSize: "13px",
      color: "#6b7280",
    },
    contactModal: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      padding: "40px",
      maxWidth: "500px",
      width: "100%",
      boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    modalTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#1f2937",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      color: "#9ca3af",
      cursor: "pointer",
    },
    formGroup: {
      marginBottom: "20px",
    },
    formLabel: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "8px",
    },
    formInput: {
      width: "100%",
      padding: "14px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "15px",
      transition: "all 0.2s ease",
      outline: "none",
      boxSizing: "border-box",
    },
    formTextarea: {
      width: "100%",
      padding: "14px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      fontSize: "15px",
      minHeight: "120px",
      resize: "vertical",
      outline: "none",
      boxSizing: "border-box",
    },
    availabilityBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#dcfce7",
      color: "#166534",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
    },
    responsiveHide: {
      display: "block",
    },
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? "#f59e0b" : i - 0.5 <= rating ? "url(#half)" : "#e5e7eb"}
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    return stars;
  };

  const toggleLike = (projectId) => {
    setLikedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getSkillColor = (category) => {
    const colors = {
      Frontend: { bg: "#dbeafe", color: "#1d4ed8" },
      Backend: { bg: "#dcfce7", color: "#166534" },
      Database: { bg: "#fef3c7", color: "#92400e" },
      Cloud: { bg: "#e0e7ff", color: "#4338ca" },
      DevOps: { bg: "#fce7f3", color: "#9d174d" },
      API: { bg: "#ccfbf1", color: "#0f766e" },
      Design: { bg: "#fae8ff", color: "#86198f" },
      Language: { bg: "#f3e8ff", color: "#7c3aed" },
    };
    return colors[category] || { bg: "#f3f4f6", color: "#374151" };
  };

  return (
    <div style={styles.container}>
      {/* Cover Section */}
      <div style={styles.coverSection}>
        <div style={styles.coverOverlay}></div>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.mainCard}>
          {/* Profile Header */}
          <div style={styles.profileHeader}>
            <div style={styles.avatarContainer}>
              <img src={freelancer.avatar} alt={freelancer.name} style={styles.avatar} />
              <div style={styles.onlineBadge}></div>
              {freelancer.isVerified && (
                <div style={styles.verifiedBadge}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
              )}
            </div>

            <div style={styles.profileInfo}>
              <div style={styles.nameRow}>
                <h1 style={styles.name}>{freelancer.name}</h1>
                {freelancer.isTopRated && (
                  <span style={styles.topRatedBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Top Rated
                  </span>
                )}
              </div>
              <p style={styles.title}>{freelancer.title}</p>
              <p style={styles.tagline}>"{freelancer.tagline}"</p>

              <div style={styles.metaRow}>
                <div style={styles.ratingContainer}>
                  <div style={styles.ratingStars}>{renderStars(freelancer.rating)}</div>
                  <span style={styles.ratingText}>{freelancer.rating}</span>
                  <span style={styles.reviewCount}>({freelancer.totalReviews} reviews)</span>
                </div>
                <div style={styles.metaItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {freelancer.location}
                </div>
                <div style={styles.availabilityBadge}>
                  <span style={{ width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%" }}></span>
                  Available for hire
                </div>
              </div>
            </div>

            <div style={styles.profileActions}>
              <button
                style={styles.primaryButton}
                onClick={() => setShowContactModal(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Hire Me - ₹{freelancer.hourlyRate}/hr
              </button>
              <button
                style={styles.followButton}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFollowing ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div style={styles.statsSection}>
            <div style={styles.statItem}>
              <div style={{ ...styles.statValue, color: "#10b981" }}>{freelancer.completedJobs}</div>
              <div style={styles.statLabel}>Jobs Completed</div>
            </div>
            <div style={styles.statItem}>
              <div style={{ ...styles.statValue, color: "#3b82f6" }}>{freelancer.successRate}%</div>
              <div style={styles.statLabel}>Success Rate</div>
            </div>
            <div style={styles.statItem}>
              <div style={{ ...styles.statValue, color: "#059669" }}>{freelancer.totalEarnings}</div>
              <div style={styles.statLabel}>Total Earnings</div>
            </div>
            
          </div>

          {/* Content Section */}
          <div style={styles.contentSection}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
              {/* Quick Info */}
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  Quick Info
                </h3>
                <ul style={styles.infoList}>
                  <li style={styles.infoItem}>
                    <span style={styles.infoIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>Member Since</div>
                      <div style={styles.infoValue}>{freelancer.memberSince}</div>
                    </div>
                  </li>
                  <li style={styles.infoItem}>
                    <span style={styles.infoIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </span>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>Timezone</div>
                      <div style={styles.infoValue}>{freelancer.timezone}</div>
                    </div>
                  </li>
                  <li style={styles.infoItem}>
                    <span style={styles.infoIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    </span>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>Last Active</div>
                      <div style={{ ...styles.infoValue, color: "#10b981" }}>{freelancer.lastActive}</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Languages */}
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Languages
                </h3>
                {freelancer.languages.map((lang, index) => (
                  <div key={index} style={styles.languageItem}>{lang}</div>
                ))}
              </div>

              {/* Skills */}
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  Skills
                </h3>
                <div style={styles.skillsGrid}>
                  {freelancer.skills.map((skill, index) => {
                    const colors = getSkillColor(skill.category);
                    return (
                      <span
                        key={index}
                        style={{
                          ...styles.skillTag,
                          backgroundColor: hoveredSkill === index ? colors.color : colors.bg,
                          color: hoveredSkill === index ? "#ffffff" : colors.color,
                        }}
                        onMouseEnter={() => setHoveredSkill(index)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Social Links */}
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Connect
                </h3>
                <div style={styles.socialLinks}>
                  <a href="#" style={styles.socialLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    {freelancer.socialLinks.github}
                  </a>
                  <a href="#" style={styles.socialLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    {freelancer.socialLinks.linkedin}
                  </a>
                  <a href="#" style={styles.socialLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1da1f2">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                    {freelancer.socialLinks.twitter}
                  </a>
                  <a href="#" style={styles.socialLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    {freelancer.socialLinks.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
              {/* Tabs */}
              <div style={styles.tabsContainer}>
                {["portfolio", "reviews", "experience", "about"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      ...styles.tab,
                      ...(activeTab === tab ? styles.activeTab : {}),
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && <span style={styles.tabIndicator}></span>}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "about" && (
                <div>
                  <p style={styles.aboutText}>{freelancer.about}</p>
                </div>
              )}

              {activeTab === "portfolio" && (
                <div style={styles.portfolioGrid}>
                  {freelancer.portfolio.map((project) => (
                    <div
                      key={project.id}
                      style={{
                        ...styles.portfolioCard,
                        transform: hoveredProject === project.id ? "translateY(-8px)" : "none",
                        boxShadow: hoveredProject === project.id ? "0 20px 40px rgba(0,0,0,0.12)" : styles.portfolioCard.boxShadow,
                      }}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <img src={project.image} alt={project.title} style={styles.portfolioImage} />
                      <div style={styles.portfolioContent}>
                        <h3 style={styles.portfolioTitle}>{project.title}</h3>
                        <p style={styles.portfolioDesc}>{project.description}</p>
                        <div style={styles.portfolioTags}>
                          {project.tags.map((tag, idx) => (
                            <span key={idx} style={styles.portfolioTag}>{tag}</span>
                          ))}
                        </div>
                        <div style={styles.portfolioStats}>
                          <button
                            onClick={() => toggleLike(project.id)}
                            style={{
                              ...styles.portfolioStat,
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: likedProjects.includes(project.id) ? "#ef4444" : "#9ca3af",
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={likedProjects.includes(project.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {project.likes + (likedProjects.includes(project.id) ? 1 : 0)}
                          </button>
                          <span style={styles.portfolioStat}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {project.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  {freelancer.reviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewClient}>
                          <img src={review.avatar} alt={review.client} style={styles.reviewAvatar} />
                          <div>
                            <div style={styles.reviewClientName}>{review.client}</div>
                            <div style={styles.reviewClientInfo}>{review.company} • {review.country}</div>
                            <div style={{ display: "flex", gap: "2px", marginTop: "6px" }}>{renderStars(review.rating)}</div>
                          </div>
                        </div>
                        <div style={styles.reviewMeta}>
                          <div style={styles.reviewProject}>{review.project}</div>
                          <div style={styles.reviewBudget}>{review.budget}</div>
                        </div>
                      </div>
                      <p style={styles.reviewText}>
                        {expandedReview === review.id || review.review.length <= 200
                          ? review.review
                          : `${review.review.substring(0, 200)}...`}
                        {review.review.length > 200 && (
                          <button
                            onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#10b981",
                              cursor: "pointer",
                              fontWeight: "600",
                              marginLeft: "4px",
                            }}
                          >
                            {expandedReview === review.id ? "Show less" : "Read more"}
                          </button>
                        )}
                      </p>
                      <div style={styles.reviewDate}>{review.date}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "experience" && (
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "24px" }}>Work Experience</h3>
                  {freelancer.experience.map((exp, index) => (
                    <div key={index} style={styles.experienceItem}>
                      <div style={styles.experienceIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <div>
                        <div style={styles.experienceTitle}>{exp.title}</div>
                        <div style={styles.experienceCompany}>{exp.company}</div>
                        <div style={styles.experiencePeriod}>{exp.period}</div>
                        <div style={styles.experienceDesc}>{exp.description}</div>
                      </div>
                    </div>
                  ))}

                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: "40px 0 24px" }}>Education</h3>
                  {freelancer.education.map((edu, index) => (
                    <div key={index} style={styles.experienceItem}>
                      <div style={{ ...styles.experienceIcon, backgroundColor: "#e0e7ff", color: "#4338ca" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                        </svg>
                      </div>
                      <div>
                        <div style={styles.experienceTitle}>{edu.degree}</div>
                        <div style={styles.experienceCompany}>{edu.institution}</div>
                        <div style={styles.experiencePeriod}>{edu.year}</div>
                      </div>
                    </div>
                  ))}

                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: "40px 0 24px" }}>Certifications</h3>
                  {freelancer.certifications.map((cert, index) => (
                    <div key={index} style={styles.certItem}>
                      <div style={styles.certIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                      </div>
                      <div>
                        <div style={styles.certName}>{cert.name}</div>
                        <div style={styles.certIssuer}>{cert.issuer} • {cert.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div style={styles.contactModal} onClick={() => setShowContactModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Contact {freelancer.name}</h2>
              <button style={styles.closeButton} onClick={() => setShowContactModal(false)}>
                &times;
              </button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Your Name</label>
              <input type="text" style={styles.formInput} placeholder="Enter your name" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Your Email</label>
              <input type="email" style={styles.formInput} placeholder="Enter your email" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Project Details</label>
              <textarea style={styles.formTextarea} placeholder="Describe your project requirements..."></textarea>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Budget (INR)</label>
              <input type="text" style={styles.formInput} placeholder="e.g., ₹50,000 - ₹1,00,000" />
            </div>
            <button style={{ ...styles.primaryButton, width: "100%", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send Message
            </button>
          </div>
        </div>
      )}

      {/* Footer spacing */}
      <div style={{ height: "60px" }}></div>
    </div>
  );
}
