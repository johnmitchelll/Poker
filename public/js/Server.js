
function updateUserStats(){
  let sessionStatsToSend = [];
  let sessionValsToSend = [];

  if(sessionData[sessionData.length-1] > userData.bestSessionWinnings){
    sessionStatsToSend.push("bestSessionWinnings");
    sessionValsToSend.push(sessionData[sessionData.length-1]);
    updateLeaderboard(userData.username, userData.password, sessionData[sessionData.length-1], 0);
  } 

  sessionStatsToSend.push("totalWinnings");
  sessionValsToSend.push(userData.totalWinnings+sessionData[sessionData.length-1]);

  sessionStatsToSend.push("handsPlayed");
  sessionValsToSend.push(userData.handsPlayed+sessionData.length-1);

  updateValue(userData.username, userData.password, sessionStatsToSend, sessionValsToSend);

  updateLeaderboard(userData.username, userData.password, userData.totalWinnings+sessionData[sessionData.length-1], 1);
}


async function updateValue(username, password, changeRequests, values){
    fetch('/edit/changeuserinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, changeRequests, values })
    })
    .then(responseData => {
    })
    .catch(error => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
    });
}

async function updateLeaderboard(username, password, score, scoreboard){
  fetch('/edit/leaderboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, score, scoreboard })
  })
  .then(responseData => {
  })
  .catch(error => {
      // Handle any errors that occur during the request
      console.error('Error:', error);
  });
}


async function readUser(username, password){
  let response;

  await fetch('/read/userData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(responseData => {
      console.log(responseData);
      response = responseData;
  })
  .catch(error => {
      // Handle any errors that occur during the request
      console.error('Error:', error);
  });

  return response;
}