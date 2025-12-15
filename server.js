// 1. express をインポート
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// EJS をテンプレートエンジンとして設定
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

//  'public' フォルダを静的ファイルとして提供
// これにより、public/index.html や public/css/style.css にブラウザからアクセスできるようになる
app.use(express.static(path.join(__dirname, 'public')));

// (重要) フォームからの POST リクエストを受け取るための設定
// これがないと、フォームのデータ (req.body) を読み取れない
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 形式のデータも受け取れるようにする

// ルーターを登録
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// 6. サーバーを起動
app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});