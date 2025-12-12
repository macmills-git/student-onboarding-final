import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    TrendingUp, PieChart, BarChart3, Activity, Moon, Sun, LogOut, X,
    Users, GraduationCap, DollarSign, Shield, UserCog, ChevronRight, ChevronLeft
} from 'lucide-react';
import compssaLogo from '../assets/images/compssalogo.png';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

export const Sidebar = () => {
    const { isDark, toggleTheme } = useTheme();
    const { signOut, profile } = useAuth();
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();

    const handleSignOutClick = () => setShowLogoutModal(true);
    const handleConfirmSignOut = () => {
        setShowLogoutModal(false);
        signOut();
    };
    const handleCancelSignOut = () => setShowLogoutModal(false);

    // Dynamic analytics items based on current page and user role
    const getAnalyticsItems = () => {
        const path = location.pathname;
        const isAdmin = profile?.role === 'admin';

        if (path === '/dashboard' && isAdmin) {
            return [
                { path: '/dashboard#operations', label: 'Daily Operations', icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400' },
                { path: '/dashboard#courses', label: 'Course Analytics', icon: PieChart, color: 'text-cyan-600 dark:text-cyan-400' },
                { path: '/dashboard#performance', label: 'Staff Performance', icon: BarChart3, color: 'text-green-600 dark:text-green-400' },
                { path: '/dashboard#system', label: 'System Status', icon: Activity, color: 'text-purple-600 dark:text-purple-400' },
            ];
        } else if (path === '/students') {
            return [
                { path: '/students', label: 'Student List', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
                { path: '/students', label: 'Analytics', icon: BarChart3, color: 'text-green-600 dark:text-green-400' },
                { path: '/students', label: 'Course Stats', icon: PieChart, color: 'text-cyan-600 dark:text-cyan-400' },
                { path: '/students', label: 'Level Stats', icon: TrendingUp, color: 'text-orange-600 dark:text-orange-400' },
            ];
        } else if (path === '/payments' && isAdmin) {
            return [
                { path: '/payments', label: 'Payment Overview', icon: DollarSign, color: 'text-green-600 dark:text-green-400' },
                { path: '/payments', label: 'Revenue Stats', icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400' },
                { path: '/payments', label: 'Payment Records', icon: BarChart3, color: 'text-cyan-600 dark:text-cyan-400' },
                { path: '/payments', label: 'User Revenue', icon: Activity, color: 'text-purple-600 dark:text-purple-400' },
            ];
        } else if (path === '/users' && isAdmin) {
            return [
                { path: '/users#security', label: 'Security & Access', icon: Shield, color: 'text-teal-600 dark:text-teal-400' },
                { path: '/users#user-list', label: 'User List', icon: UserCog, color: 'text-blue-600 dark:text-blue-400' },
                { path: '/users#user-activity', label: 'User Activity', icon: Activity, color: 'text-green-600 dark:text-green-400' },
                { path: '/users#permissions', label: 'Permissions', icon: BarChart3, color: 'text-purple-600 dark:text-purple-400' },
            ];
        } else if (path === '/home') {
            return [
                { path: '/home', label: 'Quick Register', icon: UserCog, color: 'text-blue-600 dark:text-blue-400' },
                { path: '/students', label: 'View Students', icon: Users, color: 'text-green-600 dark:text-green-400' },
                { path: '/register', label: 'Register Student', icon: GraduationCap, color: 'text-cyan-600 dark:text-cyan-400' },
                ...(isAdmin ? [{ path: '/dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-purple-600 dark:text-purple-400' }] : []),
            ];
        } else if (path === '/register') {
            return [
                { path: '/register', label: 'New Student', icon: UserCog, color: 'text-blue-600 dark:text-blue-400' },
                { path: '/students', label: 'Student List', icon: Users, color: 'text-green-600 dark:text-green-400' },
                { path: '/home', label: 'Home', icon: GraduationCap, color: 'text-cyan-600 dark:text-cyan-400' },
                ...(isAdmin ? [{ path: '/dashboard', label: 'Analytics', icon: BarChart3, color: 'text-purple-600 dark:text-purple-400' }] : []),
            ];
        }

        // Default items for clerks (student-focused)
        return [
            { path: '/home', label: 'Home', icon: GraduationCap, color: 'text-blue-600 dark:text-blue-400' },
            { path: '/register', label: 'Register Student', icon: UserCog, color: 'text-green-600 dark:text-green-400' },
            { path: '/students', label: 'View Students', icon: Users, color: 'text-cyan-600 dark:text-cyan-400' },
            ...(isAdmin ? [{ path: '/dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-purple-600 dark:text-purple-400' }] : []),
        ];
    };

    const analyticsItems = getAnalyticsItems();

    return (
        <aside className={`fixed left-0 top-0 h-screen bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-r border-white/20 dark:border-gray-700/20 shadow-[4px_0_30px_rgba(0,0,0,0.15)] dark:shadow-[4px_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out z-40 ${
            // Mobile: Always collapsed, smaller width
            // Tablet: Responsive width based on collapse state  
            // Desktop: Full responsive behavior
            isCollapsed
                ? 'w-14 sm:w-16'
                : 'w-64 sm:w-72 md:w-[15%] lg:w-[11%]'
            }`}>
            <div className="flex flex-col h-full">
                {/* Logo and Toggle Button */}
                <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b border-white/20 dark:border-gray-700/20">
                    {!isCollapsed && (
                        <Link to="/home">
                            <img src={compssaLogo} alt="COMPSSA Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 group ${isCollapsed
                            ? 'mx-auto bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 animate-pulse hover:animate-none hover:bg-blue-100 dark:hover:bg-blue-900/20'
                            : 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                            }`}
                        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 font-bold group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        ) : (
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        )}
                    </button>
                </div>

                {/* Analytics Section */}
                <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-1 sm:p-2 pt-2 sm:pt-4' : 'p-2 sm:p-3 pt-4 sm:pt-6'}`}>
                    <div className={isCollapsed ? 'space-y-0.5 sm:space-y-1' : 'space-y-1 sm:space-y-2'}>
                        {analyticsItems.map((item, index) => {
                            const Icon = item.icon;
                            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                                e.preventDefault();
                                const hash = item.path.split('#')[1];
                                if (hash) {
                                    const element = document.getElementById(hash);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                } else {
                                    // If no hash, scroll to top
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            };

                            return (
                                <div key={`${item.path}-${index}`}>
                                    <a
                                        href={item.path}
                                        onClick={handleClick}
                                        className={`flex ${isCollapsed ? 'justify-center' : 'flex-col items-center'} gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-lg transition-all duration-200 group hover:bg-blue-100 dark:hover:bg-blue-900/20 cursor-pointer relative ${isCollapsed ? 'hover:scale-105' : ''}`}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${item.color} group-hover:scale-110 transition-transform`} strokeWidth={2.5} />
                                        {!isCollapsed && (
                                            <span className="text-xs font-extrabold text-center leading-tight text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.label}</span>
                                        )}
                                        {/* Tooltip for collapsed state */}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs sm:text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700 dark:border-gray-600 group-hover:scale-105">
                                                {item.label}
                                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 dark:bg-gray-700 rotate-45 border-l border-b border-gray-700 dark:border-gray-600"></div>
                                            </div>
                                        )}
                                    </a>
                                    {index < analyticsItems.length - 1 && !isCollapsed && (
                                        <div className="border-t border-gray-300 dark:border-gray-600 mt-2"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* Expand Hint for Collapsed State */}
                {isCollapsed && (
                    <div className="p-1.5 sm:p-2 border-t border-white/20 dark:border-gray-700/20">
                        <div className="flex justify-center">
                            <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-blue-300 dark:bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 font-medium">
                            <span className="hidden sm:inline">Click →</span>
                            <span className="sm:hidden">→</span>
                        </p>
                    </div>
                )}

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
        </aside>
    );
};
