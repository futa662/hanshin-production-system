'use client';

import React from 'react';
import { Machine, MachineLog } from '@/src/types';
import { STATUS_COLORS } from '@/src/lib/constants';
import { formatDate } from '@/src/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Clock, AlertCircle, PlayCircle, PauseCircle } from 'lucide-react';

interface MachineTimelineProps {
  machine: Machine;
  logs: MachineLog[];
}

export function MachineTimeline({ machine, logs }: MachineTimelineProps) {
  const machineLogs = logs
    .filter(log => log.machineId === machine.id)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 20);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      case 'STOPPED':
        return <PauseCircle className="h-4 w-4 text-orange-600" />;
      case 'ALARM':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'POWER_OFF':
        return <PauseCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'success';
      case 'STOPPED':
        return 'warning';
      case 'ALARM':
        return 'destructive';
      case 'POWER_OFF':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{machine.name} - 稼働履歴</span>
          <Badge variant={getStatusBadge(machine.status)}>
            現在: {machine.status === 'RUNNING' ? '稼働中' : 
                   machine.status === 'STOPPED' ? '停止中' : 
                   machine.status === 'ALARM' ? 'アラーム' : '電源オフ'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-4">
            {machineLogs.map((log, index) => (
              <div key={`${log.machineId}-${index}`} className="relative flex items-start">
                <div className="absolute left-2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                <div className="ml-8 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <Badge variant={getStatusBadge(log.status)}>
                      {log.status === 'RUNNING' ? '稼働開始' : 
                       log.status === 'STOPPED' ? '停止' : 
                       log.status === 'ALARM' ? 'アラーム発生' : '電源オフ'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{log.duration}分間</span>
                    </div>
                    {log.reason && (
                      <p className="mt-1 text-red-600">理由: {log.reason}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}