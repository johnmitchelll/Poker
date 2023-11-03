
const express = require("express");
const session = require("express-session");

require('./database');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/edit');
const readRoute = require('./routes/read');

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
    console.log("ip"+req.ip)
    next();
});


app.use('/edit', userRoute);
app.use('/auth', authRoute);
app.use('/read', readRoute);


const port = process.env.PORT || 3001;
app.listen(port, () => console.log("server running"));
app.use(express.static("public"));