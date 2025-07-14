# 再利用可能なコードパターン

## 1. リアルタイム更新パターン

```typescript
// useIntervalフック
import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

## 2. 状態色分けパターン

```typescript
// 状態に基づく色の決定
const getStatusColor = (status: MachineStatus) => {
  const colors = {
    PRODUCTION: '#10b981',
    STOPPED: '#f59e0b',
    IDLE: '#6b7280'
  };
  return colors[status];
};
```

## 3. グリッドレイアウトパターン

```typescript
// 動的グリッド生成
<div className="grid grid-cols-10 gap-2">
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: index * 0.002 }}
    >
      {/* コンテンツ */}
    </motion.div>
  ))}
</div>
```

## 4. プログレスバーパターン

```typescript
// アニメーション付きプログレスバー
<div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
  <motion.div
    className="absolute top-0 left-0 h-full bg-primary"
    initial={{ width: 0 }}
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.5 }}
  />
</div>
```

## 5. カードホバーエフェクト

```typescript
// グラスモーフィズム + ホバー
<Card className="hover:border-primary/50 transition-all backdrop-blur-sm bg-card/50">
  {/* コンテンツ */}
</Card>
```

## 6. ダッシュボードカード統計

```typescript
// 統計カードコンポーネント
interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  percentage?: number;
}

export function StatCard({ title, value, icon: Icon, color, percentage }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4" style={{ color }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentage !== undefined && (
          <p className="text-xs text-muted-foreground">{percentage}%</p>
        )}
      </CardContent>
    </Card>
  );
}
```

## 7. Zustandストアパターン

```typescript
// 型安全なZustandストア
interface StoreState {
  // 状態
  items: Item[];
  
  // アクション
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  removeItem: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  }))
}));
```

## 8. 日時フォーマットパターン

```typescript
// 日本語形式の日時表示
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
```