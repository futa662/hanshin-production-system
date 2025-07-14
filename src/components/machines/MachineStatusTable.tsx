'use client';

import React, { useState } from 'react';
import { Machine, MachineLog } from '@/src/types';
import { MACHINE_CATEGORIES } from '@/src/lib/constants';
import { 
  Search, 
  Filter,
  MoreVertical,
  AlertCircle,
  Pause,
  Play,
  Power
} from 'lucide-react';

interface MachineStatusTableProps {
  machines: Machine[];
  logs: MachineLog[];
}

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  RUNNING: Play,
  STOPPED: Pause,
  ALARM: AlertCircle,
  POWER_OFF: Power
};

const STATUS_LABELS: Record<string, string> = {
  RUNNING: '稼働中',
  STOPPED: '停止中',
  ALARM: 'アラーム',
  POWER_OFF: '電源オフ'
};

export function MachineStatusTable({ machines, logs }: MachineStatusTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // フィルタリング
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         machine.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || machine.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMachines = filteredMachines.slice(startIndex, startIndex + itemsPerPage);

  // 稼働率の計算
  const getUtilizationRate = (machineId: string) => {
    const machineLogs = logs.filter(log => log.machineId === machineId);
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const relevantLogs = machineLogs.filter(log => log.timestamp >= twentyFourHoursAgo);
    const runningTime = relevantLogs
      .filter(log => log.status === 'RUNNING')
      .reduce((sum, log) => sum + log.duration, 0);
    
    return Math.round((runningTime / (24 * 60)) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* ヘッダー */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">機械稼働状況</h2>
            <p className="text-sm text-gray-500 mt-1">全 {machines.length} 台の機械</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </button>
            <button className="btn btn-primary">
              エクスポート
            </button>
          </div>
        </div>

        {/* 検索とフィルター */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="機械名またはコードで検索..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">すべてのステータス</option>
            <option value="RUNNING">稼働中</option>
            <option value="STOPPED">停止中</option>
            <option value="ALARM">アラーム</option>
            <option value="POWER_OFF">電源オフ</option>
          </select>
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>機械コード</th>
              <th>機械名</th>
              <th>カテゴリ</th>
              <th>ステータス</th>
              <th>稼働率（24h）</th>
              <th>担当者</th>
              <th className="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMachines.map((machine) => {
              const Icon = STATUS_ICONS[machine.status];
              const utilizationRate = getUtilizationRate(machine.id);
              
              if (!Icon) {
                console.warn(`Unknown machine status: ${machine.status} for machine ${machine.id}`);
              }
              
              return (
                <tr key={machine.id}>
                  <td className="font-medium">{machine.code}</td>
                  <td>{machine.name}</td>
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {MACHINE_CATEGORIES[machine.category]}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      {Icon && (
                        <Icon className={`h-4 w-4 ${
                          machine.status === 'RUNNING' ? 'text-emerald-500' :
                          machine.status === 'STOPPED' ? 'text-amber-500' :
                          machine.status === 'ALARM' ? 'text-red-500' :
                          'text-gray-500'
                        }`} />
                      )}
                      <span className={`badge ${
                        machine.status === 'RUNNING' ? 'badge-success' :
                        machine.status === 'STOPPED' ? 'badge-warning' :
                        machine.status === 'ALARM' ? 'badge-error' :
                        'badge-neutral'
                      }`}>
                        {STATUS_LABELS[machine.status]}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${utilizationRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {utilizationRate}%
                      </span>
                    </div>
                  </td>
                  <td className="text-sm">
                    {machine.operator || '-'}
                  </td>
                  <td className="text-right">
                    <button className="icon-btn">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            {filteredMachines.length} 件中 {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredMachines.length)} 件を表示
          </p>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              前へ
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-emerald-500 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              次へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}