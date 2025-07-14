import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProcessPlan, WorkInstruction, Task, DailyTask } from '@/src/types/process-planning';
import { addDays, addHours, startOfDay } from 'date-fns';

interface ProcessPlanningState {
  processPlans: ProcessPlan[];
  workInstructions: WorkInstruction[];
  selectedPlanId: string | null;
  selectedDate: Date;
  
  // Actions
  addProcessPlan: (plan: Omit<ProcessPlan, 'id'>) => void;
  updateProcessPlan: (id: string, updates: Partial<ProcessPlan>) => void;
  deleteProcessPlan: (id: string) => void;
  updateTaskProgress: (planId: string, taskId: string, progress: number) => void;
  createWorkInstruction: (date: Date, shiftType: 'day' | 'night') => void;
  updateDailyTaskStatus: (instructionId: string, taskId: string, status: DailyTask['status']) => void;
  setSelectedPlanId: (id: string | null) => void;
  setSelectedDate: (date: Date) => void;
}

// モックデータ生成
const generateMockProcessPlans = (): ProcessPlan[] => {
  const products = [
    { name: '大型船舶用エンジン DX-5000', code: 'DX-5000' },
    { name: 'クランクシャフト CS-300', code: 'CS-300' },
    { name: 'シリンダーヘッド CH-250', code: 'CH-250' },
    { name: 'カムシャフト CM-180', code: 'CM-180' },
    { name: 'ピストン組立 PS-400', code: 'PS-400' }
  ];

  const customers = ['川崎重工業', '三菱重工業', 'IHI', 'ヤンマー', '日立造船'];
  const plans: ProcessPlan[] = [];

  for (let i = 0; i < 15; i++) {
    const product = products[i % products.length];
    const startDate = addDays(new Date(), Math.floor(Math.random() * 180));
    const duration = 7 + Math.floor(Math.random() * 21); // 7-28日
    
    const plan: ProcessPlan = {
      id: `plan-${i + 1}`,
      orderId: `ORD-2024-${String(i + 1001).padStart(4, '0')}`,
      orderCode: `${product.code}-${String(i + 1).padStart(3, '0')}`,
      productName: product.name,
      productCode: product.code,
      quantity: 1 + Math.floor(Math.random() * 5),
      startDate: startDate,
      endDate: addDays(startDate, duration),
      status: i < 3 ? 'in_progress' : i < 10 ? 'planned' : 'completed',
      tasks: generateTasks(`plan-${i + 1}`, product.code),
      assignedMachines: [`machine-${(i % 10) + 1}`, `machine-${(i % 10) + 11}`],
      priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
      progress: i < 3 ? 30 + Math.floor(Math.random() * 40) : i < 10 ? 0 : 100,
      customer: customers[i % customers.length],
      notes: i % 4 === 0 ? '特急対応' : undefined
    };

    if (plan.status === 'in_progress') {
      plan.actualStartDate = addDays(plan.startDate, -1);
    } else if (plan.status === 'completed') {
      plan.actualStartDate = plan.startDate;
      plan.actualEndDate = addDays(plan.endDate, -1);
    }

    plans.push(plan);
  }

  return plans;
};

const generateTasks = (planId: string, productCode: string): Task[] => {
  const taskTemplates = {
    'DX-5000': ['材料準備', '粗加工', '熱処理', '仕上げ加工', '組立', '検査', '塗装', '最終検査'],
    'CS-300': ['鍛造', '粗加工', '熱処理', '研削加工', '仕上げ', '検査'],
    'CH-250': ['鋳造', '加工', '穴あけ', '仕上げ', '検査'],
    'CM-180': ['材料切断', '旋盤加工', '研削', '熱処理', '最終仕上げ', '検査'],
    'PS-400': ['部品準備', 'ピストン加工', 'リング組付', '重量調整', '検査']
  };

  const templates = taskTemplates[productCode as keyof typeof taskTemplates] || taskTemplates['DX-5000'];
  
  return templates.map((title, index) => ({
    id: `${planId}-task-${index + 1}`,
    planId,
    taskCode: `TSK-${planId.split('-')[1]}-${String(index + 1).padStart(2, '0')}`,
    title,
    description: `${title}作業を実施`,
    estimatedHours: 4 + Math.floor(Math.random() * 8),
    sequence: index + 1,
    status: index < 2 ? 'completed' : index === 2 ? 'in_progress' : 'pending',
    assignedStaff: [`staff-${(index % 5) + 1}`],
    assignedMachine: `machine-${(index % 10) + 1}`,
    dependencies: index > 0 ? [`${planId}-task-${index}`] : [],
    progress: index < 2 ? 100 : index === 2 ? 60 : 0
  }));
};

