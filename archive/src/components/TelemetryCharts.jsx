
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const timeRanges = [
  { value: 5, label: '5 Minutes' },
  { value: 15, label: '15 Minutes' },
  { value: 60, label: '1 Hour' }
];

const TelemetryCharts = ({ data }) => {
  const [activeRange, setActiveRange] = useState(5);
  
  // Filter data to show only the selected time range
  const filterDataByTimeRange = (range) => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - range * 60 * 1000);
    
    return data.filter(item => new Date(item.timestamp) >= cutoffTime);
  };
  
  const displayData = filterDataByTimeRange(activeRange);
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle>Live Telemetry</CardTitle>
          <Tabs defaultValue={activeRange.toString()}>
            <TabsList>
              {timeRanges.map(range => (
                <TabsTrigger 
                  key={range.value}
                  value={range.value.toString()}
                  onClick={() => setActiveRange(range.value)}
                >
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* Battery Chart */}
          <div className="h-[250px] w-full bg-card/50 rounded-lg p-4 border border-border/50">
            <h3 className="text-sm font-medium mb-2 text-[#2ecc71]">Battery (%)</h3>
            {displayData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTime}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    labelFormatter={label => formatTime(label)}
                    formatter={(value) => [`${value}%`, 'Battery']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="battery" 
                    stroke="#2ecc71" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    name="Battery"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Waiting for data...</p>
              </div>
            )}
          </div>
          
          {/* Altitude Chart */}
          <div className="h-[250px] w-full bg-card/50 rounded-lg p-4 border border-border/50">
            <h3 className="text-sm font-medium mb-2 text-[#3498db]">Altitude (m)</h3>
            {displayData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTime}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    labelFormatter={label => formatTime(label)}
                    formatter={(value) => [`${value}m`, 'Altitude']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="altitude" 
                    stroke="#3498db" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    name="Altitude"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Waiting for data...</p>
              </div>
            )}
          </div>
          
          {/* Speed Chart */}
          <div className="h-[250px] w-full bg-card/50 rounded-lg p-4 border border-border/50">
            <h3 className="text-sm font-medium mb-2 text-[#e74c3c]">Speed (m/s)</h3>
            {displayData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTime}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    labelFormatter={label => formatTime(label)}
                    formatter={(value) => [`${value}m/s`, 'Speed']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#e74c3c" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    name="Speed"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Waiting for data...</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryCharts;
