const express = require("express");
const app = express();
const mongoose = require('mongoose');
const routes = require("./routes");
require("dotenv").config();
let { PORT, CONNECTIONSTRING } = process.env;

app.use("/api", routes);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(CONNECTIONSTRING);
}

app.listen(PORT, () => {
    console.log(`We are listening to port ${PORT}`)
})