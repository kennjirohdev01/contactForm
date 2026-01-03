// DOM読み込み完了を待つ必要はありません（scriptタグがbodyの最後にあるため）

// 1. 各要素（コントロール）の参照を取得
// C++でいう GetDlgItem() でハンドルを取得する作業です
const zipInput = document.getElementById('zipcode');
const searchBtn = document.getElementById('searchBtn');
const prefInput = document.getElementById('prefecture');
const cityInput = document.getElementById('city');
const addrInput = document.getElementById('address');
const errorMsg = document.getElementById('errorMsg');

// 2. 検索ボタンにクリックイベントを設定
searchBtn.addEventListener('click', async () => {
    
    // 入力された郵便番号を取得
    const zipcode = zipInput.value;

    // --- ローカルバリデーション (簡易チェック) ---
    // C++: if (zipcode.GetLength() != 7) ...
    if (!zipcode || zipcode.length !== 7) {
        errorMsg.textContent = "郵便番号は7桁で入力してください（ハイフンなし）";
        return;
    }

    // エラーメッセージをクリア
    errorMsg.textContent = "";

    // --- APIへの問い合わせ処理 ---
    try {
        // 使用する無料API: zipcloud
        // URL作成 (C++の sprintf や std::format のような書き方)
        const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;

        // ★ 通信開始 (Fetch API)
        // await: 「通信が終わるまでここで待機せよ。ただしUIはフリーズさせるな」という命令
        const response = await fetch(url);

        // レスポンスをJSONとして解析
        // これも非同期処理なので await します
        const data = await response.json();

        // --- 結果の判定 ---
        // data.results は、見つかれば配列、見つからなければ null が返ってきます
        if (data.results === null) {
            errorMsg.textContent = "住所が見つかりませんでした。";
            return;
        }

        // --- 画面への反映 (UpdateData(FALSE)) ---
        // 結果の0番目（通常は1つだけ）を取得
        const result = data.results[0];

        // 取得した値を各テキストボックスにセット
        prefInput.value = result.address1; // 都道府県
        cityInput.value = result.address2; // 市区町村
        addrInput.value = result.address3; // 地域（番地の手前まで）

    } catch (error) {
        // 通信エラー（ネットが切れている等）の場合
        console.error("通信エラー:", error);
        errorMsg.textContent = "通信エラーが発生しました。";
    }
});