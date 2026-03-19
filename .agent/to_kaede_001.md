# GemDeck 機能拡張仕様：AIステータス・ミニインジケーター

## 1. 概要
GemDeckのメインウィンドウ上部に、主要AI（Gemini / Claude）の稼働状況をリアルタイムで表示するインジケーターを追加する。APIを介さず、各社のパブリックなステータス情報を利用する。

## 2. UI/UX 仕様
- **表示場所**: メインタイトル「GemDeck」の右隣（同一ライン）。
- **表示形式**: `[アイコン] [サービス名]` のセットを横並びに配置。
- **デザイン詳細**:
    - フォントサイズはタイトルより一回り小さく設定。
    - ステータス状況を色付きの丸アイコン（●）で表現。
- **インタラクション**:
    - 各サービス名をクリック時、OSの標準ブラウザで公式ステータスページを別ウィンドウで開く。

## 3. 監視対象・データソース
| 項目 | 取得元 (Polling URL) | リンク先 (Click URL) |
| :--- | :--- | :--- |
| **Gemini API** | `https://status.cloud.google.com/en/feed.atom` | `https://aistudio.google.com/status` |
| **Claude Code** | `https://status.anthropic.com/api/v2/status.json` | `https://status.anthropic.com/` |

## 4. 動作仕様
### 4.1 定期更新処理
- **実行間隔**: 30分（1,800,000 ms）ごとに自動フェッチ。
- **判定ロジック**:
    - 🟢 **正常 (Normal)**: 
        - Claude: `indicator: "none"`
        - Gemini: Atomフィードに直近のクリティカルな障害報告がない
    - 🟡 **不安定 (Minor Issues)**: 
        - Claude: `indicator: "minor"` または `maintenance`
        - Gemini: フィードに「Service Disruption」等のキーワードが含まれる
    - 🔴 **停止 (Major Outage)**: 
        - Claude: `indicator: "major"` または `critical`
    - ⚪ **不明 (Unknown)**: ネットワークエラー、タイムアウト時

### 4.2 実装のポイント
- **CORS回避**: Antigravityのメインプロセス（Node.js環境）から `fetch` または `axios` で取得し、レンダラープロセスへ送る実装を推奨。
- **軽量化**: 背景で動くタイマーが重くならないよう、最小限のデータ取得に留める。

## 5. 表示イメージ
`GemDeck  ● Gemini API  ○ Claude Code`
（※●は正常、○は異常やメンテナンス時を想定した色変化）