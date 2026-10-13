const { addNewUser, getAllPosts, deletePost, updateMembership, addNewPost } = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const signUpValidation = [
    body("first_name")
        .trim()
        .isLength({min: 1, max: 255})
        .withMessage("First name must be between 1 - 255 characters"),
    body("last_name")
        .trim()
        .isLength({min: 1, max: 255})
        .withMessage("Last name must be between 1 - 255 characters"),
    body("username")
        .trim()
        .isLength({min: 1, max: 255})
        .withMessage("Username must be between 1 - 255 characters"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Must enter a valid email"),
    body("password")
        .isLength({min: 4})
        .withMessage("Password must be at least 4 characters long"),
    body("confirm_password")
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage("Passwords do not match")
];

const newPostsValidation = [
    body("title")
        .trim()
        .isLength({min: 1, max: 255})
        .withMessage("Title must be between 1 - 255 characters"),
    body("message")
        .trim()
        .isLength({min: 1, max: 255})
        .withMessage("Message must be between 1 - 255 characters")
]

const getLoginController = (req, res) => {
    res.render("login-form", { user: req.user });
}

const getSignUpController = (req, res) => {
    res.render("sign-up-form");
}

// eventually add validation and use bcrypt to hash password instead of storing it in db
const postSignUpController = [
    signUpValidation,
    async (req, res, next) => {
        const errors = validationResult(req);
        const {first_name, last_name, password, email, username} = req.body;

        if (!errors.isEmpty()) {
            return res.render("sign-up-form", {
                errors: errors.array(),
                form_data: {
                    first_name,
                    last_name,
                    email,
                    username,
                    password
                }
            })
        }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await addNewUser({first_name, last_name, username, hashedPassword, email});
            res.redirect("/");
        }catch(err) {
            if (err.code === "23505") {
                return res.render("sign-up-form", {
                    errors: [{msg: "Username already taken"}],
                    form_data: {
                        first_name,
                        last_name,
                        email,
                        username,
                        password
                    }
                })
            }
            return next(err);
        }
    }
]


const postLoginController = (req, res) => {
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureMessage: true,
    })(req, res);
}

const getLogoutController = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
}

const getHomeController = async (req, res) => {
    const posts = await getAllPosts();
    res.render("home", {user: req.user, posts: posts})
}

const getMembershipController = (req, res) => {
    res.render("membership-form");
}

// this handles updating membership status
const postMembershipController = async (req, res) => {
    const code = req.body.membership_password;
    
    if (code === process.env.MEMBER_PASSWORD) {
        await updateMembership(req.user.id, "member")
        return res.redirect("/home");
    }

    if (code === process.env.ADMIN_PASSWORD) {
        await updateMembership(req.user.id, "admin")
        return res.redirect("/home");
    };

    res.render("membership-form");
};

const getNewPostsController = (req, res) => {
    res.render("new-post-form");
};

const postNewPostsController = [
    newPostsValidation,

    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("new-post-form", {
                errors: errors.array()
            })
        };

        try {
            const { title, message } = req.body;
            await addNewPost({title, message, user_id: req.user.id});
            res.redirect("/home");
        }catch(err) {
            next(err);
        }
    }
];

const postDeletePostController = async (req, res) => {
    const id = Number(req.params.id);
    if (req.user.member_status !== "admin" || !id) {
        return res.redirect("/home");
    };
    await deletePost(id);
    res.redirect("/home");
}

module.exports = {
    getSignUpController,
    postSignUpController,
    getLoginController,
    postLoginController,
    getLogoutController,
    getHomeController,
    getMembershipController,
    postMembershipController,
    getNewPostsController,
    postNewPostsController,
    postDeletePostController
}