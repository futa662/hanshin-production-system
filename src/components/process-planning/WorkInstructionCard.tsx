'use client';

import { DailyTask, Task } from '@/src/types/process-planning';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { 
  Clock, 
  User, 
  Cog, 
  CheckCircle2, 
  PlayCircle, 
  QrCode,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface WorkInstructionCardProps {
  dailyTask: DailyTask;
  task: Task;
  productName: string;
  onStatusChange: (status: DailyTask['status']) => void;
  isTabletView?: boolean;
}

const STATUS_CONFIG = {
  waiting: {
    label: '待機中',
    color: 'bg-gray-100 text-gray-700',
    icon: Clock
  },
  in_progress: {
    label: '作業中',
    color: 'bg-emerald-100 text-emerald-700',
    icon: PlayCircle
  },
  completed: {
    label: '完了',
    color: 'bg-blue-100 text-blue-700',
    icon: CheckCircle2
  }
};

export function WorkInstructionCard({ 
  dailyTask, 
  task, 
  productName,
  onStatusChange,
  isTabletView = false 
}: WorkInstructionCardProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const config = STATUS_CONFIG[dailyTask.status];
  const StatusIcon = config.icon;

  const handleStartWork = () => {
    onStatusChange('in_progress');
  };

  const handleCompleteWork = () => {
    onStatusChange('completed');
  };

  const calculateDuration = () => {
    if (!dailyTask.startedAt) return null;
    const start = new Date(dailyTask.startedAt);
    const end = dailyTask.completedAt ? new Date(dailyTask.completedAt) : new Date();
    const minutes = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
  };

  return (
    <Card className={`p-4 ${isTabletView ? 'p-6' : ''} hover:shadow-md transition-shadow`}>
      <div className="space-y-3">
        {/* ヘッダー */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-semibold ${isTabletView ? 'text-lg' : 'text-sm'} text-gray-900`}>
                {task.title}
              </h4>
              <Badge className={`${config.color} text-xs`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">{productName}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              タスクコード: {task.taskCode}
            </p>
          </div>
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <QrCode className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* QRコード表示 */}
        {showQRCode && (
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-xs text-gray-600">
              QR: {dailyTask.qrCode}
            </div>
          </div>
        )}

        {/* 詳細情報 */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>予定: {task.estimatedHours}時間</span>
            </div>
            {dailyTask.status !== 'waiting' && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>経過: {calculateDuration()}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Cog className="h-4 w-4" />
              <span>機械: {dailyTask.machineId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <User className="h-4 w-4" />
              <span>担当: {dailyTask.staffIds.length}名</span>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 pt-1">{task.description}</p>
          )}
        </div>

        {/* 時刻情報 */}
        {(dailyTask.startedAt || dailyTask.completedAt) && (
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
            {dailyTask.startedAt && (
              <span>開始: {format(new Date(dailyTask.startedAt), 'HH:mm', { locale: ja })}</span>
            )}
            {dailyTask.completedAt && (
              <span>完了: {format(new Date(dailyTask.completedAt), 'HH:mm', { locale: ja })}</span>
            )}
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-2 pt-2">
          {dailyTask.status === 'waiting' && (
            <Button
              onClick={handleStartWork}
              className={`flex-1 ${isTabletView ? 'h-12 text-base' : ''}`}
              variant="default"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              作業開始
            </Button>
          )}
          
          {dailyTask.status === 'in_progress' && (
            <>
              <Button
                onClick={handleCompleteWork}
                className={`flex-1 ${isTabletView ? 'h-12 text-base' : ''}`}
                variant="default"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                作業完了
              </Button>
              <Button
                variant="outline"
                className={isTabletView ? 'h-12' : ''}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                問題報告
              </Button>
            </>
          )}
          
          {dailyTask.status === 'completed' && (
            <div className="flex-1 text-center py-2 text-sm text-gray-500">
              作業完了済み
            </div>
          )}
        </div>

        {/* メモ欄 */}
        {dailyTask.notes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600">
              <span className="font-medium">メモ:</span> {dailyTask.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}