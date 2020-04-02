/*
 |--------------------------------------------------------------------------
 | Import the packages
 |--------------------------------------------------------------------------
 */
import dotdev from "dotenv";
dotdev.config();
console.log("APP>JS        GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import connect from "./db";
import session from "express-session";
import cors from "cors";
import flash from "connect-flash";
import mongoose from "mongoose";
import validator from "express-validator";
import connectMongo from "connect-mongo";

import passport from "passport";
import "./config/passport";
import initializeRoutes from "./routes";

const app = express();

/*
 |--------------------------------------------------------------------------
 | Set up default mongoose connection.
 |--------------------------------------------------------------------------
 */
connect().then(() => {
  console.log("connected to MLAB");
});

/*
 |--------------------------------------------------------------------------
 | Use Cors,so we can make request from another server
 |--------------------------------------------------------------------------
 */

app.use(
  cors({
    origin: process.env.APP_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  })
);
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", process.env.APP_URL);
  res.set("Access-Control-Allow-Credentials", true);
  next();
});

/*
 |--------------------------------------------------------------------------
 | Configure app to use bodyParser() and morgan
 |--------------------------------------------------------------------------
 |
 | This will let us get the data from a POST
 |
 | Morgan will show request info such as method,url
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());
app.use(flash());
app.use(require("morgan")(":method :url :status - :response-time ms"));
app.use(express.static(path.join(__dirname, "public")));

/*
 |--------------------------------------------------------------------------
 | Sessions stores in mongoDb
 |--------------------------------------------------------------------------
 */
const MongoStore = connectMongo(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(passport.initialize());
app.use(passport.session());

/*
 |--------------------------------------------------------------------------
 | Pug configuration
 |--------------------------------------------------------------------------
 */
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/*
 |--------------------------------------------------------------------------
 | Initialize routes
 |--------------------------------------------------------------------------
 */

initializeRoutes(app, passport);

/*
 |--------------------------------------------------------------------------
 | 404 page
 |--------------------------------------------------------------------------
 */

app.use((req, res, next) => {
  res.status(404);

  res.format({
    html: function() {
      res.render("pages/404.pug", {
        url: req.url,
        title: "404 Page Not Found"
      });
    },
    json: function() {
      res.json({ error: "Not found" });
    },
    default: function() {
      res.type("txt").send("Not found");
    }
  });
});

/*
 |--------------------------------------------------------------------------
 | Start server
 |--------------------------------------------------------------------------
 */
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
