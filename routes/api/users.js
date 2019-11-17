const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require("bcryptjs");

// Can add routes here

router.get("/test", (req, res) => {
    res.json({msg: "This is the user route"});
});

router.post('/register', (req, res) => {
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

module.exports = router;