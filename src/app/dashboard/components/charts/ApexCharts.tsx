import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading chart...</span>
    </div>
});

export default Chart;