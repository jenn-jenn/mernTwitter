const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
const User = require('./models/User');
const bodyParser = require("body-parser"); // tells app what sort of request it should respond to
const passport = require('passport');


// Have mongoose connect to db
mongoose.connect(db, { useNewUrlParser: true})
    .then( () => {
        console.log("Connected to mongoDB");
    })
    .catch( err => {
        console.log(err);
    });

// what out app to respond to request from software & json request
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    const user = new User({
        handle: "jim",
        email: "jim@jim.jim",
        password: "123456"
    })
    user.save();
    res.send("Hello again");
});

app.use("/api/users", users);
app.use("/api/tweets", tweets);

require('./config/passport')(passport);
app.use(passport.initialize());



// Listen on a given port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

