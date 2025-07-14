# トラブルシューティングガイド

## 1. よくあるエラーと解決方法

### 1.1 Element type is invalid エラー

#### エラーメッセージ
```
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.
```

#### 原因
1. コンポーネントのインポート/エクスポートの不一致
2. 存在しないコンポーネントの使用
3. 条件付きレンダリングでundefinedを返している

#### 解決方法
1. **インポート文の確認**
   ```typescript
   // ❌ 間違い - デフォルトエクスポートでないのにデフォルトインポート
   import Badge from '@/src/components/ui/badge';
   
   // ✅ 正解 - 名前付きインポート
   import { Badge } from '@/src/components/ui/badge';
   ```

2. **エクスポート文の確認**
   ```typescript
   // ❌ 間違い
   function Badge() { ... }
   export { Badge };
   
   // ✅ 正解
   export function Badge() { ... }
   ```

3. **条件付きレンダリングの安全な実装**
   ```typescript
   // ❌ 危険 - Iconがundefinedの可能性
   <Icon className="h-4 w-4" />
   
   // ✅ 安全
   {Icon && <Icon className="h-4 w-4" />}
   ```

### 1.2 Tailwind CSSクラスが適用されない

#### 原因
1. カスタムCSSクラスが定義されていない
2. Tailwindの設定ミス
3. クラス名の動的生成

#### 解決方法
1. **globals.cssでカスタムクラスを定義**
   ```css
   .btn {
     @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150;
   }
   ```

2. **動的クラス名の回避**
   ```typescript
   // ❌ Tailwindがパージしてしまう可能性
   className={`text-${color}-500`}
   
   // ✅ 完全なクラス名を使用
   className={color === 'red' ? 'text-red-500' : 'text-blue-500'}
   ```

### 1.3 ポート使用中エラー

#### エラーメッセージ
```
Port 3000 is in use, trying 3001 instead.
```

#### 解決方法
```bash
# プロセスを確認
lsof -i :3000

# プロセスを終了
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# または特定のポートで起動
PORT=3001 npm run dev
```

### 1.4 SWC Binary エラー

#### エラーメッセージ
```
Failed to load SWC binary for darwin/arm64
```

#### 解決方法
```bash
# SWCバイナリを再インストール
npm uninstall @next/swc-darwin-arm64
npm install @next/swc-darwin-arm64

# またはnode_modulesを削除して再インストール
rm -rf node_modules
npm install
```

## 2. デバッグのテクニック

### 2.1 コンソールログの活用
```typescript
// ステータスが不明な場合の警告
if (!Icon) {
  console.warn(`Unknown machine status: ${machine.status} for machine ${machine.id}`);
}
```

### 2.2 React Developer Tools
- コンポーネントツリーの確認
- プロップスの検証
- 状態の確認

### 2.3 Network タブの活用
- APIリクエストの確認
- レスポンスの検証
- タイミングの分析

## 3. パフォーマンス問題

### 3.1 リアルタイム更新の最適化

#### 問題
150台の機械データを15秒ごとに更新すると重い

#### 解決策
```typescript
// 必要な部分のみ更新
const updateMachineStatus = useCallback(() => {
  // ランダムに選んだ機械のみ更新
  const machineToUpdate = machines[Math.floor(Math.random() * machines.length)];
  // ...
}, [machines]);
```

### 3.2 メモリリーク

#### 原因
useEffectのクリーンアップ忘れ

#### 解決策
```typescript
useEffect(() => {
  const interval = setInterval(updateData, 1000);
  
  // クリーンアップ関数を必ず返す
  return () => clearInterval(interval);
}, []);
```

## 4. 認証関連の問題

### 4.1 ログイン後にリダイレクトされない

#### 原因
1. Next.js のルーターキャッシュ
2. middlewareとZustand persistの認証状態の不整合

#### 解決策
```typescript
// router.push の代わりに window.location.href を使用
window.location.href = '/';
```

