# GemDeck Tips: AIを活用した一括インポート

GemDeck（v1.0.0以降）では、設定画面からJSONファイルをインポートすることで、複数のAI・Gemを一括で登録することができます。

このドキュメントでは、GeminiやClaudeなどの他のAIサービスを使って、**画面情報のスクリーンショットやテキストコピペから、GemDeck用の一括登録JSONファイル（`gemdeck-export.json`）を自動生成させるための魔法のプロンプト**を紹介します。

---

## 汎用LLM向けプロンプト (ChatGPT / Claude Web版用)

**用途**: ブラウザからテキストをざっくりコピーして（あるいはスクリーンショットを貼って）、チャット画面上のAIにJSONを作ってもらう場合に使用します。

以下のプロンプトとデータをAIに送信し、返ってきたJSONコードのブロックをコピーして、適当な名前（例: `import.json`）で保存してください。その後、GemDeckの「歯車アイコン」→「Import JSON」から読み込ませます。

```markdown
以下のテキスト（または画像）は、私が作成したAIアシスタント（Gem等）の一覧です。
この情報を整理して、指定するJSONフォーマットで出力してください。

## 入力データ
[ここにブラウザからコピーしたテキストを雑に貼り付ける、またはスクショを添付する。各AIの名前とURLが含まれているのが望ましいです。]

## ルール
- 各アシスタントごとに、以下の要素を判別・推測してください。
  - `name`: 名前
  - `role`: 短い肩書きや担当分野（例: SEO Specialist / Coding Assistant / Python Expert）
  - `description`: アシスタントの説明（短い文章）
  - `gemUrl`: 起動用のURL。テキスト内にない場合はプレースホルダー（`https://gemini.google.com/gems/IDを入力`など）を仮置きしてください。
- `id` には重複しないランダムな文字列（UUIDなど）としてください。
- 返答は**JSONコードブロックのみ**にしてください（余計な挨拶や説明は不要です）。

## 出力JSONフォーマット
以下のオブジェクトの配列として出力してください。
`json
[
  {
    "id": "重複しないランダムな文字列",
    "role": "肩書き",
    "name": "名前",
    "description": "説明",
    "iconUrl": "",
    "gemUrl": "起動用のURL",
    "lastUsedAt": 1700000000000,
    "isPinned": false
  }
]
`
```

---

## 自律型エージェント向けプロンプト (Cowork / Claude Computer Use用)

**用途**: 自律的にブラウザを操作できるAIエージェント（Antigravity, Computer Use, Cursor, Browser Useなど）に対して、直接Gemの管理画面を見に行かせてJSONファイルを作らせる場合に使用します。

```markdown
# タスク指示
ブラウザで現在開いている「Gem（またはカスタムGPT）の管理画面・一覧画面」を巡回し、取得したデータから GemDeckインポート用の `gemdeck-export.json` を作成して保存してください。

## データ抽出ルール
一覧にあるすべてのAIアシスタントについて、以下の情報を取得・推測してください。
- `name`: AIの名前（必須）
- `role`: そのAIの「担当分野」や「肩書き」を数単語で推測して設定（必須/例: Python Expert, Web Searcher）
- `description`: 画面上の説明文。ない場合は用途を推測して1〜2行で記述（必須）
- `gemUrl`: そのAIを開くための直接のURL（必須/`https://gemini.google.com/gems/...` など。チャット画面のURLではなくGem本体のURLを取得すること）
- `iconUrl`: アイコン画像のURLが取得できれば設定（任意/取得できなければ `""` 空文字）

## 出力フォーマット (JSON配列)
以下のスキーマに厳密に準拠したJSONファイルを出力してください。
`json
[
  {
    "id": "ランダムな一意の文字列（UUIDなど）",
    "role": "役割（例：Creative Writer）",
    "name": "AI・Gemの名前",
    "description": "説明文",
    "iconUrl": "画像URLまたは空文字",
    "gemUrl": "直接開くためのURL",
    "lastUsedAt": 1700000000000,
    "isPinned": false
  }
]
`

## アクション
1. 画面の要素を読み取り、上記のフォーマットでJSON配列を構築してください。
2. 構築したJSON配列を `gemdeck-export.json` という名前のファイルとしてカレントディレクトリに保存してください。
```
