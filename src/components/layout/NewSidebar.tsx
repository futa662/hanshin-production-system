'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Calendar, 
  BarChart3, 
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Factory,
  Users,
  FileText,
  Package,
  TrendingUp,
  Home,
  Menu,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { useAuthStore } from '@/src/store/auth-store';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'ダッシュボード',
    icon: Home,
    href: '/'
  },
  {
    id: 'facility',
    label: '施設管理',
    icon: Factory,
    children: [
      {
        id: 'machines',
        label: '機械モニター',
        icon: LayoutGrid,
        href: '/manufacturing'
      },
      {
        id: 'maintenance',
        label: 'メンテナンス',
        icon: Settings,
        href: '/maintenance'
      }
    ]
  },
  {
    id: 'device',
    label: 'デバイス管理',
    icon: Package,
    href: '/devices'
  },
  {
    id: 'energy',
    label: 'エネルギー管理',
    icon: TrendingUp,
    children: [
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
      }
    ]
  }
];

const bottomMenuItems: MenuItem[] = [
  {
    id: 'automation',
    label: 'オートメーション設定',
    icon: Settings,
    href: '/automation'
  },
  {
    id: 'alerts',
    label: 'アラート管理',
    icon: Bell,
    href: '/alerts'
  }
];

const systemMenuItems: MenuItem[] = [
  {
    id: 'users',
    label: 'ユーザー管理',
    icon: Users,
    href: '/users'
  },
  {
    id: 'system',
    label: 'システム設定',
    icon: Settings,
    href: '/settings'
  }
];

export function NewSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        <div key={item.id}>
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors hover:bg-white hover:text-gray-900 text-gray-600 ${
              isCollapsed ? 'px-3' : ''
            }`}
          >
            <div className="flex items-center">
              <Icon className={`h-5 w-5 text-gray-600 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span className="text-gray-700">{item.label}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            )}
          </button>
          {!isCollapsed && isExpanded && item.children && (
            <div className="ml-4">
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
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
            : 'text-gray-700 hover:bg-gray-100'
        } ${depth > 0 ? 'pl-12' : ''} ${isCollapsed ? 'px-3 justify-center' : ''}`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-gray-600'} ${
          isCollapsed ? '' : 'mr-3'
        }`} />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 z-50 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      {/* ヘッダー */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <Link href="/" className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Factory className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && <span className="ml-3 font-semibold text-gray-900">Smart PMS</span>}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* メインメニュー */}
      <nav className="flex-1 overflow-y-auto py-4">
        {!isCollapsed && (
          <div className="px-4 mb-2">
            <p className="text-xs text-gray-500">
              主要メニュー
            </p>
          </div>
        )}
        <div className="space-y-1 px-2">
          {menuItems.map(item => renderMenuItem(item))}
        </div>

        {!isCollapsed && (
          <div className="px-4 mt-6 mb-2">
            <p className="text-xs text-gray-500">
              高度な機能
            </p>
          </div>
        )}
        <div className="space-y-1 px-2">
          {bottomMenuItems.map(item => renderMenuItem(item))}
        </div>

        {!isCollapsed && (
          <div className="px-4 mt-6 mb-2">
            <p className="text-xs text-gray-500">
              システム
            </p>
          </div>
        )}
        <div className="space-y-1 px-2">
          {systemMenuItems.map(item => renderMenuItem(item))}
        </div>
      </nav>

      {/* フッター */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name || '管理者'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}