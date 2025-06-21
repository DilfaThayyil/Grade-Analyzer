import { useMemo } from "react";
import ApexChart from "./ApexCharts";
import { Student } from "../Dashboard";
import { ApexOptions } from "apexcharts";

interface SubjectDataItem {
    date: Date;
    marks: number;
    name: string;
}

type SubjectData = {
    [subject: string]: SubjectDataItem[];
};

export const AreaChartComponent = ({ students }: { students: Student[] }) => {
    const { chartData, options } = useMemo(() => {
        const subjectData: SubjectData = {};

        students.forEach((student) => {
            student.subjects.forEach((subject) => {
                if (!subjectData[subject.subject]) {
                    subjectData[subject.subject] = [];
                }
                subjectData[subject.subject].push({
                    date: new Date(subject.examDate),
                    marks: subject.marks,
                    name: student.name,
                });
            });
        });

        const series = Object.keys(subjectData).map((subject: string, index: number) => {
            const sorted = subjectData[subject].sort(
                (a: SubjectDataItem, b: SubjectDataItem) => a.date.getTime() - b.date.getTime()
            );
            const data = sorted.map((item: SubjectDataItem, idx: number) => ({
                x: `Exam ${idx + 1}`,
                y: item.marks,
            }));

            return {
                name: subject,
                data: data,
                color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
            };
        });

        const chartOptions: ApexOptions = {
            chart: {
                toolbar: {
                    show: true,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false,
                    },
                },
                animations: {
                    enabled: true,
                    animateGradually: {
                        enabled: true,
                        delay: 150,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 800,
                    },
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.1,
                    stops: [0, 90, 100],
                },
            },
            xaxis: {
                labels: {
                    style: {
                        fontSize: '12px',
                        colors: '#6b7280',
                    },
                },
            },
            yaxis: {
                title: {
                    text: 'Marks',
                    style: {
                        color: '#6b7280',
                        fontSize: '14px',
                    },
                },
                labels: {
                    style: {
                        colors: '#6b7280',
                    },
                },
            },
            grid: {
                borderColor: '#f0f0f0',
                strokeDashArray: 3,
            },
            legend: {
                position: 'top',
                fontSize: '12px',
            },
            tooltip: {
                shared: true,
                custom: function ({
                    series,
                    seriesIndex,
                    dataPointIndex,
                    w
                }: {
                    series: number[][];
                    seriesIndex: number;
                    dataPointIndex: number;
                    w: any;
                }) {
                    const labels = w.globals.labels;
                    const subjectNames = w.globals.seriesNames;

                    let tooltipHTML = `<div class="bg-white p-3 border border-gray-200 rounded-lg shadow text-gray-800">`;
                    tooltipHTML += `<p class="text-sm font-semibold text-gray-700 mb-2">${labels[dataPointIndex]}</p>`;

                    subjectNames.forEach((subject: string, i: number) => {
                        const value = series[i][dataPointIndex];
                        if (value !== null && value !== undefined) {
                            tooltipHTML += `
                        <div class="flex justify-between items-center">
                          <span class="text-sm text-gray-600">${subject}</span>
                          <span class="text-sm font-medium text-emerald-600 ml-2">${value} marks</span>
                        </div>`;
                        }
                    });

                    tooltipHTML += `</div>`;
                    return tooltipHTML;
                }
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            height: 300,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        return { chartData: series, options: chartOptions };
    }, [students]);

    return <ApexChart options={options} series={chartData} type="area" height={320} />;
};
