const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World")
});

// Listen on a given port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

