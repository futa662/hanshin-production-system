export type MachineStatus = 'RUNNING' | 'STOPPED' | 'ALARM' | 'POWER_OFF';
export type MachineCategory = 'NC_LATHE' | 'CRANKSHAFT_LATHE' | 'NC_MACHINING' | 'FIVE_AXIS';

export interface Machine {
  id: string;
  code: string;
  name: string;
  category: MachineCategory;
  status: MachineStatus;
  operator?: string;
  lastStatusChange: Date;
  utilization: number;
  currentProduct?: string;
}

export interface MachineLog {
  machineId: string;
  status: MachineStatus;
  timestamp: Date;
  duration: number;
  reason?: string;
}

export interface Schedule {
  id: string;
  productCode: string;
  productName: string;
  machineId: string;
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  progress: number;
  operator: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface KPIData {
  overallUtilization: number;
  machineCount: {
    production: number;
    stopped: number;
    idle: number;
  };
  topMachines: Array<{
    machineId: string;
    utilization: number;
  }>;
  stoppageReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}