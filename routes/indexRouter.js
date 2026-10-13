const { Router } = require("express");
const {
    getSignUpController,
    getLoginController,
    postSignUpController,
    postLoginController,
    getLogoutController,
    getHomeController,
    getMembershipController,
    postMembershipController,
    getNewPostsController,
    postNewPostsController,
    postDeletePostController
} = require("../controllers/indexController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
    res.redirect("/login");
});

indexRouter.get("/login", getLoginController);

indexRouter.post("/login", postLoginController);


indexRouter.get("/sign-up", getSignUpController);

indexRouter.post("/sign-up", postSignUpController);


indexRouter.get("/home", getHomeController);


indexRouter.get("/membership", isAuthenticated, getMembershipController);

indexRouter.post("/membership", isAuthenticated, postMembershipController)


indexRouter.get("/logout", getLogoutController);


indexRouter.post("/delete-post/:id", isAuthenticated, postDeletePostController);


indexRouter.get("/posts/new", isAuthenticated, getNewPostsController);

indexRouter.post("/posts/new", isAuthenticated, postNewPostsController)

module.exports = indexRouter; 