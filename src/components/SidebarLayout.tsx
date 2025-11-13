import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarLayoutProps {
    children: ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Sidebar />

                {/* Top Navbar */}
                <TopNavbar />

                {/* Main Content */}
                <main className="md:ml-[15%] lg:ml-[11%] min-h-screen pt-20 md:pt-24 px-3 md:px-6 pb-8 transition-all duration-500 ease-in-out">
                    <div className="w-full">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="md:ml-[15%] lg:ml-[11%] relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-t border-white/20 dark:border-gray-700/20 transition-all duration-500 ease-in-out">
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
