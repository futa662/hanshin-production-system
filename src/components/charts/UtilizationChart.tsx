'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { date: '12/14', utilization: 85 },
  { date: '12/15', utilization: 88 },
  { date: '12/16', utilization: 82 },
  { date: '12/17', utilization: 91 },
  { date: '12/18', utilization: 87 },
  { date: '12/19', utilization: 93 },
  { date: '12/20', utilization: 89 },
];

export function UtilizationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUtilization" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          formatter={(value: any) => [`${value}%`, '稼働率']}
        />
        <Area
          type="monotone"
          dataKey="utilization"
          stroke="#10B981"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorUtilization)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}