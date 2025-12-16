const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// module 読み込み
const {formatDate} = require('../utils/dataFormater');

router.get('/', async(req, res ,next) => {
    // 必要なら DB からデータを取得して渡す
    try{
        const [rows] = await pool.query('SELECT * FROM contacts');

        // デバッグ
        //console.log(rows);

        res.render('admin', 
            // admin.ejsに渡すオブジェクト
            // 左側:EJSで使用する変数・関数名/
            // 右側：admin.js(このファイル)で持っているデータまたは関数名
            { submissions: rows ,
              formatDate : formatDate
            });
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;