
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("server running"));
app.use(express.static("public"));


app.post('/sendScore', (request, response) => { 
    console.log(request.body);
    response.send(201);
});