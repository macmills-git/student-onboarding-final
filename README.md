# 🎓 COMPSSA Student Management System

A modern, frontend-only student management system built for the Computer Science Students Association (COMPSSA) at the University of Ghana.

## ✨ Features

### 🎯 Complete Student Management

- **Student Registration** - Multi-step registration with validation
- **Student Records** - Search, filter, and manage student data
- **Real-time Updates** - Changes reflect immediately across all pages

### 💰 Payment Tracking

- **Payment Recording** - Support for Cash, Mobile Money, and Bank transfers
- **Payment History** - Complete transaction records
- **Staff Revenue Tracking** - Individual performance metrics

### 👥 User Management

- **Role-Based Access** - Admin and Clerk permissions
- **User Administration** - Create and manage system users
- **Performance Analytics** - Staff productivity insights

### 📊 Analytics Dashboard

- **Live Statistics** - Real-time enrollment and revenue data
- **Course Analytics** - Program distribution insights
- **Export Functions** - Download data as CSV/Excel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/macmills-git/student-onboarding-final.git
cd student-onboarding-final

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

## 🔐 Demo Credentials

### Admin Access (Full Features)

- **Username**: `mcmills`
- **Password**: `mcmills1`

### Clerk Access (Limited Features)

- **Username**: `clerk`
- **Password**: `Clerk123!`

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **React Context** for state management
- **Lucide React** for icons

## 📁 Project Structure

```
compssa-student-management/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Data, Theme)
│   ├── pages/              # Page components
│   ├── assets/             # Images and static files
│   └── App.tsx             # Main application
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## 🎯 How It Works

### Frontend-Only Architecture

- **No Backend Required** - All data managed in React Context
- **Mock Authentication** - Secure login simulation
- **Shared State** - Real-time updates across all pages
- **Local Storage** - Session persistence

### Data Management

- **DataContext** - Centralized state for Students, Payments, Users
- **Real-time Updates** - Add/edit/delete operations update immediately
- **Persistent Sessions** - Data survives page navigation

## 🚀 Deployment

### Static Hosting (Recommended)

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
```

- **Vercel** - `vercel --prod`
- **Netlify** - Drag and drop `dist/` folder
- **GitHub Pages** - Enable Pages in repository settings
- **Any Static Host** - Upload `dist/` folder contents

### Environment Setup

No environment variables or server configuration required!

## 🎨 Features Showcase

### 🏠 HomePage

- Modern landing page with UG Tower background
- Role-based feature display
- Responsive design with smooth animations

### 📊 Dashboard (Admin Only)

- Live enrollment statistics (1,247+ students)
- Staff performance tracking with circular progress
- Course distribution analytics
- Recent activities feed

### 👥 Students Management

- Complete student directory with search/filter
- Multi-step registration process
- Edit/delete operations with real-time updates
- Export functionality

### 💰 Payments (Admin Only)

- Payment recording for multiple methods
- Staff revenue tracking
- Payment history with analytics
- Export reports

### 👤 Users (Admin Only)

- User creation and management
- Role assignment (Admin/Clerk)
- Performance metrics per user
- Account status management

## 🔒 Security Features

- **Mock Authentication** - Secure login simulation
- **Role-Based Access** - Admin vs Clerk permissions
- **Input Validation** - Form validation and sanitization
- **Session Management** - Secure token handling

## 📱 Responsive Design

- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Mobile gesture support
- **Progressive Enhancement** - Works on all devices
- **Dark/Light Theme** - User preference support

## 🎯 Perfect For

- **Demonstrations** - Show complete functionality without backend
- **Prototyping** - Test UI/UX before backend development
- **Portfolio Projects** - Showcase frontend development skills
- **Academic Submissions** - University-level project example
- **Client Presentations** - Professional system showcase

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- University of Ghana Computer Science Department
- COMPSSA (Computer Science Students Association)
- React and Vite communities

---

**🎊 Ready to explore? Login with `mcmills` / `mcmills1` and experience the complete system!**

**Built with ❤️ for COMPSSA**