export const useProcessPlanningStore = create<ProcessPlanningState>()(
  persist(
    (set, get) => ({
      processPlans: generateMockProcessPlans(),
      workInstructions: [],
      selectedPlanId: null,
      selectedDate: new Date(),

      addProcessPlan: (plan) => {
        const newPlan: ProcessPlan = {
          ...plan,
          id: `plan-${Date.now()}`
        };
        set(state => ({
          processPlans: [...state.processPlans, newPlan]
        }));
      },

      updateProcessPlan: (id, updates) => {
        set(state => ({
          processPlans: state.processPlans.map(plan =>
            plan.id === id ? { ...plan, ...updates } : plan
          )
        }));
      },

      deleteProcessPlan: (id) => {
        set(state => ({
          processPlans: state.processPlans.filter(plan => plan.id !== id)
        }));
      },

      updateTaskProgress: (planId, taskId, progress) => {
        set(state => ({
          processPlans: state.processPlans.map(plan => {
            if (plan.id !== planId) return plan;
            
            const updatedTasks = plan.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  progress,
                  status: progress === 100 ? 'completed' as const : 
                         progress > 0 ? 'in_progress' as const : 'pending' as const
                };
              }
              return task;
            });

            // 全体の進捗率を再計算
            const totalProgress = updatedTasks.reduce((sum, task) => sum + task.progress, 0) / updatedTasks.length;

            return {
              ...plan,
              tasks: updatedTasks,
              progress: Math.round(totalProgress)
            };
          })
        }));
      },

      createWorkInstruction: (date, shiftType) => {
        const { processPlans } = get();
        const tasksForDate = processPlans
          .filter(plan => plan.status === 'in_progress')
          .flatMap(plan => plan.tasks.filter(task => task.status !== 'completed'))
          .slice(0, 10); // 1日最大10タスク

        const instruction: WorkInstruction = {
          id: `wi-${Date.now()}`,
          date,
          shiftType,
          tasks: tasksForDate.map((task, index) => ({
            id: `dt-${Date.now()}-${index}`,
            taskId: task.id,
            instructionId: `wi-${Date.now()}`,
            sequence: index + 1,
            staffIds: task.assignedStaff,
            machineId: task.assignedMachine || '',
            status: 'waiting',
            qrCode: `QR-${task.taskCode}`
          })),
          createdBy: 'system',
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => ({
          workInstructions: [...state.workInstructions, instruction]
        }));
      },

      updateDailyTaskStatus: (instructionId, taskId, status) => {
        set(state => ({
          workInstructions: state.workInstructions.map(instruction => {
            if (instruction.id !== instructionId) return instruction;
            
            return {
              ...instruction,
              tasks: instruction.tasks.map(task => {
                if (task.id === taskId) {
                  const now = new Date();
                  return {
                    ...task,
                    status,
                    startedAt: status === 'in_progress' ? now : task.startedAt,
                    completedAt: status === 'completed' ? now : task.completedAt
                  };
                }
                return task;
              }),
              updatedAt: new Date()
            };
          })
        }));
      },

      setSelectedPlanId: (id) => set({ selectedPlanId: id }),
      setSelectedDate: (date) => set({ selectedDate: date })
    }),
    {
      name: 'process-planning-storage'
    }
  )
);