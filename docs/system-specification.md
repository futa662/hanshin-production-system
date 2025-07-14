# 阪神内燃機工業 生産管理システム仕様書

## 1. システム概要

### 1.1 目的
大型船舶向け内燃機（エンジン）製造における150台の工作機械の稼働状況をリアルタイムで監視し、生産効率の最適化を実現する統合管理システム。

### 1.2 主要機能
1. **機械稼働状況モニター** - リアルタイム監視と履歴管理
2. **生産スケジュール管理** - 製造計画と進捗追跡
3. **KPIダッシュボード** - 経営指標の可視化

### 1.3 技術スタック
- **フロントエンド**: Next.js 14.2.4 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **グラフ**: Recharts
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React

## 2. 機能仕様

### 2.1 認証システム
#### 機能
- ログイン/ログアウト
- セッション永続化（localStorage）
- ロールベースアクセス（admin, operator, viewer）

#### 仮アカウント
```
管理者: admin / admin123
オペレーター: operator01 / pass123
閲覧者: viewer01 / view123
```

#### 実装詳細
- Zustand + persist middlewareでセッション管理
- Next.js middlewareで未認証ユーザーのリダイレクト
- クッキーベースの認証チェック

### 2.2 機械稼働状況モニター

#### 2.2.1 ステータス種別
1. **RUNNING（稼働中）** - 緑色 (#10B981)
2. **STOPPED（停止中）** - オレンジ色 (#F59E0B)
3. **ALARM（アラーム）** - 赤色 (#EF4444)
4. **POWER_OFF（電源オフ）** - グレー色 (#9CA3AF)

#### 2.2.2 表示モード
1. **テーブル表示**
   - 検索機能（機械名/コード）
   - ステータスフィルター
   - ページネーション（10件/ページ）
   - 稼働率表示（24時間ベース）

2. **タイムライン表示**
   - 24時間の連続的な稼働状況
   - ホバーで詳細情報表示
   - 稼働率の自動計算

#### 2.2.3 データ更新
- 15秒間隔でリアルタイム更新
- ランダムな状態変化シミュレーション（開発環境）

### 2.3 生産スケジュール管理

#### 機能
- 品目別スケジュール表示
- 進捗率のリアルタイム更新
- 納期までの残り時間表示
- ステータス別集計（完了/進行中/未着手）

#### データ構造
```typescript
interface Schedule {
  id: string;
  machineId: string;
  productCode: string;
  productName: string;
  plannedQuantity: number;
  completedQuantity: number;
  startDate: Date;
  endDate: Date;
  progress: number;
  operator: string;
}
```

### 2.4 KPIダッシュボード

#### 表示指標
1. **全体稼働率** - リアルタイム計算
2. **設備総合効率（OEE）** - 85.3%（固定値）
3. **生産性** - 156台/日
4. **作業効率** - 92.1%

#### サブ指標
- 可動率: 92.1%
- 性能稼働率: 96.7%
- 良品率: 95.8%
- 計画達成率: 88.5%

#### グラフ表示
- 稼働率推移（過去7日間）
- エリアチャートでの可視化

## 3. UI/UXデザイン

### 3.1 デザインシステム
- **メインカラー**: ミントグリーン (#10B981)
- **背景色**: グレー (#F9FAFB)
- **フォント**: Inter + 日本語ゴシック
- **余白**: 統一された padding/margin 設計
- **角丸**: 6px (0.375rem)

### 3.2 レイアウト構成
1. **サイドバー**
   - 幅: 16px（折りたたみ時）/ 256px（展開時）
   - ホバーで自動展開
   - アイコンベースナビゲーション

2. **メインコンテンツ**
   - 最大幅: max-w-screen-2xl
   - パディング: 24px

### 3.3 レスポンシブデザイン
- モバイル対応（テーブルの横スクロール）
- グリッドレイアウトの自動調整

## 4. データモデル

### 4.1 Machine（機械）
```typescript
interface Machine {
  id: string;
  code: string;          // 例: "MC-001"
  name: string;          // 例: "CNC旋盤 #1"
  status: MachineStatus;
  currentProduct?: string;
  operator?: string;
  location: string;      // 例: "A-1"
}
```

### 4.2 MachineLog（稼働ログ）
```typescript
interface MachineLog {
  machineId: string;
  status: MachineStatus;
  timestamp: Date;
  duration: number;      // 分単位
  reason?: string;       // 停止理由
}
```

### 4.3 User（ユーザー）
```typescript
interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
}
```

## 5. パフォーマンス最適化

### 5.1 実装済み
- React.memoによるコンポーネントの最適化
- 仮想スクロール（予定）
- 画像の遅延読み込み（必要に応じて）

### 5.2 考慮事項
- 150台の機械データのリアルタイム更新
- 大量のログデータの効率的な処理
- メモリリークの防止（useEffectのクリーンアップ）

## 6. セキュリティ

### 6.1 実装済み
- クライアントサイドでのパスワード非表示/表示切り替え
- エラーメッセージの詳細隠蔽
- ミドルウェアレベルでのルート保護

### 6.2 今後の実装予定
- APIエンドポイントの保護
- CSRF対策
- XSS対策
- SQLインジェクション対策（DB実装時）

## 7. 開発環境

### 7.1 必要な環境
- Node.js 18以上
- npm または yarn

### 7.2 セットアップ
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プロダクション実行
npm start
```

### 7.3 環境変数
現在は使用していないが、将来的に以下を想定：
- `DATABASE_URL` - データベース接続文字列
- `JWT_SECRET` - JWT署名用秘密鍵
- `API_BASE_URL` - バックエンドAPIのURL

## 8. テスト戦略

### 8.1 単体テスト（未実装）
- Jest + React Testing Library
- コンポーネントテスト
- ストアのテスト

### 8.2 E2Eテスト（未実装）
- Cypress または Playwright
- 主要なユーザーフローのテスト

## 9. デプロイメント

### 9.1 推奨環境
- Vercel（Next.jsの公式推奨）
- Docker + Kubernetes（エンタープライズ環境）

### 9.2 考慮事項
- 環境変数の管理
- CI/CDパイプライン
- ロールバック戦略