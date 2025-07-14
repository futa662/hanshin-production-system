export type StaffStatus = 'PROCESSING' | 'ASSEMBLY' | 'QUALITY_CHECK' | 'INSPECTION' | 'BREAK' | 'LEAVE';

export interface Staff {
  id: string;
  employeeNumber: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  status: StaffStatus;
  department: string;
  shift: 'morning' | 'afternoon' | 'night';
  statusStartTime: Date;
}

export interface StaffStatusLog {
  id: string;
  staffId: string;
  status: StaffStatus;
  startTime: Date;
  endTime: Date | null;
}