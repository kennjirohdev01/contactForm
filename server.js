// 1. express をインポート
const express = require('express');
const path = require('path'); // Node.js に標準で入っている 'path' モジュール

// 2. express アプリケーションを作成
const app = express();
const PORT = 3000; // サーバーを起動するポート番号 (3000 が一般的)

// 3. (重要) 'public' フォルダを静的ファイルとして提供
// これにより、public/index.html や public/css/style.css にブラウザからアクセスできるようになる
app.use(express.static(path.join(__dirname, 'public')));

// 4. (重要) フォームからの POST リクエストを受け取るための設定
// これがないと、フォームのデータ (req.body) を読み取れない
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 形式のデータも受け取れるようにする

// 5. フォーム送信 (POST) を受け取るルート
app.post('/submit', (req, res) => {
    console.log('フォームデータを受け取りました:');
    console.log(req.body); // ターミナルに送信されたデータが表示される

    // ここでデータベース保存やメール送信処理を行う（今回はログ出力のみ）

    // ユーザーに完了メッセージを返す
    res.send('お問い合わせありがとうございました！');
});

// 6. サーバーを起動
app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});