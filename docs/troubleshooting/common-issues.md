# トラブルシューティングガイド

## 遭遇した問題と解決方法

### 1. SWCバイナリエラー
**問題**: Next.js起動時に「Failed to load SWC binary for darwin/arm64」エラー
```
⚠ Attempted to load @next/swc-darwin-arm64, but an error occurred
```

**解決方法**:
```bash
npm install @next/swc-darwin-arm64
```

### 2. ポート競合
**問題**: ポート3000が既に使用中
```
⚠ Port 3000 is in use, trying 3001 instead.
```

**解決方法**:
```bash
lsof -ti:3000 | xargs kill -9
```

### 3. TypeScript型定義不足
**問題**: rechartsの型定義がない

**解決方法**:
```bash
npm install --save-dev @types/recharts
```

### 4. パス解決エラー
**問題**: @/でのインポートが機能しない

**解決方法**: tsconfig.jsonに以下を追加
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## パフォーマンス関連

### 150台の機械表示
- 初期実装では問題なし
- 今後、パフォーマンス低下が見られたら仮想スクロールを検討

### リアルタイム更新
- 15秒ごとの更新は現状問題なし
- 必要に応じてWebSocketへの移行を検討