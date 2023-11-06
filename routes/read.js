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

    const allUsers = await User.find({});
    let topTen = allUsers.filter(obj => {
      if (obj.topTen && obj.topTen.length > scoreboard) {
        const charAtIndex = obj.topTen.charAt(scoreboard);
        return charAtIndex === "1";
      }
      return false;
    });

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
    if(scoreboard == 2){
        topTen.sort(function(a, b){return b.bestSessionSlots - a.bestSessionSlots});
    }

    return topTen;
}


module.exports = router;