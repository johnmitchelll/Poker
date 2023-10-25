
var sessionLeaders = [];
var allTimeLeaders = [];


function handleMenu(keycode){

    // headers
    drawText("black", '46px customfont', "Leaderboards", CANVAS_WIDTH/2-165, CANVAS_HEIGHT/10);
    drawText("black", '32px customfont', "Single Session", CANVAS_WIDTH/8-10, CANVAS_HEIGHT/4-10);
    drawText("black", '32px customfont', "All Time", CANVAS_WIDTH-CANVAS_WIDTH/4-60, CANVAS_HEIGHT/4-10);

    // borders
    colorRectNoFill(15, CANVAS_HEIGHT/4-60, CANVAS_WIDTH/2-30, CANVAS_HEIGHT-190, "white", 1)
    colorRectNoFill(CANVAS_WIDTH/2+15, CANVAS_HEIGHT/4-60, CANVAS_WIDTH/2-30, CANVAS_HEIGHT-190, "white", 1)

    if(sessionLeaders){
        for (let i = 0; i < sessionLeaders.length; i++) {
            drawText("black", '32px customfont', sessionLeaders[i].username + ": " + sessionLeaders[i].bestSessionWinnings, CANVAS_WIDTH/20, CANVAS_HEIGHT/3+i*40-10);
        }
    }

    if(allTimeLeaders){
        for (let i = 0; i < allTimeLeaders.length; i++) {
            drawText("black", '32px customfont', allTimeLeaders[i].username + ": " + allTimeLeaders[i].totalWinnings, CANVAS_WIDTH/2+CANVAS_WIDTH/20, CANVAS_HEIGHT/3+i*40-10);
        }
    }

    handleButtons(CANVAS_WIDTH/2-95, 9*CANVAS_HEIGHT/10+10, 190, 40, "Main Menu", ENTER, goBackToMenu);
}

function goBackToMenu(){
    window.location.href = "../menu"
}


async function getLeaderboardData(scoreboard){
    let response;

    await fetch('/read/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ scoreboard })
    })
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData)
        response = responseData;
    })
    .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
    });

    return response;
}