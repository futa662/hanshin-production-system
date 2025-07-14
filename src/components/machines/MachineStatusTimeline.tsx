'use client';

import React, { useState } from 'react';
import { Machine, MachineLog } from '@/src/types';
import { STATUS_COLORS } from '@/src/lib/constants';
import { AlertTriangle, Power, Pause, Play } from 'lucide-react';

interface MachineStatusTimelineProps {
  machine: Machine;
  logs: MachineLog[];
}

interface StatusSegment {
  status: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  percentage: number;
  reason?: string;
}

const STATUS_ICONS = {
  RUNNING: Play,
  STOPPED: Pause,
  ALARM: AlertTriangle,
  POWER_OFF: Power
};

const STATUS_LABELS = {
  RUNNING: '稼働中',
  STOPPED: '停止中',
  ALARM: 'アラーム',
  POWER_OFF: '電源オフ'
};

export function MachineStatusTimeline({ machine, logs }: MachineStatusTimelineProps) {
  const [hoveredSegment, setHoveredSegment] = useState<StatusSegment | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // 過去24時間のログをフィルタリング
  const relevantLogs = logs
    .filter(log => log.machineId === machine.id && log.timestamp >= twentyFourHoursAgo)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // 連続的なセグメントを生成
  const segments: StatusSegment[] = [];
  let currentStatus = relevantLogs[0]?.status || machine.status;
  let segmentStart = twentyFourHoursAgo;

  relevantLogs.forEach((log, index) => {
    if (log.status !== currentStatus) {
      const segment: StatusSegment = {
        status: currentStatus,
        startTime: segmentStart,
        endTime: log.timestamp,
        duration: (log.timestamp.getTime() - segmentStart.getTime()) / 1000 / 60,
        percentage: ((log.timestamp.getTime() - segmentStart.getTime()) / (24 * 60 * 60 * 1000)) * 100,
        reason: log.reason
      };
      segments.push(segment);
      currentStatus = log.status;
      segmentStart = log.timestamp;
    }
  });

  // 最後のセグメントを追加
  segments.push({
    status: currentStatus,
    startTime: segmentStart,
    endTime: now,
    duration: (now.getTime() - segmentStart.getTime()) / 1000 / 60,
    percentage: ((now.getTime() - segmentStart.getTime()) / (24 * 60 * 60 * 1000)) * 100
  });

  // 稼働率の計算
  const runningTime = segments
    .filter(s => s.status === 'RUNNING')
    .reduce((sum, s) => sum + s.duration, 0);
  const utilizationRate = Math.round((runningTime / (24 * 60)) * 100);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-900">{machine.code}</span>
          <span className="text-sm text-gray-500">{machine.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-2xl font-semibold text-gray-900">{utilizationRate}%</span>
            <span className="text-xs text-gray-500 ml-1">稼働率</span>
          </div>
        </div>
      </div>

      {/* タイムライン */}
      <div className="relative">
        <div 
          className="h-8 bg-gray-100 rounded overflow-hidden relative cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          {segments.map((segment, index) => (
            <div
              key={index}
              className="absolute top-0 h-full transition-opacity duration-150"
              style={{
                left: `${segments.slice(0, index).reduce((sum, s) => sum + s.percentage, 0)}%`,
                width: `${segment.percentage}%`,
                backgroundColor: STATUS_COLORS[segment.status as keyof typeof STATUS_COLORS],
                opacity: hoveredSegment === segment ? 1 : 0.9
              }}
              onMouseEnter={() => setHoveredSegment(segment)}
            />
          ))}
        </div>

        {/* 時刻マーカー */}
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>24時間前</span>
          <span>12時間前</span>
          <span>現在</span>
        </div>
      </div>

      {/* ホバー時の詳細情報 */}
      {hoveredSegment && (
        <div 
          className="absolute bg-gray-900 text-white p-2 rounded text-xs shadow-lg z-10 pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y - 70,
            transform: 'translateX(-50%)'
          }}
        >
          <p className="font-medium">{STATUS_LABELS[hoveredSegment.status as keyof typeof STATUS_LABELS]}</p>
          <p className="opacity-80">
            {hoveredSegment.startTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} - 
            {hoveredSegment.endTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="opacity-80">{Math.round(hoveredSegment.duration)}分</p>
          {hoveredSegment.reason && (
            <p className="text-yellow-300 mt-1">理由: {hoveredSegment.reason}</p>
          )}
        </div>
      )}
    </div>
  );
}