"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// Icons as inline SVG components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
    }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BidIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// Project Data
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
  {
    id: 3,
    title: "Modern Ecommerce Website",
    description:
      "Develop a modern ecommerce website with shopping cart functionality and Stripe payment integration. Should include product catalog, user accounts, and order management system.",
    tech: ["Next.js", "MongoDB", "Stripe", "Tailwind CSS"],
    budget: 1500,
    timeline: "1 Month",
    posted: "20 minutes ago",
    bids: 7,
    clientRating: 5.0,
    category: "E-commerce",
    isUrgent: false,
  },
  {
    id: 4,
    title: "Developer Portfolio Website",
    description:
      "Create a personal developer portfolio with smooth animations and modern design. Should showcase projects, skills, and include a contact form with email integration.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    budget: 400,
    timeline: "1 Week",
    posted: "1 hour ago",
    bids: 12,
    clientRating: 4.7,
    category: "Web Design",
    isUrgent: false,
  },
  {
    id: 5,
    title: "Real Estate Listing Platform",
    description:
      "Build a comprehensive real estate listing website with property search, filtering, map integration, and agent dashboard. Should support multiple listing types and virtual tours.",
    tech: ["Vue.js", "PostgreSQL", "Google Maps API", "AWS"],
    budget: 2500,
    timeline: "2 Months",
    posted: "2 hours ago",
    bids: 5,
    clientRating: 4.6,
    category: "Web Development",
    isUrgent: true,
  },
  {
    id: 6,
    title: "Mobile Fitness Tracking App",
    description:
      "Create a cross-platform mobile fitness app with workout tracking, progress charts, social features, and integration with wearable devices.",
    tech: ["React Native", "Firebase", "HealthKit", "Google Fit"],
    budget: 1200,
    timeline: "6 Weeks",
    posted: "3 hours ago",
    bids: 8,
    clientRating: 4.5,
    category: "Mobile Development",
    isUrgent: false,
  },
];

const techStackOptions = [
  "React",
  "Next.js",
  "Vue.js",
  "Node.js",
  "Python",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "TypeScript",
  "Tailwind CSS",
];

const categoryOptions = [
  "Web Development",
  "Mobile Development",
  "AI & Machine Learning",
  "E-commerce",
  "Web Design",
  "Data Science",
];

