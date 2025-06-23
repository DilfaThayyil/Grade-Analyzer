'use client';

import { motion } from 'framer-motion';
import { Search, Mail, Calendar, ChevronDown, ChevronUp, Award, BookOpen } from 'lucide-react';
import { Student } from './Dashboard';
import { Pagination } from './Pagination';
import { useState } from 'react';
import React from 'react';

interface StudentsTableProps {
    students: Student[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    currentPage: number;
    onPageChange: (page: number) => void;
    totalStudents: number;
    itemsPerPage?: number;
}

export const StudentsTable = ({ students, searchTerm, onSearchChange, currentPage, onPageChange, totalStudents, itemsPerPage = 5 }: StudentsTableProps) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const groupedStudents = students.map((student) => ({
        ...student,
        averageMarks: Math.round(
            student.subjects.reduce((sum, sub) => sum + sub.marks, 0) / student.subjects.length
        ),
        totalSubjects: student.subjects.length,
    }));

    const toggleRowExpansion = (studentId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(studentId)) {
            newExpanded.delete(studentId);
        } else {
            newExpanded.add(studentId);
        }
        setExpandedRows(newExpanded);
    };

    const getGradeColor = (marks: number) => {
        if (marks >= 90) return 'text-green-600 bg-green-50 border-green-200';
        if (marks >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (marks >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getProgressColor = (marks: number) => {
        if (marks >= 90) return 'bg-green-500';
        if (marks >= 80) return 'bg-blue-500';
        if (marks >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Student Performance</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {groupedStudents.length} students • Click on any row to view detailed subject breakdown
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subjects
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Average Score
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Performance
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {groupedStudents.map((student, index) => (
                            <React.Fragment key={student.id}>
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => toggleRowExpansion(student.id)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {student.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {student.totalSubjects} Subject{student.totalSubjects > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {student.subjects.slice(0, 3).map((subject, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    {subject.subject}
                                                </span>
                                            ))}
                                            {student.subjects.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                    +{student.subjects.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <span className={`text-2xl font-bold ${getGradeColor(student.averageMarks).split(' ')[0]}`}>
                                                {student.averageMarks}%
                                            </span>
                                            <div className="flex-1 w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getProgressColor(student.averageMarks)}`}
                                                    style={{ width: `${student.averageMarks}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(student.averageMarks)}`}>
                                            <Award className="w-3 h-3 mr-1" />
                                            {student.averageMarks >= 90 ? 'Excellent' :
                                                student.averageMarks >= 80 ? 'Good' :
                                                    student.averageMarks >= 70 ? 'Average' : 'Needs Improvement'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-400">
                                            {expandedRows.has(student.id) ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                                
                                {expandedRows.has(student.id) && (
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-gray-50"
                                    >
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {student.subjects.map((subject, idx) => (
                                                    <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                                                            <span className={`text-lg font-bold ${getGradeColor(subject.marks).split(' ')[0]}`}>
                                                                {subject.marks}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                                            <div
                                                                className={`h-1.5 rounded-full ${getProgressColor(subject.marks)}`}
                                                                style={{ width: `${subject.marks}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {new Date(subject.examDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </motion.tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="lg:hidden">
                <div className="divide-y divide-gray-200">
                    {groupedStudents.map((student, index) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.email}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xl font-bold ${getGradeColor(student.averageMarks).split(' ')[0]}`}>
                                        {student.averageMarks}%
                                    </div>
                                    <div className="text-xs text-gray-500">{student.totalSubjects} subjects</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {student.subjects.map((subject, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                                                <span className={`text-sm font-semibold ${getGradeColor(subject.marks).split(' ')[0]}`}>
                                                    {subject.marks}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                                <div
                                                    className={`h-1.5 rounded-full ${getProgressColor(subject.marks)}`}
                                                    style={{ width: `${subject.marks}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(subject.examDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalStudents / itemsPerPage)}
                onPageChange={onPageChange}
                totalItems={totalStudents}
                itemsPerPage={itemsPerPage}
            />
        </motion.div>
    );
};