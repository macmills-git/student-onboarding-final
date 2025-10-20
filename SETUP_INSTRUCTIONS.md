# Student Management System - Setup Instructions

## Overview

A comprehensive student management system with dark/light mode, authentication, and role-based access control.

## Features

- Dark/Light theme toggle
- Login authentication with Supabase
- Multi-step student registration form
- Admin dashboard with analytics
- Student management with search and filtering
- Payment tracking and management
- User/clerk management (admin only)

## Setup Steps

### 1. Create Admin User

Before you can use the system, you need to create an admin user:

1. Open your Supabase project dashboard
2. Go to Authentication > Users
3. Click "Add User" or "Invite User"
4. Create a user with:

   - Email: `admin@system.local`
   - Password: Choose a secure password
   - Or use any email/username combination

5. After creating the auth user, copy the User ID (UUID)
6. Go to SQL Editor in Supabase and run:

```sql
INSERT INTO users (id, username, full_name, role, permissions, is_active)
VALUES (
  'paste-user-id-here',
  'admin',
  'System Administrator',
  'admin',
  '{}',
  true
);
```

### 2. Login to the System

1. Navigate to the application
2. Use the credentials you created:
   - Username: `admin` (or the username you set)
   - Password: The password you chose

### 3. Create Additional Users

Once logged in as admin:

1. Go to Users page
2. Click "Add User"
3. Fill in the details:
   - Full Name
   - Username
   - Password
   - Role (Admin or Clerk)

## User Roles & Security

### Admin (Full Access)

- **Dashboard** - Complete analytics and system insights
- **Student Registration** - Register new students with full privileges
- **Student Management** - View, edit, and manage all student records
- **Payment Management** - Access to all financial records and payment tracking
- **User Management** - Create, edit, and manage system users
- **Home** - Access to all quick actions

### Clerk (Limited Access)

- **Student Registration** - Register new students (core responsibility)
- **Student Management** - View and edit student records
- **Home** - Access to clerk-specific quick actions
- **Restricted Access** - Cannot access Dashboard, Payments, or User Management

### Security Features

- **Universal Navigation** - All menu items are visible to both admin and clerk users
- **Route Protection** - Admin-only pages show unauthorized access message for clerks
- **Visual Indicators** - Role badges show current access level
- **Unauthorized Access Page** - Clerks see informative message when accessing restricted pages
- **Contact Information** - Clear guidance on how to request additional permissions

### Default Login Credentials

- **Admin**: Username: `admin`, Password: `admin123`
- **Clerk**: Username: `clerk`, Password: `clerk123`

## Pages & Access Control

1. **Login** - Beautiful glassy login page with animations (Public)
2. **Home** - Landing page with role-based quick actions (Admin & Clerk)
3. **Register** - 3-step student registration form (Admin & Clerk)
4. **Students** - View and manage all students (Admin & Clerk)
5. **Dashboard** - Analytics and insights (Admin Only)
6. **Payments** - Payment tracking and recording (Admin Only)
7. **Users** - Manage system users (Admin Only)

### Access Control Implementation

- **Universal Navigation** - All menu items visible to encourage exploration
- **Route Guards** - Protected routes show unauthorized access page instead of redirecting
- **Informative Messaging** - Clear explanation of access restrictions and contact information
- **Visual Feedback** - Role badges and user-friendly unauthorized access interface

## Theme Toggle

Click the sun/moon icon in the navigation bar to toggle between light and dark modes.

## Database Schema

The system uses the following tables:

- `users` - System users and their roles
- `students` - Student records
- `payments` - Payment transactions
- `activities` - Activity logs for auditing

All tables have Row Level Security (RLS) enabled for data protection.
