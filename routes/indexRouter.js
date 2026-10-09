const { Router } = require("express");
const {
    getSignUpController,
    getLoginController,
    postSignUpController,
    postLoginController
} = require("../controllers/indexController");
const passport = require("passport");
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
    res.redirect("/login");
})

indexRouter.get("/login", getLoginController);

indexRouter.post("/login", postLoginController);

indexRouter.get("/sign-up", getSignUpController);

indexRouter.post("/sign-up", postSignUpController);

indexRouter.get("/home", (req, res) => {
    res.send("hello there it works")
})

module.exports = indexRouter; 