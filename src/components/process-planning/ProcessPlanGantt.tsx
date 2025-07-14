'use client';

import { useEffect, useRef, useState } from 'react';
import { ProcessPlan } from '@/src/types/process-planning';
import { format, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

interface ProcessPlanGanttProps {
  plans: ProcessPlan[];
  currentDate?: Date;
  onPlanClick?: (plan: ProcessPlan) => void;
  onPlanDrag?: (planId: string, newStartDate: Date) => void;
}

const STATUS_COLORS = {
  planned: '#6B7280',
  in_progress: '#10B981',
  completed: '#3B82F6',
  delayed: '#EF4444'
};

const PRIORITY_COLORS = {
  high: '#DC2626',
  medium: '#F59E0B',
  low: '#6B7280'
};

export function ProcessPlanGantt({ plans, currentDate = new Date(), onPlanClick, onPlanDrag }: ProcessPlanGanttProps) {
  const [viewStartDate, setViewStartDate] = useState(startOfMonth(currentDate));
  const [viewEndDate, setViewEndDate] = useState(endOfMonth(addDays(currentDate, 90)));
  const [draggedPlan, setDraggedPlan] = useState<ProcessPlan | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<ProcessPlan | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const days = eachDayOfInterval({ start: viewStartDate, end: viewEndDate });
  const totalDays = days.length;
  const dayWidth = 30; // ピクセル

  // 月ごとにグループ化
  const monthGroups = days.reduce((acc, day) => {
    const monthKey = format(day, 'yyyy-MM');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(day);
    return acc;
  }, {} as Record<string, Date[]>);

  const handleDragStart = (e: React.DragEvent, plan: ProcessPlan) => {
    setDraggedPlan(plan);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    if (draggedPlan && onPlanDrag) {
      const newStartDate = days[dayIndex];
      onPlanDrag(draggedPlan.id, newStartDate);
    }
    setDraggedPlan(null);
  };

  const calculatePlanPosition = (plan: ProcessPlan) => {
    const startIndex = differenceInDays(plan.startDate, viewStartDate);
    const duration = differenceInDays(plan.endDate, plan.startDate) + 1;
    
    return {
      left: Math.max(0, startIndex * dayWidth),
      width: duration * dayWidth,
      isVisible: startIndex < totalDays && startIndex + duration > 0
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -30 : 30;
    setViewStartDate(addDays(viewStartDate, offset));
    setViewEndDate(addDays(viewEndDate, offset));
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* ヘッダー */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">工程計画ガントチャート</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.planned }} />
              計画
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.in_progress }} />
              進行中
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.completed }} />
              完了
            </Badge>
            <Badge variant="outline" className="gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.delayed }} />
              遅延
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium px-2">
            {format(viewStartDate, 'yyyy年MM月', { locale: ja })} - {format(viewEndDate, 'yyyy年MM月', { locale: ja })}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ガントチャート本体 */}
      <div ref={containerRef} className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <div className="min-w-max">
          {/* 月ヘッダー */}
          <div className="flex border-b sticky top-0 bg-white z-20">
            <div className="w-64 flex-shrink-0 p-2 border-r bg-gray-50 font-medium text-sm">
              製品名 / 受注番号
            </div>
            <div className="flex">
              {Object.entries(monthGroups).map(([monthKey, monthDays]) => (
                <div
                  key={monthKey}
                  className="border-r bg-gray-50 text-center font-medium text-sm py-2"
                  style={{ width: monthDays.length * dayWidth }}
                >
                  {format(monthDays[0], 'yyyy年M月', { locale: ja })}
                </div>
              ))}
            </div>
          </div>

          {/* 日付ヘッダー */}
          <div className="flex border-b sticky top-[37px] bg-white z-20">
            <div className="w-64 flex-shrink-0 p-2 border-r bg-gray-50"></div>
            <div className="flex">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`border-r text-center text-xs py-1 ${
                    day.getDay() === 0 ? 'bg-red-50 text-red-600' :
                    day.getDay() === 6 ? 'bg-blue-50 text-blue-600' :
                    'bg-white'
                  }`}
                  style={{ width: dayWidth }}
                >
                  {format(day, 'd')}
                </div>
              ))}
            </div>
          </div>

          {/* 計画行 */}
          {plans.map((plan, planIndex) => {
            const position = calculatePlanPosition(plan);
            if (!position.isVisible) return null;

            return (
              <div key={plan.id} className="flex border-b hover:bg-gray-50 group">
                {/* 計画情報 */}
                <div className="w-64 flex-shrink-0 p-3 border-r">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {plan.productName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{plan.orderCode}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{plan.customer}</span>
                        {plan.priority === 'high' && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 ml-2">
                      {plan.progress}%
                    </span>
                  </div>
                </div>

                {/* ガントバー */}
                <div className="flex-1 relative h-[76px]">
                  <div
                    className="absolute top-4 h-8 rounded cursor-move shadow-sm hover:shadow-md transition-all"
                    style={{
                      left: position.left,
                      width: position.width,
                      backgroundColor: STATUS_COLORS[plan.status],
                      opacity: hoveredPlan?.id === plan.id ? 0.8 : 1
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, plan)}
                    onMouseEnter={() => setHoveredPlan(plan)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    onClick={() => onPlanClick?.(plan)}
                  >
                    {/* 進捗バー */}
                    <div
                      className="absolute top-0 left-0 h-full bg-black bg-opacity-20 rounded"
                      style={{ width: `${plan.progress}%` }}
                    />
                    
                    {/* ラベル */}
                    {position.width > 80 && (
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-xs font-medium text-white truncate">
                          {plan.productCode} ({plan.quantity}個)
                        </span>
                      </div>
                    )}

                    {/* 優先度インジケーター */}
                    {plan.priority === 'high' && (
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ backgroundColor: PRIORITY_COLORS[plan.priority] }}
                      />
                    )}
                  </div>

                  {/* ドロップゾーン */}
                  {draggedPlan && (
                    <div className="absolute inset-0 flex">
                      {days.map((_, dayIndex) => (
                        <div
                          key={dayIndex}
                          className="h-full border-r border-transparent hover:bg-emerald-100 hover:bg-opacity-50"
                          style={{ width: dayWidth }}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, dayIndex)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* フッター情報 */}
      {hoveredPlan && (
        <div className="p-3 border-t bg-gray-50 text-sm">
          <span className="font-medium">{hoveredPlan.productName}</span>
          <span className="text-gray-500 ml-2">
            {format(hoveredPlan.startDate, 'M/d', { locale: ja })} - {format(hoveredPlan.endDate, 'M/d', { locale: ja })}
          </span>
          <span className="text-gray-500 ml-2">({differenceInDays(hoveredPlan.endDate, hoveredPlan.startDate) + 1}日間)</span>
          {hoveredPlan.notes && (
            <span className="text-amber-600 ml-2">※ {hoveredPlan.notes}</span>
          )}
        </div>
      )}
    </Card>
  );
}