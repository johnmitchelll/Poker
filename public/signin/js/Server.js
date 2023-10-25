
async function registerServer(username, password){
    let response;

    await fetch('/auth/register', {
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


async function signInServer(username, password){
  let response;

  await fetch('/auth/login', {
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