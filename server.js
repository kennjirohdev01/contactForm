// 1. express をインポート
const express = require('express');
const path = require('path'); // Node.js に標準で入っている 'path' モジュール

// 2. express アプリケーションを作成
const app = express();
const PORT = 3000; // サーバーを起動するポート番号 (3000 が一般的)

 // EJS をテンプレートエンジンとして設定
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

// 3. (重要) 'public' フォルダを静的ファイルとして提供
// これにより、public/index.html や public/css/style.css にブラウザからアクセスできるようになる
app.use(express.static(path.join(__dirname, 'public')));

// 4. (重要) フォームからの POST リクエストを受け取るための設定
// これがないと、フォームのデータ (req.body) を読み取れない
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 形式のデータも受け取れるようにする

// mysql2のインポートと設定 promiseAPIを使用
const mysql=require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'contact_app_user',
    password: '@123456789MMkk',
    database: 'contact_form_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

app.get('/', (req, res) => {
    res.render('index', { prefectures: prefectures });
});


// 5. フォーム送信 (POST) を受け取るルート
app.post('/submit', async(req, res) => {
    console.log('フォームデータを受け取りました:', req.body);
    
    // html側のname属性
    const{
        user_name,
        user_prefecture,
        user_city,
        user_street,
        user_birthday,
        user_email,
        user_message
    }  = req.body;
    
    // date型が空白だとDBへのInsertでエラーになるため、nullに変換
    const birthdayForDb = user_birthday === '' ? null : user_birthday;
    
    // ここでデータベース保存やメール送信処理を行う（今回はログ出力のみ）
    try {
        const sql = `
            INSERT INTO contacts
            (name, prefecture, city, address_line1, birthday, email_address, message)
            VALUES 
            (?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.execute(sql,[
            user_name,          // -> name
            user_prefecture,    // -> prefecture
            user_city,          // -> city
            user_street,        // -> street
            birthdayForDb,      // -> birthday
            user_email,         // -> email
            user_message        // -> message
        ]);

        console.log(`データベースへの保存に成功しました`);
        res.send(`お問い合わせありがとうございました！`);
    } catch (error) {
        console.error('データベース保存中にエラーが発生しました:', error);
        res.status(500).send('サーバーエラーが発生しました。後ほど再度お試しください。');
    }
    

});

// 6. サーバーを起動
app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});