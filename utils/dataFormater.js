/**
 * 日付オブジェクトを受け取り、指定のフォーマットの文字列を返す関数
 * @param {Data|string} data - 日付
 * @param {boolean} includeTime - 時刻を含めるか
 * @returns {string} フォーマットされた文字列
 */

function formatDate(date, includeTime = false){
    if (!date) return '';

    const d = new Date(date);
    // 無効な日付データの場合のガード
    if(isNaN(d.getTime())) return 'invalid date';

    const yyyy = d.getFullYear();
    const mm = ('00' + (d.getMonth() + 1)).slice(-2); // 0埋め
    const dd = ('00' + d.getDate()).slice(-2);

    let dateStr = `${yyyy}/${mm}/${dd}`;

    if(includeTime){
        const hh = ('00' + d.getHours()).slice(-2);
        const min = ('00' + d.getMinutes()).slice(-2);
        const ss = ('00' + d.getSeconds()).slice(-2);
        dateStr += ' ';
        dateStr += `${hh}:${min}:${ss}`;
    }

    return dateStr;
}

module.exports = {
    formatDate
};