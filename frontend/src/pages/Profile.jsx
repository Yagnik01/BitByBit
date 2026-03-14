"use client";
import { useState, useEffect, useCallback } from "react";

// ─── tiny auth helper ───────────────────────────────────────────────────────
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// ─── default empty profile (matches backend schema) ─────────────────────────
const EMPTY_PROFILE = {
  name: "", title: "", tagline: "", bio: "", avatar: "", coverImage: "",
  location: "", timezone: "", hourlyRate: 0, languages: [],
  skills: [], portfolio: [], experience: [],
  socialLinks: { github: "", linkedin: "", twitter: "", website: "" },
  completedJobs: 0, successRate: 0, totalEarnings: "₹0",
  isVerified: false, isTopRated: false, availableForHire: true,
  createdAt: new Date().toISOString(),
};

export default function Profile() {
  // ── profile state ──────────────────────────────────────────────────────────
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState("");
  const isOwner = !!localStorage.getItem("token"); // simplistic: if logged-in you own it

  // ── UI state (same as before) ─────────────────────────────────────────────
  const [activeTab, setActiveTab]           = useState("portfolio");
  const [isFollowing, setIsFollowing]       = useState(false);
  const [hoveredSkill, setHoveredSkill]     = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [likedProjects, setLikedProjects]   = useState([]);

  // ── edit-profile modal ────────────────────────────────────────────────────
  const [showEditModal, setShowEditModal]   = useState(false);
  const [editForm, setEditForm]             = useState({});
  const [editLoading, setEditLoading]       = useState(false);
  const [editError, setEditError]           = useState("");

  // ── add skill ─────────────────────────────────────────────────────────────
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillForm, setSkillForm]           = useState({ name: "", level: 80, category: "General" });
  const [skillLoading, setSkillLoading]     = useState(false);
  const [skillError, setSkillError]         = useState("");

  // ── add portfolio project ─────────────────────────────────────────────────
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioForm, setPortfolioForm]   = useState({ title: "", description: "", link: "", tags: "", image: "" });
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState("");

  // ── add experience ────────────────────────────────────────────────────────
  const [showExpModal, setShowExpModal]     = useState(false);
  const [expForm, setExpForm]               = useState({ title: "", company: "", period: "", description: "" });
  const [expLoading, setExpLoading]         = useState(false);
  const [expError, setExpError]             = useState("");

  // ─────────────────────────────────────────────────────────────────────────
  // FETCH PROFILE
  // ─────────────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/users/profile", { headers: authHeaders() });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to load profile");
      const data = await res.json();
      setProfile({ ...EMPTY_PROFILE, ...data });
    } catch (err) {
      setApiError(err.message);
      setProfile(EMPTY_PROFILE); // show empty UI rather than crash
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ─────────────────────────────────────────────────────────────────────────
  // EDIT PROFILE
  // ─────────────────────────────────────────────────────────────────────────
  const openEditModal = () => {
    setEditForm({
      name:             profile.name || "",
      title:            profile.title || "",
      tagline:          profile.tagline || "",
      bio:              profile.bio || "",
      avatar:           profile.avatar || "",
      location:         profile.location || "",
      timezone:         profile.timezone || "",
      hourlyRate:       profile.hourlyRate || 0,
      languages:        (profile.languages || []).join(", "),
      availableForHire: profile.availableForHire ?? true,
      "socialLinks.github":   profile.socialLinks?.github || "",
      "socialLinks.linkedin": profile.socialLinks?.linkedin || "",
      "socialLinks.twitter":  profile.socialLinks?.twitter || "",
      "socialLinks.website":  profile.socialLinks?.website || "",
    });
    setEditError("");
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      // Build payload – flatten socialLinks
      const payload = {
        name:             editForm.name,
        title:            editForm.title,
        tagline:          editForm.tagline,
        bio:              editForm.bio,
        avatar:           editForm.avatar,
        location:         editForm.location,
        timezone:         editForm.timezone,
        hourlyRate:       Number(editForm.hourlyRate),
        availableForHire: editForm.availableForHire,
        languages:        editForm.languages.split(",").map(l => l.trim()).filter(Boolean),
        socialLinks: {
          github:   editForm["socialLinks.github"],
          linkedin: editForm["socialLinks.linkedin"],
          twitter:  editForm["socialLinks.twitter"],
          website:  editForm["socialLinks.website"],
        },
      };
      const res = await fetch("/api/users/profile", {
        method: "PUT", headers: authHeaders(), body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Update failed");
      const updated = await res.json();
      setProfile(prev => ({ ...prev, ...updated }));
      setShowEditModal(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SKILLS
  // ─────────────────────────────────────────────────────────────────────────
  const handleAddSkill = async () => {
    if (!skillForm.name.trim()) { setSkillError("Skill name is required"); return; }
    setSkillLoading(true); setSkillError("");
    try {
      const res = await fetch("/api/users/skills", {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ name: skillForm.name.trim(), level: Number(skillForm.level), category: skillForm.category }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add skill");
      const skills = await res.json();
      setProfile(prev => ({ ...prev, skills }));
      setSkillForm({ name: "", level: 80, category: "General" });
      setShowSkillModal(false);
    } catch (err) {
      setSkillError(err.message);
    } finally {
      setSkillLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (!window.confirm("Remove this skill?")) return;
    try {
      const res = await fetch(`/api/users/skills/${skillId}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to remove skill");
      const skills = await res.json();
      setProfile(prev => ({ ...prev, skills }));
    } catch (err) {
      alert(err.message);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PORTFOLIO
  // ─────────────────────────────────────────────────────────────────────────
  const handleAddPortfolio = async () => {
    if (!portfolioForm.title.trim()) { setPortfolioError("Project title is required"); return; }
    setPortfolioLoading(true); setPortfolioError("");
    try {
      const res = await fetch("/api/users/portfolio", {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({
          title: portfolioForm.title.trim(),
          description: portfolioForm.description,
          link: portfolioForm.link,
          image: portfolioForm.image,
          tags: portfolioForm.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add project");
      const portfolio = await res.json();
      setProfile(prev => ({ ...prev, portfolio }));
      setPortfolioForm({ title: "", description: "", link: "", tags: "", image: "" });
      setShowPortfolioModal(false);
    } catch (err) {
      setPortfolioError(err.message);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const handleDeletePortfolio = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/users/portfolio/${projectId}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to delete");
      const portfolio = await res.json();
      setProfile(prev => ({ ...prev, portfolio }));
    } catch (err) {
      alert(err.message);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // EXPERIENCE
  // ─────────────────────────────────────────────────────────────────────────
  const handleAddExperience = async () => {
    if (!expForm.title.trim() || !expForm.company.trim()) { setExpError("Title and company are required"); return; }
    setExpLoading(true); setExpError("");
    try {
      const res = await fetch("/api/users/experience", {
        method: "POST", headers: authHeaders(), body: JSON.stringify(expForm),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to add experience");
      const experience = await res.json();
      setProfile(prev => ({ ...prev, experience }));
      setExpForm({ title: "", company: "", period: "", description: "" });
      setShowExpModal(false);
    } catch (err) {
      setExpError(err.message);
    } finally {
      setExpLoading(false);
    }
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm("Remove this experience?")) return;
    try {
      const res = await fetch(`/api/users/experience/${expId}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed to delete");
      const experience = await res.json();
      setProfile(prev => ({ ...prev, experience }));
    } catch (err) {
      alert(err.message);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  const toggleLike = (projectId) =>
    setLikedProjects(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg key={i} width="18" height="18" viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? "#f59e0b" : i - 0.5 <= rating ? "url(#half)" : "#e5e7eb"}>
          <defs><linearGradient id="half"><stop offset="50%" stopColor="#f59e0b"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }
    return stars;
  };

  const SKILL_COLORS = {
    Frontend:{ bg:"#dbeafe", color:"#1d4ed8" }, Backend:{ bg:"#dcfce7", color:"#166534" },
    Database:{ bg:"#fef3c7", color:"#92400e" }, Cloud:{ bg:"#e0e7ff", color:"#4338ca" },
    DevOps:  { bg:"#fce7f3", color:"#9d174d" }, API:{ bg:"#ccfbf1", color:"#0f766e" },
    Design:  { bg:"#fae8ff", color:"#86198f" }, Language:{ bg:"#f3e8ff", color:"#7c3aed" },
    General: { bg:"#f3f4f6", color:"#374151" },
  };
  const getSkillColor = (cat) => SKILL_COLORS[cat] || SKILL_COLORS.General;

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  // ─────────────────────────────────────────────────────────────────────────
  // LOADING / ERROR SCREENS
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"48px", height:"48px", border:"4px solid #e2e8f0", borderTopColor:"#10b981", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
        <p style={{ color:"#64748b", fontSize:"16px" }}>Loading profile…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // STYLES  (identical to original — not a single colour changed)
  // ─────────────────────────────────────────────────────────────────────────
  const styles = {
    container:{ minHeight:"100vh", backgroundColor:"#f8fafc", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" },
    coverSection:{ position:"relative", height:"320px", background:`linear-gradient(135deg,rgba(16,185,129,0.9) 0%,rgba(6,95,70,0.95) 100%)`, backgroundSize:"cover", backgroundPosition:"center" },
    coverOverlay:{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.3) 100%)" },
    profileCard:{ maxWidth:"1200px", margin:"-80px auto 0", padding:"0 24px", position:"relative", zIndex:10 },
    mainCard:{ backgroundColor:"#ffffff", borderRadius:"24px", boxShadow:"0 20px 60px rgba(0,0,0,0.1)", overflow:"hidden" },
    profileHeader:{ padding:"32px 40px", display:"flex", gap:"32px", alignItems:"flex-start", flexWrap:"wrap", borderBottom:"1px solid #e2e8f0" },
    avatarContainer:{ position:"relative", flexShrink:0 },
    avatar:{ width:"160px", height:"160px", borderRadius:"24px", objectFit:"cover", border:"4px solid #ffffff", boxShadow:"0 10px 40px rgba(0,0,0,0.15)" },
    onlineBadge:{ position:"absolute", bottom:"8px", right:"8px", width:"24px", height:"24px", backgroundColor:"#10b981", borderRadius:"50%", border:"4px solid #ffffff" },
    verifiedBadge:{ position:"absolute", top:"-8px", right:"-8px", backgroundColor:"#3b82f6", color:"#ffffff", borderRadius:"50%", width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center" },
    profileInfo:{ flex:1, minWidth:"280px" },
    nameRow:{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap", marginBottom:"8px" },
    name:{ fontSize:"32px", fontWeight:"700", color:"#0f172a", margin:0 },
    topRatedBadge:{ background:"linear-gradient(135deg,#f59e0b 0%,#d97706 100%)", color:"#ffffff", padding:"6px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:"600", display:"flex", alignItems:"center", gap:"6px" },
    title:{ fontSize:"18px", color:"#475569", margin:"0 0 12px 0", fontWeight:"500" },
    tagline:{ fontSize:"15px", color:"#64748b", margin:"0 0 16px 0", fontStyle:"italic" },
    metaRow:{ display:"flex", flexWrap:"wrap", gap:"20px", alignItems:"center" },
    metaItem:{ display:"flex", alignItems:"center", gap:"8px", color:"#64748b", fontSize:"14px" },
    ratingContainer:{ display:"flex", alignItems:"center", gap:"8px", backgroundColor:"#fef3c7", padding:"8px 16px", borderRadius:"12px" },
    ratingStars:{ display:"flex", gap:"2px" },
    ratingText:{ fontWeight:"700", color:"#92400e", fontSize:"16px" },
    reviewCount:{ color:"#a16207", fontSize:"14px" },
    profileActions:{ display:"flex", flexDirection:"column", gap:"12px", alignItems:"flex-end" },
    primaryButton:{ background:"linear-gradient(135deg,#10b981 0%,#059669 100%)", color:"#ffffff", border:"none", padding:"14px 32px", borderRadius:"12px", fontSize:"16px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", boxShadow:"0 8px 24px rgba(16,185,129,0.3)" },
    secondaryButton:{ backgroundColor:"#ffffff", color:"#10b981", border:"2px solid #10b981", padding:"12px 28px", borderRadius:"12px", fontSize:"15px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" },
    followButton:(following)=>({ backgroundColor:following?"#10b981":"#ffffff", color:following?"#ffffff":"#475569", border:following?"2px solid #10b981":"2px solid #e2e8f0", padding:"12px 28px", borderRadius:"12px", fontSize:"15px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" }),
    statsSection:{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"1px", backgroundColor:"#e2e8f0", borderBottom:"1px solid #e2e8f0" },
    statItem:{ backgroundColor:"#ffffff", padding:"24px 16px", textAlign:"center" },
    statValue:{ fontSize:"28px", fontWeight:"700", color:"#0f172a", marginBottom:"4px" },
    statLabel:{ fontSize:"13px", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.5px" },
    contentSection:{ display:"grid", gridTemplateColumns:"340px 1fr", gap:0 },
    sidebar:{ borderRight:"1px solid #e2e8f0", padding:"32px", backgroundColor:"#fafafa" },
    sidebarSection:{ marginBottom:"32px" },
    sidebarTitle:{ fontSize:"14px", fontWeight:"700", color:"#374151", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" },
    infoList:{ listStyle:"none", padding:0, margin:0 },
    infoItem:{ display:"flex", alignItems:"flex-start", gap:"12px", padding:"12px 0", borderBottom:"1px solid #e5e7eb" },
    infoIcon:{ color:"#10b981", marginTop:"2px" },
    infoContent:{ flex:1 },
    infoLabel:{ fontSize:"12px", color:"#9ca3af", marginBottom:"2px" },
    infoValue:{ fontSize:"14px", color:"#1f2937", fontWeight:"500" },
    skillsGrid:{ display:"flex", flexWrap:"wrap", gap:"8px" },
    skillTag:{ padding:"8px 14px", borderRadius:"20px", fontSize:"13px", fontWeight:"500", cursor:"pointer" },
    languageItem:{ padding:"10px 0", borderBottom:"1px solid #e5e7eb", fontSize:"14px", color:"#374151" },
    socialLinks:{ display:"flex", flexDirection:"column", gap:"10px" },
    socialLink:{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", backgroundColor:"#ffffff", borderRadius:"10px", color:"#475569", textDecoration:"none", fontSize:"14px", border:"1px solid #e5e7eb" },
    mainContent:{ padding:"32px 40px" },
    tabsContainer:{ display:"flex", gap:"8px", borderBottom:"2px solid #e2e8f0", marginBottom:"32px" },
    tab:{ padding:"14px 24px", border:"none", backgroundColor:"transparent", fontSize:"15px", fontWeight:"600", color:"#64748b", cursor:"pointer", position:"relative" },
    activeTab:{ color:"#10b981" },
    tabIndicator:{ position:"absolute", bottom:"-2px", left:0, right:0, height:"3px", backgroundColor:"#10b981", borderRadius:"3px 3px 0 0" },
    aboutText:{ fontSize:"15px", lineHeight:"1.8", color:"#475569", whiteSpace:"pre-line" },
    portfolioGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"24px" },
    portfolioCard:{ backgroundColor:"#ffffff", borderRadius:"16px", overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.06)", border:"1px solid #e5e7eb", cursor:"pointer" },
    portfolioImage:{ width:"100%", height:"180px", objectFit:"cover" },
    portfolioContent:{ padding:"20px" },
    portfolioTitle:{ fontSize:"17px", fontWeight:"600", color:"#1f2937", marginBottom:"8px" },
    portfolioDesc:{ fontSize:"14px", color:"#6b7280", lineHeight:"1.6", marginBottom:"16px" },
    portfolioTags:{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px" },
    portfolioTag:{ backgroundColor:"#ecfdf5", color:"#059669", padding:"4px 10px", borderRadius:"6px", fontSize:"12px", fontWeight:"500" },
    portfolioStats:{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"16px", borderTop:"1px solid #f3f4f6" },
    portfolioStat:{ display:"flex", alignItems:"center", gap:"6px", color:"#9ca3af", fontSize:"13px" },
    reviewCard:{ backgroundColor:"#ffffff", borderRadius:"16px", padding:"24px", marginBottom:"20px", boxShadow:"0 2px 12px rgba(0,0,0,0.04)", border:"1px solid #e5e7eb" },
    reviewHeader:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" },
    reviewClient:{ display:"flex", gap:"14px" },
    reviewAvatar:{ width:"50px", height:"50px", borderRadius:"12px", objectFit:"cover" },
    reviewClientName:{ fontSize:"16px", fontWeight:"600", color:"#1f2937", marginBottom:"2px" },
    reviewClientInfo:{ fontSize:"13px", color:"#6b7280" },
    reviewMeta:{ textAlign:"right" },
    reviewProject:{ fontSize:"14px", fontWeight:"500", color:"#374151", marginBottom:"4px" },
    reviewBudget:{ fontSize:"13px", color:"#10b981", fontWeight:"600" },
    reviewText:{ fontSize:"15px", color:"#475569", lineHeight:"1.7", marginBottom:"12px" },
    reviewDate:{ fontSize:"13px", color:"#9ca3af" },
    experienceItem:{ display:"flex", gap:"20px", paddingBottom:"28px", marginBottom:"28px", borderBottom:"1px solid #e5e7eb" },
    experienceIcon:{ width:"48px", height:"48px", backgroundColor:"#ecfdf5", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", color:"#10b981", flexShrink:0 },
    experienceTitle:{ fontSize:"17px", fontWeight:"600", color:"#1f2937", marginBottom:"4px" },
    experienceCompany:{ fontSize:"15px", color:"#10b981", fontWeight:"500", marginBottom:"4px" },
    experiencePeriod:{ fontSize:"13px", color:"#9ca3af", marginBottom:"8px" },
    experienceDesc:{ fontSize:"14px", color:"#6b7280", lineHeight:"1.6" },
    contactModal:{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"20px" },
    modalContent:{ backgroundColor:"#ffffff", borderRadius:"24px", padding:"40px", maxWidth:"500px", width:"100%", boxShadow:"0 25px 80px rgba(0,0,0,0.2)", maxHeight:"90vh", overflowY:"auto" },
    modalHeader:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" },
    modalTitle:{ fontSize:"24px", fontWeight:"700", color:"#1f2937" },
    closeButton:{ background:"none", border:"none", fontSize:"24px", color:"#9ca3af", cursor:"pointer" },
    formGroup:{ marginBottom:"20px" },
    formLabel:{ display:"block", fontSize:"14px", fontWeight:"600", color:"#374151", marginBottom:"8px" },
    formInput:{ width:"100%", padding:"14px 16px", border:"2px solid #e5e7eb", borderRadius:"12px", fontSize:"15px", outline:"none", boxSizing:"border-box" },
    formTextarea:{ width:"100%", padding:"14px 16px", border:"2px solid #e5e7eb", borderRadius:"12px", fontSize:"15px", minHeight:"120px", resize:"vertical", outline:"none", boxSizing:"border-box" },
    availabilityBadge:{ display:"inline-flex", alignItems:"center", gap:"8px", backgroundColor:"#dcfce7", color:"#166534", padding:"8px 16px", borderRadius:"20px", fontSize:"13px", fontWeight:"600" },
    addBtn:{ background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", border:"none", padding:"8px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" },
    dangerBtn:{ background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"12px", padding:"4px 8px", borderRadius:"6px" },
    errorText:{ color:"#ef4444", fontSize:"13px", marginTop:"8px" },
    saveBtn:{ background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", border:"none", padding:"14px 32px", borderRadius:"12px", fontSize:"15px", fontWeight:"600", cursor:"pointer", width:"100%" },
  };

  const p = profile; // shorthand

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>

      {/* ── API error banner ── */}
      {apiError && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#b91c1c", padding:"12px 24px", fontSize:"14px", textAlign:"center" }}>
          ⚠ {apiError} — showing empty profile. Make sure you are logged in.
        </div>
      )}

      {/* ── Cover ── */}
      <div style={styles.coverSection}><div style={styles.coverOverlay}/></div>

      {/* ── Profile card ── */}
      <div style={styles.profileCard}>
        <div style={styles.mainCard}>

          {/* ── Header ── */}
          <div style={styles.profileHeader}>
            <div style={styles.avatarContainer}>
              <img
                src={p.avatar || "https://www.freelancer.com/img/unknown.png?image-optimizer=force&format=webply&width=120"}
                alt={p.name}
                style={styles.avatar}
              />
              <div style={styles.onlineBadge}/>
              {p.isVerified && (
                <div style={styles.verifiedBadge}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                </div>
              )}
            </div>

            <div style={styles.profileInfo}>
              <div style={styles.nameRow}>
                <h1 style={styles.name}>{p.name || "Your Name"}</h1>
                {p.isTopRated && (
                  <span style={styles.topRatedBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Top Rated
                  </span>
                )}
              </div>
              <p style={styles.title}>{p.title || "Your professional title"}</p>
              {p.tagline && <p style={styles.tagline}>"{p.tagline}"</p>}

              <div style={styles.metaRow}>
                <div style={styles.ratingContainer}>
                  <div style={styles.ratingStars}>{renderStars(4.9)}</div>
                  <span style={styles.ratingText}>4.9</span>
                  <span style={styles.reviewCount}>(0 reviews)</span>
                </div>
                {p.location && (
                  <div style={styles.metaItem}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {p.location}
                  </div>
                )}
                {p.availableForHire && (
                  <div style={styles.availabilityBadge}>
                    <span style={{ width:"8px", height:"8px", backgroundColor:"#22c55e", borderRadius:"50%" }}/>
                    Available for hire
                  </div>
                )}
              </div>
            </div>

            <div style={styles.profileActions}>
              {isOwner ? (
                <button style={styles.primaryButton} onClick={openEditModal}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Profile
                </button>
              ) : (
                <button style={styles.primaryButton} onClick={() => setShowContactModal(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Hire Me — ₹{p.hourlyRate}/hr
                </button>
              )}
              <button style={styles.followButton(isFollowing)} onClick={() => setIsFollowing(!isFollowing)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFollowing?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div style={styles.statsSection}>
            <div style={styles.statItem}><div style={{ ...styles.statValue, color:"#10b981" }}>{p.completedJobs}</div><div style={styles.statLabel}>Jobs Completed</div></div>
            <div style={styles.statItem}><div style={{ ...styles.statValue, color:"#3b82f6" }}>{p.successRate}%</div><div style={styles.statLabel}>Success Rate</div></div>
            <div style={styles.statItem}><div style={{ ...styles.statValue, color:"#059669" }}>{p.totalEarnings}</div><div style={styles.statLabel}>Total Earnings</div></div>
          </div>

          {/* ── Two-column layout ── */}
          <div style={styles.contentSection}>

            {/* ── LEFT SIDEBAR ── */}
            <div style={styles.sidebar}>

              {/* Quick Info */}
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  Quick Info
                </h3>
                <ul style={styles.infoList}>
                  <li style={styles.infoItem}>
                    <span style={styles.infoIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                    <div style={styles.infoContent}><div style={styles.infoLabel}>Member Since</div><div style={styles.infoValue}>{memberSince}</div></div>
                  </li>
                  {p.timezone && (
                    <li style={styles.infoItem}>
                      <span style={styles.infoIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                      <div style={styles.infoContent}><div style={styles.infoLabel}>Timezone</div><div style={styles.infoValue}>{p.timezone}</div></div>
                    </li>
                  )}
                  <li style={styles.infoItem}>
                    <span style={styles.infoIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></span>
                    <div style={styles.infoContent}><div style={styles.infoLabel}>Last Active</div><div style={{ ...styles.infoValue, color:"#10b981" }}>Online now</div></div>
                  </li>
                </ul>
              </div>

              {/* Languages */}
              {(p.languages || []).length > 0 && (
                <div style={styles.sidebarSection}>
                  <h3 style={styles.sidebarTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    Languages
                  </h3>
                  {p.languages.map((lang, i) => <div key={i} style={styles.languageItem}>{lang}</div>)}
                </div>
              )}

              {/* Skills */}
              <div style={styles.sidebarSection}>
                <h3 style={{ ...styles.sidebarTitle, justifyContent:"space-between" }}>
                  <span style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    Skills
                  </span>
                  {isOwner && (
                    <button style={styles.addBtn} onClick={() => { setSkillError(""); setShowSkillModal(true); }}>+ Add</button>
                  )}
                </h3>
                <div style={styles.skillsGrid}>
                  {(p.skills || []).length === 0 && <p style={{ color:"#9ca3af", fontSize:"13px" }}>No skills added yet.</p>}
                  {(p.skills || []).map((skill, i) => {
                    const colors = getSkillColor(skill.category);
                    return (
                      <span key={skill._id || i} style={{ ...styles.skillTag, backgroundColor: hoveredSkill === i ? colors.color : colors.bg, color: hoveredSkill === i ? "#fff" : colors.color, position:"relative", display:"inline-flex", alignItems:"center", gap:"6px" }}
                        onMouseEnter={() => setHoveredSkill(i)} onMouseLeave={() => setHoveredSkill(null)}>
                        {skill.name}
                        {isOwner && (
                          <button onClick={() => handleRemoveSkill(skill._id)} style={{ background:"none", border:"none", color:"inherit", cursor:"pointer", padding:"0", lineHeight:1, fontSize:"14px", opacity:0.7 }} title="Remove">×</button>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Social Links */}
              {(p.socialLinks?.github || p.socialLinks?.linkedin || p.socialLinks?.twitter || p.socialLinks?.website) && (
                <div style={styles.sidebarSection}>
                  <h3 style={styles.sidebarTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    Connect
                  </h3>
                  <div style={styles.socialLinks}>
                    {p.socialLinks?.github && (
                      <a href={`https://${p.socialLinks.github}`} target="_blank" rel="noreferrer" style={styles.socialLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1f2937"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        {p.socialLinks.github}
                      </a>
                    )}
                    {p.socialLinks?.linkedin && (
                      <a href={`https://${p.socialLinks.linkedin}`} target="_blank" rel="noreferrer" style={styles.socialLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        {p.socialLinks.linkedin}
                      </a>
                    )}
                    {p.socialLinks?.twitter && (
                      <a href={`https://twitter.com/${p.socialLinks.twitter}`} target="_blank" rel="noreferrer" style={styles.socialLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1da1f2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                        {p.socialLinks.twitter}
                      </a>
                    )}
                    {p.socialLinks?.website && (
                      <a href={`https://${p.socialLinks.website}`} target="_blank" rel="noreferrer" style={styles.socialLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        {p.socialLinks.website}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={styles.mainContent}>
              {/* Tabs */}
              <div style={styles.tabsContainer}>
                {["portfolio","experience","about"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ ...styles.tab, ...(activeTab===tab ? styles.activeTab : {}) }}>
                    {tab.charAt(0).toUpperCase()+tab.slice(1)}
                    {activeTab===tab && <span style={styles.tabIndicator}/>}
                  </button>
                ))}
              </div>

              {/* About */}
              {activeTab === "about" && (
                <div>
                  {p.bio ? <p style={styles.aboutText}>{p.bio}</p>
                    : <p style={{ color:"#9ca3af", fontSize:"15px" }}>No bio added yet.{isOwner && " Click Edit Profile to add one."}</p>}
                </div>
              )}

              {/* Portfolio */}
              {activeTab === "portfolio" && (
                <div>
                  {isOwner && (
                    <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"20px" }}>
                      <button style={styles.addBtn} onClick={() => { setPortfolioError(""); setShowPortfolioModal(true); }}>
                        + Add Project
                      </button>
                    </div>
                  )}
                  {(p.portfolio || []).length === 0 ? (
                    <div style={{ textAlign:"center", padding:"60px 20px", color:"#9ca3af" }}>
                      <div style={{ fontSize:"48px", marginBottom:"12px" }}>🗂</div>
                      <p style={{ fontSize:"16px", marginBottom:"8px" }}>No portfolio projects yet.</p>
                      {isOwner && <p style={{ fontSize:"13px" }}>Click "+ Add Project" to showcase your work.</p>}
                    </div>
                  ) : (
                    <div style={styles.portfolioGrid}>
                      {(p.portfolio || []).map((project) => (
                        <div key={project._id}
                          style={{ ...styles.portfolioCard, transform: hoveredProject===project._id ? "translateY(-8px)" : "none", boxShadow: hoveredProject===project._id ? "0 20px 40px rgba(0,0,0,0.12)" : "0 4px 16px rgba(0,0,0,0.06)" }}
                          onMouseEnter={() => setHoveredProject(project._id)}
                          onMouseLeave={() => setHoveredProject(null)}>
                          {project.image ? (
                            <img src={project.image} alt={project.title} style={styles.portfolioImage}/>
                          ) : (
                            <div style={{ ...styles.portfolioImage, background:"linear-gradient(135deg,#ecfdf5,#d1fae5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"40px" }}>💼</div>
                          )}
                          <div style={styles.portfolioContent}>
                            <h3 style={styles.portfolioTitle}>{project.title}</h3>
                            <p style={styles.portfolioDesc}>{project.description}</p>
                            {(project.tags||[]).length > 0 && (
                              <div style={styles.portfolioTags}>
                                {project.tags.map((tag,i) => <span key={i} style={styles.portfolioTag}>{tag}</span>)}
                              </div>
                            )}
                            <div style={styles.portfolioStats}>
                              <button onClick={() => toggleLike(project._id)}
                                style={{ ...styles.portfolioStat, border:"none", background:"none", cursor:"pointer", color: likedProjects.includes(project._id) ? "#ef4444" : "#9ca3af" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill={likedProjects.includes(project._id)?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                Like
                              </button>
                              <div style={{ display:"flex", gap:"8px" }}>
                                {project.link && (
                                  <a href={project.link} target="_blank" rel="noreferrer"
                                    style={{ ...styles.portfolioStat, color:"#10b981", textDecoration:"none", fontSize:"13px" }}>
                                    🔗 View
                                  </a>
                                )}
                                {isOwner && (
                                  <button onClick={() => handleDeletePortfolio(project._id)} style={styles.dangerBtn}>🗑 Delete</button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Experience */}
              {activeTab === "experience" && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
                    <h3 style={{ fontSize:"18px", fontWeight:"600", color:"#1f2937", margin:0 }}>Work Experience</h3>
                    {isOwner && (
                      <button style={styles.addBtn} onClick={() => { setExpError(""); setShowExpModal(true); }}>+ Add</button>
                    )}
                  </div>
                  {(p.experience||[]).length === 0 ? (
                    <p style={{ color:"#9ca3af", fontSize:"14px" }}>No experience added yet.{isOwner && " Click '+ Add' to add your work history."}</p>
                  ) : (
                    (p.experience||[]).map((exp, i) => (
                      <div key={exp._id||i} style={styles.experienceItem}>
                        <div style={styles.experienceIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={styles.experienceTitle}>{exp.title}</div>
                          <div style={styles.experienceCompany}>{exp.company}</div>
                          {exp.period && <div style={styles.experiencePeriod}>{exp.period}</div>}
                          {exp.description && <div style={styles.experienceDesc}>{exp.description}</div>}
                        </div>
                        {isOwner && (
                          <button onClick={() => handleDeleteExperience(exp._id)} style={styles.dangerBtn}>🗑</button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── MODALS ───────────── */}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={styles.contactModal} onClick={() => setShowEditModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Profile</h2>
              <button style={styles.closeButton} onClick={() => setShowEditModal(false)}>×</button>
            </div>

            {[
              { label:"Full Name",      key:"name",      type:"input" },
              { label:"Professional Title", key:"title", type:"input" },
              { label:"Tagline",        key:"tagline",   type:"input" },
              { label:"Bio",            key:"bio",       type:"textarea" },
              { label:"Avatar URL",     key:"avatar",    type:"input" },
              { label:"Location",       key:"location",  type:"input" },
              { label:"Timezone",       key:"timezone",  type:"input" },
              { label:"Hourly Rate (₹)",key:"hourlyRate",type:"input" },
              { label:"Languages (comma-separated)", key:"languages", type:"input" },
              { label:"GitHub",         key:"socialLinks.github",   type:"input" },
              { label:"LinkedIn",       key:"socialLinks.linkedin", type:"input" },
              { label:"Twitter handle", key:"socialLinks.twitter",  type:"input" },
              { label:"Website",        key:"socialLinks.website",  type:"input" },
            ].map(({ label, key, type }) => (
              <div key={key} style={styles.formGroup}>
                <label style={styles.formLabel}>{label}</label>
                {type === "textarea" ? (
                  <textarea style={styles.formTextarea} value={editForm[key]||""} onChange={e => setEditForm(f=>({...f,[key]:e.target.value}))}/>
                ) : (
                  <input style={styles.formInput} value={editForm[key]||""} onChange={e => setEditForm(f=>({...f,[key]:e.target.value}))}/>
                )}
              </div>
            ))}

            <div style={styles.formGroup}>
              <label style={{ ...styles.formLabel, display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }}>
                <input type="checkbox" checked={!!editForm.availableForHire} onChange={e => setEditForm(f=>({...f,availableForHire:e.target.checked}))}/>
                Available for Hire
              </label>
            </div>

            {editError && <p style={styles.errorText}>⚠ {editError}</p>}

            <button style={{ ...styles.saveBtn, opacity: editLoading ? 0.7 : 1 }} onClick={handleEditSave} disabled={editLoading}>
              {editLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div style={styles.contactModal} onClick={() => setShowSkillModal(false)}>
          <div style={{ ...styles.modalContent, maxWidth:"400px" }} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add Skill</h2>
              <button style={styles.closeButton} onClick={() => setShowSkillModal(false)}>×</button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Skill Name *</label>
              <input style={styles.formInput} placeholder="e.g. React.js" value={skillForm.name} onChange={e => setSkillForm(f=>({...f,name:e.target.value}))}/>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Category</label>
              <select style={styles.formInput} value={skillForm.category} onChange={e => setSkillForm(f=>({...f,category:e.target.value}))}>
                {["Frontend","Backend","Database","Cloud","DevOps","API","Design","Language","General"].map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Proficiency Level: {skillForm.level}%</label>
              <input type="range" min="1" max="100" value={skillForm.level} onChange={e => setSkillForm(f=>({...f,level:Number(e.target.value)}))} style={{ width:"100%" }}/>
            </div>
            {skillError && <p style={styles.errorText}>⚠ {skillError}</p>}
            <button style={{ ...styles.saveBtn, opacity: skillLoading ? 0.7 : 1 }} onClick={handleAddSkill} disabled={skillLoading}>
              {skillLoading ? "Adding…" : "Add Skill"}
            </button>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {showPortfolioModal && (
        <div style={styles.contactModal} onClick={() => setShowPortfolioModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add Portfolio Project</h2>
              <button style={styles.closeButton} onClick={() => setShowPortfolioModal(false)}>×</button>
            </div>
            {[
              { label:"Project Title *", key:"title",       placeholder:"e.g. E-commerce Platform" },
              { label:"Description",     key:"description", placeholder:"What did you build?" },
              { label:"Project Link",    key:"link",        placeholder:"https://github.com/..." },
              { label:"Tags (comma-separated)", key:"tags", placeholder:"React, Node.js, MongoDB" },
              { label:"Image URL",       key:"image",       placeholder:"https://... (optional)" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={styles.formGroup}>
                <label style={styles.formLabel}>{label}</label>
                {key === "description" ? (
                  <textarea style={styles.formTextarea} placeholder={placeholder} value={portfolioForm[key]} onChange={e => setPortfolioForm(f=>({...f,[key]:e.target.value}))}/>
                ) : (
                  <input style={styles.formInput} placeholder={placeholder} value={portfolioForm[key]} onChange={e => setPortfolioForm(f=>({...f,[key]:e.target.value}))}/>
                )}
              </div>
            ))}
            {portfolioError && <p style={styles.errorText}>⚠ {portfolioError}</p>}
            <button style={{ ...styles.saveBtn, opacity: portfolioLoading ? 0.7 : 1 }} onClick={handleAddPortfolio} disabled={portfolioLoading}>
              {portfolioLoading ? "Saving…" : "Add Project"}
            </button>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showExpModal && (
        <div style={styles.contactModal} onClick={() => setShowExpModal(false)}>
          <div style={{ ...styles.modalContent, maxWidth:"440px" }} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add Experience</h2>
              <button style={styles.closeButton} onClick={() => setShowExpModal(false)}>×</button>
            </div>
            {[
              { label:"Job Title *",    key:"title",       placeholder:"Senior Developer" },
              { label:"Company *",      key:"company",     placeholder:"Acme Corp / Freelance" },
              { label:"Period",         key:"period",      placeholder:"2022 – Present" },
              { label:"Description",    key:"description", placeholder:"What you did and achieved…" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={styles.formGroup}>
                <label style={styles.formLabel}>{label}</label>
                {key === "description" ? (
                  <textarea style={styles.formTextarea} placeholder={placeholder} value={expForm[key]} onChange={e => setExpForm(f=>({...f,[key]:e.target.value}))}/>
                ) : (
                  <input style={styles.formInput} placeholder={placeholder} value={expForm[key]} onChange={e => setExpForm(f=>({...f,[key]:e.target.value}))}/>
                )}
              </div>
            ))}
            {expError && <p style={styles.errorText}>⚠ {expError}</p>}
            <button style={{ ...styles.saveBtn, opacity: expLoading ? 0.7 : 1 }} onClick={handleAddExperience} disabled={expLoading}>
              {expLoading ? "Saving…" : "Add Experience"}
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal (for non-owners) */}
      {showContactModal && (
        <div style={styles.contactModal} onClick={() => setShowContactModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Contact {p.name}</h2>
              <button style={styles.closeButton} onClick={() => setShowContactModal(false)}>×</button>
            </div>
            {[
              { label:"Your Name", type:"text", placeholder:"Enter your name" },
              { label:"Your Email", type:"email", placeholder:"Enter your email" },
            ].map(({ label, type, placeholder }, i) => (
              <div key={i} style={styles.formGroup}>
                <label style={styles.formLabel}>{label}</label>
                <input type={type} style={styles.formInput} placeholder={placeholder}/>
              </div>
            ))}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Project Details</label>
              <textarea style={styles.formTextarea} placeholder="Describe your project requirements…"/>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Budget (₹)</label>
              <input type="text" style={styles.formInput} placeholder="e.g. ₹50,000 – ₹1,00,000"/>
            </div>
            <button style={{ ...styles.saveBtn }}>
              Send Message
            </button>
          </div>
        </div>
      )}

      <div style={{ height:"60px" }}/>
    </div>
  );
}
