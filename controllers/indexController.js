const { addNewUser } = require("../db/queries");
const passport = require("passport");

const getLoginController = (req, res) => {
    res.render("login-form", { user: req.user });
}

const getSignUpController = (req, res) => {
    res.render("sign-up-form");
}

// eventually add validation and use bcrypt to hash password instead of storing it in db
const postSignUpController = async (req, res, next) => {
    try {
        const {first_name, last_name, username, password} = req.body;
        await addNewUser({first_name, last_name, username, password});
        res.redirect("/");
    }catch(err) {
        return next(err);
    }
};

const postLoginController = (req, res) => {
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureMessage: true,
    })
}

module.exports = {
    getSignUpController,
    postSignUpController,
    getLoginController,
    postLoginController
}