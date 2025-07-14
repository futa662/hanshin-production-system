#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 引数から作業内容を取得
const workDescription = process.argv.slice(2).join(' ');

if (!workDescription) {
  console.error('使用方法: npm run dev-log "作業内容"');
  process.exit(1);
}

// 現在の日時を取得
const now = new Date();
const dateStr = now.toISOString().split('T')[0];
const timeStr = now.toTimeString().split(' ')[0];

// ファイル名を生成
const fileName = `${dateStr}-${workDescription.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}.md`;
const filePath = path.join(__dirname, '..', 'docs', 'development-log', fileName);

// テンプレート
const template = `# 開発ログ: ${dateStr} ${timeStr}

## 作業概要
${workDescription}

## 実施内容
- 

## 遭遇した問題
- 

## 解決方法
- 

## 学んだこと
- 

## 次のステップ
- 

## 参考リンク
- 
`;

// ファイルを作成
fs.writeFileSync(filePath, template);
console.log(`開発ログを作成しました: ${filePath}`);
console.log('エディタで開いて詳細を記入してください。');