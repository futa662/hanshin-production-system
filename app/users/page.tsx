'use client';

import { useAuthStore } from '@/store/auth-store';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Users, Construction, UserPlus, Shield, Key, Building } from 'lucide-react';

export default function UsersPage() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    redirect('/login');
  }

  const userManagementFeatures = [
    {
      icon: UserPlus,
      title: 'ユーザー登録',
      description: '新規ユーザーの追加、権限設定、部署割り当て',
      status: '開発中'
    },
    {
      icon: Shield,
      title: '権限管理',
      description: 'ロール設定、アクセス権限、機能制限の管理',
      status: '開発中'
    },
    {
      icon: Key,
      title: 'パスワード管理',
      description: 'パスワードリセット、有効期限設定、強度ポリシー',
      status: '開発中'
    },
    {
      icon: Building,
      title: '部署・組織管理',
      description: '部署構成、階層管理、グループ設定',
      status: '開発中'
    }
  ];

  // 現在のテストユーザー情報
  const testUsers = [
    { username: 'admin', name: '管理者', role: '管理者', department: 'システム管理部' },
    { username: 'operator01', name: '田中太郎', role: 'オペレーター', department: '製造第一課' },
    { username: 'viewer01', name: '山田花子', role: '閲覧者', department: '生産管理部' }
  ];

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          </div>
          <p className="text-gray-600">システムユーザーの管理と権限設定を行います</p>
        </div>

        {/* 開発中の通知 */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 p-6">
            <Construction className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">この機能は現在開発中です</p>
              <p className="text-sm text-amber-700 mt-1">
                ユーザー管理機能は今後のアップデートで実装予定です。現在はテストユーザーのみ利用可能です。
              </p>
            </div>
          </div>
        </Card>

        {/* 管理機能一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {userManagementFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {feature.status}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 現在のテストユーザー */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">現在利用可能なテストユーザー</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ユーザー名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">氏名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">権限</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属部署</th>
                </tr>
              </thead>
              <tbody>
                {testUsers.map((testUser, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm">
                      <code className="bg-gray-100 px-2 py-1 rounded text-emerald-600">
                        {testUser.username}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{testUser.name}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        testUser.role === '管理者' 
                          ? 'bg-purple-100 text-purple-800'
                          : testUser.role === 'オペレーター'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {testUser.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{testUser.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>テストパスワード:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• 管理者: <code className="bg-gray-200 px-1 rounded">admin123</code></li>
              <li>• オペレーター: <code className="bg-gray-200 px-1 rounded">pass123</code></li>
              <li>• 閲覧者: <code className="bg-gray-200 px-1 rounded">view123</code></li>
            </ul>
          </div>
        </Card>

        {/* 今後の実装予定 */}
        <Card className="mt-6 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">実装予定の機能</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              Active Directory / LDAP 連携
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              シングルサインオン（SSO）対応
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              二要素認証（2FA）
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              監査ログ・アクセス履歴
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              一括インポート/エクスポート機能
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}