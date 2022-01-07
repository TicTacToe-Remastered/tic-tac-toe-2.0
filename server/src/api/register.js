const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
    res.end('🎉 Register 🎉');
});

module.exports = router;