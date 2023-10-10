
const express = require("express");
const session = require("express-session");

require('./database');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/scoreboard');


const app = express();
app.use(express.json());

app.use(
    session({
        secret: "ASDFGHJKJHGFDSASDFGH",
        resave: false, 
        saveUninitialized: false
    })
);


app.use((req, res, next) =>{
    console.log(req.method + ':' + req.url);
    next();
});

app.use('/api/v1/scoreboard', userRoute);
app.use('/api/v1/auth', authRoute);


const port = process.env.PORT || 3001;
app.listen(port, () => console.log("server running"));
app.use(express.static("public"));