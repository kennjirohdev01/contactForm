const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db/pool');

// --API用の認証チェックミドルウェア--
// 既存のauth.jsとは異なり、API用に「エラー(401)を返す専用のものを作成」
const checkApiAuth = (req,res,next)=>{
    if(req.session.isAuthenticated){
        next();
    }else{
        // Json形式でエラーを返す
        res.status(401).json({success:false,message:'ログインしていません'});
    }
};

// ログインAPI(POST /api/login)
router.post('/login',async(req,res) =>{
    const {email ,password} = req.body;

    try{
        // メールアドレスでユーザーを検索
        const[rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?',[email]);
        const user = rows[0];

        // ユーザーが見つからない場合
        if(!user || !password){
            return res.json({success:false,message:'メールアドレスまたはパスワードが異なります'})
        }

        // パスワードの比較(入力された生パスワードとDBのハッシュ)
        const match = await bcrypt.compare(password,user.password_hash);

        if(match){
            // ログイン成功：セッションに記録
            req.session.isAuthenticated = true;
            res.json({success:true,message:'ログイン成功'});
        }else{
            res.json({success:false,message:'メールアドレスまたはパスワードが異なります'})
        }
    }catch(err){
        console.error(err);
        res.status(500).json({success:false,message:'サーバエラーが発生しました'});
    }
})

// 問い合わせ一覧取得API(GET /api/contacts)
// checkApiAuthを挟むことで、ログイン済みユーザーだけをアクセス可能にする
router.get('/contacts',checkApiAuth,async(req,res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM contacts');
        res.json(rows);
    }catch(err){
        console.error(err);
        res.status(500).json({success: false,message:'データ取得エラー'});
    }
});

// 管理ユーザー追加API(POST /api/admin/users)
router.post('/admin/users',checkApiAuth,async(req,res) =>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({success:false,message:'入力が不足しています'});
    }
    try{
        // パスワードをハッシュ化
        const hash = await bcrypt.hash(password,10);
        
        // DBに保存
        await pool.query(
            'INSERT INTO admin_users (email,password_hash) VALUES (?,?)',
            [email,hash]
        );
        res.json({success:true,message:'管理ユーザーを登録しました'});
    }catch(err){
        console.error(err);
        //  メールアドレスの重複だけは別で通知
        if(err.code === 'ER_DUP_ENTRY'){
            res.json({success:false,message:'そのメールアドレスは既に登録されています。'});
        }else{
            res.status(500).json({success:false,message:'登録エラー'});
        }
    }
});

module.exports = router;