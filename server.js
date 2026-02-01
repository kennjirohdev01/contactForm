const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const checkAuth = require('./auth');        // 認証チェック用ミドルウェア
require('dotenv').config();

// 作成したルーターを読み込む ▼▼▼
const authRouter = require('./routes/auth'); 
const apiRouter = require('./routes/api');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// セッションの設定
app.use(session({
    secret: 'secret_key_12345',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(flash());

// ここで '/' にマウントすることで、
// routes/auth.js 内の '/login' は 'http://host/login' としてアクセス可能になります。
app.use('/', authRouter); 
app.use('/api',apiRouter); // /apiから始まるURLはapi.jsに任せる

// ルーターを登録 (既存)
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

app.use('/', indexRouter);

// 管理画面の保護 (既存のまま)
// /admin にアクセスするときだけ checkAuth が発動し、
// OKなら adminRouter (管理画面の中身) へ進む
app.use('/admin', checkAuth, adminRouter);


app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});