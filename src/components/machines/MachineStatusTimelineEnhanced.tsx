'use client';

import React, { useState, useMemo } from 'react';
import { Machine, MachineLog } from '@/src/types';
import { STATUS_COLORS } from '@/src/lib/constants';
import { AlertTriangle, Power, Pause, Play, Clock } from 'lucide-react';
import { format, subHours, subDays, subWeeks, differenceInMinutes } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

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

type TimeRange = '1h' | '12h' | '24h' | '1w';

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

const TIME_RANGES: Record<TimeRange, { label: string; hours: number }> = {
  '1h': { label: '1時間', hours: 1 },
  '12h': { label: '12時間', hours: 12 },
  '24h': { label: '24時間', hours: 24 },
  '1w': { label: '1週間', hours: 168 }
};

export function MachineStatusTimelineEnhanced({ machine, logs }: MachineStatusTimelineProps) {
  const [hoveredSegment, setHoveredSegment] = useState<StatusSegment | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  
  const now = useMemo(() => new Date(), []);
  const rangeHours = TIME_RANGES[selectedRange].hours;
  const startTime = useMemo(() => new Date(now.getTime() - rangeHours * 60 * 60 * 1000), [now, rangeHours]);

  // 時間軸のマーカーを計算
  const timeMarkers = useMemo(() => {
    const markers = [];
    let interval: number;
    let formatStr: string;

    if (selectedRange === '1h') {
      interval = 10; // 10分間隔
      formatStr = 'HH:mm';
    } else if (selectedRange === '12h') {
      interval = 60; // 1時間間隔
      formatStr = 'HH:mm';
    } else if (selectedRange === '24h') {
      interval = 120; // 2時間間隔
      formatStr = 'HH:mm';
    } else {
      interval = 1440; // 1日間隔
      formatStr = 'M/d';
    }

    const markerCount = Math.floor((rangeHours * 60) / interval);
    for (let i = 0; i <= markerCount; i++) {
      const time = new Date(startTime.getTime() + i * interval * 60 * 1000);
      markers.push({
        time,
        label: formatStr === 'M/d' 
          ? format(time, formatStr, { locale: ja }) 
          : format(time, formatStr),
        position: (i / markerCount) * 100
      });
    }

    return markers;
  }, [selectedRange, startTime, rangeHours]);

  // ログをフィルタリングして関連するものだけ取得
  const relevantLogs = logs
    .filter(log => log.machineId === machine.id && log.timestamp >= startTime)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // 連続的なセグメントを生成
  const segments: StatusSegment[] = [];
  let currentStatus = relevantLogs[0]?.status || machine.status;
  let segmentStart = startTime;

  relevantLogs.forEach((log, index) => {
    const segmentEnd = log.timestamp;
    const duration = segmentEnd.getTime() - segmentStart.getTime();
    const percentage = (duration / (rangeHours * 60 * 60 * 1000)) * 100;

    if (percentage > 0) {
      segments.push({
        status: currentStatus,
        startTime: segmentStart,
        endTime: segmentEnd,
        duration,
        percentage,
        reason: log.reason
      });
    }

    currentStatus = log.status;
    segmentStart = segmentEnd;
  });

  // 最後のセグメントを追加
  const finalDuration = now.getTime() - segmentStart.getTime();
  const finalPercentage = (finalDuration / (rangeHours * 60 * 60 * 1000)) * 100;
  
  if (finalPercentage > 0) {
    segments.push({
      status: currentStatus,
      startTime: segmentStart,
      endTime: now,
      duration: finalDuration,
      percentage: finalPercentage
    });
  }

  // 稼働統計を計算
  const statistics = segments.reduce((acc, segment) => {
    if (!acc[segment.status]) {
      acc[segment.status] = 0;
    }
    acc[segment.status] += segment.duration;
    return acc;
  }, {} as Record<string, number>);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900">稼働タイムライン</h3>
            <div className="flex items-center gap-1">
              {Object.entries(STATUS_LABELS).map(([status, label]) => (
                <div key={status} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}
                  />
                  <span className="text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 期間選択ボタン */}
          <div className="flex items-center gap-1">
            {Object.entries(TIME_RANGES).map(([key, { label }]) => (
              <Button
                key={key}
                size="sm"
                variant={selectedRange === key ? 'default' : 'outline'}
                onClick={() => setSelectedRange(key as TimeRange)}
                className="px-3 py-1 text-xs"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* タイムライン */}
        <div className="relative">
          {/* 時間軸 */}
          <div className="relative h-8 mb-2">
            {timeMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{ left: `${marker.position}%` }}
              >
                <div className="w-px h-2 bg-gray-300" />
                <span className="text-xs text-gray-500 mt-1 transform -translate-x-1/2">
                  {marker.label}
                </span>
              </div>
            ))}
          </div>

          {/* ステータスバー */}
          <div 
            className="relative h-12 bg-gray-100 rounded-lg overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {segments.map((segment, index) => (
              <div
                key={index}
                className="absolute top-0 h-full transition-opacity duration-150 cursor-pointer"
                style={{
                  left: `${segments.slice(0, index).reduce((sum, s) => sum + s.percentage, 0)}%`,
                  width: `${segment.percentage}%`,
                  backgroundColor: STATUS_COLORS[segment.status as keyof typeof STATUS_COLORS],
                  opacity: hoveredSegment === segment ? 0.8 : 1
                }}
                onMouseEnter={() => setHoveredSegment(segment)}
              />
            ))}
            
            {/* 現在時刻のマーカー */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ right: '0%' }}
            >
              <div className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-4 gap-2 text-sm">
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const duration = statistics[status] || 0;
            const percentage = (duration / (rangeHours * 60 * 60 * 1000)) * 100;
            const hours = Math.floor(duration / (60 * 60 * 1000));
            const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
            
            return (
              <div key={status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">{label}:</span>
                <span className="font-medium">
                  {hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`} ({percentage.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* ホバー時のツールチップ */}
        {hoveredSegment && (
          <div 
            className="fixed z-50 bg-gray-900 text-white text-xs rounded px-3 py-2 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 40
            }}
          >
            <p className="font-medium">{STATUS_LABELS[hoveredSegment.status as keyof typeof STATUS_LABELS]}</p>
            <p className="opacity-80">
              {format(hoveredSegment.startTime, 'HH:mm', { locale: ja })} - 
              {format(hoveredSegment.endTime, 'HH:mm', { locale: ja })}
            </p>
            <p className="opacity-80">
              継続時間: {Math.floor(hoveredSegment.duration / (60 * 1000))}分
            </p>
            {hoveredSegment.reason && (
              <p className="opacity-80 mt-1">理由: {hoveredSegment.reason}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}