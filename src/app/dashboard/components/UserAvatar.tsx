'use client';

interface UserAvatarProps {
    userName: string;
}

export const UserAvatar = ({ userName }: UserAvatarProps) => {
    const getInitials = (name: string): string => {
        if (!name) return '';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0][0]?.toUpperCase() || '';
        }
        return (words[0][0] + words[1][0]).toUpperCase();
    };

    return (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(userName)}
        </div>
    );
};