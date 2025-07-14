'use client';

import { useEffect } from 'react';
import { useStaffStore } from '@/src/store/staff-store';
import { StaffStatusTable } from '@/src/components/staff/StaffStatusTable';
import { Users, UserCheck, Coffee, AlertCircle, Wrench, Calendar } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '@/src/lib/staff-constants';
import { AuthLayout } from '@/src/components/layout/AuthLayout';

export default function StaffPage() {
  const { staff, initializeData, updateStaffStatus } = useStaffStore();

  useEffect(() => {
    initializeData();
    const interval = setInterval(() => {
      updateStaffStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, [initializeData, updateStaffStatus]);

  // ステータスごとの人数を計算
  const statusCounts = {
    PROCESSING: staff.filter((m) => m.status === 'PROCESSING').length,
    ASSEMBLY: staff.filter((m) => m.status === 'ASSEMBLY').length,
    QUALITY_CHECK: staff.filter((m) => m.status === 'QUALITY_CHECK').length,
    INSPECTION: staff.filter((m) => m.status === 'INSPECTION').length,
    BREAK: staff.filter((m) => m.status === 'BREAK').length,
    LEAVE: staff.filter((m) => m.status === 'LEAVE').length,
  };

  const workingCount = statusCounts.PROCESSING + statusCounts.ASSEMBLY + statusCounts.QUALITY_CHECK + statusCounts.INSPECTION;
  const attendance = staff.length - statusCounts.LEAVE;
  const attendanceRate = staff.length > 0 ? Math.round((attendance / staff.length) * 100) : 0;

  const statusIcons = {
    PROCESSING: Wrench,
    ASSEMBLY: UserCheck,
    QUALITY_CHECK: AlertCircle,
    INSPECTION: AlertCircle,
    BREAK: Coffee,
    LEAVE: Calendar,
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">スタッフ稼働状況</h1>
            <p className="text-sm text-gray-500 mt-1">100名のスタッフをリアルタイム管理</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm px-6 py-3">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{attendance}/{staff.length}</p>
                <p className="text-xs text-gray-500">出勤人数</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{attendanceRate}%</p>
                <p className="text-xs text-gray-500">出勤率</p>
              </div>
            </div>
          </div>
        </div>

        {/* ステータスカード */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const Icon = statusIcons[status as keyof typeof statusIcons];
            return (
              <div key={status} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5" style={{ color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }} />
                  <span className="text-2xl font-bold text-gray-900">{count}</span>
                </div>
                <p className="text-sm text-gray-600">{STATUS_LABELS[status as keyof typeof STATUS_LABELS]}</p>
                <div className="mt-2 h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${staff.length > 0 ? (count / staff.length) * 100 : 0}%`,
                      backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* サマリー情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">作業中</p>
                <p className="text-2xl font-bold text-gray-900">{workingCount}名</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">休憩中</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.BREAK}名</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">休暇</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.LEAVE}名</p>
              </div>
            </div>
          </div>
        </div>

        {/* スタッフ一覧テーブル */}
        <StaffStatusTable staff={staff} />
      </div>
    </AuthLayout>
  );
}