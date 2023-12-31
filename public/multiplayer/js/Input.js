// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;
var prevMouseDown = false;
var mouseInBetKnob = false;

const S = 83;
const C = 67;
const F = 70;
const A = 65;
const M = 77;
const P = 80;
const DELETE = 8;
const ENTER = 13;
var c_held = false;
var s_held = false;

function keyPressed(evt){ 
    if(menu){
        handleMenuingInput(evt.keyCode);
    }else{
        playHand(evt.keyCode);
        goToMenu(keyCode);
    }

    evt.preventDefault();
}

function keyReleased(evt){ 
    keyHoldRelease(evt.keyCode, false);
    evt.preventDefault();
}

function keyHoldRelease(keyCode, held){
    c_held = false;
    s_held = false;

    if(held == false){
        return;
    }

    if(keyCode == C){
        c_held = true;
    }

    if(keyCode == S){
        s_held = true;
    }
}

document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyReleased)

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mouseup', setMouseUp);
document.addEventListener('mousedown', setMouseDown);

document.addEventListener('touchstart', setMouseDown, { passive: false});
document.addEventListener('touchend', setMouseUp, { passive: false});
document.addEventListener('touchmove', touchMove, { passive: false});

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  let width = document.getElementById("gameCanvas").style.width;
  let height = document.getElementById("gameCanvas").style.height;

  width = parseFloat(width.slice(0, -2));
  height = parseFloat(height.slice(0, -2));

  mouseX = (evt.clientX - rect.left)/width * CANVAS_WIDTH;
  mouseY = (evt.clientY - rect.top)/height  * CANVAS_HEIGHT;
}

