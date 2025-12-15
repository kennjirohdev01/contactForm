const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // 必要なら DB からデータを取得して渡す
    res.render('admin', { /* 必要なデータ */ });
});

module.exports = router;