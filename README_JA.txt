間取りAI スターター（スマホ対応Webアプリ）

含まれるもの
- 要望入力フォーム
- 3つの概念間取り案の表示と比較
- 部屋のドラッグ移動
- 選択した部屋の寸法・ドア・窓・玄関方角の編集UI
- Netlify Function経由のOpenAI API連携用コード

まず試す（AI設定なし）
1. ZIPを展開する
2. index.htmlをブラウザで開く
   ※静的なサンプル案と編集UIを試せます。AI連携は動きません。

NetlifyでAI連携を有効にする
1. このフォルダの中身をGitHubリポジトリにアップロードする
2. Netlifyで「Add new site」→「Import an existing project」を選び、GitHubリポジトリを接続
3. Site configuration（サイト設定）→ Environment variables（環境変数）で
   OPENAI_API_KEY = OpenAI APIキー
   を登録する
4. 再デプロイして、公開URLから試す
5. 必要なら OPENAI_MODEL = gpt-4.1-mini を設定する（デフォルトも同じ）

重要
- APIキーをindex.htmlなどのブラウザ側コードに書かないでください。
- APIの利用にはOpenAI側の利用設定・料金が必要な場合があります。
- このスターターは概念配置用です。寸法の整合性、壁厚、構造、採光・換気、建築基準法、設備配管、耐震性、避難経路などを検証しません。
- 実際の建築・申請に使う前に、建築士等の専門家による確認が必要です。
- 現在の編集機能は基本的な部屋の移動とサイズ調整です。壁・ドア・窓を図面上で直接つかんで移動する高度なCAD編集ではありません。
