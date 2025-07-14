'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Machine } from '@/src/types';
import { STATUS_COLORS } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';
import { Clock, User, Package } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
  index: number;
}

export function MachineCard({ machine, index }: MachineCardProps) {
  const statusColor = STATUS_COLORS[machine.status];

  const statusGradients = {
    RUNNING: 'from-green-50 to-emerald-50',
    STOPPED: 'from-orange-50 to-amber-50',
    ALARM: 'from-red-50 to-rose-50',
    POWER_OFF: 'from-gray-50 to-slate-50'
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateX: -30 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      transition={{ 
        delay: index * 0.002,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)'
      }}
      className={cn(
        'relative p-4 rounded-xl cursor-pointer transition-all duration-300',
        `bg-gradient-to-br ${statusGradients[machine.status]}`,
        'border border-white/50 shadow-lg',
        'backdrop-blur-sm'
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-800">{machine.code}</span>
        <div className="relative">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          {machine.status === 'ALARM' ? (
            <>
              <div
                className="absolute inset-0 w-3 h-3 rounded-full animate-ping"
                style={{ backgroundColor: statusColor }}
              />
              <div
                className="absolute inset-0 w-3 h-3 rounded-full animate-ping animation-delay-200"
                style={{ backgroundColor: statusColor }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0 w-3 h-3 rounded-full animate-pulse opacity-75"
              style={{ backgroundColor: statusColor }}
            />
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div
            className="w-full h-1 rounded-full bg-muted"
            style={{
              background: `linear-gradient(to right, ${statusColor} ${machine.utilization}%, transparent ${machine.utilization}%)`,
            }}
          />
        </div>

        {machine.status === 'RUNNING' && (
          <>
            {machine.currentProduct && (
              <div className="flex items-center gap-1 text-xs">
                <Package className="h-3 w-3" />
                <span className="truncate">{machine.currentProduct}</span>
              </div>
            )}
            {machine.operator && (
              <div className="flex items-center gap-1 text-xs">
                <User className="h-3 w-3" />
                <span className="truncate">{machine.operator}</span>
              </div>
            )}
          </>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{machine.utilization}%</span>
        </div>
      </div>

    </motion.div>
  );
}