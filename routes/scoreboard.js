const { Router } = require("express");
const router = Router();

// make sure the user is logged in
router.use((req, res, next) => {
    if(req.session.user) next(); 
    else res.send(401);
});


router.post('/sendScore', (request, response) => { 
    console.log(request.body);
    response.sendStatus(201);
});


router.get('/user', (request, response) => {
    const { user } = request.session;

    if(!user){
        response.send("YOU HAVE NO CART")
    } else {
        response.send(user);
    }
});

router.post('/user/id', (request, response) => {
    const { id, userName } = request.body;
    const user = { id, userName };

    const { userNew } = request.session;

    if(userNew){
        request.session.user.items.push(user);
    } else {
        request.session.user = {
            items: [user],
        }
    }

    response.sendStatus(201);
});



module.exports = router;