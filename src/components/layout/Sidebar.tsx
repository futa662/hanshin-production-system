'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Calendar, 
  BarChart3, 
  Settings,
  HelpCircle,
  ChevronRight,
  Factory
} from 'lucide-react';
import { UserMenu } from './UserMenu';

const menuItems = [
  { href: '/', icon: Factory, label: 'ホーム' },
  { href: '/manufacturing', icon: LayoutGrid, label: '機械モニター' },
  { href: '/production', icon: Calendar, label: '生産スケジュール' },
  { href: '/management', icon: BarChart3, label: 'ダッシュボード' },
];

const bottomMenuItems = [
  { href: '/settings', icon: Settings, label: '設定' },
  { href: '/help', icon: HelpCircle, label: 'ヘルプ' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-200 z-50 flex flex-col ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* ロゴエリア */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Factory className="h-5 w-5 text-white" />
        </div>
        {isExpanded && (
          <span className="ml-3 font-semibold text-gray-900 text-sm">Smart PMS</span>
        )}
      </div>

      {/* メインメニュー */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ボトムメニュー */}
      <div className="border-t border-gray-200 py-4">
        <ul className="space-y-1 px-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* ユーザーメニュー */}
        {isExpanded && (
          <div className="mt-4 px-2">
            <UserMenu />
          </div>
        )}
      </div>
    </div>
  );
}