const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require("bcryptjs");
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const validateRegistInput = require('../../validations/register');
const valideateLoginInput = require('../../validations/login');
// Can add routes here

// test route
router.get("/test", (req, res) => {
    res.json({msg: "This is the user route"});
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        handle: req.user.handle,
        email: req.user.email
    });
});

// REGISTER route
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegistInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then( user => {
            if(user) { // user already existed
                return res.status(400).json({email: "Email already in used"})
            } else {
                const newUser = new User({
                    handle: req.body.handle,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    // use salt to hash password
                    bcrypt.hash(newUser.password, salt, (err, hashPW) => {
                        if(err) throw err;
                        newUser.password = hashPW;
                        newUser.save()
                            .then(user => res.json(user)) // after save, send back to frontend
                            .catch(err => console.log(err));  
                    })
                })
            }
        })
})

// LOGIN route
router.post('/login', (req, res) => {

    const { errors, isValid } = valideateLoginInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne( {email} ) // ES6 destructure to get email; findOne gives back one, find gives arr
        .then( user => {
            if(!user) {
                return res.status(404).json({ email: "This user does not exist"});
            }
            bcrypt.compare(password, user.password)
                .then( isMatch => {
                    if(isMatch) {
                        // create jsonwebtoken and send back to client after logging in
                        // create payload we are going to send back
                        const payload = { // include user information
                            id: user.id, // come from DB
                            handle: user.handle,
                            email: user.email
                        }
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true, // created the webtoken
                                    token: "Bearer " + token
                                });
                            }
                        )
                    } else {
                        return res.status(400).json({password: "Incorrect Password"});
                    }
                })
        })
})


module.exports = router;
