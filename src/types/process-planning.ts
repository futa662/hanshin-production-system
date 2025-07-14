// 工程計画関連の型定義

export type ProcessStatus = 'planned' | 'in_progress' | 'completed' | 'delayed';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type Priority = 'high' | 'medium' | 'low';

// 工程計画
export interface ProcessPlan {
  id: string;
  orderId: string;              // 受注ID
  orderCode: string;            // 受注番号
  productName: string;          // 製品名
  productCode: string;          // 製品コード
  quantity: number;             // 数量
  startDate: Date;              // 開始予定日
  endDate: Date;                // 完了予定日
  status: ProcessStatus;
  tasks: Task[];                // 作業タスク一覧
  assignedMachines: string[];   // 割当機械ID
  priority: Priority;
  actualStartDate?: Date;       // 実績開始日
  actualEndDate?: Date;         // 実績完了日
  progress: number;             // 進捗率 (0-100)
  customer: string;             // 顧客名
  notes?: string;               // 備考
}

// 作業タスク
export interface Task {
  id: string;
  planId: string;               // 工程計画ID
  taskCode: string;             // タスクコード（バーコード代替）
  title: string;                // 作業項目名
  description: string;          // 作業内容
  estimatedHours: number;       // 予定作業時間
  actualHours?: number;         // 実績作業時間
  sequence: number;             // 作業順序
  status: TaskStatus;
  assignedStaff: string[];      // 担当スタッフID
  assignedMachine?: string;     // 使用機械ID
  startedAt?: Date;             // 開始時刻
  completedAt?: Date;           // 完了時刻
  dependencies: string[];       // 前提タスクID
  progress: number;             // 進捗率 (0-100)
}

// 作業指示書
export interface WorkInstruction {
  id: string;
  date: Date;                   // 作業日
  shiftType: 'day' | 'night';   // シフト
  tasks: DailyTask[];           // その日の作業項目
  createdBy: string;            // 作成者（現場長）
  status: 'draft' | 'published' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// 日次作業項目
export interface DailyTask {
  id: string;
  taskId: string;               // タスクID（参照）
  instructionId: string;        // 作業指示書ID
  sequence: number;             // 実行順序
  staffIds: string[];           // 担当スタッフ
  machineId: string;            // 使用機械
  status: 'waiting' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;               // 作業メモ
  qrCode?: string;              // QRコード（バーコード代替）
}

// ガントチャート用のデータ構造
export interface GanttItem {
  id: string;
  planId: string;
  title: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
  color?: string;
  resourceId?: string;          // 機械ID
}