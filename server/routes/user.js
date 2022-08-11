const express = require("express");
const mongoose = require("mongoose");
const { UserSchema } = require("../schemas.js")
const router = express.Router();

const User = mongoose.model('User', UserSchema, "Users");

router.post("/create", async (req, res) => {

    // pass username as a req query parameter
    var username = req.query.username;
    try {
        // check to see if username is valid
        if (!username) throw "Please provide a username";
        if (username.length < 5) throw "Username must be more than 5 characters";
        const found = await User.find({ username });
        if (found.length > 0) throw "username already exists";
        // insert into db
        const user = new User({ username });
        await user.save()
        res.status(200).json({ message: `Created user: ${user.username}` })
    } catch (eMessage) {
        res.status(400).json({ error: eMessage });
    }

})

router.delete("/delete", async (req, res) => {

    var username = req.query.username;
    try {
        if (!username) throw "Please provide a username to delete.";
        const found = await User.find({ username });
        if (found.length == 0) throw "No user exists";
        await User.deleteOne({ username });
        res.status(200).json({ message: `Deleted ${username}` });

    } catch (eMessage) {
        res.status(400).json({ error: eMessage })
    }

})




module.exports = router
