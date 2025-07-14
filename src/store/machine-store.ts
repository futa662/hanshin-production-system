import { create } from 'zustand';
import { Machine, Schedule, MachineLog } from '@/src/types';
import { generateMachines, generateSchedules, generateMachineLogs } from '@/src/lib/mock-data';
import { pickRandom } from '@/src/lib/utils';

interface MachineStore {
  machines: Machine[];
  schedules: Schedule[];
  logs: MachineLog[];
  updateMachineStatus: () => void;
  updateScheduleProgress: () => void;
  initializeData: () => void;
}

export const useMachineStore = create<MachineStore>((set, get) => ({
  machines: [],
  schedules: [],
  logs: [],
  
  initializeData: () => {
    const machines = generateMachines();
    const schedules = generateSchedules(machines);
    const logs = generateMachineLogs(machines);
    set({ machines, schedules, logs });
  },
  
  updateMachineStatus: () => {
    set((state) => {
      const updatedMachines = state.machines.map(machine => {
        if (Math.random() < 0.05) {
          const newStatus = pickRandom(['RUNNING', 'STOPPED', 'ALARM', 'POWER_OFF'] as const);
          return {
            ...machine,
            status: newStatus,
            lastStatusChange: new Date(),
            utilization: machine.utilization + (Math.random() * 2 - 1)
          };
        }
        return machine;
      });
      return { machines: updatedMachines };
    });
  },
  
  updateScheduleProgress: () => {
    set((state) => {
      const updatedSchedules = state.schedules.map(schedule => {
        if (schedule.actualStart && schedule.progress < 100) {
          return {
            ...schedule,
            progress: Math.min(100, schedule.progress + Math.random() * 5)
          };
        }
        return schedule;
      });
      return { schedules: updatedSchedules };
    });
  }
}));