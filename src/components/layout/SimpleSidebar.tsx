'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutGrid, 
  Calendar, 
  BarChart3, 
  Settings,
  HelpCircle,
  Factory,
  Home,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '@/src/store/auth-store';

const menuItems = [
  { href: '/', icon: Home, label: 'ホーム' },
  { href: '/manufacturing', icon: LayoutGrid, label: '機械モニター' },
  { href: '/production', icon: Calendar, label: '生産スケジュール' },
  { href: '/management', icon: BarChart3, label: 'ダッシュボード' },
];

const bottomMenuItems = [
  { href: '/settings', icon: Settings, label: '設定' },
  { href: '/help', icon: HelpCircle, label: 'ヘルプ' },
];

export function SimpleSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* サイドバー */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}>
        <div className="h-full flex flex-col">
          {/* ヘッダー */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Factory className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 font-semibold text-gray-900">Smart PMS</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* メインメニュー */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 space-y-1">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* フッター */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name || '管理者'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">ログアウト</span>
            </button>
          </div>
        </div>
      </div>

      {/* モバイル用メニューボタン */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </>
  );
}