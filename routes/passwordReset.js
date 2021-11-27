const express = require("express");
const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendEmail = require("../middleware/forgotPassMail");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (!user)
            return res.status(500).json({ success: false, message: "Email doesnt existed" });

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;
        await sendEmail(req.body.email, "Password reset", link);

        res.status(200).json({ success: true, message: "Reset link sent to your email account" });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).json({ success: false, message: "Invalid link or expired" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).json({ success: false, message: "Invalid link or expired" });

        user.password = req.body.password;
        await user.save();
        await token.delete();

        res.status(200).json({ success: true, message: "Password reset sucessfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
        console.log(error);
    }
});

module.exports = router;
