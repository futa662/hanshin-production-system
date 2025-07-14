'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutGrid, 
  Calendar, 
  BarChart3, 
  Settings,
  Factory,
  LogOut,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { useAuthStore } from '@/src/store/auth-store';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'machines',
    label: '機械稼働状況',
    icon: LayoutGrid,
    href: '/manufacturing'
  },
  {
    id: 'staff',
    label: 'スタッフ稼働状況',
    icon: User,
    href: '/staff'
  },
  {
    id: 'production',
    label: '生産スケジュール',
    icon: Calendar,
    href: '/production'
  },
  {
    id: 'kpi',
    label: 'KPIダッシュボード',
    icon: BarChart3,
    href: '/management'
  },
  {
    id: 'system',
    label: 'システム設定',
    icon: Settings,
    href: '/settings'
  },
  {
    id: 'users',
    label: 'ユーザー管理',
    icon: Users,
    href: '/users'
  }
];

interface ProperSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function ProperSidebar({ isCollapsed, setIsCollapsed }: ProperSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.href === pathname;
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors
              ${depth === 0 ? 'hover:bg-gray-100' : 'hover:bg-gray-50'}
              ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="flex items-center">
              {Icon && <Icon className={`h-5 w-5 text-gray-500 ${isCollapsed ? '' : 'mr-3'}`} />}
              {!isCollapsed && <span className="text-gray-700">{item.label}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            )}
          </button>
          {!isCollapsed && isExpanded && item.children && (
            <div className="mt-1 ml-8">
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        className={`flex items-center px-3 py-2 mb-1 text-sm rounded-md transition-colors
          ${isActive
            ? 'bg-emerald-50 text-emerald-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
          ${depth > 0 ? 'pl-11' : ''}
          ${isCollapsed ? 'justify-center' : ''}`}
      >
        {Icon && <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-500'} ${
          isCollapsed ? '' : 'mr-3'
        }`} />}
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex h-full flex-col">
        {/* ヘッダー */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!isCollapsed && (
            <Link href="/" className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <Factory className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">Smart PMS</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`rounded-lg p-1.5 hover:bg-gray-100 ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* メインナビゲーション */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {!isCollapsed && (
            <p className="mb-4 px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              主要メニュー
            </p>
          )}
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* ユーザー情報 */}
        <div className="border-t border-gray-200 p-4">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || '管理者'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}