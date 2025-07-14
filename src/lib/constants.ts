import { MachineCategory } from '@/src/types';

export const MACHINE_COUNT = 150;

export const STOPPAGE_REASONS = [
  '部品交換',
  'メンテナンス',
  '段取り替え',
  '材料待ち',
  'トラブル'
];

export const MACHINE_CATEGORIES: Record<MachineCategory, string> = {
  NC_LATHE: 'NC旋盤',
  CRANKSHAFT_LATHE: 'クランク軸旋盤',
  NC_MACHINING: 'NCマシニング旋盤',
  FIVE_AXIS: '5軸複合加工機'
};

export const OPERATORS = [
  '田中太郎',
  '山田花子',
  '佐藤次郎',
  '鈴木一郎',
  '高橋美香',
  '渡辺健一',
  '伊藤由美',
  '中村大輔',
  '小林愛子',
  '加藤浩二'
];

export const STATUS_COLORS = {
  RUNNING: '#10B981',    // ミントグリーン
  STOPPED: '#F59E0B',    // 控えめなアンバー
  ALARM: '#EF4444',      // 警告レッド
  POWER_OFF: '#9CA3AF'   // ニュートラルグレー
} as const;

// 新しいデザインシステムのカラーパレット
export const COLORS = {
  primary: '#10B981',      // ミントグリーン (メインカラー)
  secondary: '#6B7280',    // グレー
  background: '#FFFFFF',   // 白
  surface: '#F9FAFB',      // 薄いグレー
  border: '#E5E7EB',       // ボーダーグレー
  text: {
    primary: '#111827',    // ダークグレー
    secondary: '#6B7280',  // ミディアムグレー
    tertiary: '#9CA3AF'    // ライトグレー
  },
  status: {
    success: '#10B981',    // ミントグリーン
    warning: '#F59E0B',    // アンバー
    error: '#EF4444',      // レッド
    info: '#3B82F6'        // ブルー
  }
} as const;

// サイドバーのメニュー構成
export const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    href: '/',
    icon: 'LayoutDashboard'
  },
  {
    id: 'monitoring',
    label: '監視',
    icon: 'Monitor',
    children: [
      { id: 'production', label: '製造ライン', href: '/production', icon: 'Factory' },
      { id: 'manufacturing', label: '機械加工', href: '/manufacturing', icon: 'Cog' },
      { id: 'staff', label: 'スタッフ', href: '/staff', icon: 'Users' },
    ]
  },
  {
    id: 'planning',
    label: '工程計画',
    href: '/process-planning',
    icon: 'Calendar'
  },
  {
    id: 'management',
    label: '管理',
    href: '/management',
    icon: 'TrendingUp'
  },
  {
    id: 'settings',
    label: '設定',
    icon: 'Settings',
    children: [
      { id: 'system-settings', label: 'システム設定', href: '/settings', icon: 'Settings' },
      { id: 'users', label: 'ユーザー管理', href: '/users', icon: 'Users' },
    ]
  }
];