import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useTheme } from '../contexts/ThemeContext';
import { useSidebar } from '../contexts/SidebarContext';

interface SidebarLayoutProps {
    children: ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
    const { isDark } = useTheme();
    const { isCollapsed } = useSidebar();

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Sidebar />

                {/* Top Navbar */}
                <TopNavbar />

                {/* Main Content */}
                <main className={`${isCollapsed
                        ? 'ml-14 sm:ml-16 md:ml-16'
                        : 'ml-64 sm:ml-72 md:ml-[15%] lg:ml-[11%]'
                    } min-h-screen pt-16 sm:pt-20 md:pt-24 px-2 sm:px-3 md:px-6 pb-6 sm:pb-8 transition-all duration-500 ease-in-out`}>
                    <div className="w-full max-w-full overflow-x-auto">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className={`${isCollapsed
                        ? 'ml-14 sm:ml-16 md:ml-16'
                        : 'ml-64 sm:ml-72 md:ml-[15%] lg:ml-[11%]'
                    } relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-t border-white/20 dark:border-gray-700/20 transition-all duration-500 ease-in-out`}>
                    <div className="px-4 md:px-8 py-3 md:py-4">
                        <p className="text-xs md:text-sm text-center text-gray-700 dark:text-gray-300">
                            Powered by <span className="font-bold text-blue-500">COMPSSA-UoG</span> © {new Date().getFullYear()}. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};
