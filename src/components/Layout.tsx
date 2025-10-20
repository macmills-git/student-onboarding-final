import { ReactNode, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Users, DollarSign, UserCircle,
  Moon, Sun, LayoutDashboard, GraduationCap, UserCog, LogOut, X, Menu
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isDark, toggleTheme } = useTheme();
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmSignOut = () => {
    setShowLogoutModal(false);
    signOut();
  };

  const handleCancelSignOut = () => {
    setShowLogoutModal(false);
  };

  // Show all navigation items for both admin and clerk users
  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/register', label: 'Register', icon: UserCircle },
    { path: '/students', label: 'Students', icon: GraduationCap },
    { path: '/payments', label: 'Payments', icon: DollarSign },
    { path: '/users', label: 'Users', icon: UserCog },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/home" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-200 transform hover:scale-105">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white hidden xs:block">
                  Student Management
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white block xs:hidden">
                  SMS
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-2 xl:px-3 py-2 text-sm transition-all duration-300 relative transform hover:scale-105 hover:-translate-y-0.5 ${isActive(item.path)
                        ? 'text-gray-800 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hover:shadow-md'
                        } ${isActive(item.path) ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500 after:animate-pulse' : ''}`}
                    >
                      <Icon className={`w-4 h-4 transition-all duration-300 ${isActive(item.path) ? 'text-blue-500 animate-bounce' : 'hover:rotate-12'}`} />
                      <span className="font-medium hidden xl:block">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-2">
                {/* User Role Badge */}
                {profile && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${profile.role === 'admin'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}>
                    {profile.role === 'admin' ? '👑 Admin' : '👤 Clerk'}
                  </div>
                )}

                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:shadow-lg"
                  title="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-yellow-500 animate-spin" />
                  ) : (
                    <Moon className="w-4 h-4 text-gray-600 animate-pulse" />
                  )}
                </button>

                {/* Logout button */}
                <button
                  onClick={handleSignOutClick}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="sm:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg animate-fade-in">
                <div className="px-4 py-3 space-y-1">
                  {/* User Role Badge for Mobile */}
                  {profile && (
                    <div className="flex justify-center mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${profile.role === 'admin'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}>
                        {profile.role === 'admin' ? '👑 Admin Access' : '👤 Clerk Access'}
                      </div>
                    </div>
                  )}

                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-300 ${isActive(item.path)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-500' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-3 flex-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      {isDark ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOutClick();
                      }}
                      className="flex items-center gap-3 flex-1 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-24 sm:pt-28 lg:pt-24 min-h-screen animate-fade-in">
          <div className="max-w-7xl mx-auto animate-slide-up">
            {children}
          </div>
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 sm:mt-16 lg:mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-gray-800 dark:text-white">
                      Student Management
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprehensive student registration and management system for educational <br />institutions.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Contact</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>University of Ghana</p>
                    <p>Computer Science Students' Association</p>
                    <p>Email: compssa@st.ug.edu.gh</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Powered by <span className="font-semibold text-blue-500">COMPSSA-UoG</span> © {new Date().getFullYear()}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Logout Confirmation Modal */}
        {
          showLogoutModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">Confirm Sign Out</h2>
                  <button
                    onClick={handleCancelSignOut}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                        Are you sure you want to sign out?
                      </h3>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelSignOut}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmSignOut}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};