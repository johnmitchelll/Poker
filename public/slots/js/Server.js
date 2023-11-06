
function updateUserStats(){
    let sessionStatsToSend = ["bestSessionSlots"];
    let sessionValsToSend = [coins];
  
    if(coins > userData.bestSessionSlots){
      updateLeaderboard(userData.username, userData.password, coins, 2);
      updateValue(userData.username, userData.password, sessionStatsToSend, sessionValsToSend);
    } 
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