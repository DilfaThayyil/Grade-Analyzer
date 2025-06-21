import { useEffect, useMemo, useRef } from "react";
import { Student } from "../Dashboard";
import ApexChart from './ApexCharts'

interface PieChartComponentProps {
    students: Student[];
    selectedSubject: string;
}

type GradeKey = 'A (90-100)' | 'B (80-89)' | 'C (70-79)' | 'D (60-69)' | 'F (0-59)';

interface GradesCount {
    'A (90-100)': number;
    'B (80-89)': number;
    'C (70-79)': number;
    'D (60-69)': number;
    'F (0-59)': number;
}

export const PieChartComponent = ({ students, selectedSubject }: PieChartComponentProps) => {
    const { chartData, options } = useMemo(() => {
        const grades: GradesCount = {
            'A (90-100)': 0,
            'B (80-89)': 0,
            'C (70-79)': 0,
            'D (60-69)': 0,
            'F (0-59)': 0
        };

        students.forEach((student: Student) => {
            const relevantSubjects = selectedSubject === 'All'
                ? student.subjects
                : student.subjects.filter(sub => sub.subject === selectedSubject);
    
            relevantSubjects.forEach((subj) => {
                if (subj.marks >= 90) grades['A (90-100)']++;
                else if (subj.marks >= 80) grades['B (80-89)']++;
                else if (subj.marks >= 70) grades['C (70-79)']++;
                else if (subj.marks >= 60) grades['D (60-69)']++;
                else grades['F (0-59)']++;
            });
        });

        const labels = (Object.keys(grades) as GradeKey[]).filter((grade: GradeKey) => grades[grade] > 0);
        const series = labels.map((grade: GradeKey) => grades[grade]);

        const totalRelevantSubjects = series.reduce((sum, count) => sum + count, 0);
        const chartOptions = {
            chart: {
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800
                }
            },
            labels: labels,
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            legend: {
                position: 'bottom' as const,
                fontSize: '12px'
            },
            tooltip: {
                y: {
                    formatter: function (val: number): string {
                        const percentage = ((val / totalRelevantSubjects) * 100).toFixed(1);
                        return val + " students (" + percentage + "%)";
                    }
                }
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        height: 300
                    },
                    legend: {
                        position: 'bottom' as const
                    }
                }
            }]
        };

        return { chartData: series, options: chartOptions };
    }, [students,selectedSubject]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 400);

        return () => clearTimeout(timeout);
    }, [students,selectedSubject]);

    return <ApexChart options={options} series={chartData} type="pie" height={320} />;
};