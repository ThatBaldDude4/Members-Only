const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const pool = require("./db/pool");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

// connect ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({secret: "pass", resave: false, saveUninitialized: false}));
app.use(passport.session());
app.use(express.urlencoded({extended: true}));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      console.log(user);
      console.log("My password is: ", password);
      if (user.hash !== password) {
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
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
        done(null, user);
    }catch(err) {
        done(err);
    }
});


// routes
app.use("/", indexRouter);

// open port connection
app.listen(8000, (error) => {
    if (error) {
        throw error;
    }
    console.log("server listening on port 8000!");
});