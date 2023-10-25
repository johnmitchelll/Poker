

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


  async function changeUsernameServer(username, password, changeRequests, values){
    let response;
  
    await fetch('/edit/changeuserinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, changeRequests, values })
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