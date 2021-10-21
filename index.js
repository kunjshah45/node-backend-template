// import from libraries
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("module-alias/register");
const config = require("@config/config");
const db = require("@config/database");
const debug = require("debug")("sample-backend:express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const indexRoute = require("@routes/index");


// create express app
const app = express();
app.use(cors());
app.use(
    session({
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
        }),
        sessionName: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        cookie: { secure: true, maxAge: 1209600000 },
        resave: true,
        saveUninitialized: true,
    })
);

app.get("/", (req, res) => {
    console.log("ss----", req.session, req.sessionID);
    res.send("Hi Kunj Shah");
});

app.get("/api", (req, res) => {
    res.json({ message: "No Page found" });
});

app.use("/api", indexRoute);


// listen for requests
app.listen(config.port, () => {
    // console.log('Server is listening on port ' + config.port);
    debug("Listening on " + config.port);
  });
  