const timelineOptions = ["1 Week", "2 Weeks", "3 Weeks", "1 Month", "2 Months", "3+ Months"];

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-title" />
      <div className="skeleton-badge" />
    </div>
    <div className="skeleton-budget" />
    <div className="skeleton-desc" />
    <div className="skeleton-desc short" />
    <div className="skeleton-tags">
      <div className="skeleton-tag" />
      <div className="skeleton-tag" />
      <div className="skeleton-tag" />
    </div>
    <div className="skeleton-footer">
      <div className="skeleton-meta" />
      <div className="skeleton-meta" />
    </div>
    <style jsx>{`
      .skeleton-card {
        background: white;
        padding: 24px;
        border-radius: 16px;
        margin-bottom: 16px;
        border: 1px solid #e5e7eb;
      }
      .skeleton-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .skeleton-title {
        height: 24px;
        width: 60%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
      }
      .skeleton-badge {
        height: 24px;
        width: 80px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 12px;
      }
      .skeleton-budget {
        height: 20px;
        width: 120px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
        margin-bottom: 16px;
      }
      .skeleton-desc {
        height: 16px;
        width: 100%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
        margin-bottom: 8px;
      }
      .skeleton-desc.short {
        width: 70%;
      }
      .skeleton-tags {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        margin-bottom: 16px;
      }
      .skeleton-tag {
        height: 28px;
        width: 80px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 14px;
      }
      .skeleton-footer {
        display: flex;
        justify-content: space-between;
      }
      .skeleton-meta {
        height: 16px;
        width: 100px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

// Collapsible Filter Section Component
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <button className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="filter-title">{title}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>
      <div className={`filter-content ${isOpen ? "open" : ""}`}>{children}</div>
      <style jsx>{`
        .filter-section {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .filter-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 12px;
        }
        .filter-title {
          font-weight: 600;
          font-size: 14px;
          color: #1f2937;
        }
        .filter-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .filter-content.open {
          max-height: 500px;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

// Main Browse Component
const Browse = () => {
  const navigate = useNavigate();

  // State
  const [search, setSearch] = useState("");
  const [budgetRange, setBudgetRange] = useState([0, 3000]);
  const [selectedTimelines, setSelectedTimelines] = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [savedProjects, setSavedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = projectsData.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesBudget = p.budget >= budgetRange[0] && p.budget <= budgetRange[1];
      const matchesTimeline = selectedTimelines.length === 0 || selectedTimelines.includes(p.timeline);
      const matchesTech =
        selectedTech.length === 0 || selectedTech.some((tech) => p.tech.map((t) => t.toLowerCase()).includes(tech.toLowerCase()));
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);

      return matchesSearch && matchesBudget && matchesTimeline && matchesTech && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case "budget-high":
        result.sort((a, b) => b.budget - a.budget);
        break;
      case "budget-low":
        result.sort((a, b) => a.budget - b.budget);
        break;
      case "timeline":
        const timelineOrder = ["1 Week", "2 Weeks", "3 Weeks", "1 Month", "2 Months", "3+ Months"];
        result.sort((a, b) => timelineOrder.indexOf(a.timeline) - timelineOrder.indexOf(b.timeline));
        break;
      case "latest":
      default:
        // Already sorted by latest
        break;
    }

    return result;
  }, [search, budgetRange, selectedTimelines, selectedTech, selectedCategories, sortBy]);

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedProjects((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const toggleTimeline = (timeline) => {
    setSelectedTimelines((prev) => (prev.includes(timeline) ? prev.filter((t) => t !== timeline) : [...prev, timeline]));
  };

  const toggleTech = (tech) => {
    setSelectedTech((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  };

  const clearAllFilters = () => {
    setSearch("");
    setBudgetRange([0, 3000]);
    setSelectedTimelines([]);
    setSelectedTech([]);
    setSelectedCategories([]);
  };

  const activeFiltersCount =
    selectedTimelines.length + selectedTech.length + selectedCategories.length + (budgetRange[0] > 0 || budgetRange[1] < 3000 ? 1 : 0);

  // Render filter sidebar content
  const renderFilters = () => (
    <>
      <div className="filter-header-main">
        <h3 className="filter-main-title">Filters</h3>
        {activeFiltersCount > 0 && (
          <button className="clear-all-btn" onClick={clearAllFilters}>
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      <FilterSection title="Budget Range">
        <div className="budget-inputs">
          <div className="budget-input-group">
            <label>Min</label>
            <div className="budget-input-wrapper">
              <span className="currency">$</span>
              <input
                type="number"
                value={budgetRange[0]}
                onChange={(e) => setBudgetRange([Number(e.target.value), budgetRange[1]])}
                className="budget-input"
              />
            </div>
          </div>
          <div className="budget-divider">—</div>
          <div className="budget-input-group">
            <label>Max</label>
            <div className="budget-input-wrapper">
              <span className="currency">$</span>
              <input
                type="number"
                value={budgetRange[1]}
                onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
                className="budget-input"
              />
            </div>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="3000"
          step="100"
          value={budgetRange[1]}
          onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
          className="budget-slider"
        />
      </FilterSection>

      <FilterSection title="Timeline">
        <div className="checkbox-group">
          {timelineOptions.map((timeline) => (
            <label key={timeline} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTimelines.includes(timeline)}
                onChange={() => toggleTimeline(timeline)}
                className="checkbox-input"
              />
              <span className="checkbox-custom" />
              <span className="checkbox-text">{timeline}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Tech Stack">
        <div className="checkbox-group">
          {techStackOptions.map((tech) => (
            <label key={tech} className="checkbox-label">
              <input type="checkbox" checked={selectedTech.includes(tech)} onChange={() => toggleTech(tech)} className="checkbox-input" />
              <span className="checkbox-custom" />
              <span className="checkbox-text">{tech}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="checkbox-group">
          {categoryOptions.map((category) => (
            <label key={category} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="checkbox-input"
              />
              <span className="checkbox-custom" />
              <span className="checkbox-text">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <style jsx>{`
        .filter-header-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        .filter-main-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .clear-all-btn {
          background: none;
          border: none;
          color: #059669;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }
        .clear-all-btn:hover {
          color: #047857;
        }
        .budget-inputs {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          margin-bottom: 16px;
        }
        .budget-input-group {
          flex: 1;
        }
        .budget-input-group label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 6px;
        }
        .budget-input-wrapper {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .budget-input-wrapper:focus-within {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
        .currency {
          color: #6b7280;
          font-size: 14px;
        }
        .budget-input {
          width: 100%;
          padding: 10px 8px;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #111827;
          outline: none;
        }
        .budget-divider {
          color: #9ca3af;
          padding-bottom: 10px;
        }
        .budget-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
        }
        .budget-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #059669;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
          transition: transform 0.2s;
        }
        .budget-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 6px 0;
        }
        .checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }
        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .checkbox-input:checked + .checkbox-custom {
          background: #059669;
          border-color: #059669;
        }
        .checkbox-input:checked + .checkbox-custom::after {
          content: "";
          width: 5px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          margin-bottom: 2px;
        }
        .checkbox-text {
          font-size: 14px;
          color: #374151;
        }
        .checkbox-label:hover .checkbox-custom {
          border-color: #059669;
        }
      `}</style>
    </>
  );

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="browse-title">Browse Projects</h1>
            <p className="browse-subtitle">Find your next opportunity from thousands of projects</p>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <span className="search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search projects by title, skills, or keywords..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch("")}>
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className="tab active">
              Projects
              <span className="tab-count">{filteredProjects.length}</span>
            </button>
            <a href="/freelancers" className="tab">FreeLancers</a>
            <button className="tab">My Bids</button>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Mobile Filter Toggle */}
        <button className="mobile-filter-toggle" onClick={() => setShowMobileFilters(true)}>
          <FilterIcon />
          <span>Filters</span>
          {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
        </button>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div className="mobile-filter-overlay">
            <div className="mobile-filter-panel">
              <div className="mobile-filter-header">
                <h2>Filters</h2>
                <button className="close-filters" onClick={() => setShowMobileFilters(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="mobile-filter-content">{renderFilters()}</div>
              <div className="mobile-filter-footer">
                <button className="apply-filters-btn" onClick={() => setShowMobileFilters(false)}>
                  Show {filteredProjects.length} results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="sidebar">{renderFilters()}</aside>

        {/* Project List */}
        <section className="project-section">
          {/* Results Header */}
          <div className="result-header">
            <div className="result-info">
              <span className="result-count">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
              </span>
              {activeFiltersCount > 0 && (
                <span className="active-filters">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} applied
                </span>
              )}
            </div>
            <div className="sort-wrapper">
              <label className="sort-label">Sort by:</label>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="budget-high">Highest Budget</option>
                <option value="budget-low">Lowest Budget</option>
                <option value="timeline">Shortest Timeline</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No projects found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="reset-filters-btn" onClick={clearAllFilters}>
                Reset all filters
              </button>
            </div>
          ) : (
            /* Project Cards */
            filteredProjects.map((project) => (
              <article
                key={project.id}
                className={`project-card ${hoveredCard === project.id ? "hovered" : ""}`}
                onClick={() => navigate(`/project/${project.id}`)}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-header">
                  <div className="card-title-section">
                    <span className="category-badge">{project.category}</span>
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                  <button
                    className={`bookmark-btn ${savedProjects.includes(project.id) ? "saved" : ""}`}
                    onClick={(e) => toggleSave(project.id, e)}
                    aria-label={savedProjects.includes(project.id) ? "Remove from saved" : "Save project"}
                  >
                    <BookmarkIcon filled={savedProjects.includes(project.id)} />
                  </button>
                </div>

                <div className="budget-timeline">
                  <span className="budget">${project.budget.toLocaleString()}</span>
                  <span className="timeline">
                    <ClockIcon />
                    {project.timeline}
                  </span>
                </div>

                <p className="description">{project.description}</p>

                <div className="tech-row">
                  {project.tech.slice(0, 4).map((tech, i) => (
                    <span key={i} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && <span className="tech-more">+{project.tech.length - 4}</span>}
                </div>

                <div className="card-footer">
                  <div className="footer-left">
                    {project.bids === 0 ? (
                      <span className="first-bid-badge">🎯 Be first to bid!</span>
                    ) : (
                      <span className="bids">
                        <BidIcon />
                        {project.bids} bid{project.bids !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="client-rating">
                      <StarIcon />
                      {project.clientRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="footer-right">
                    {project.isUrgent && <span className="urgent-badge">Urgent</span>}
                    <span className="posted">{project.posted}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <style jsx>{`
        .page {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: #f3f4f6;
          min-height: 100vh;
        }

        /* Header */
        .header {
          background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
          color: white;
          padding: 40px 24px 0;
        }
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
        }
        .header-top {
          margin-bottom: 32px;
        }
        .browse-title {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .browse-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }

        /* Search */
        .search-container {
          margin-bottom: 24px;
        }
        .search-wrapper {
          position: relative;
          max-width: 700px;
        }
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          display: flex;
        }
        .search-input {
          width: 100%;
          padding: 16px 50px;
          border-radius: 50px;
          border: none;
          font-size: 16px;
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .search-input:focus {
          outline: none;
          box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }
        .search-input::placeholder {
          color: #9ca3af;
        }
        .clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: #e5e7eb;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }
        .clear-search:hover {
          background: #d1d5db;
          color: #374151;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
        }
        .tab {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 16px 24px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab:hover {
          color: white;
        }
        .tab.active {
          color: white;
          border-bottom-color: white;
        }
        .tab-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 13px;
        }

        /* Container */
        .container {
          display: flex;
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
          gap: 32px;
        }

        /* Mobile Filter Toggle */
        .mobile-filter-toggle {
          display: none;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          margin-bottom: 20px;
          width: 100%;
          justify-content: center;
        }
        .filter-badge {
          background: #059669;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
        }

        /* Mobile Filter Overlay */
        .mobile-filter-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
        .mobile-filter-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }
        .mobile-filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        .mobile-filter-header h2 {
          margin: 0;
          font-size: 20px;
        }
        .close-filters {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
        }
        .mobile-filter-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }
        .mobile-filter-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
        }
        .apply-filters-btn {
          width: 100%;
          background: #059669;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: white;
          padding: 24px;
          border-radius: 16px;
          height: fit-content;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 32px;
        }

        /* Project Section */
        .project-section {
          flex: 1;
          min-width: 0;
        }

        /* Result Header */
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .result-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .result-count {
          font-weight: 600;
          color: #111827;
          font-size: 16px;
        }
        .active-filters {
          background: #ecfdf5;
          color: #059669;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }
        .sort-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sort-label {
          font-size: 14px;
          color: #6b7280;
        }
        .sort-select {
          padding: 10px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          color: #374151;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .sort-select:focus {
          outline: none;
          border-color: #059669;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 16px;
        }
        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        .empty-state h3 {
          font-size: 20px;
          color: #111827;
          margin: 0 0 8px;
        }
        .empty-state p {
          color: #6b7280;
          margin: 0 0 24px;
        }
        .reset-filters-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .reset-filters-btn:hover {
          background: #047857;
        }

        /* Project Card */
        .project-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 16px;
          cursor: pointer;
          border: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .project-card:hover,
        .project-card.hovered {
          border-color: #059669;
          box-shadow: 0 10px 40px rgba(5, 150, 105, 0.12);
          transform: translateY(-4px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 12px;
        }
        .card-title-section {
          flex: 1;
        }
        .category-badge {
          display: inline-block;
          background: #f0fdf4;
          color: #059669;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .project-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          line-height: 1.4;
          transition: color 0.2s;
        }
        .project-card:hover .project-title {
          color: #059669;
        }
        .bookmark-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #9ca3af;
          transition: all 0.2s;
          border-radius: 8px;
        }
        .bookmark-btn:hover {
          color: #059669;
          background: #f0fdf4;
        }
        .bookmark-btn.saved {
          color: #059669;
        }

        .budget-timeline {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 16px;
        }
        .budget {
          font-size: 22px;
          font-weight: 700;
          color: #059669;
        }
        .timeline {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
        }

        .description {
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 16px;
          font-size: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .tech-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .tech-tag:hover {
          background: #e5e7eb;
        }
        .tech-more {
          background: #e5e7eb;
          color: #6b7280;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-left,
        .footer-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .first-bid-badge {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        .bids {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
        }
        .client-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f59e0b;
          font-size: 14px;
          font-weight: 500;
        }
        .urgent-badge {
          background: #fee2e2;
          color: #dc2626;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .posted {
          color: #9ca3af;
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
          .mobile-filter-toggle {
            display: flex;
          }
          .mobile-filter-overlay {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .header {
            padding: 24px 16px 0;
          }
          .browse-title {
            font-size: 28px;
          }
          .container {
            padding: 20px 16px;
          }
          .project-card {
            padding: 20px;
          }
          .budget {
            font-size: 20px;
          }
          .result-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .tabs {
            width: 100%;
            overflow-x: auto;
          }
          .tab {
            padding: 12px 16px;
            font-size: 14px;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Browse;
