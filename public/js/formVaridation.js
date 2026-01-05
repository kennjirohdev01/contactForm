document.addEventListener('DOMContentLoaded',()=>{

    // 要素(コントロールの取得)
    const form = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('messageError');

    const submitBtn = form.querySelector('button[type="submit"]');

    // 送信ボタンが押された時のイベント
    form.addEventListener('submit',(event)=>{

        // バリデーションチェック
        const messageValue = messageInput.value;

        if(!messageValue || messageValue.trim() === ""){
            // ここで送信を止める
            event.preventDefault();

            messageError.textContent = "お問い合わせ内容を入力してください。";

            // エラー箇所にフォーカスを当てる(親切設計)
            messageInput.focus();

            submitBtn.disabled = false;
        }else{
            // エラーが無い場合は何もしない
            messageError.textContent = "";

            // 二重送信防止
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';
        }

    });

    messageInput.addEventListener('input',()=>{
        if(messageInput.value.trim() !== ""){
            messageError.textContent = "";
        }
    });

});