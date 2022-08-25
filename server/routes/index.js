const express = require("express");
const user = require("./user");
const task = require("./task");
const router = express.Router();

router.use("/user", user);
router.use("/task", task);




module.exports = router

