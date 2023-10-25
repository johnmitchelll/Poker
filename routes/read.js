const { Router } = require("express");
const router = Router();

const User = require("../database/schemas/User");

const { hashpassword, comparepassword } = require('../utils/helpers.js');

router.post("/userData", async (request, response) => {
    const { username } = request.body;
    const userDB = await User.findOne({ username });

    if(!userDB){
        return response.send(400);
    }

    const isValid = comparepassword(request.body.password, userDB.password);

    if(!isValid){
        return response.send(401);
    }

    response.status(201).send({userDB});

});



router.post("/leaderboard", async (request, response) => {
    const { scoreboard } = request.body;

    const onOneOffOne = changeStringChar(scoreboard, "1", "00");
    let topTen = await User.find({$or:[{topTen: "11"},{topTen: onOneOffOne}]});

    topTen = sortTopTen(scoreboard, topTen);

    response.status(201).send(topTen);
});

function changeStringChar(index, char, string){
    string = string.split('');
    string[index] = char;
    string = string.join('');
    return string;
}

function sortTopTen(scoreboard, topTen){
    topTen.sort(function(a, b){return b.bestSessionWinnings - a.bestSessionWinnings});
    if(scoreboard == 1){
        topTen.sort(function(a, b){return b.totalWinnings - a.totalWinnings});
    }

    return topTen;
}


module.exports = router;