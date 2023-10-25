const { Router } = require("express");
const router = Router();

const { hashpassword, comparepassword } = require('../utils/helpers.js');

const User = require("../database/schemas/User");



router.post("/login", async (request, response) => {
    const { username, password } = request.body;

    if(!username || !password) return response.send(400);

    const userDB = await User.findOne({ username });
    if(!userDB) return response.json({ msg: "User Does Not Exsist" });

    const isValid = comparepassword(password, userDB.password);

    if(isValid){
        request.session.user = userDB;
        console.log(request.session);
        response.json({ msg: "Success" });
    }else{
        response.json({ msg: "Incorrect Password" });
    }
});

router.post('/register', async (request, response) => {
    const { username  } = request.body;
    const userDB = await User.findOne({ username });

    if(userDB){
        response.json({ msg: "User Already Exists" });
    }else{
        request.session.user = userDB;
        const password = hashpassword(request.body.password);
        const newUser = await User.create({ username, password });
        respon.json({ msg: "Success" });
    }
});

module.exports = router;