const { Router } = require("express");
const router = Router();

const User = require("../database/schemas/User");

router.post("/login", (request, response) => {
    const { username, password } = request.body;

    if(username && password){
        if(request.session.user){
            response.send(request.session.user);
        }else{
            request.session.user = {
                username
            };

            response.send(request.session);
        }
    } else response.send(401);
});

router.post('/register', async (request, response) => {
    const { username, password } = request.body;
    const userDB = await User.findOne({ $or: [{ username }]});

    if(userDB){
        response.status(400).send({ msg: "USER EXISTS" });
    }else{
       const newUser = await User.create({ username, password });
       response.send(201);
    }
});

module.exports = router;