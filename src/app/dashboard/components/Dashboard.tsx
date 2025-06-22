'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { StatsCards } from './StatsCards';
import { FileUpload } from './FileUpload'
import { ChartsSection } from './ChartSection';
import { StudentsTable } from './StudentsTable';
import { UserAvatar } from './UserAvatar';
import debounce from 'lodash/debounce'
import axios from 'axios';
import { signOut } from 'next-auth/react';


export interface DashboardProps {
    userName: string;
    userImage: string;
}
export interface Subject {
    subject: string;
    marks: number;
    examDate: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    subjects: Subject[];
}


const Dashboard = ({ userName, userImage }: DashboardProps) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);

    const fetchStudentData = async (query: string, page: number) => {
        if (!userName) return;
        setLoading(true);
        try {
            const response = await axios.get(`/api/students?q=${query}&page=${page}&limit=5`);
            if (response.status === 200) {
                setStudents(response.data.students);
                setTotalStudents(response.data.total);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchStudentData = useCallback(
        debounce((query: string, page: number) => {
            fetchStudentData(query, page);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedFetchStudentData(searchTerm, currentPage);
        return () => {
            debouncedFetchStudentData.cancel();
        };
    }, [searchTerm, currentPage, debouncedFetchStudentData]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return
        const formData = new FormData()
        formData.append('file', file)
        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (response.status === 200) {
                const newStudents = response.data.students
                setStudents(prev => [...prev, ...newStudents])
            } else {
                console.error('Upload failed : ', response)
            }
        } catch (error) {
            console.error('Error uploading file : ', error)
        }
    };

    const handleFileDrop = (files: FileList) => {
        if (files.length > 0) {
            const fileDrop = {
                target: { files },
            } as React.ChangeEvent<HTMLInputElement>
            handleFileUpload(fileDrop)
        }
    };

    const exportData = () => {
        const csvContent = [
            ['Name', 'Email', 'Subject', 'Marks', 'Exam Date'],
            ...students.flatMap(student =>
                student.subjects.map(sub => [
                    student.name,
                    student.email,
                    sub.subject,
                    sub.marks.toString(),
                    sub.examDate
                ])
            )
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student-data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-serif">Grade Analyzer</h1>
                            <p className="text-gray-600 mt-1 ">Analyze and visualize student performance data</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={exportData}
                                className="flex items-center px-4 py-2  bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </button>
                            <UserAvatar
                                userName={userName}
                                userImage={userImage}
                                onLogout={() => signOut({ callbackUrl: '/login' })} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <FileUpload onFileUpload={handleFileUpload} onFileDrop={handleFileDrop} />
                </motion.div>

                <StudentsTable
                    students={students}
                    searchTerm={searchTerm}
                    onSearchChange={(term) => {
                        setSearchTerm(term);
                        setCurrentPage(1);
                    }}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalStudents={totalStudents}
                />

                <ChartsSection
                    students={students}
                    selectedSubject={selectedSubject}
                    onSubjectChange={setSelectedSubject}
                />
                <StatsCards students={students} />

            </div>
        </div>
    );
};

export default Dashboard;