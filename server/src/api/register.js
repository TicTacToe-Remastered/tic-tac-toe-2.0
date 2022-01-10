const express = require("express");
const User = require("../models/user");
const bcrypt = require('bcrypt');

const router = express.Router();

const saltRounds = 12;

router.get("/register", (req, res) => {
    res.json({ message: '🎉 Register 🎉' });
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
        (err) => {
            console.log("Error: ", err);
        }
    );

    if (alreadyExistsUser) {
        return res.status(409).json({ message: "User with email already exists!" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hash });
    const savedUser = await newUser.save().catch((err) => {
        console.log("Error: ", err);
        res.status(500).json({ error: "Cannot register user at the moment!" });
    });

    if (savedUser) res.json({ message: "Thanks for registering" });
});

module.exports = router;