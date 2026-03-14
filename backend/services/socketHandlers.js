const Project = require('../models/Project');
const User = require('../models/User');

// Store notifications in memory (in production, use Redis or database)
const notifications = new Map();

const socketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join user to their personal room
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Handle freelancer applying to a project
    socket.on('apply_to_project', async (data) => {
      try {
        const { projectId, freelancerId, freelancerName, projectTitle } = data;
        
        // Get project details
        const project = await Project.findById(projectId);
        if (!project) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        // Create notification
        const notification = {
          id: Date.now(),
          projectId,
          projectTitle,
          freelancerId,
          freelancerName,
          freelancerAvatar: null, // You can fetch this from user model
          timestamp: new Date(),
          type: 'freelancer_application'
        };

        // Store notification for the project owner
        const projectOwnerId = project.postedBy.toString();
        if (!notifications.has(projectOwnerId)) {
          notifications.set(projectOwnerId, []);
        }
        notifications.get(projectOwnerId).push(notification);

        // Send notification to project owner
        io.to(`user_${projectOwnerId}`).emit('freelancer_applied', notification);

        // Confirm to freelancer
        socket.emit('application_sent', { 
          success: true, 
          message: 'Application sent successfully' 
        });

      } catch (error) {
        console.error('Error applying to project:', error);
        socket.emit('error', { message: 'Failed to apply to project' });
      }
    });

    // Handle getting notifications for a user
    socket.on('get_notifications', (userId) => {
      const userNotifications = notifications.get(userId) || [];
      socket.emit('notifications_list', userNotifications);
    });

    // Handle confirming a freelancer
    socket.on('confirm_freelancer', async (data) => {
      try {
        const { projectId, freelancerId } = data;
        
        // Update project status
        const project = await Project.findById(projectId);
        if (!project) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        // Update project with accepted freelancer
        project.acceptedFreelancer = freelancerId;
        project.status = 'assigned';
        await project.save();

        // Remove the notification
        const projectOwnerId = project.postedBy.toString();
        const userNotifications = notifications.get(projectOwnerId) || [];
        const updatedNotifications = userNotifications.filter(
          n => !(n.projectId === projectId && n.freelancerId === freelancerId)
        );
        notifications.set(projectOwnerId, updatedNotifications);

        // Notify the freelancer
        const freelancer = await User.findById(freelancerId);
        if (freelancer) {
          io.to(`user_${freelancerId}`).emit('project_accepted', {
            projectId,
            projectTitle: project.title,
            message: `Your application for "${project.title}" has been accepted!`
          });
        }

        // Confirm to project owner
        socket.emit('freelancer_confirmed', { 
          success: true, 
          message: 'Freelancer confirmed successfully' 
        });

      } catch (error) {
        console.error('Error confirming freelancer:', error);
        socket.emit('error', { message: 'Failed to confirm freelancer' });
      }
    });

    // Handle rejecting a freelancer
    socket.on('reject_freelancer', async (data) => {
      try {
        const { projectId, freelancerId } = data;
        
        // Get project details
        const project = await Project.findById(projectId);
        if (!project) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        // Remove the notification
        const projectOwnerId = project.postedBy.toString();
        const userNotifications = notifications.get(projectOwnerId) || [];
        const updatedNotifications = userNotifications.filter(
          n => !(n.projectId === projectId && n.freelancerId === freelancerId)
        );
        notifications.set(projectOwnerId, updatedNotifications);

        // Notify the freelancer
        io.to(`user_${freelancerId}`).emit('project_rejected', {
          projectId,
          projectTitle: project.title,
          message: `Your application for "${project.title}" was not selected`
        });

        // Confirm to project owner
        socket.emit('freelancer_rejected', { 
          success: true, 
          message: 'Freelancer rejected successfully' 
        });

      } catch (error) {
        console.error('Error rejecting freelancer:', error);
        socket.emit('error', { message: 'Failed to reject freelancer' });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandlers;
