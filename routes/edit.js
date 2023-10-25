const { Router } = require("express");
const router = Router();

const User = require("../database/schemas/User");

const { hashpassword, comparepassword } = require('../utils/helpers.js');

// make sure the user is logged in
// router.use((req, res, next) => {
//     console.log(req.session);
//     if(req.session.user) next(); 
//     else res.send(401);
// });


router.post("/changeuserinfo", async (request, response) => {
    const { username, changeRequests, values } = request.body;
    const userDB = await User.findOne({ username });

    if(!userDB){
        return response.send(400);
    }

    const isValid = comparepassword(request.body.password, userDB.password);

    if(!isValid){
        return response.send(401);
    }

    for (let i = 0; i < changeRequests.length; i++) {
        if(changeRequests[i] == "totalWinnings"){
            await User.findOneAndUpdate({ username }, {  totalWinnings: values[i]  });
        }
        if(changeRequests[i] == "bestSessionWinnings"){
            await User.findOneAndUpdate({ username }, { bestSessionWinnings: values[i] });
        }
        if(changeRequests[i] == "handsPlayed"){
            await User.findOneAndUpdate({ username }, { handsPlayed: values[i] });
        }
        if(changeRequests[i] == "name"){
            let possibleUsername = await User.findOne({ username: values[i] });

            console.log(possibleUsername)

            if(possibleUsername){
                return response.status(401).send({ msg:"Username is Taken" });
            }

            await User.findOneAndUpdate({ username }, { username: values[i] } );
        }
        await User.findOneAndUpdate({ username }, { $inc: { serverAttempts: 1 } });
    }

    response.status(201).send({ msg:"Success" });
}); 

router.post("/leaderboard", async (request, response) => {

    // scoreboard == 0 for single session
    // scoreboard == 1 for total score
    const { username, score, scoreboard } = request.body;

    const onOneOffOne = changeStringChar(scoreboard, "1", "00");
    let topTen = await User.find({$or:[{topTen: "11"},{topTen: onOneOffOne}]});
    const userDB = await User.findOne({ username });

    if(!userDB){
        return response.send(400);
    }

    const isValid = comparepassword(request.body.password, userDB.password);

    if(!isValid){
        return response.send(401);
    }


    // if we come in and the list is incomplete add the item to the 
    // list and update the leaderboard to be sent back
    if(topTen.length < 10){
        let userTopTenValue = await User.findOne({ username });
        userTopTenValue = changeStringChar(scoreboard, "1", userTopTenValue.topTen);

        topTen = sortTopTen(scoreboard, topTen);

        await User.findOneAndUpdate({ username }, { topTen: userTopTenValue } );
        topTen = await User.find({$or:[{topTen: "11"},{topTen: onOneOffOne}]});

        response.status(201).send(JSON.stringify(topTen));
        return;
    }


    topTen = sortTopTen(scoreboard, topTen);
    

    // if we are on the leaderboard return the sorted leaderboard
    for (let i = 0; i < topTen.length; i++) {
       if(topTen[i].username == username){
        return response.status(201).send(JSON.stringify(topTen));
       }
    }


    // sort the list, if the score is bigger than the lowest score add it to the list, 
    // resort, change last elements tag to 0, change new elements tag to 1
    if((score > topTen[topTen.length-1].bestSessionWinnings && scoreboard == 0) || (score > topTen[topTen.length-1].totalWinnings && scoreboard == 1)){
        topTen.push(await User.findOne({ username }));
    }else{
        return response.status(201).send(JSON.stringify(topTen));
    }

    topTen = sortTopTen(scoreboard, topTen);
   
    // set the user to a new leaderboard position
    let userUpdatedLeaderBoard = await User.findOne({ username });
    userUpdatedLeaderBoard = changeStringChar(scoreboard, "1", userUpdatedLeaderBoard.topTen)
    await User.findOneAndUpdate({ username }, { topTen: userUpdatedLeaderBoard } );


    // set the deleted element to off leaderboard
    let swappedValue = await User.findOne({ username: topTen[topTen.length-1].username });
    swappedValue = changeStringChar(scoreboard, "0", swappedValue.topTen)
    await User.findOneAndUpdate({ username: topTen[topTen.length-1].username }, { topTen: swappedValue } );

    topTen.pop();

    response.status(201).send(JSON.stringify(topTen));
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