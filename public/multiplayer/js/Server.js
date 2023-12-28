

function sendNewPlayerVals(attributes, vals){
    let data = []

    for (let i = 0; i < attributes.length; i++) {
        data.push({attribute:attributes[i],value:vals[i]});
    }

    socket.emit('updatePlayer', data);
}

function sendNewGameVals(attributes, vals){
    let data = []

    for (let i = 0; i < attributes.length; i++) {
        data.push({attribute:attributes[i],value:vals[i]});
    }

    socket.emit('updateGame', data);
}

function sendNewOponentVals(attributes, vals){
    let data = {oponent: socketData.oponent.id, data:[]}

    for (let i = 0; i < attributes.length; i++) {
        data.data.push({attribute:attributes[i],value:vals[i]});
    }

    socket.emit('updateOponent', data);
}


async function gatherDataFromServer(){
    if(!socketData){
        return;
    }

    table.pot = socketData.game.pot;
    table.bet = socketData.game.bet;
    scene = socketData.game.scene;
    stage = socketData.game.stage;
    table.winner = socketData.game.winner;

    handleBoard();

    command =  socketData.oponent.command;
    ai.bet = socketData.oponent.bet;
    ai.betAmount = socketData.oponent.bet;
    ai.chips = socketData.oponent.chips;
    ai.allIn = socketData.oponent.allIn;
    ai.straddle = socketData.oponent.straddle;

    let humanPlayer = "p1";
    if(socketData.oponent.id == socketData.game.p1.id){
        humanPlayer = "p2";
    }

    handleCards();

    human.bet = socketData.game[humanPlayer].bet;
    human.chips = socketData.game[humanPlayer].chips;
    human.allIn = socketData.game[humanPlayer].allIn;
    human.straddle = socketData.game[humanPlayer].straddle;

    ai.dealer = false;
    human.dealer = true;
    if(socketData.oponent.dealer){
        ai.dealer = true;
        human.dealer = false;
    }

    turn = "human";
    if(socketData.game.turn == socketData.oponent.id){
        turn = "ai";
    }

    if(socketData.game[humanPlayer].deal && dealing == false){

        dealing = true;

        sendNewPlayerVals(["deal"],[false]);

        while (socketData.game[humanPlayer].deal == true) {
            console.log(socketData.game[humanPlayer].deal)
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log("I AM GOING TO ATTEPT TO DEAL");
        table.seeNext();

        dealing = false;
    }

    if(socketData.game.winner && ai.cards[0] && ai.cards[1]){
       ai.cards[0].faceDown = false;
       ai.cards[1].faceDown = false;
    }

    return true;
}

function handleCards(){
    if(socketData.game.p1Cards.length == 0){
        if(playerOne == false){
            ai.cards = [];
        }
    }

    if(socketData.game.p2Cards.length == 0){
        if(playerOne == true){
            ai.cards = [];
        }
    }

    if((socketData.game.p1Cards.length > 0 && prevCards[0].length > 0) || 
       (socketData.game.p2Cards.length > 0 && prevCards[1].length > 0)){
        return;
    }

    human.cards = socketData.game.p2Cards;
    ai.cards = socketData.game.p1Cards;
    if(socketData.oponent.id == socketData.game.p2.id){
        human.cards = socketData.game.p1Cards;
        ai.cards = socketData.game.p2Cards;
    }

    if(human.cards.length > 0){
        playCardNoise();

        setTimeout(() => { 
            playCardNoise();
        }, 500);
    }

    let cardPrototype = new Card();

    for (let i = 0; i < 2; i++) {
        if(ai.cards.length > 0){
            ai.cards[i].display = cardPrototype.display;
            ai.cards[i].animateUpdate = cardPrototype.animateUpdate;
            ai.cards[i].faceDown = true;
        }
        if(human.cards.length > 0){
            human.cards[i].display = cardPrototype.display;
            human.cards[i].animateUpdate = cardPrototype.animateUpdate;
            human.cards[i].faceDown = false;
        }
    }

    prevCards = [socketData.game.p1Cards, socketData.game.p2Cards]
}

function handleBoard(){
    if(socketData.game.board.length == 0){
        table.board = [];
        prevBoard = [];
        return;
    }

    if(prevBoard.length != socketData.game.board.length){
        playCardNoise();

        let cardPrototype = new Card();

        for (let i = prevBoard.length; i < socketData.game.board.length; i++) {
            table.board[i] =  socketData.game.board[i];

            table.board[i].display = cardPrototype.display;
            table.board[i].animateUpdate = cardPrototype.animateUpdate;
            table.board[i].faceDown = false;
        }
    }

    prevBoard = socketData.game.board;
}

