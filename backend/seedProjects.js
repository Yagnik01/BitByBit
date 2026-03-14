const mongoose = require('mongoose');
const Project = require('./models/Project');
require('dotenv').config();

const sampleProjects = [
  {
    description: "Build a modern AI chatbot web application using React, Node.js, and OpenAI API. The chatbot should have a clean UI, support multiple conversations, and include features like conversation history and export functionality.",
    domain: "AI/ML",
    total_budget: 800,
    timeline: "2 weeks",
    status: "open",
    milestones: [
      {
        title: "UI Design",
        description: "Create responsive chat interface",
        timeline: "3 days",
        budget_allocation: 200,
        status: "pending"
      },
      {
        title: "Backend Integration",
        description: "Set up Node.js server and OpenAI API",
        timeline: "5 days",
        budget_allocation: 300,
        status: "pending"
      },
      {
        title: "Features Implementation",
        description: "Add conversation history and export",
        timeline: "6 days",
        budget_allocation: 300,
        status: "pending"
      }
    ]
  },
  {
    description: "Develop a full-stack e-commerce website with product catalog, shopping cart, user authentication, and payment integration using Stripe. Should include admin panel for product management.",
    domain: "E-commerce",
    total_budget: 2000,
    timeline: "1 month",
    status: "open",
    milestones: [
      {
        title: "Frontend Development",
        description: "React components for product catalog and cart",
        timeline: "10 days",
        budget_allocation: 800,
        status: "pending"
      },
      {
        title: "Backend API",
        description: "Node.js REST API with MongoDB",
        timeline: "8 days",
        budget_allocation: 600,
        status: "pending"
      },
      {
        title: "Payment Integration",
        description: "Stripe payment gateway setup",
        timeline: "5 days",
        budget_allocation: 400,
        status: "pending"
      },
      {
        title: "Admin Panel",
        description: "Product management interface",
        timeline: "7 days",
        budget_allocation: 200,
        status: "pending"
      }
    ]
  },
  {
    description: "Create a fitness tracking mobile app with React Native. Features include workout logging, progress tracking, nutrition tracking, and social features for sharing achievements.",
    domain: "Mobile",
    total_budget: 1200,
    timeline: "3 weeks",
    status: "open",
    milestones: [
      {
        title: "App Architecture",
        description: "Set up React Native project structure",
        timeline: "3 days",
        budget_allocation: 200,
        status: "pending"
      },
      {
        title: "Core Features",
        description: "Workout logging and progress tracking",
        timeline: "10 days",
        budget_allocation: 600,
        status: "pending"
      },
      {
        title: "Social Features",
        description: "User profiles and achievement sharing",
        timeline: "8 days",
        budget_allocation: 400,
        status: "pending"
      }
    ]
  },
  {
    description: "Build a modern developer portfolio website with smooth animations, project showcase, blog section, and contact form. Should be highly optimized for performance and SEO.",
    domain: "Web Development",
    total_budget: 400,
    timeline: "1 week",
    status: "open",
    milestones: [
      {
        title: "Design & Layout",
        description: "Create modern UI with animations",
        timeline: "2 days",
        budget_allocation: 100,
        status: "pending"
      },
      {
        title: "Content Sections",
        description: "About, projects, and blog sections",
        timeline: "3 days",
        budget_allocation: 200,
        status: "pending"
      },
      {
        title: "Optimization",
        description: "SEO and performance optimization",
        timeline: "2 days",
        budget_allocation: 100,
        status: "pending"
      }
    ]
  },
  {
    description: "Develop a task management dashboard with drag-and-drop functionality, team collaboration features, and real-time updates. Should integrate with calendar and notification systems.",
    domain: "Productivity",
    total_budget: 1500,
    timeline: "2 weeks",
    status: "open",
    milestones: [
      {
        title: "Dashboard UI",
        description: "Create responsive dashboard layout",
        timeline: "4 days",
        budget_allocation: 500,
        status: "pending"
      },
      {
        title: "Core Functionality",
        description: "Task CRUD operations and drag-drop",
        timeline: "6 days",
        budget_allocation: 600,
        status: "pending"
      },
      {
        title: "Collaboration Features",
        description: "Real-time updates and notifications",
        timeline: "4 days",
        budget_allocation: 400,
        status: "pending"
      }
    ]
  }
];

async function seedProjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert sample projects
    const insertedProjects = await Project.insertMany(sampleProjects);
    console.log(`Inserted ${insertedProjects.length} sample projects:`);
    
    insertedProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.description.slice(0, 50)}... - $${project.total_budget}`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
}

seedProjects();
