
import React, { useState } from 'react';
import { Battery, ArrowUp, Gauge } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const iconMap = {
  'battery': Battery,
  'altitude': ArrowUp,
  'speed': Gauge
};

const colorMap = {
  'drone-battery': 'text-[#2ecc71]',
  'drone-altitude': 'text-[#3498db]',
  'drone-speed': 'text-[#e74c3c]',
}

const bgColorMap = {
  'drone-battery': 'bg-[#2ecc71]/10',
  'drone-altitude': 'bg-[#3498db]/10',
  'drone-speed': 'bg-[#e74c3c]/10',
}

const borderMap = {
  'drone-battery': 'group-hover:border-[#2ecc71]/30',
  'drone-altitude': 'group-hover:border-[#3498db]/30',
  'drone-speed': 'group-hover:border-[#e74c3c]/30',
}

// This function creates dummy historical data for the modal
const generateDummyHistory = (type, currentValue) => {
  const data = [];
  const now = new Date();
  const baseValue = currentValue ? parseFloat(currentValue) : 50;
  
  for (let i = 15; i >= 0; i--) {
    const pastTime = new Date(now.getTime() - i * 60000);
    const value = type === 'battery' 
      ? Math.max(0, Math.min(100, baseValue - i * 0.2 + Math.random() * 2))
      : baseValue + (Math.random() - 0.5) * 10;
    
    data.push({
      time: pastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(value * 10) / 10
    });
  }
  
  return data;
};

const StatusCard = ({ title, value, icon, color }) => {
  const Icon = iconMap[icon] || Battery;
  const textColor = colorMap[color] || 'text-primary';
  const bgColor = bgColorMap[color] || 'bg-primary/10';
  const borderColor = borderMap[color] || 'group-hover:border-primary/30';
  
  const [historyData, setHistoryData] = useState(() => 
    generateDummyHistory(icon, value?.replace(/[^0-9.]/g, ''))
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={`group cursor-pointer transition-all hover:shadow-md ${borderColor}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className={`text-2xl font-bold ${textColor} transition-all`}>{value}</p>
              </div>
              <div className={`${textColor} ${bgColor} p-3 rounded-full transition-all group-hover:scale-110`}>
                <Icon size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={textColor} size={18} /> {title} History
          </DialogTitle>
          <DialogDescription>
            Historical data for the last 15 minutes
          </DialogDescription>
        </DialogHeader>
        <div className="h-[250px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historyData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color === 'drone-battery' ? '#2ecc71' : 
                       (color === 'drone-altitude' ? '#3498db' : '#e74c3c')} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusCard;
