# 技術的な気づきとノウハウ

## 1. Next.js App Router特有の注意点

### 1.1 'use client' ディレクティブ
- **必須の場面**: useState, useEffect, イベントハンドラーを使うコンポーネント
- **不要な場面**: 静的なコンポーネント、サーバーサイドでのみ実行されるコード

```typescript
// ❌ 忘れがち
export function InteractiveComponent() {
  const [count, setCount] = useState(0); // エラー！
}

// ✅ 正しい
'use client';
export function InteractiveComponent() {
  const [count, setCount] = useState(0); // OK
}
```

### 1.2 レイアウトの入れ子構造
- グローバルレイアウト（app/layout.tsx）は最小限に
- 認証が必要なページは専用レイアウトでラップ
- これによりログインページでサイドバーを非表示にできる

## 2. Zustand のベストプラクティス

### 2.1 persist middleware の使用
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ストアの実装
    }),
    {
      name: 'auth-storage', // localStorageのキー名
    }
  )
);
```

### 2.2 大規模データの効率的な更新
```typescript
// ❌ 非効率 - 全データを再生成
set({ machines: machines.map(m => ({ ...m })) });

// ✅ 効率的 - 必要な部分のみ更新
set((state) => ({
  machines: state.machines.map(m => 
    m.id === targetId ? { ...m, status: newStatus } : m
  )
}));
```

## 3. TypeScript の型安全性

### 3.1 Record型の活用
```typescript
// アイコンマッピングの型安全な定義
const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  RUNNING: Play,
  STOPPED: Pause,
  ALARM: AlertCircle,
  POWER_OFF: Power
};
```

### 3.2 型ガードの実装
```typescript
// 実行時の型チェック
function isMachineStatus(status: string): status is MachineStatus {
  return ['RUNNING', 'STOPPED', 'ALARM', 'POWER_OFF'].includes(status);
}
```

## 4. パフォーマンス最適化

### 4.1 不要な再レンダリングの防止
```typescript
// useCallbackで関数をメモ化
const updateMachineStatus = useCallback(() => {
  // 更新ロジック
}, [/* 依存配列 */]);

// React.memoでコンポーネントをメモ化
export const MachineCard = React.memo(({ machine }: Props) => {
  // コンポーネントの実装
});
```

### 4.2 大量データの扱い
- 150台の機械データを扱う際の工夫
  - ページネーション（10件ずつ表示）
  - 仮想スクロール（今後の実装候補）
  - 検索・フィルター機能で表示数を制限

## 5. UI/UX の工夫

### 5.1 エンタープライズ向けデザイン
- **カラーパレット**: 派手な色を避け、ミントグリーン基調
- **余白**: 適切な padding/margin で情報の階層を明確化
- **アニメーション**: 最小限に抑えてプロフェッショナルな印象

### 5.2 アクセシビリティ
```typescript
// フォーカススタイルの実装
:focus-visible {
  @apply ring-2 ring-emerald-500 ring-offset-2;
}

// アイコンボタンには適切なaria-label
<button aria-label="メニューを開く">
  <MenuIcon />
</button>
```

## 6. エラーハンドリング

### 6.1 ユーザーフレンドリーなエラー表示
```typescript
// 詳細を隠蔽したエラーメッセージ
if (!success) {
  setError('ユーザーIDまたはパスワードが正しくありません');
  // 実際のエラー詳細はログに記録
  console.error('Login failed:', error);
}
```

### 6.2 フォールバック UI
```typescript
// Iconが存在しない場合の対処
{Icon ? (
  <Icon className="h-4 w-4" />
) : (
  <div className="h-4 w-4 bg-gray-300 rounded" />
)}
```

## 7. 開発効率化のTips

### 7.1 コンポーネントの構造化
```
src/components/
├── layout/          # レイアウト関連
├── machines/        # 機械モニター機能
├── schedules/       # スケジュール機能
├── charts/          # グラフ・チャート
└── ui/              # 汎用UIコンポーネント
```

### 7.2 定数の一元管理
```typescript
// src/lib/constants.ts
export const MACHINE_COUNT = 150;
export const STATUS_COLORS = { ... };
export const STOPPAGE_REASONS = [ ... ];
```

## 8. Tailwind CSS の活用

### 8.1 カスタムユーティリティクラス
```css
/* グローバルCSSで定義 */
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 
         text-sm font-medium rounded-md transition-colors duration-150;
}

.btn-primary {
  @apply bg-emerald-500 text-white hover:bg-emerald-600;
}
```

### 8.2 動的クラスの回避
```typescript
// ❌ パージされる可能性
className={`bg-${color}-500`}

// ✅ 安全
const colorClasses = {
  red: 'bg-red-500',
  blue: 'bg-blue-500'
};
className={colorClasses[color]}
```

## 9. 状態管理の設計

### 9.1 グローバル状態 vs ローカル状態
- **グローバル（Zustand）**: 認証情報、機械データ、スケジュール
- **ローカル（useState）**: フォーム入力、UIの開閉状態、一時的なフィルター

### 9.2 リアルタイムデータの更新戦略
```typescript
// 15秒ごとの更新でも、実際に変更するのは一部のみ
const updateMachineStatus = () => {
  const randomIndex = Math.floor(Math.random() * machines.length);
  // 1台のみ状態を変更
};
```

## 10. セキュリティの考慮

### 10.1 認証フローの実装
1. クライアント側でログイン情報を検証
2. Zustand + persistでセッション保存
3. Next.js middlewareで保護されたルートをチェック
4. 未認証の場合は自動的にログインページへ

### 10.2 機密情報の扱い
```typescript
// パスワードを含まないユーザー情報を保存
const { password: _, ...userWithoutPassword } = user;
set({ user: userWithoutPassword });
```

## 11. 今後の改善ポイント

### 11.1 実装したい機能
1. WebSocketによるリアルタイム通信
2. プッシュ通知（アラーム発生時）
3. データのエクスポート機能
4. ダークモード対応

### 11.2 技術的な改善
1. React Queryでのデータフェッチ
2. Suspenseを使った非同期処理
3. Error Boundaryの実装
4. 国際化（i18n）対応

## 12. 学んだ教訓

### 12.1 デザインフィードバックへの対応
- 最初の実装が「素人っぽい」との指摘
- エンタープライズシステムらしい洗練されたデザインへ刷新
- 過度な装飾やアニメーションは避ける

### 12.2 エラー対応の重要性
- "Element type is invalid" エラーは大抵インポート/エクスポートの問題
- エラーメッセージをよく読み、スタックトレースを追跡
- 小さな変更を積み重ねて原因を特定

### 12.3 ドキュメントの価値
- 開発中の決定事項を記録することで、後から理由が分かる
- トラブルシューティングの経験を蓄積
- 新しいメンバーのオンボーディングに活用

### 12.4 認証システムの実装
- middlewareとクライアント側の状態管理の整合性が重要
- Zustand persistのデフォルトはlocalStorage、middlewareはCookieを使用
- カスタムストレージ実装で両方に対応する必要性
- デバッグログを活用して認証フローを追跡