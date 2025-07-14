'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Schedule } from '@/src/types';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Clock, User, Package } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';

interface ScheduleCardProps {
  schedule: Schedule;
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const priorityColors = {
    HIGH: 'destructive',
    MEDIUM: 'warning',
    LOW: 'secondary',
  } as const;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      className="cursor-move"
    >
      <Card className="p-4 hover:border-primary/50 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-sm">{schedule.productCode}</h4>
            <p className="text-xs text-muted-foreground">{schedule.productName}</p>
          </div>
          <Badge variant={priorityColors[schedule.priority]} className="text-xs">
            {schedule.priority}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{schedule.operator}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(schedule.plannedStart)}</span>
          </div>

          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${schedule.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-right text-muted-foreground">{schedule.progress}%</p>
        </div>
      </Card>
    </motion.div>
  );
}