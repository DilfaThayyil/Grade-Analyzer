'use client';
import { useState, useRef, useEffect } from 'react';

interface UserAvatarProps {
    userName: string;
    userImage: string;
    onLogout?: () => void;
}

export const UserAvatar = ({ userName, userImage, onLogout }: UserAvatarProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string): string => {
        if (!name) return '';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0][0]?.toUpperCase() || '';
        }
        return (words[0][0] + words[1][0]).toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        onLogout?.();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition-shadow outline-none ring-2 ring-purple-500 ring-offset-2"
            >
                {userImage ? (
                    <img
                        src={userImage}
                        alt={userName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {getInitials(userName)}
                    </div>
                )}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {userName}
                            </p>
                        </div>
                        
                        <div className="border-t border-gray-100"></div>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};