---
description: ユーザーの指示が Gemini 案件か Claude 案件かを判定し、適切に振り分ける
---

あなたはユーザー（なべ）の指示を受けた際、最初に行うべき儀式として「タスクルーティング」を実施します。

### 1. 判定基準の確認
必ず [`prompts/routing_prompt.md`](file:///c:/Projects/GemDeck/prompts/routing_prompt.md) の内容を読み込み、最新の判定基準を把握してください。

### 2. インテント判定
ユーザーの指示を分析し、以下のいずれかに分類してください：
- **Gemini案件**: そのままあなたが（Antigravity Agentとして）タスクを実行します。
- **Claude案件**: Claude Code CLI に任せるべきタスクです。

### 3. アクション
#### Gemini案件の場合
- 「それならうちがやるね！」と伝え、そのまま作業を開始してください。

#### Claude案件の場合
- **理由の提示**: なぜこのタスクがClaudeに適しているのかを [`prompts/routing_prompt.md`](file:///c:/Projects/GemDeck/prompts/routing_prompt.md) の基準に沿って簡潔に説明してください。
- **実行の提案**: `ag-hybrid.executeClaudeDirect` コマンドを使用して Claude Code を起動することを提案してください。
- **プロンプトの清書**: 必要であれば、基準に合わせて Claude が理解しやすいようにプロンプトを清書（Draft作成）してください。

### 4. 実行アクション（自動連携）
Claudeの実行が承認された場合、以下の手順で拡張機能側に指示を出してください：
1.  プロジェクトルートの `.agent/bridge.json` に、以下の内容を書き込む。
    ```json
    {
      "command": "executeClaude",
      "prompt": "清書したプロンプト内容"
    }
    ```
2.  書き込みが完了すると、拡張機能側で自動的に Claude ターミナルが立ち上がります。