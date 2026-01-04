// 認証チェックを行うミドルウェア関数
// req: リクエストオブジェクト
// res: レスポンスオブジェクト
// next: 次のミドルウェア関数を呼び出すための関数
function checkAuth(req,res,next){

    // セッションの中に「管理者としてログイン済み」というフラグが立っているか
    if(req.session.isAuthenticated){
        // 合格
        next(); // nextは本来行きたい処理を呼ぶ
    }else{
        // 不合格
        // ログイン画面へ強制転送(リダイレクト)
        res.redirect('/login');
    }
}

module.exports = checkAuth;