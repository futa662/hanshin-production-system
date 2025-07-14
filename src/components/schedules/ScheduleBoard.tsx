'use client';

import React from 'react';
import { Schedule, Machine } from '@/src/types';
import { ScheduleCard } from './ScheduleCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

interface ScheduleBoardProps {
  schedules: Schedule[];
  machines: Machine[];
}

export function ScheduleBoard({ schedules, machines }: ScheduleBoardProps) {
  const machineSchedules = machines.slice(0, 6).map((machine) => ({
    machine,
    schedules: schedules.filter((s) => s.machineId === machine.id),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {machineSchedules.map(({ machine, schedules }) => (
        <Card key={machine.id} className="h-[500px] overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{machine.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                machine.status === 'RUNNING' ? 'bg-green-500/20 text-green-600' :
                machine.status === 'STOPPED' ? 'bg-orange-500/20 text-orange-600' :
                machine.status === 'ALARM' ? 'bg-red-500/20 text-red-600 animate-pulse' :
                'bg-gray-500/20 text-gray-600'
              }`}>
                {machine.status === 'RUNNING' ? '稼働中' :
                 machine.status === 'STOPPED' ? '停止中' :
                 machine.status === 'ALARM' ? 'アラーム' : '電源オフ'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 overflow-y-auto h-[420px]">
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                スケジュールなし
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}