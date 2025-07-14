'use client';

import { useState } from 'react';
import { useAuthStore } from '@/src/store/auth-store';
import { useProcessPlanningStore } from '@/src/store/process-planning-store';
import { redirect } from 'next/navigation';
import { AuthLayout } from '@/src/components/layout/AuthLayout';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ProcessPlanGantt } from '@/src/components/process-planning/ProcessPlanGantt';
import { WorkInstructionCard } from '@/src/components/process-planning/WorkInstructionCard';
import { 
  Calendar,
  Filter,
  Plus,
  Download,
  Upload,
  BarChart3,
  ListChecks,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  Cog
} from 'lucide-react';
import { format, startOfDay, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function ProcessPlanningPage() {
  const { isAuthenticated } = useAuthStore();
  const { 
    processPlans, 
    workInstructions,
    selectedDate,
    setSelectedDate,
    updateProcessPlan,
    createWorkInstruction,
    updateDailyTaskStatus
  } = useProcessPlanningStore();

  const [viewMode, setViewMode] = useState<'gantt' | 'instructions'>('gantt');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isAuthenticated) {
    redirect('/login');
  }

  // 統計情報の計算
  const stats = {
    total: processPlans.length,
    inProgress: processPlans.filter(p => p.status === 'in_progress').length,
    planned: processPlans.filter(p => p.status === 'planned').length,
    completed: processPlans.filter(p => p.status === 'completed').length,
    delayed: processPlans.filter(p => p.status === 'delayed').length,
    highPriority: processPlans.filter(p => p.priority === 'high').length
  };

  // フィルタリング
  const filteredPlans = filterStatus === 'all' 
    ? processPlans 
    : processPlans.filter(p => p.status === filterStatus);

  // 今日の作業指示
  const todayInstructions = workInstructions.filter(
    wi => format(wi.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handlePlanDrag = (planId: string, newStartDate: Date) => {
    const plan = processPlans.find(p => p.id === planId);
    if (plan) {
      const duration = Math.ceil((plan.endDate.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24));
      updateProcessPlan(planId, {
        startDate: newStartDate,
        endDate: addDays(newStartDate, duration)
      });
    }
  };

  const handleCreateTodayInstruction = () => {
    createWorkInstruction(selectedDate, 'day');
  };

  return (
    <AuthLayout>
      <div className="h-full bg-gray-50 p-6">
        <div className="mx-auto max-w-[1600px]">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">工程計画管理</h1>
              <p className="text-gray-600 mt-1">製造計画の作成・調整と作業指示の管理</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                受注データ取込
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                新規計画作成
              </Button>
            </div>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">全計画</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">進行中</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-emerald-400" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">計画中</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.planned}</p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">完了</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-400" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">遅延</p>
                  <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">優先度高</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.highPriority}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-400" />
              </div>
            </Card>
          </div>

          {/* ビュー切り替えとフィルター */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'gantt' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('gantt')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                ガントチャート
              </Button>
              <Button
                variant={viewMode === 'instructions' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('instructions')}
              >
                <ListChecks className="h-4 w-4 mr-2" />
                作業指示
              </Button>
            </div>

            {viewMode === 'gantt' && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5"
                >
                  <option value="all">すべて</option>
                  <option value="planned">計画中</option>
                  <option value="in_progress">進行中</option>
                  <option value="completed">完了</option>
                  <option value="delayed">遅延</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* メインコンテンツ */}
        {viewMode === 'gantt' ? (
          <ProcessPlanGantt
            plans={filteredPlans}
            currentDate={selectedDate}
            onPlanDrag={handlePlanDrag}
            onPlanClick={(plan) => console.log('Plan clicked:', plan)}
          />
        ) : (
          <div className="space-y-6">
            {/* 日付選択と作業指示作成 */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="border rounded-lg px-3 py-2"
                  />
                  <div className="text-sm text-gray-600">
                    {format(selectedDate, 'yyyy年M月d日(E)', { locale: ja })}の作業指示
                  </div>
                </div>
                <Button onClick={handleCreateTodayInstruction} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  本日の作業指示を作成
                </Button>
              </div>
            </Card>

            {/* 作業指示一覧 */}
            {todayInstructions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {todayInstructions[0].tasks.map((dailyTask) => {
                  // タスクと計画の情報を取得
                  const plan = processPlans.find(p => 
                    p.tasks.some(t => t.id === dailyTask.taskId)
                  );
                  const task = plan?.tasks.find(t => t.id === dailyTask.taskId);
                  
                  if (!task || !plan) return null;

                  return (
                    <WorkInstructionCard
                      key={dailyTask.id}
                      dailyTask={dailyTask}
                      task={task}
                      productName={plan.productName}
                      onStatusChange={(status) => 
                        updateDailyTaskStatus(todayInstructions[0].id, dailyTask.id, status)
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <ListChecks className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">本日の作業指示はまだ作成されていません</p>
                <Button onClick={handleCreateTodayInstruction} className="mt-4">
                  作業指示を作成
                </Button>
              </Card>
            )}
          </div>
        )}
        </div>
      </div>
    </AuthLayout>
  );
}