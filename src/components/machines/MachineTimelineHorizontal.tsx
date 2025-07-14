'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Machine, MachineLog } from '@/src/types';
import { Card } from '@/src/components/ui/card';
import { Info } from 'lucide-react';

interface MachineTimelineHorizontalProps {
  machine: Machine;
  logs: MachineLog[];
  date?: Date;
}

const STATUS_COLORS = {
  RUNNING: '#10b981',
  STOPPED: '#f59e0b',
  ALARM: '#ef4444',
  POWER_OFF: '#9ca3af',
  IDLE: '#e5e7eb'
} as const;

export function MachineTimelineHorizontal({ machine, logs, date = new Date() }: MachineTimelineHorizontalProps) {
  // 24時間分のタイムラインを生成
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // 該当日のログをフィルタリング
  const dayLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate.toDateString() === date.toDateString() && log.machineId === machine.id;
  });

  // 時間ごとの状態を計算
  const getStatusForHour = (hour: number) => {
    const hourStart = new Date(date);
    hourStart.setHours(hour, 0, 0, 0);
    const hourEnd = new Date(date);
    hourEnd.setHours(hour + 1, 0, 0, 0);

    const relevantLog = dayLogs.find(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= hourStart && logTime < hourEnd;
    });

    return relevantLog?.status || 'IDLE';
  };

  // 稼働率の計算
  const utilizationRate = Math.round(
    (dayLogs.filter(log => log.status === 'RUNNING').length / dayLogs.length) * 100
  ) || 0;

  return (
    <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        {/* 機械情報パネル */}
        <div className="w-48 p-4 bg-gradient-to-r from-gray-50 to-white border-r border-gray-100">
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-gray-900">{machine.code}</h3>
              <p className="text-xs text-gray-500">{machine.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-gray-900">{utilizationRate}%</div>
              <div className="text-xs text-gray-500">稼働率</div>
            </div>
          </div>
        </div>

        {/* タイムライン */}
        <div className="flex-1 relative">
          <div className="flex h-20">
            {hours.map((hour) => {
              const status = getStatusForHour(hour);
              const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS];
              
              return (
                <motion.div
                  key={hour}
                  className="flex-1 relative group"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: hour * 0.01 }}
                >
                  <div 
                    className="h-full border-r border-gray-100 transition-all duration-200 group-hover:scale-105"
                    style={{ backgroundColor: color }}
                  />
                  
                  {/* ホバー時の時刻表示 */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {hour}:00
                    </div>
                  </div>

                  {/* 停止理由のツールチップ */}
                  {status === 'STOPPED' && (
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Info className="h-3 w-3 text-white" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 時刻目盛り */}
          <div className="flex absolute bottom-0 left-0 right-0 h-6 bg-gray-50 border-t border-gray-100">
            {[0, 6, 12, 18, 24].map((hour) => (
              <div
                key={hour}
                className="absolute text-xs text-gray-500"
                style={{ left: `${(hour / 24) * 100}%`, transform: 'translateX(-50%)' }}
              >
                {hour}:00
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}