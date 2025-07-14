'use client';

import { useEffect, useState } from 'react';
import { useMachineStore } from '@/src/store/machine-store';
import { MachineStatusTable } from '@/src/components/machines/MachineStatusTable';
import { MachineStatusTimeline } from '@/src/components/machines/MachineStatusTimeline';
import { MachineStatusTimelineEnhanced } from '@/src/components/machines/MachineStatusTimelineEnhanced';
import { Activity, AlertCircle, Pause, Power, Grid3X3, Clock } from 'lucide-react';
import { STATUS_COLORS } from '@/src/lib/constants';
import { AuthLayout } from '@/src/components/layout/AuthLayout';

export default function ManufacturingPage() {
  const { machines, logs, initializeData, updateMachineStatus } = useMachineStore();
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  useEffect(() => {
    initializeData();
    const interval = setInterval(() => {
      updateMachineStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, [initializeData, updateMachineStatus]);

  const statusCounts = {
    RUNNING: machines.filter((m) => m.status === 'RUNNING').length,
    STOPPED: machines.filter((m) => m.status === 'STOPPED').length,
    ALARM: machines.filter((m) => m.status === 'ALARM').length,
    POWER_OFF: machines.filter((m) => m.status === 'POWER_OFF').length,
  };

  const overallUtilization = machines.length > 0
    ? Math.round((statusCounts.RUNNING / machines.length) * 100)
    : 0;

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">機械稼働状況モニター</h1>
          <p className="text-sm text-gray-500 mt-1">150台の工作機械をリアルタイム監視</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg shadow-sm px-4 py-2 flex items-center space-x-2">
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setViewMode('table')}
            >
              <Grid3X3 className="inline h-4 w-4 mr-1" />
              テーブル
            </button>
            <button
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setViewMode('timeline')}
            >
              <Clock className="inline h-4 w-4 mr-1" />
              タイムライン
            </button>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">全体稼働率</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{overallUtilization}%</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">稼働中</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{statusCounts.RUNNING}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">停止中</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{statusCounts.STOPPED}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Pause className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">アラーム</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{statusCounts.ALARM}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">電源オフ</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">{statusCounts.POWER_OFF}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Power className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      {viewMode === 'table' ? (
        <MachineStatusTable machines={machines} logs={logs} />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              機械稼働タイムライン
            </h3>
            <div className="space-y-3">
              {machines.slice(0, 10).map((machine) => (
                <MachineStatusTimelineEnhanced
                  key={machine.id}
                  machine={machine}
                  logs={logs}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </AuthLayout>
  );
}