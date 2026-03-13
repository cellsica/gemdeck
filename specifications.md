🛠️ Gem専用PWAランチャー「GemDeck」最新仕様書


## 1. コンセプト



* **「専門家を召喚する」**: 各Gemを特定の分野のスペシャリストに見立て、セキュリティカード（IDカード）風のUIで並べる。
* **「身軽な動作」**: PWAとして構築し、ブラウザのタブ管理から解放された独自のランチャーとして機能させる。
* **「ポータビリティ」**: 設定をJSONで管理し、環境移行を容易にする。


## 2. デザイン・画面構成（UI/UX）


### カードデザイン（セキュリティカード風）

PCでは横に並び、スマホでは縦1列に最適化されるレスポンシブなグリッドレイアウト。



* **顔写真（アイコン）**: 左側または上部に配置。デフォルトはGem名の頭文字、カスタム画像も指定可能。
* **担当分野（Role）**: カード上部に強調して表示（例：「Pythonエンジニア」「税務アドバイザー」）。
* **Gem名（Title）**: カードの中央に大きく配置。ここがクリック時のリンクになる。
* **説明（Description）**: 小さめの文字で、その専門家の得意なことやプロンプトのコツを記載。


### モード切り替え



* **閲覧モード**: カードをクリックしてGemを別タブで開く。
* **編集モード**: 各項目のテキストやアイコンURLをその場で編集可能（Gem名以外）。


## 3. 機能要件


<table>
  <tr>
   <td><strong>機能</strong>
   </td>
   <td><strong>内容</strong>
   </td>
  </tr>
  <tr>
   <td><strong>マルチデバイス対応</strong>
   </td>
   <td>PWAとしてPC/スマホ/タブレットにインストール可能。スマホでは縦長に最適化。
   </td>
  </tr>
  <tr>
   <td><strong>Gem起動</strong>
   </td>
   <td>クリックで https://gemini.google.com/gems/unique-id を別タブで開く。
   </td>
  </tr>
  <tr>
   <td><strong>インプレース編集</strong>
   </td>
   <td>担当分野、説明、アイコンURL、リンク先URLをユーザーが自由に入力・変更可能。
   </td>
  </tr>
  <tr>
   <td><strong>データ管理</strong>
   </td>
   <td>ブラウザの localStorage を使用し、リロードしても設定を維持。
   </td>
  </tr>
  <tr>
   <td><strong>インポート/エクスポート</strong>
   </td>
   <td>全設定を1つの <strong>JSON形式</strong> で書き出し、または読み込み可能。
   </td>
  </tr>
  <tr>
   <td><strong>デフォルト表示</strong>
   </td>
   <td>登録直後やアイコン未設定時は、Gem名の1文字目＋円形背景を自動生成（Gem純正風）。
   </td>
  </tr>
</table>



## 4. 技術スタック（推奨）



* **フレームワーク**: Vue.js 3 (Composition API)
* **スタイリング**: Tailwind CSS (レスポンシブ設計とカードデザインの構築が容易)
* **PWA**: @vitejs/plugin-pwa (Vite環境でPWA化)
* **状態管理**: Pinia (Gemリストの追加・削除・編集ロジックを共通化)


## 5. データ構造（JSONイメージ）


    JSON

[ \
  { \
    "id": "unique-gem-id-1", \
    "role": "Python Specialist", \
    "name": "Code Buddy", \
    "description": "Vue.jsやPythonのコードレビュー、デバッグを担当。", \
    "iconUrl": "https://example.com/avatar.png", \
    "gemUrl": "https://gemini.google.com/gems/..." \
  } \
] \



## 

---
📱 スマホでの見え方イメージ

スマホで見た時は、セキュリティカードが縦にシュッと並んで、親指でタップしやすいサイズ感になるように調整するわ。PCやとあるじの広い画面を活かして、横に3〜4枚並ぶような感じやね。