'use client';

import Link from 'next/link';
import { Gauge, Calendar, BarChart3, ArrowRight, Factory } from 'lucide-react';
import { AuthLayout } from '@/src/components/layout/AuthLayout';

const dashboards = [
  {
    title: '製造部向け',
    description: '機械稼働状況モニター',
    href: '/manufacturing',
    icon: Gauge,
    stats: '150台',
    features: ['リアルタイム監視', '24時間履歴', 'アラート通知'],
  },
  {
    title: '生産管理部向け',
    description: 'スケジュール管理',
    href: '/production',
    icon: Calendar,
    stats: '月産500台',
    features: ['スケジュール調整', '進捗管理', '予実差異'],
  },
  {
    title: '経営企画部向け',
    description: 'KPIダッシュボード',
    href: '/management',
    icon: BarChart3,
    stats: '稼働率89%',
    features: ['稼働率分析', '停止理由', '負荷予測'],
  },
];

export default function Home() {
  return (
    <AuthLayout>
      <div className="py-12">
        {/* ヘッダー */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Factory className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Smart PMS
        </h1>
        <p className="text-gray-600">
          部門に合わせたダッシュボードを選択してください
        </p>
      </div>

      {/* ダッシュボードカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {dashboards.map((dashboard) => {
          const Icon = dashboard.icon;
          return (
            <Link
              key={dashboard.href}
              href={dashboard.href}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {dashboard.stats}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {dashboard.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {dashboard.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {dashboard.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700">
                  <span>ダッシュボードを開く</span>
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* フッター情報 */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>システムバージョン: 1.0.0 | 最終更新: {new Date().toLocaleDateString('ja-JP')}</p>
      </div>
    </div>
    </AuthLayout>
  );
}