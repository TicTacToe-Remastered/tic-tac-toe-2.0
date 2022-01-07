const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {
    res.end('🎉 Login 🎉');
});

module.exports = router;