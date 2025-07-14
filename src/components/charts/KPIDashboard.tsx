'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { KPIData } from '@/src/types';

interface KPIDashboardProps {
  kpiData: KPIData;
}

const COLORS = ['#10b981', '#f59e0b', '#6b7280'];

export function KPIDashboard({ kpiData }: KPIDashboardProps) {
  const pieData = [
    { name: '生産中', value: kpiData.machineCount.production },
    { name: '停止', value: kpiData.machineCount.stopped },
    { name: 'アイドル', value: kpiData.machineCount.idle },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>機械稼働状況内訳</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm">
                  {entry.name}: {entry.value}台
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>停止理由の内訳</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpiData.stoppageReasons.map((reason) => (
              <div key={reason.reason}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{reason.reason}</span>
                  <span className="text-muted-foreground">{reason.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>機械別稼働率ランキング（TOP10）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {kpiData.topMachines.map((machine, index) => (
              <div key={machine.machineId} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-muted-foreground w-8">
                  {index + 1}
                </span>
                <span className="flex-1">{machine.machineId}</span>
                <div className="flex items-center gap-2 w-32">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${machine.utilization}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {machine.utilization}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}