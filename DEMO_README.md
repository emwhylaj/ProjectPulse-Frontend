# ProjectPulse Demo Documentation

This document explains how to use the dummy data implementation for presentations and demonstrations.

## 🚀 Quick Start

1. **Start the application**: `npm run dev`
2. **Access the app**: http://localhost:3000
3. **Auto-login**: The app automatically logs you in as John Doe (Admin)
4. **Explore features**: Navigate to different sections or click "View Full Demo"

## 👥 Demo User Accounts

The application comes with 8 pre-configured user accounts for testing different roles:

### Admin Users
- **John Doe** (john.doe@company.com) - Full system access

### Project Managers  
- **Sarah Johnson** (sarah.johnson@company.com) - Manages multiple projects
- **David Wilson** (david.wilson@company.com) - Handles infrastructure projects

### Team Members
- **Mike Chen** (mike.chen@company.com) - Senior Developer
- **Emily Davis** (emily.davis@company.com) - UI/UX Designer  
- **Lisa Rodriguez** (lisa.rodriguez@company.com) - QA Specialist
- **Robert Brown** (robert.brown@company.com) - Backend Developer
- **Jessica Martinez** (jessica.martinez@company.com) - Business Analyst

> **Note**: All demo accounts use the password "password" for login, but auto-login is enabled by default.

## 🎯 Demo Features

### Projects Available
1. **E-Commerce Platform Redesign** - Active project with multiple tasks
2. **Mobile App Development** - Critical priority, in progress
3. **Data Analytics Dashboard** - Planning phase
4. **Security Audit & Enhancement** - Completed project
5. **Customer Support Portal** - Upcoming project
6. **Infrastructure Upgrade** - Currently on hold

### Task Examples
- Design and development tasks with different priorities
- Progress tracking with completion percentages
- Comments and collaboration features
- Due date monitoring and overdue alerts
- Status workflows (To Do → In Progress → Review → Completed)

### Notifications & Activities
- Task assignments and status changes
- Project updates and member additions
- Due date reminders and overdue alerts  
- Comment notifications and collaboration updates

## 🎮 How to Switch Users

### Method 1: User Switcher (Recommended)
1. Look for the floating blue button in the bottom-right corner
2. Click it to open the user switcher panel
3. Select any user to instantly switch roles
4. The page will refresh to show the new user's perspective

### Method 2: Manual Login
1. Logout from current session
2. Go to `/login` 
3. Use any of the email addresses above with password "password"

## 🎪 Demo Navigation

### Dashboard (`/dashboard`)
- Overview statistics and recent activities
- Quick access to assigned projects and tasks
- Role-specific data and permissions

### Full Demo Showcase (`/demo`)  
- Comprehensive view of all dummy data
- User statistics and role information
- Complete project and task listings
- Team member directory
- Recent notifications and activities
- Demo instructions and user guides

## 🔧 Configuration

### Enable/Disable Mock Data
In each service file (e.g., `src/services/auth.service.ts`):

```typescript
// Set to false to use real API endpoints
const USE_MOCK_API = true;
```

### Customize Mock Data
Edit `src/data/dummyData.ts` to:
- Add/remove users, projects, or tasks
- Modify project statuses and priorities
- Update notification types and messages
- Change user roles and permissions

### Reset Demo State
Call these functions in browser console:
```javascript
// Clear current demo data
clearMockData();

// Switch to different user (by ID)
switchMockUser(2); // Switch to Sarah Johnson

// Refresh page to see changes
window.location.reload();
```

## 📊 Data Statistics

The demo includes:
- **8 Users** across 3 different roles
- **6 Projects** with various statuses and priorities  
- **10 Tasks** with different completion states
- **11 Project Members** showing team assignments
- **5 Task Comments** demonstrating collaboration
- **6 Notifications** for different event types
- **8 Project Activities** showing audit trail

## 🎯 Presentation Tips

1. **Start with Admin View**: Shows full system capabilities
2. **Switch to Project Manager**: Demonstrate management features  
3. **Switch to Team Member**: Show task-focused interface
4. **Highlight Key Features**:
   - Role-based access control
   - Real-time status updates
   - Progress tracking and reporting
   - Team collaboration tools
   - Notification system

## 🔒 Security Notes

- Mock data is stored in memory only
- No real API calls are made when `USE_MOCK_API = true`
- User switching is for demo purposes only
- Profile images are loaded from Unsplash (external service)

## 🚨 Troubleshooting

### Application won't start
- Ensure all dependencies are installed: `npm install`
- Check Node.js version compatibility
- Clear node_modules and reinstall if needed

### Mock data not loading
- Check browser console for errors
- Verify `USE_MOCK_API = true` in service files
- Refresh the page or restart the dev server

### User switcher not working  
- Ensure the UserSwitcher component is imported and rendered
- Check that the floating button is visible in bottom-right corner
- Try refreshing the page after switching users

---

**Happy Demoing! 🎉**

For questions or issues, check the browser console for detailed error messages.