import { useMemo } from "react";
import ApexChart from './ApexCharts'

interface ChartDataItem {
    subject: string;
    average: number;
}

interface BarChartComponentProps {
    data: ChartDataItem[];
}



export const BarChartComponent = ({ data }: BarChartComponentProps) => {
    const { chartData, options } = useMemo(() => {
        const series = [{
            name: 'Average Marks',
            data: data.map((item: ChartDataItem) => item.average),
            color: '#10B981'
        }];

        const chartOptions = {
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
                        reset: false
                    }
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: false,
                    columnWidth: '60%'
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: data.map((item: ChartDataItem) => item.subject),
                labels: {
                    style: {
                        fontSize: '12px',
                        colors: '#6b7280'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Average Marks',
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
                    const subject = w.globals.labels[dataPointIndex];
                    const average = series[seriesIndex][dataPointIndex];
                    return `
                    <div class="bg-white p-3 border border-gray-200 rounded-lg shadow text-gray-800">
                      <p class="font-semibold text-gray-900">${subject}</p>
                      <p class="text-green-600 font-medium">Avg Marks: ${average}%</p>
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
                    plotOptions: {
                        bar: {
                            columnWidth: '80%'
                        }
                    }
                }
            }]
        };

        return { chartData: series, options: chartOptions };
    }, [data]);

    return <ApexChart options={options} series={chartData} type="bar" height={320} />;
};