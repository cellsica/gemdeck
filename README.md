# GemDeck 🎴

Gemini や Claude などのカスタム AI アシスタントを管理・起動するための、セキュリティカード風 PWA ランチャーです。

## ✨ 機能
- **AI カード管理**: AI サービスへのリンクを直感的なカード形式で管理。
- **インテリジェント表示**: URL に応じて自動的に「Gem」「Claude」「Rakuten」などのボタンを出し分け。
- **ステータス監視**: Gemini API と Claude Code のリアルタイム稼働状況をヘッダーに表示。
- **PWA 対応**: スマホへのインストールや、Web Share Target による Gem 追加に対応。

## 🚀 ローカルでの確認手順

以下の手順で、お使いの PC 上で GemDeck を起動して動作を確認できます。

### 1. 依存関係のインストール
プロジェクトのルートディレクトリでターミナル（Powershell 等）を開き、以下のコマンドを実行します。
```powershell
npm install
```

### 2. 開発サーバーの起動
以下のコマンドでローカル開発サーバーを立ち上げます。
```powershell
npm run dev
```

### 3. ブラウザでアクセス
コマンド実行後、ターミナルに表示される URL（デフォルトは `http://localhost:5173/` ）をブラウザで開いてください。
ヘッダー右側に **Gemini API** と **Claude Code** の稼働ステータスが表示されていれば、今回の更新分も含めて正常に動作しています。

## 🛠️ 技術スタック
- **Vite** + **Vue 3 (Composition API)**
- **Tailwind CSS** (v4)
- **Pinia** (状態管理)
- **Vite PWA Plugin**

---
*Powered by Cellsica* / *Created with ❤️ for the Gemini Community*
