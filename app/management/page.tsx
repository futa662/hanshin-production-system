'use client';

import { useEffect, useState } from 'react';
import { useMachineStore } from '@/src/store/machine-store';
import { UtilizationChart } from '@/src/components/charts/UtilizationChart';
import { KPIDashboard } from '@/src/components/charts/KPIDashboard';
import { calculateKPIData } from '@/src/lib/mock-data';
import { TrendingUp, Gauge, Activity, Users } from 'lucide-react';
import { AuthLayout } from '@/src/components/layout/AuthLayout';

export default function ManagementPage() {
  const { machines, initializeData, updateMachineStatus } = useMachineStore();
  const [kpiData, setKpiData] = useState(calculateKPIData([]));

  useEffect(() => {
    if (machines.length === 0) {
      initializeData();
    }
  }, [machines.length, initializeData]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateMachineStatus();
      setKpiData(calculateKPIData(machines));
    }, 2000);
    return () => clearInterval(interval);
  }, [machines, updateMachineStatus]);

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">KPIダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">経営指標と生産性分析</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Gauge className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs text-emerald-600 font-medium">+12.5%</span>
          </div>
          <h3 className="text-sm text-gray-500">全体稼働率</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{kpiData.overallUtilization}%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">+8.3%</span>
          </div>
          <h3 className="text-sm text-gray-500">設備総合効率（OEE）</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">85.3%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs text-green-600 font-medium">+5.2%</span>
          </div>
          <h3 className="text-sm text-gray-500">生産性</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">156台/日</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-xs text-red-600 font-medium">-2.1%</span>
          </div>
          <h3 className="text-sm text-gray-500">作業効率</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">92.1%</p>
        </div>
      </div>

      {/* 生産性指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">生産性指標</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">可動率</span>
                <span className="font-medium text-gray-900">92.1%</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2">
                <div className="bg-emerald-500 h-2 rounded" style={{ width: '92.1%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">性能稼働率</span>
                <span className="font-medium text-gray-900">96.7%</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '96.7%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">良品率</span>
                <span className="font-medium text-gray-900">95.8%</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2">
                <div className="bg-purple-500 h-2 rounded" style={{ width: '95.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">計画達成率</span>
                <span className="font-medium text-gray-900">88.5%</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2">
                <div className="bg-amber-500 h-2 rounded" style={{ width: '88.5%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">稼働率推移</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <UtilizationChart />
          </div>
        </div>
      </div>

      {/* 詳細ダッシュボード */}
      <KPIDashboard kpiData={kpiData} />
    </div>
    </AuthLayout>
  );
}