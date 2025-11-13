import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, LogOut, X, Home, LayoutDashboard, UserCircle, GraduationCap, DollarSign, UserCog, Menu } from 'lucide-react';

export const TopNavbar = () => {
  const { signOut, profile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOutClick = () => setShowLogoutModal(true);
  const handleConfirmSignOut = () => {
    setShowLogoutModal(false);
    signOut();
  };
  const handleCancelSignOut = () => setShowLogoutModal(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/register', label: 'Register', icon: UserCircle },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/students', label: 'Students', icon: GraduationCap },
    { path: '/payments', label: 'Payments', icon: DollarSign },
    { path: '/users', label: 'Users', icon: UserCog },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 md:left-[15%] lg:left-[11%] right-0 z-[9999] transition-all duration-500 ease-in-out pt-3 md:pt-4 px-3 md:px-6 animate-fade-in">
        <div className="mx-auto px-4 md:px-8 h-14 md:h-16 relative rounded-[50px] bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.15)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20 dark:border-gray-700/20 flex items-center transition-all duration-500 ease-in-out transform-gpu animate-scale-in">
          {/* Main Navigation - Centered - Hidden on mobile (sidebar handles mobile) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-3 lg:gap-6">
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

          {/* Right Side Actions - Always visible */}
          <div className="flex items-center gap-2 md:gap-6 absolute right-2 md:right-8">
            {/* Theme Toggle - Always visible */}
            <button
              onClick={toggleTheme}
              className="p-2 md:p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:shadow-lg"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 animate-spin" />
              ) : (
                <Moon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 animate-pulse" />
              )}
            </button>

            {/* Logout Button - Always visible */}
            <button
              onClick={handleSignOutClick}
              className="p-2 md:p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Mobile Menu Button - Only on mobile - Last item */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY - Only on mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[9998] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU SIDEBAR - Only on mobile */}
      <div className={`fixed top-0 left-0 h-full w-64 z-[9999] md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border-r border-gray-200 dark:border-gray-700">
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
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
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
    </>
  );
};
