'use client';

import { useAuthStore } from '@/store/auth-store';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Settings, Construction, Wrench, Server, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    redirect('/login');
  }

  const settingsCategories = [
    {
      icon: Server,
      title: 'システム構成',
      description: 'データベース接続、API設定、バックアップ設定など',
      status: '開発中'
    },
    {
      icon: Bell,
      title: '通知設定',
      description: 'アラーム通知、メール通知、プッシュ通知の設定',
      status: '開発中'
    },
    {
      icon: Shield,
      title: 'セキュリティ',
      description: 'パスワードポリシー、二要素認証、ログ監査設定',
      status: '開発中'
    },
    {
      icon: Wrench,
      title: 'カスタマイズ',
      description: 'ダッシュボード表示、レポート形式、エクスポート設定',
      status: '開発中'
    }
  ];

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">システム設定</h1>
          </div>
          <p className="text-gray-600">システムの各種設定を管理します</p>
        </div>

        {/* 開発中の通知 */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 p-6">
            <Construction className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">この機能は現在開発中です</p>
              <p className="text-sm text-amber-700 mt-1">
                システム設定機能は今後のアップデートで順次実装予定です。
              </p>
            </div>
          </div>
        </Card>

        {/* 設定カテゴリー一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {category.status}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 今後の実装予定 */}
        <Card className="mt-8 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">実装予定の機能</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              WebSocket接続設定（リアルタイム通信）
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              バックアップ・リストア機能
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              外部システム連携設定（ERP/MES）
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              ダークモード対応
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              多言語対応（日本語/英語）
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}