'use client';

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface ChartProps {
  data: { name: string; value: number }[];
}

export default function UserGrowthChart({ data }: ChartProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Tăng trưởng Học viên (7 ngày qua)</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#888' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#6366f1" // Màu Indigo-500
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}