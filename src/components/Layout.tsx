import { ReactNode, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Users, DollarSign, UserCircle,
  Moon, Sun, LayoutDashboard, GraduationCap, UserCog, LogOut, X, Menu
} from 'lucide-react';
import compssaLogo from '../assets/images/compssalogo.png';

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

  const handleSignOutClick = () => setShowLogoutModal(true);
  const handleConfirmSignOut = () => {
    setShowLogoutModal(false);
    signOut();
  };
  const handleCancelSignOut = () => setShowLogoutModal(false);

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/register', label: 'Register', icon: UserCircle },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/students', label: 'Students', icon: GraduationCap },
    { path: '/payments', label: 'Payments', icon: DollarSign },
    { path: '/users', label: 'Users', icon: UserCog },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-in-out pt-4 px-6 animate-fade-in">
          <div className="mx-auto px-8 sm:px-12 lg:px-16 h-16 relative rounded-[50px] bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.15)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20 dark:border-gray-700/20 transition-all duration-500 ease-in-out transform-gpu animate-scale-in">
            <div className="flex items-center justify-between h-full gap-12">

              {/* Logo - far left */}
              <div className="flex-shrink-0">
                <Link to="/home" className="flex items-center gap-4 hover:opacity-80 transition-all duration-200 transform hover:scale-105">
                  <img src={compssaLogo} alt="COMPSSA Logo" className="h-12 w-auto" />
                  <span className="text-lg font-bold text-gray-800 dark:text-white hidden xs:block">
                    Student Management
                  </span>
                  <span className="text-lg font-bold text-gray-800 dark:text-white block xs:hidden">
                    SMS
                  </span>
                </Link>
              </div>

              {/* Navigation - centered - Hidden on mobile */}
              <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-4 lg:gap-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 lg:px-5 py-3 text-lg font-bold transition-all duration-300 relative transform hover:scale-105 hover:-translate-y-0.5 ${isActive(item.path)
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hover:shadow-md'
                        } ${isActive(item.path) ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500 after:animate-pulse' : ''}`}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-300 ${isActive(item.path) ? 'text-blue-500 animate-bounce' : 'hover:rotate-12'}`} />
                      <span className="font-bold hidden xl:block">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Actions - far right - Always visible */}
              <div className="flex items-center gap-3 md:gap-6 ml-auto">
                {profile && (
                  <div className={`hidden md:block px-5 py-2 rounded-full text-sm font-bold ${profile.role === 'admin'
                    ? 'bg-blue-900/30 text-white border border-blue-800'
                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                    }`}>
                    {profile.role === 'admin' ? 'Admin' : '👤 Clerk'}
                  </div>
                )}

                {/* Theme toggle - Always visible */}
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:shadow-lg"
                  title="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500 animate-spin" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 animate-pulse" />
                  )}
                </button>

                {/* Logout button - Always visible */}
                <button
                  onClick={handleSignOutClick}
                  className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Mobile Menu Button - Only on mobile */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU OVERLAY */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-[10000] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* MOBILE MENU SIDEBAR */}
        <div className={`fixed top-0 left-0 h-full w-1/2 z-[10001] lg:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className="h-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.15)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] border-r border-white/20 dark:border-gray-700/20">
            <div className="flex flex-col h-full py-8 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 mb-2 ${isActive(item.path)
                      ? 'bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400 shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive(item.path) ? 'text-blue-500' : ''}`} />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-0 pt-28 sm:pt-32 lg:pt-32 min-h-screen animate-fade-in transition-all duration-500 ease-in-out">
          <div className="max-w-7xl mx-auto animate-slide-up">
            {children}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="relative">
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-t border-white/20 dark:border-gray-700/20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6">
              <div className="max-w-7xl mx-auto text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Powered by <span className="font-bold text-blue-500">COMPSSA-UoG</span> © {new Date().getFullYear()}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* LOGOUT MODAL */}
        {showLogoutModal && (
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
