'use client';

import React from 'react';
import { Machine } from '@/src/types';
import { MachineCard } from './MachineCard';

interface MachineGridProps {
  machines: Machine[];
}

export function MachineGrid({ machines }: MachineGridProps) {
  return (
    <div className="grid grid-cols-10 gap-2 p-4">
      {machines.map((machine, index) => (
        <MachineCard key={machine.id} machine={machine} index={index} />
      ))}
    </div>
  );
}