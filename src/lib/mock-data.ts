import { Machine, MachineStatus, MachineCategory, Schedule, MachineLog } from '@/src/types';
import { MACHINE_COUNT, OPERATORS, STOPPAGE_REASONS } from './constants';
import { randomBetween, pickRandom } from './utils';
import { addHours, subHours } from 'date-fns';

export function generateMachines(): Machine[] {
  const machines: Machine[] = [];
  const categories: MachineCategory[] = ['NC_LATHE', 'CRANKSHAFT_LATHE', 'NC_MACHINING', 'FIVE_AXIS'];
  
  for (let i = 1; i <= MACHINE_COUNT; i++) {
    const status = pickRandom<MachineStatus>(['RUNNING', 'STOPPED', 'ALARM', 'POWER_OFF']);
    const category = pickRandom<MachineCategory>(categories);
    const machine: Machine = {
      id: `machine-${i}`,
      code: `M${String(i).padStart(3, '0')}`,
      name: `工作機械 ${i}号機`,
      category,
      status,
      operator: status === 'RUNNING' ? pickRandom(OPERATORS) : undefined,
      lastStatusChange: subHours(new Date(), randomBetween(0, 8)),
      utilization: randomBetween(70, 95)
    };
    machines.push(machine);
  }
  
  return machines;
}

export function generateSchedules(machines: Machine[]): Schedule[] {
  const schedules: Schedule[] = [];
  const now = new Date();
  
  // PRODUCTSを使わずに仮のプロダクトデータを生成
  const products = [
    { code: 'LH26-376', name: '大型船舶用エンジン LH26型' },
    { code: 'MH32-198', name: '中型船舶用エンジン MH32型' },
    { code: 'SH18-452', name: '小型船舶用エンジン SH18型' },
    { code: 'LH28-205', name: '大型船舶用エンジン LH28型' },
    { code: 'MH35-089', name: '中型船舶用エンジン MH35型' }
  ];
  
  machines.slice(0, 30).forEach((machine, index) => {
    const product = pickRandom(products);
    const plannedStart = addHours(now, randomBetween(-12, 12));
    const plannedEnd = addHours(plannedStart, randomBetween(2, 8));
    
    const schedule: Schedule = {
      id: `schedule-${index + 1}`,
      productCode: product.code,
      productName: product.name,
      machineId: machine.id,
      plannedStart,
      plannedEnd,
      actualStart: machine.status === 'RUNNING' ? subHours(now, randomBetween(0, 6)) : undefined,
      progress: machine.status === 'RUNNING' ? randomBetween(10, 90) : 0,
      operator: pickRandom(OPERATORS),
      priority: pickRandom(['HIGH', 'MEDIUM', 'LOW'])
    };
    schedules.push(schedule);
  });
  
  return schedules;
}

export function generateMachineLogs(machines: Machine[]): MachineLog[] {
  const logs: MachineLog[] = [];
  const now = new Date();
  
  machines.forEach(machine => {
    let currentTime = subHours(now, 24);
    let currentStatus = pickRandom<MachineStatus>(['RUNNING', 'STOPPED', 'ALARM', 'POWER_OFF']);
    
    // 24時間分のログを生成（より現実的なパターン）
    while (currentTime < now) {
      const duration = randomBetween(30, 240); // 30分〜4時間
      
      logs.push({
        machineId: machine.id,
        status: currentStatus,
        timestamp: new Date(currentTime),
        duration,
        reason: (currentStatus === 'STOPPED' || currentStatus === 'ALARM') ? pickRandom(STOPPAGE_REASONS) : undefined
      });
      
      // 次の状態変更
      currentTime = addHours(currentTime, duration / 60);
      
      // 状態をランダムに変更（現実的な確率で）
      const random = Math.random();
      if (currentStatus === 'RUNNING' && random < 0.3) {
        currentStatus = pickRandom<MachineStatus>(['STOPPED', 'ALARM', 'POWER_OFF']);
      } else if (currentStatus !== 'RUNNING' && random < 0.7) {
        currentStatus = 'RUNNING';
      }
    }
  });
  
  return logs;
}

export function calculateKPIData(machines: Machine[]) {
  const running = machines.filter(m => m.status === 'RUNNING').length;
  const stopped = machines.filter(m => m.status === 'STOPPED').length;
  const alarm = machines.filter(m => m.status === 'ALARM').length;
  const powerOff = machines.filter(m => m.status === 'POWER_OFF').length;
  
  const topMachines = machines
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 10)
    .map(m => ({
      machineId: m.id,
      utilization: m.utilization
    }));
  
  const stoppageReasons = STOPPAGE_REASONS.map(reason => ({
    reason,
    count: randomBetween(5, 20),
    percentage: randomBetween(10, 30)
  }));
  
  return {
    overallUtilization: Math.round((running / MACHINE_COUNT) * 100),
    machineCount: {
      production: running,
      stopped,
      idle: powerOff
    },
    topMachines,
    stoppageReasons
  };
}