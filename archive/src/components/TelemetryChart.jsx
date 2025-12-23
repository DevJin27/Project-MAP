
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TelemetryChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0.8,
        to: 0.2,
        loop: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    }
  };

  const chartData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Altitude (m)',
        data: data.map(item => item.altitude),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Speed (m/s)',
        data: data.map(item => item.speed),
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Battery (%)',
        data: data.map(item => item.battery),
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  return (
    <div className="chart-container">
      {data.length > 0 ? (
        <Line options={options} data={chartData} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Waiting for telemetry data...</p>
        </div>
      )}
    </div>
  );
};

export default TelemetryChart;
