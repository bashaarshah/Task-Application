const express = require("express");
const mongoose = require("mongoose");
const { UserSchema } = require("../schemas.js")
const router = express.Router();

const User = mongoose.model('User', UserSchema, "Users");

// check username
// make sure username exists
// check task
router.post("/create", async (req, res) => {

    // pass username as a req query parameter
    var username = req.query.username;
    var task = req.query.task;
    try {
        // check to see if username is valid
        if (!username) throw "Please provide a username";
        const foundUser = await User.findOne({ username });
        if (!foundUser) throw "Username does not exist";
        if (!task) throw "Please add a task";

        // insert into db
        // need to figure out how to add something to db
        if (foundUser.tasks.includes(task)) {
            throw 'Task already exists';
        }

        let updated = await User.updateOne({ username }, { $push: { tasks: task } })
        if (updated.modifiedCount != 1) {
            res.status(304).json({ message: 'Task not added' }).end();
            return;
        }

        res.status(200).json({ message: `Created task: ${task}` })
    } catch (eMessage) {
        console.log(eMessage);
        res.status(400).json({ error: eMessage.toString() });
    }

})


module.exports = router