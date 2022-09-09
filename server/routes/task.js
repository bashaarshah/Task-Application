const express = require("express");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { UserSchema } = require("../schemas.js")
const router = express.Router();
const { generateRandomString } = require("../utils")
const id = require("mongodb").ObjectId;

const User = mongoose.model('User', UserSchema, "Users");

// check username
// make sure username exists
// check task
router.post("/create", async (req, res) => {

    // pass username as a req query parameter
    var username = req.query.username;
    var task = req.query.task;
    var priority = req.query.priority;
    try {
        // check to see if username is valid
        if (!username) throw "Please provide a username";
        const foundUser = await User.findOne({ username });
        if (!foundUser) throw "Username does not exist";
        if (!task) throw "Please add a task";
        if (!priority) throw "Please provide a priority";

        // to generate task id
        const taskId = new id();

        let objTask = {}

        // insert into db
        if (foundUser.tasks.includes(task)) {
            throw 'Task already exists';
        }

        objTask.task = task;
        objTask._id = taskId;
        objTask.priority = priority;

        let updated = await User.updateOne({ username }, { $push: { tasks: objTask } })
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


// find user
// find task
// update task
router.put("/update", async (req, res) => {

    // pass username as a req query parameter
    var username = req.query.username;
    var taskid = req.query.taskid;
    //var oldpriorty = req.query.taskid;
    var newtask = req.query.newtask;
    var newpriority = req.query.newpriority;
    try {
        // check to see if username is valid
        if (!username) throw "Please provide a username";
        if (!taskid) throw "Please provide a taskid";
        if (!newtask) throw "Please provide a new task";
        if (!newpriority) throw "Please update the priority";

        const foundUser = await User.findOne({ username });
        if (!foundUser) throw "Username does not exist";

        // console.log(foundUser.tasks[])

        let newObjTask = {}

        // insert into db
        // need to figure out how to add something to db
        if (foundUser.tasks.includes(newtask)) {
            throw 'Task already exists';
        }
        newObjTask.newtask = newtask;
        newObjTask.newpriority = newpriority;
        let updated = await User.updateOne(
            { username, "tasks._id": new ObjectId(taskid) },
            { $set: { "tasks.$.task": newtask, "tasks.$.priority": newpriority } })
        if (updated.modifiedCount != 1) {
            res.status(304).json({ message: 'Task not added' }).end();
            return;
        }

        res.status(200).json({ message: `Updated task: ${taskid}` })
    } catch (eMessage) {
        console.log(eMessage);
        res.status(400).json({ error: eMessage.toString() });
    }

})

router.delete("/delete", async (req, res) => {

    // pass username as a req query parameter
    var username = req.query.username;
    var taskid = req.query.taskid;
    try {
        // check to see if username is valid
        if (!username) throw "Please provide a username";
        if (!taskid) throw "Please provide a taskid";

        const foundUser = await User.findOne({ username });
        if (!foundUser) throw "Username does not exist";


        let updated = await User.updateOne(
            { username, "tasks._id": new ObjectId(taskid) },
            { $pull: { "tasks.$.task": taskid } })

        res.status(200).json({ message: `Deleted task: ${taskid}` })
    } catch (eMessage) {
        console.log(eMessage);
        res.status(400).json({ error: eMessage.toString() });
    }

})






module.exports = router