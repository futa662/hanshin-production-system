# 阪神内燃機工業 生産管理システム - AI開発ガイド

## プロジェクト概要
大型船舶向け内燃機（エンジン）製造における150台の工作機械の稼働状況をリアルタイムで監視する生産管理システム。

## 重要な注意事項

### 1. デザインガイドライン
- **エンタープライズ向けの洗練されたデザイン**を維持すること
- 派手な色やアニメーションは避ける
- ミントグリーン (#10B981) を基調とした落ち着いた配色
- 適切な余白（padding/margin）を確保
- **素人っぽいデザインは絶対に避ける**

### 2. よくあるエラーと対処法

#### Element type is invalid エラー
```typescript
// 必ず存在チェックを行う
{Icon && <Icon className="h-4 w-4" />}

// インポート/エクスポートの一致を確認
export function ComponentName() { ... }  // 名前付きエクスポート
import { ComponentName } from '...'      // 名前付きインポート
```

#### ポート使用中エラー
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### 3. 開発時の必須事項

#### ドキュメントの更新
開発中は必ず以下のドキュメントを更新すること：
- `/docs/development-log/` - 日付ごとの開発ログ
- `/docs/troubleshooting-guide.md` - 新しいエラーと解決方法
- `/docs/technical-insights.md` - 技術的な気づき
- このファイル（CLAUDE.md） - 重要な変更や注意点

#### コミット前のチェックリスト
- [ ] TypeScriptエラーがないこと
- [ ] `npm run build` が成功すること
- [ ] UIがエンタープライズ向けの品質であること
- [ ] ドキュメントを更新したこと

## 技術スタック
- Next.js 14.2.4 (App Router)
- TypeScript
- Tailwind CSS
- Zustand（状態管理）
- Recharts（グラフ）
- Framer Motion（アニメーション - 最小限に）
- Lucide React（アイコン）

## プロジェクト構造
```
src/
├── components/
│   ├── layout/       # Sidebar, UserMenu, AuthLayout
│   ├── machines/     # MachineStatusTable, MachineStatusTimeline
│   ├── schedules/    # ScheduleBoard, ScheduleCard
│   ├── charts/       # UtilizationChart, KPIDashboard
│   └── ui/           # Badge, Button, Card（汎用コンポーネント）
├── store/            # Zustand ストア
├── lib/              # ユーティリティ、定数、モックデータ
└── types/            # TypeScript 型定義
```

## 認証システム

### テストアカウント
```
管理者: admin / admin123
オペレーター: operator01 / pass123
閲覧者: viewer01 / view123
```

### 認証フロー
1. 未認証ユーザーは自動的に `/login` へリダイレクト
2. Zustand + persist でセッション管理
3. Next.js middleware でルート保護

## 機械ステータス
- **RUNNING（稼働中）** - 緑 (#10B981)
- **STOPPED（停止中）** - オレンジ (#F59E0B)
- **ALARM（アラーム）** - 赤 (#EF4444)
- **POWER_OFF（電源オフ）** - グレー (#9CA3AF)

## パフォーマンス最適化
- 150台の機械データは15秒ごとに1台のみ更新（開発環境）
- テーブル表示は10件ごとのページネーション
- 検索・フィルター機能で表示数を制限

## 今後の実装予定
1. WebSocketによるリアルタイム通信
2. データエクスポート機能
3. プッシュ通知（アラーム時）
4. ダークモード対応
5. 国際化（i18n）

## トラブルシューティング
詳細は `/docs/troubleshooting-guide.md` を参照。

### クイックフィックス
```bash
# 開発サーバーの再起動
rm -rf .next
npm run dev

# 依存関係の再インストール
rm -rf node_modules
npm install

# TypeScriptの型チェック
npm run type-check
```

## コーディング規約
1. **'use client'** - useState, useEffect を使うコンポーネントには必須
2. **型安全性** - any型は使用禁止、適切な型定義を行う
3. **エラーハンドリング** - ユーザーフレンドリーなメッセージを表示
4. **コンポーネント分割** - 1ファイル200行以内を目安に
5. **命名規則** - コンポーネントはPascalCase、関数はcamelCase

## デプロイメント
- 推奨: Vercel
- 代替: Docker + Kubernetes

## 連絡事項
- このシステムは阪神内燃機工業の生産現場で実際に使用される想定
- UIの品質には特に注意を払うこと
- ユーザーは製造現場の作業者から経営層まで幅広い

---
最終更新: 2024-12-20
更新者: Claude