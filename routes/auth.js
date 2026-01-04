const express = require('express');
const router = express.Router();
require('dotenv').config();

// ログイン画面の表示(GET /login)
router.get('/login',(req,res)=>{
    res.render('login',{error:null});
});

// ログイン処理(POST /login)
router.post('/login',(req,res)=>{
    const inputPassword = req.body.password;
    const truePassword = process.env.ADMIN_PASSWORD;

    if(inputPassword === truePassword){
        // 認証成功
        req.session.isAuthenticated = true;

        // 管理画面へリダイレクト
        res.redirect('/admin');
    }else{
        // 認証失敗
        res.render('login',{error:'パスワードが違います'});
    }

});

// ログアウト処理(POST /logout)
router.get('/logout',(req,res)=>{
    // セッションを削除
    req.session.destroy(()=>{
       // ログイン画面に戻す
       res.redirect('/login');
    });
});

// ルータを外部公開
module.exports = router;
