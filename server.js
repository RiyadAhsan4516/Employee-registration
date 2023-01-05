const express = require("express");

const app = express();

app.get("/", function(req, res, next){
    console.log(`Route is ${req.path} type is ${req.method}`)
    res.sendFile(`${__dirname}/personal.html`);
})

app.listen(3000, "127.0.0.1", ()=>{
    console.log("listening to port 3000");
})