try {
    process.loadEnvFile();
} catch (err) {
    if (err.code !== "ENOENT") {
        throw err;
    }
}

const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const PORT = process.env.PORT || 8000;
const { prisma } = require("./lib/prisma");

const app = express();

// connect ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({
    store: new (require('connect-pg-simple')(session))({
        // db connection
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true
    }),
    secret: process.env.MY_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000},
    saveUninitialized: false
}));
app.use(passport.session());
app.use(express.urlencoded({extended: true}));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({ where: {username: username}})

        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        
        const match = await bcrypt.compare(password, user.hash);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    } catch(err) {
        return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({where: {id: id}});

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    }catch(err) {
        done(err);
    }
});


// routes
app.use("/", indexRouter);

app.use("*splat", (req, res) => {
    res.status(404).render("404");
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error");
})

// open port connection
app.listen(PORT, "0.0.0.0", (error) => {
    if (error) {
        throw error;
    }
    console.log("server listening on port ", PORT);
});