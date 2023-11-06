
var sessionLeaders = [];
var allTimeLeaders = [];
var slotsLeaders = [];

var titles = ["All Time", "Single Session", "Slots Single Session"];
var currentLeaderboard = 0;

function handleMenu(keycode){

    // controlls
    handleButtons(CANVAS_WIDTH/2-160/2, CANVAS_HEIGHT/10+10, 160, 40, "All Time", 0, changeLeaderboard);
    handleButtons(CANVAS_WIDTH/2-265-160/2-20, CANVAS_HEIGHT/10+10, 265, 40, "Single Session", 1, changeLeaderboard);
    handleButtons(CANVAS_WIDTH/2+160/2+20, CANVAS_HEIGHT/10+10, 250, 40, "Slots Session", 2, changeLeaderboard);

    // headers
    drawText("black", '46px customfont', "Leaderboards", CANVAS_WIDTH/2-165, CANVAS_HEIGHT/10-10);
    let width = getCharWidth(titles[currentLeaderboard], '32px customfont');
    drawText("black", '32px customfont', titles[currentLeaderboard], CANVAS_WIDTH/2-width/2, CANVAS_HEIGHT/4+10);

    // borders
    colorRectNoFill(15, CANVAS_HEIGHT/4-40, CANVAS_WIDTH-30, CANVAS_HEIGHT-210, "white", 1)


    if(currentLeaderboard == 0){
        for (let i = 0; i < allTimeLeaders.length; i++) {
            drawText("black", '32px customfont', allTimeLeaders[i].username + ": " + allTimeLeaders[i].totalWinnings, CANVAS_WIDTH/20, CANVAS_HEIGHT/3+i*40);
        }
    }

    if(currentLeaderboard == 1){
        for (let i = 0; i < sessionLeaders.length; i++) {
            drawText("black", '32px customfont', sessionLeaders[i].username + ": " + sessionLeaders[i].bestSessionWinnings, CANVAS_WIDTH/20, CANVAS_HEIGHT/3+i*40);
        }
    }

    if(currentLeaderboard == 2){
        for (let i = 0; i < slotsLeaders.length; i++) {
            drawText("black", '32px customfont', slotsLeaders[i].username + ": " + slotsLeaders[i].bestSessionSlots, CANVAS_WIDTH/20, CANVAS_HEIGHT/3+i*40);
        }
    }

    handleButtons(CANVAS_WIDTH/2-95, 9*CANVAS_HEIGHT/10+10, 190, 40, "Main Menu", ENTER, goBackToMenu);
}

function goBackToMenu(){
    window.location.href = "../menu"
}

function changeLeaderboard(index){
    currentLeaderboard = index;
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