function setMouseDown(evt){
    let width = document.getElementById("gameCanvas").style.width;
    let height = document.getElementById("gameCanvas").style.height;

    width = parseFloat(width.slice(0, -2));
    height = parseFloat(height.slice(0, -2));

    let gameCanvas = document.getElementById("gameCanvas").getBoundingClientRect();

	if(evt.changedTouches && evt.changedTouches[0]){
		mouseX = (evt.changedTouches[0].pageX-gameCanvas.left)/width * CANVAS_WIDTH;
		mouseY = (evt.changedTouches[0].pageY-gameCanvas.top)/height * CANVAS_HEIGHT;
	}

    mouseDown = true;

    evt.preventDefault();

    keyHoldRelease(evt.keyCode, true); 
}
function setMouseUp(evt){
    mouseDown = false;
    mouseInBetKnob = false;
    prevMouseDown = false;
}
function touchMove(evt){
    let width = document.getElementById("gameCanvas").style.width;
    let height = document.getElementById("gameCanvas").style.height;

    width = parseFloat(width.slice(0, -2));
    height = parseFloat(height.slice(0, -2));

    let gameCanvas = document.getElementById("gameCanvas").getBoundingClientRect();

	if(evt.changedTouches[0]){
		mouseX = (evt.changedTouches[0].pageX-gameCanvas.left)/width * CANVAS_WIDTH;
		mouseY = (evt.changedTouches[0].pageY-gameCanvas.top)/height * CANVAS_HEIGHT;
	}

    evt.preventDefault();

	mouseDown = true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Scene0Input(keyCode){

    if(keyCode == S && s_held == false){

        human.autoBet = true;
    
        if(human.betAmount == 0){
            table.bet = table.minBet;
            human.call();
        }else if(handleSInput() == false){
            human.straddle = true;
        }else if(handleSInput()){
            return;
        }
        
        // little blind
        table.deal();
        scene = 1;

        ai.raise(table.minBet/2);

        let p1Cards = human.cards;
        let p2Cards = ai.cards;

        if(socketData.game.p1.id == socketData.oponent.id){
            p1Cards = ai.cards;
            p2Cards = human.cards;
        }

        stage = 0;

        // setting this to true every time because I need the oponent to be able to call and the bet goes back to the dealer
        sendNewPlayerVals(["straddle"], [true])

        sendNewGameVals(["timer", "turn", "scene", "stage", "bet", "p1Cards", "p2Cards"], 
                        [265, socketData.oponent.id, scene, stage, table.bet, p1Cards, p2Cards]);
    }

    handleHumanBetAmount(keyCode);
}

function Stage0Input(keyCode){

    // call
    if(keyCode == C && c_held == false){
        human.call();

        turn = "ai";
        stage = 1;

        sendNewOponentVals(["straddle"], [false]);

        sendNewGameVals(["timer", "turn", "scene", "stage", "bet"], 
                        [265, socketData.oponent.id, scene, stage, table.bet]);

        if(scene == 2 || (scene == 1 && ai.straddle == false)){
            table.seeNext();
            scene = 2; 

            sendNewGameVals(["timer", "turn", "scene", "stage", "bet", "pot"], 
                        [265, socketData.oponent.id, scene, stage, table.bet, table.pot]);

            sendNewPlayerVals(["bet"],[0]);
            sendNewOponentVals(["bet"],[0]);
        }
    }   

    // fold
    if(keyCode == F){
        ai.chips += human.bet + ai.bet + table.pot;

        human.betAmount = 0;
		ai.betAmount = 0;
        human.cards = [];
        stage = 3;

        sendNewPlayerVals(["bet", "command"],[0, [human.name, "Folds"]]);

        setTimer(1, 2, () => {
            if(!socketData.game.winner){
                sendNewPlayerVals(["command"], [-1]);
            }
        })

        sendNewOponentVals(["chips", "bet"],[ai.chips, 0]);

        if(socketData.game.p1.id == socketData.oponent.id){
            sendNewGameVals(["stage", "bet", "p2Cards", "timer", "pot"], [stage, table.minBet, [], 265]);
        }else if(socketData.game.p2.id == socketData.oponent.id){
            sendNewGameVals(["stage", "bet", "p1Cards", "timer", "pot"], [stage, table.minBet, [], 265]);
        }

        fold.play();
    }

    // raise
    if(keyCode == S && s_held == false){
        if(handleSInput() == false){
            sendNewOponentVals(["straddle"], [false]);
        }
    }

    handleHumanBetAmount(keyCode);
}


// check or bet
function Stage1Input(keyCode){

    // check
    if(keyCode == C && c_held == false){
        check.play();
        turn = "ai";

        sendNewPlayerVals(["command"], [[human.name,"Checks"]]);

        setTimer(1, 2, () => {
            sendNewPlayerVals(["command"], [-1]);
        })

        if(human.dealer){
            table.seeNext();

            sendNewPlayerVals(["bet"],[0]);
            sendNewOponentVals(["bet"],[0]);
        }

        sendNewGameVals(["timer", "turn", "scene", "stage", "bet", "pot"], 
                        [265, socketData.oponent.id, scene, stage, table.bet, table.pot]);
    }

    // bet
    if(keyCode == S && s_held == false){
        handleSInput();
    }

    handleHumanBetAmount(keyCode);
}


function Stage3Input(keycode){

    // next hand
    if(keycode == S && s_held == false){
        let amount = human.bet + ai.bet + table.pot;

        if(table.winner == "hand1" && human.dealer){
            human.chips += amount;
            sendNewPlayerVals(["chips"], [human.chips]);
        }else if(table.winner == "hand1" && ai.dealer){
            ai.chips += amount;
            sendNewOponentVals(["chips"], [ai.chips]);
        }else if(table.winner == "hand2" && human.dealer){
            ai.chips += amount;
            sendNewOponentVals(["chips"], [ai.chips]);
        }else if(table.winner == "hand2" && ai.dealer){
            human.chips += amount;
            sendNewPlayerVals(["chips"], [human.chips]);
        }else if(table.winner == "chop"){  
            ai.chips += Math.floor(amount/2);
            human.chips += Math.floor(amount/2);
            sendNewPlayerVals(["chips", [human.chips]]);
            sendNewOponentVals(["chips", [ai.chips]]);
        }

        newHand();
    }
}


function handleSInput(){
    let allIn = false; 
    human.autoBet = true;

    if(human.betAmount + human.bet >= human.chips + human.bet){
        allIn = true;
    }

    // putting the ai all in
    if(human.betAmount + human.bet >= ai.chips + ai.bet){
        allIn = true;
    }   

    // ai is all in
    if(ai.chips <= 0){
        err = 5;
        return true;
    }

    if(table.bet >= human.chips + human.bet){
        err = 6;
        return true;
    }

    if(human.betAmount > human.chips+human.bet){
        err = 0;
        return true;
    }else if(human.betAmount > ai.chips + ai.bet){
        err = 3;
        return true;
    }else if(human.betAmount < table.bet*2 && allIn == false){
        err = 1;
        return true;
    }else if(human.betAmount < table.minBet && allIn == false){
        err = 2;
        return true;
    }

    table.bet = human.betAmount;

    if(allIn){
        human.raise(human.betAmount + human.bet);
    }else{
        human.raise(human.betAmount);
    }
    
    turn = "ai";

    sendNewGameVals(["bet", "turn", "stage", "timer"], [table.bet, socketData.oponent.id, stage, 265]);

    return false;
}



function handleHumanBetAmount(keyCode){
    // number
    if(keyCode >= 48 && keyCode <= 57){
        if(human.autoBet){
            human.betAmount = 0;
            human.autoBet = false;
        }

        let amount = String(human.betAmount);

        if(amount.length == 4){
            return;
        }

        amount += keyCode - 48;

        human.betAmount = parseInt(amount);
    }

    if(keyCode == DELETE){
        let amount = String(human.betAmount);

        if(amount == "0"){
            return;
        }

        if(amount.length == 1){
            human.betAmount = 0;
            return;
        }

        let newAmount = amount.slice(0, amount.length - 1)

        human.betAmount = parseInt(newAmount);
    }
}


function handleMenuingInput(keyCode){

    if(keyCode == S){
        spectateGame();
    }

    if(keyCode == P){
        startGame();
    }

}

function goToMenu(keyCode){
    if(keyCode == ENTER){
        window.location.href = "../menu";
    }
}