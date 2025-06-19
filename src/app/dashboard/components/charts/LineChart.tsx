import React, { useMemo } from 'react';
import ApexChart from './ApexCharts';
import { Student } from '../Dashboard';

interface LineChartProps {
    students: Student[],
    selectedSubject: string
}

export const LineChartComponent = ({ students, selectedSubject }: LineChartProps) => {
    const { chartData, options } = useMemo(() => {
        const filteredData = selectedSubject === 'All'
            ? students
            : students.filter(s => s.subject === selectedSubject);

        const categories = filteredData.map(student => student.name.split(' ')[0]);
        const data = filteredData.map(student => student.marks);

        const series = [{
            name: 'Marks',
            data: data,
            color: '#3B82F6'
        }];

        const chartOptions = {
            chart: {
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                    }
                },
                animations: {
                    enabled: true,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 800
                    }
                }
            },
            stroke: {
                curve: 'smooth' as const,
                width: 3
            },
            markers: {
                size: 6,
                colors: ['#3B82F6'],
                strokeColors: '#fff',
                strokeWidth: 2,
                hover: {
                    size: 8
                }
            },
            xaxis: {
                categories: categories,
                labels: {
                    style: {
                        fontSize: '12px',
                        colors: '#6b7280'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Marks',
                    style: {
                        color: '#6b7280',
                        fontSize: '14px'
                    }
                },
                labels: {
                    style: {
                        colors: '#6b7280'
                    }
                }
            },
            grid: {
                borderColor: '#f0f0f0',
                strokeDashArray: 3
            },
            tooltip: {
                custom: function ({
                    dataPointIndex
                }: {
                    dataPointIndex: number;
                    series?: unknown;
                    seriesIndex?: number;
                    w?: unknown;
                }) {
                    const student = filteredData[dataPointIndex];
                    return `
              <div class="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p class="font-semibold text-gray-900">${student.name}</p>
                <p class="text-sm text-gray-600">Subject: ${student.subject}</p>
                <p class="text-blue-600 font-medium">Marks: ${student.marks}</p>
              </div>
            `;
                }
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        height: 300
                    },
                    xaxis: {
                        labels: {
                            rotate: -45
                        }
                    }
                }
            }]
        };

        return { chartData: series, options: chartOptions };
    }, [students, selectedSubject]);

    return <ApexChart options={options} series={chartData} type="line" height={320} />;
};