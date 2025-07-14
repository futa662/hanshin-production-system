# 阪神内燃機工業 生産管理システム

大型船舶向け内燃機（エンジン）製造における生産管理を効率化するWebアプリケーション。

## 🚀 機能

### 1. 機械稼働状況モニター
- 150台の工作機械のリアルタイム監視
- 4種類のステータス表示（稼働中、停止中、アラーム、電源オフ）
- 24時間の稼働履歴タイムライン
- 検索・フィルター機能
- テーブル/タイムライン表示切り替え

### 2. 生産スケジュール管理
- 品目別の生産計画表示
- 進捗率のリアルタイム更新
- 納期管理
- 担当者割り当て

### 3. KPIダッシュボード
- 全体稼働率
- 設備総合効率（OEE）
- 生産性指標
- 稼働率推移グラフ

## 🛠 技術スタック

- **フレームワーク**: Next.js 14.2.4 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **認証**: カスタム実装（Zustand + persist）
- **グラフ**: Recharts
- **アイコン**: Lucide React

## 📦 インストール

```bash
# リポジトリのクローン
git clone [repository-url]
cd hanshin

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 🔐 ログイン情報

開発環境では以下のテストアカウントが利用可能：

| ロール | ユーザーID | パスワード |
|--------|------------|------------|
| 管理者 | admin | admin123 |
| オペレーター | operator01 | pass123 |
| 閲覧者 | viewer01 | view123 |

## 📁 プロジェクト構造

```
hanshin/
├── app/                    # Next.js App Router
│   ├── login/             # ログインページ
│   ├── manufacturing/     # 機械モニター
│   ├── production/        # スケジュール管理
│   └── management/        # KPIダッシュボード
├── src/
│   ├── components/        # Reactコンポーネント
│   ├── store/            # Zustand ストア
│   ├── lib/              # ユーティリティ
│   └── types/            # TypeScript型定義
├── docs/                  # ドキュメント
│   ├── development-log/   # 開発ログ
│   ├── system-specification.md
│   ├── troubleshooting-guide.md
│   └── technical-insights.md
└── public/               # 静的ファイル
```

## 🚦 開発ガイドライン

1. **デザイン原則**
   - エンタープライズ向けの洗練されたUI
   - ミントグリーン (#10B981) を基調
   - 適切な余白と情報の階層化

2. **コーディング規約**
   - TypeScriptの型安全性を重視
   - 'use client'ディレクティブの適切な使用
   - エラーハンドリングの実装

3. **パフォーマンス**
   - 150台の機械データの効率的な処理
   - リアルタイム更新の最適化
   - メモリリークの防止

## 📚 ドキュメント

- [システム仕様書](./docs/system-specification.md)
- [トラブルシューティングガイド](./docs/troubleshooting-guide.md)
- [技術的な気づき](./docs/technical-insights.md)
- [AI開発ガイド](./CLAUDE.md)

## 🐛 トラブルシューティング

### ポート3000が使用中の場合
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### 開発サーバーが不安定な場合
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 🔧 スクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLintチェック
npm run type-check # TypeScriptチェック
```

## 📈 今後の開発予定

- [ ] WebSocketによるリアルタイム通信
- [ ] データエクスポート機能
- [ ] プッシュ通知
- [ ] ダークモード対応
- [ ] 多言語対応（i18n）
- [ ] モバイルアプリ版

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは阪神内燃機工業の内部システムです。

---

開発: Claude AI Assistant
最終更新: 2024-12-20