#### 詳細な原因と解決方法
1. **問題**: middlewareはCookieをチェックするが、Zustand persistのデフォルトはlocalStorage
2. **解決**: カスタムストレージを実装してCookieとlocalStorageの両方を使用

```typescript
// auth-store.ts のカスタムストレージ実装
storage: {
  getItem: (name) => {
    // Cookieから読み取り
    if (typeof window === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2]));
      } catch (e) {
        return null;
      }
    }
    // フォールバックとしてlocalStorageも確認
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    // Cookieに保存
    const stringValue = JSON.stringify(value);
    setCookie(name, stringValue);
    // localStorageにも保存（フォールバック）
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, stringValue);
    }
  },
  removeItem: (name) => {
    // Cookieから削除
    deleteCookie(name);
    // localStorageからも削除
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
}
```

### 4.2 認証状態が保持されない

#### 原因
1. Zustand persistの設定ミス
2. ミドルウェアでのクッキー読み取りエラー
3. CookieとlocalStorageの不整合

#### 解決策
```typescript
// クッキーの正しい読み取り
const authCookie = request.cookies.get('auth-storage');
if (authCookie) {
  const authData = JSON.parse(authCookie.value);
  // ...
}
```

#### デバッグ方法
1. ブラウザの開発者ツールでCookieを確認
2. console.logでmiddlewareの動作を追跡
3. localStorageとCookieの両方をチェック

```typescript
// デバッグ用コード
console.log('[Middleware] Path:', pathname);
console.log('[Middleware] Auth cookie:', authCookie?.value ? 'exists' : 'not found');
console.log('[Middleware] Auth data parsed:', authData);
```

## 5. スタイリングの問題

### 5.1 レイアウトの崩れ

#### 原因
親要素のレイアウト設定

#### 解決策
```typescript
// AuthLayoutで適切にラップ
<AuthLayout>
  <div className="space-y-6">
    {/* コンテンツ */}
  </div>
</AuthLayout>
```

### 5.2 アニメーションが動かない

#### 原因
1. Framer Motionのインポート忘れ
2. CSSでアニメーションを無効化している

#### 解決策
```css
/* アニメーションを選択的に有効化 */
* {
  transition: color 0.15s ease, background-color 0.15s ease !important;
}
```

## 6. データ関連の問題

### 6.1 状態が更新されない

#### 原因
Zustandの使い方の誤り

#### 解決策
```typescript
// 正しい状態更新
set((state) => ({
  machines: state.machines.map(m => 
    m.id === machineId ? { ...m, status: newStatus } : m
  )
}));
```

### 6.2 無限ループ

#### 原因
useEffectの依存配列の設定ミス

#### 解決策
```typescript
// 依存配列を適切に設定
useEffect(() => {
  // ...
}, [initializeData]); // 関数は必ずuseCallbackでラップ
```

## 7. ビルドエラー

### 7.1 TypeScriptエラー

#### よくあるエラー
```
Type 'string' is not assignable to type 'MachineStatus'
```

#### 解決策
```typescript
// 型アサーションを使用
const status = data.status as MachineStatus;

// または型ガードを実装
function isMachineStatus(status: string): status is MachineStatus {
  return ['RUNNING', 'STOPPED', 'ALARM', 'POWER_OFF'].includes(status);
}
```

## 8. 開発環境のTips

### 8.1 ホットリロードが効かない

#### 解決策
```bash
# .nextフォルダを削除
rm -rf .next
npm run dev
```

### 8.2 VSCode設定

#### 推奨拡張機能
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript React code snippets

#### 設定ファイル (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 9. よくある質問

### Q: なぜグローバルCSSでカスタムクラスを定義するのか？
A: Tailwindのパージ機能により、動的に生成されるクラスが削除される可能性があるため。事前定義することで確実に適用される。

### Q: なぜwindow.location.hrefを使うのか？
A: Next.jsのルーターキャッシュを回避し、ページ全体をリロードして認証状態を確実に反映させるため。

### Q: リアルタイム更新の間隔は変更できるか？
A: はい。setIntervalの値を変更することで調整可能。本番環境ではWebSocketの使用を推奨。