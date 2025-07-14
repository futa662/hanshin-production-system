'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Monitor,
  Factory,
  Cog,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { UserMenu } from './UserMenu';
import { MENU_ITEMS } from '@/src/lib/constants';

// アイコンマッピング
const iconMap = {
  LayoutDashboard,
  Monitor,
  Factory,
  Cog,
  Users,
  Calendar,
  TrendingUp,
  Settings
};

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

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
          {MENU_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = item.href ? pathname === item.href : false;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);

            return (
              <li key={item.id}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full flex items-center px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {isExpanded && (
                        <>
                          <span className="ml-3 text-sm font-medium">{item.label}</span>
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`} />
                        </>
                      )}
                    </button>
                    {isExpanded && isExpanded && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = iconMap[child.icon as keyof typeof iconMap];
                          const isChildActive = pathname === child.href;
                          
                          return (
                            <li key={child.id}>
                              <Link
                                href={child.href}
                                className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                                  isChildActive
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <ChildIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="ml-3">{child.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
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
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ユーザーメニュー */}
      <div className="border-t border-gray-200 py-4">
        {isExpanded && (
          <div className="px-2">
            <UserMenu />
          </div>
        )}
      </div>
    </div>
  );
}