const express = require("express");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/login", (req, res) => {
    res.json({ message: '🎉 Login 🎉' });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};

    const userWithEmail = await User.findOne({ where: { email } }).catch(
        (err) => {
            console.log("Error: ", err);
        }
    );

    if (!userWithEmail)
        return res
            .status(400)
            .json({ message: "Email or password does not match!" });

    const match = await bcrypt.compare(password, userWithEmail.password);
    if (!match)
        return res
            .status(400)
            .json({ message: "Email or password does not match!" });

    const jwtToken = jwt.sign(
        { id: userWithEmail.id, email: userWithEmail.email },
        process.env.JWT_SECRET
    );

    res.json({ message: "Welcome Back!", token: jwtToken });
});

module.exports = router;

