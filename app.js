const express = require("express");
const path = require("node:path");

const app = express();

// connect ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
    res.send("Hello World");
})

// open port connection
app.listen(8000, (error) => {
    if (error) {
        throw error;
    }
    console.log("server listening on port 8000!");
});