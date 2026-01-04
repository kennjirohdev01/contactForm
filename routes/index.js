const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/submit', async (req, res) => {
    const {
        user_name,
        user_prefecture,
        user_city,
        user_street,
        user_birthday,
        user_email,
        user_message
    } = req.body;

    const birthdayForDb = user_birthday === '' ? null : user_birthday;
    
    // 入力内容のチェック
    if(!user_message || user_message.trim() === ""){
        return res.redirect('/');
    }
    

    try {
        const sql = `
            INSERT INTO contacts
            (name, prefecture, city, address_line1, birthday, email_address, message)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.execute(sql, [
            user_name,
            user_prefecture,
            user_city,
            user_street,
            birthdayForDb,
            user_email,
            user_message
        ]);
        res.send('お問い合わせありがとうございました！');
    } catch (error) {
        console.error(error);
        res.status(500).send('サーバーエラーが発生しました。');
    }
});

module.exports = router;