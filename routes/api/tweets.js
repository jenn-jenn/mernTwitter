const express = require("express");
const router = express.Router();

// Can add routes here

router.get("/test", (req, res) => {
    res.json({ msg: "This is the tweet route" });
});


module.exports = router;