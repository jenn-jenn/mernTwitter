const express = require("express");
const router = express.Router();
const passport = require('passport');
const validateTweetInput = require("../../validations/tweets");
const Tweet = require("../../models/Tweet");

// Can add routes here

router.get("/test", (req, res) => {
    res.json({ msg: "This is the tweet route" });
});

router.get("/", (req, res) => { // doesn't need user auth
    Tweet
        .find() // gets everything back
        .sort( {date: -1} )
        .then(tweets => res.json(tweets))
        .catch(err => res.status(400).json(err));
})  

router.get("/user/:user_id", (req, res) => {
    Tweet
        .find({user: req.params.user_id})
        .then(tweets => res.json(tweets))
        .catch(err => res.status(400).json(err))
})

router.get("/:id", (req, res) => {
    Tweet
        .findById(req.params.id)
        .then(tweet => res.json(tweet))
        .catch(err => res.status(400).json(err))
})

// Post tweet
// passport as the second middleware function
router.post("/", passport.authenticate("jwt", { session: false}), (req, res) => {
    const { errors, isValid } = validateTweetInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newTweet = new Tweet({
        user: req.user.id,
        text: req.body.text
    });
    newTweet.save()
        .then(tweet => res.json(tweet));
})



module.exports = router;