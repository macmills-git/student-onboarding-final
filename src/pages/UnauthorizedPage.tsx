import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-sm w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        Access Restricted
                    </h1>

                    {/* Note */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Admin permission required
                    </p>

                    {/* Actions */}
                    <Link
                        to="/home"
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};