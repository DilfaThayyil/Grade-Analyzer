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
                        download: true,
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
                y: {
                    formatter: function (val: number): string {
                        return val + "%";
                    }
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