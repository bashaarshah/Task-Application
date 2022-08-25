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
        if (found.length > 0) throw "Username already exists";

        // insert into db
        const user = new User({ username });
        await user.save()

        res.status(200).json({ message: `Created user: ${user.username}` })
    } catch (eMessage) {
        res.status(400).json({ error: eMessage });
    }

})

router.put("/update", async (req, res) => {

    var username = req.query.username;
    var newUsername = req.query.newUsername;
    try {
        if (!username) throw "Please provide a username to update.";
        if (!newUsername) throw "Please provide a new username."
        if (newUsername.length < 5) throw "Username must be more than 5 characters";
        if (username == newUsername) throw "New username cannot be the same as old username.";


        let found = await User.findOne({ username }); // first db call
        if (!found) throw "No user exists";

        found.username = newUsername; // making change in memory
        await found.save(); // second db call
        

        res.status(200).json({ message: `Updated ${username} to ${found.username}` });

    } catch (eMessage) {
        res.status(400).json({ error: eMessage.toString() })
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

/**
 * This is another way to do the update request
 * This way uses 2 database calls, whereas the first method only calls the db once
 * Here, we find the document, then update it
 * In the first implemenation, we find the document (without making a call to the db), and just update it
 */
// router.put("/update", async (req, res) => {

//     var username = req.query.username;
//     var newUsername = req.query.newUsername;
//     try {
//         if (!username) throw "Please provide a username to update.";
//         if (!newUsername) throw "Please provide a new username."
//         if (newUsername.length < 5) throw "Username must be more than 5 characters";
//         if (username == newUsername) throw "New username cannot be the same as old username.";

//         let found = await User.find({ username }); first call to the db
//         if (found.length == 0) throw "No user exists";

        
//         // second, and third call to the db
//         await User.updateOne({ username: username }, { username: newUsername });


//         res.status(200).json({ message: `Updated ${username} to ${newUsername}` });

//     } catch (eMessage) {
//         res.status(400).json({ error: eMessage.toString() })
//     }

// })



module.exports = router
