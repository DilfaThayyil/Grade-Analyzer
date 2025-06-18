'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Student } from './Dashboard';

interface StatsCardsProps {
    students: Student[];
}

export const StatsCards = ({ students }: StatsCardsProps) => {
    const totalStudents = students.length;
    const subjects = [...new Set(students.map(s => s.subject))];
    const totalSubjects = subjects.length;
    const overallAverage = Math.round((students.reduce((sum, s) => sum + s.marks, 0) / students.length) * 100) / 100;
    const topScore = Math.max(...students.map(s => s.marks));

    const stats = [
        {
            title: 'Total Students',
            value: totalStudents,
            icon: Users,
            color: 'blue',
            delay: 0.1
        },
        {
            title: 'Total Subjects',
            value: totalSubjects,
            icon: BookOpen,
            color: 'green',
            delay: 0.2
        },
        {
            title: 'Overall Average',
            value: `${overallAverage}%`,
            icon: TrendingUp,
            color: 'yellow',
            delay: 0.3
        },
        {
            title: 'Top Score',
            value: `${topScore}%`,
            icon: Award,
            color: 'purple',
            delay: 0.4
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stat.delay }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};