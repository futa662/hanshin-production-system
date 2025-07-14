'use client';

import { ProcessPlan } from '@/src/types/process-planning';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { 
  Calendar,
  Package,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Cog,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useMachineStore } from '@/src/store/machine-store';

interface ProcessPlanDetailProps {
  plan: ProcessPlan;
  onClose?: () => void;
  onEdit?: () => void;
}

const STATUS_CONFIG = {
  planned: {
    label: '計画中',
    color: 'bg-gray-100 text-gray-700',
    icon: Calendar
  },
  in_progress: {
    label: '進行中',
    color: 'bg-emerald-100 text-emerald-700',
    icon: Clock
  },
  completed: {
    label: '完了',
    color: 'bg-blue-100 text-blue-700',
    icon: CheckCircle
  },
  delayed: {
    label: '遅延',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle
  }
};

const PRIORITY_CONFIG = {
  high: { label: '高', color: 'bg-red-100 text-red-700' },
  medium: { label: '中', color: 'bg-amber-100 text-amber-700' },
  low: { label: '低', color: 'bg-gray-100 text-gray-700' }
};

export function ProcessPlanDetail({ plan, onClose, onEdit }: ProcessPlanDetailProps) {
  const { machines } = useMachineStore();
  const statusConfig = STATUS_CONFIG[plan.status];
  const StatusIcon = statusConfig.icon;
  const priorityConfig = PRIORITY_CONFIG[plan.priority];

  // 割り当て機械の情報を取得
  const assignedMachines = plan.assignedMachines
    .map(id => machines.find(m => m.id === id))
    .filter(Boolean);

  // 進捗状況の計算
  const completedTasks = plan.tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = plan.tasks.filter(t => t.status === 'in_progress').length;
  const pendingTasks = plan.tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{plan.productName}</h2>
              <p className="text-sm text-gray-500 mt-1">受注番号: {plan.orderCode}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <Badge className={priorityConfig.color}>
                優先度: {priorityConfig.label}
              </Badge>
              {plan.notes && (
                <Badge className="bg-amber-100 text-amber-700">
                  {plan.notes}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span>数量: {plan.quantity}個</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>顧客: {plan.customer}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span>進捗: {plan.progress}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  編集
                </Button>
              )}
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  閉じる
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* スケジュール情報 */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">スケジュール</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">予定期間</p>
              <p className="font-medium">
                {format(plan.startDate, 'yyyy年M月d日', { locale: ja })} - {format(plan.endDate, 'yyyy年M月d日', { locale: ja })}
              </p>
            </div>
            {plan.actualStartDate && (
              <div>
                <p className="text-sm text-gray-600 mb-1">実績期間</p>
                <p className="font-medium">
                  {format(plan.actualStartDate, 'yyyy年M月d日', { locale: ja })} - 
                  {plan.actualEndDate ? format(plan.actualEndDate, 'yyyy年M月d日', { locale: ja }) : '進行中'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 割り当て機械 */}
        {assignedMachines.length > 0 && (
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-4">割り当て機械</h3>
            <div className="flex flex-wrap gap-3">
              {assignedMachines.map(machine => (
                <div key={machine!.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <Cog className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{machine!.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      machine!.status === 'RUNNING' ? 'text-emerald-600' :
                      machine!.status === 'STOPPED' ? 'text-amber-600' :
                      machine!.status === 'ALARM' ? 'text-red-600' :
                      'text-gray-600'
                    }`}
                  >
                    {machine!.status === 'RUNNING' ? '稼働中' :
                     machine!.status === 'STOPPED' ? '停止中' :
                     machine!.status === 'ALARM' ? 'アラーム' :
                     '電源OFF'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* タスク一覧 */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">作業タスク</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                完了: {completedTasks}
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                進行中: {inProgressTasks}
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                未着手: {pendingTasks}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {plan.tasks.map((task, index) => (
              <div key={task.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    予定: {task.estimatedHours}時間
                    {task.assignedMachine && ` | 機械: ${task.assignedMachine}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in_progress' ? 'bg-emerald-500' :
                        'bg-gray-300'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-10 text-right">
                    {task.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}