'use client';

import { motion } from 'framer-motion';
import { Filter, LineChart, BarChart3, PieChart, Activity } from 'lucide-react';
import { Student } from './Dashboard';
import { LineChartComponent } from './charts/LineChart';
import { BarChartComponent } from './charts/BarChart';
import { PieChartComponent } from './charts/PieChart';
import { AreaChartComponent } from './charts/AreaChart';

interface ChartsSectionProps {
    students: Student[];
    selectedSubject: string;
    onSubjectChange: (subject: string) => void;
}

export const ChartsSection = ({ students, selectedSubject, onSubjectChange }: ChartsSectionProps) => {
    const allSubjects = students.flatMap((student) =>
        student.subjects.map((subj) => subj.subject)
    );

    const uniqueSubjects = [...new Set(allSubjects)];

    const averageMarksPerSubject = uniqueSubjects.map((subject) => {
        const allMarks = students.flatMap((student) =>
            student.subjects
                .filter((s) => s.subject === subject)
                .map((s) => s.marks)
        );
        const avg =
            allMarks.reduce((sum, mark) => sum + mark, 0) / allMarks.length || 0;
        return { subject, average: Math.round(avg * 100) / 100 };
    });

    const flattenedStudents = students.flatMap((student) =>
        student.subjects.map((s) => ({
            name: student.name,
            subject: s.subject,
            marks: s.marks,
            examDate: s.examDate,
        }))
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pt-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                        Student Performance
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={selectedSubject}
                            onChange={(e) => onSubjectChange(e.target.value)}
                            className="border border-gray-300 text-gray-500 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Subjects</option>
                            {uniqueSubjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <LineChartComponent students={students} selectedSubject={selectedSubject} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Average by Subject
                </h3>
                <BarChartComponent data={averageMarksPerSubject} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                    Grade Distribution
                </h3>
                <PieChartComponent students={students} selectedSubject={selectedSubject} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-red-600" />
                    Performance Trends
                </h3>
                <AreaChartComponent students={students} />
            </motion.div>
        </div>
    );
};