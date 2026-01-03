document.addEventListener('DOMContentLoaded', function() {

    const yearSelect = document.getElementById('selectYear');
    const monthSelect = document.getElementById('selectMonth');
    const daySelect = document.getElementById('selectDay');
    const hiddenInput = document.getElementById('hiddenBirthday');

    // 1. 年の選択肢生成 (現在 〜 1900年)
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1900; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    // 2. 月の選択肢生成 (1 〜 12)
    for (let m = 1; m <= 12; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m;
        monthSelect.appendChild(option);
    }

    // 3. 日の選択肢を更新する関数
    function updateDayOptions() {
        // 現在選択されている「日」を記憶しておく
        const currentDay = daySelect.value;
        
        // 年と月が選ばれていない場合は、とりあえず31日まで表示しておく
        const year = yearSelect.value || currentYear; 
        const month = monthSelect.value || 1;

        // その月の最終日を取得 (重要: month は 1オリジンで渡すと、0を指定したことになるため、そのまま使えます)
        // 例: new Date(2025, 2, 0) -> 2025年3月0日 ＝ 2025年2月の最終日
        const lastDay = new Date(year, month, 0).getDate();

        // いったん「日」の選択肢を全削除
        daySelect.innerHTML = '<option value="">--</option>';

        // 1日 〜 最終日まで生成
        for (let d = 1; d <= lastDay; d++) {
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d;
            daySelect.appendChild(option);
        }

        // もともと選んでいた日が、新しい範囲内なら選択し直す
        // (例: 1月31日を選んでいて、2月に変更したら、31日は消えるので選択解除される)
        if (currentDay && currentDay <= lastDay) {
            daySelect.value = currentDay;
        }
    }

    // 4. 隠しフィールドを更新する関数
    function updateHiddenDate() {
        const y = yearSelect.value;
        const m = monthSelect.value;
        const d = daySelect.value;

        if (y && m && d) {
            const mm = ('00' + m).slice(-2);
            const dd = ('00' + d).slice(-2);
            hiddenInput.value = `${y}-${mm}-${dd}`;
        } else {
            hiddenInput.value = '';
        }
    }

    // イベントリスナー設定
    
    // 年・月が変わったら -> 日の選択肢を作り直す -> 隠しフィールド更新
    yearSelect.addEventListener('change', () => {
        updateDayOptions();
        updateHiddenDate();
    });

    monthSelect.addEventListener('change', () => {
        updateDayOptions();
        updateHiddenDate();
    });

    // 日が変わったら -> 隠しフィールド更新のみ
    daySelect.addEventListener('change', updateHiddenDate);

    // 初期化 (ページ読み込み時に一度実行して、日の選択肢を作る)
    updateDayOptions();
});