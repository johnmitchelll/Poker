// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;

const S = 83;
const C = 67;
const F = 70;
const A = 65;
const DELETE = 8;
const ENTER = 13;
var c_held = false;
var s_held = false;

function keyPressed(evt){ 
    playHand(evt.keyCode);

    keyHoldRelease(evt.keyCode, true);

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

document.addEventListener('touchstart', setMouseDown, { passive: false});
document.addEventListener('touchend', setMouseUp, { passive: false});
document.addEventListener('touchmove', touchMove, { passive: false});

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = (evt.clientX - rect.left) - canvas.width/2;
  mouseY = (evt.clientY - rect.top) - CANVAS_HEIGHT/2;
}

function setMouseDown(evt){}
function setMouseUp(evt){}
function touchMove(evt){}

//////////////////////////////////////////


function Scene0Input(keyCode){
    if(keyCode == S && s_held == false){

        human.autoBet = true;
    
        if(human.betAmount == 0){
            table.bet = table.minBet;
            human.call();
        }else if(handleSInput()){
            human.straddle = true;
            return;
        }
        
        // little blind
        ai.raise(table.minBet/2);
        
        table.deal();
        scene = 1;
        s_held = true;
        turn = "ai";
    }

    handleHumanBetAmount(keyCode);
}

function Stage0Input(keyCode){

    // call
    if(keyCode == C && c_held == false){
        human.call();

        turn = "ai";
        c_held = true;
        stage = 1;


        if(scene == 2 || (scene == 1 && table.bet > table.minBet)){
            table.pushBets();
            table.seeNext();
            scene = 2; 
        }
    }

    // fold
    if(keyCode == F){
        ai.chips += human.bet + ai.bet + table.pot;
        human.betAmount = 0;
		ai.betAmount = 0;
        human.cards = [];
        stage = 3;
    }

    // raise
    if(keyCode == S && s_held == false){
        handleSInput();
    }

    handleHumanBetAmount(keyCode);
}


// check or bet
function Stage1Input(keyCode){

    // check
    if(keyCode == C && c_held == false){
        turn = "ai";
        c_held = true;

        if(human.dealer){
            table.seeNext();
        }
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

        if(table.winner == "hand1"){
            human.chips += amount;
        }

        if(table.winner == "hand2"){
            ai.chips += amount;
        }

        if(table.winner == "chop"){  
            ai.chips += Math.floor(amount/2);
            human.chips += Math.floor(amount/2);
        }
        
        newHand();
        s_held = true;
    }
}

function Stage4Input(keycode){
    // all in
    if(keyCode == A){
        human.call();
        table.pot += human.bet + ai.bet;
    }

    // fold
    if(keyCode == F){
        ai.chips += human.bet + ai.bet + table.pot;
        human.betAmount = 0;
		ai.betAmount = 0;
        human.cards = [];
        stage = 3;
    }

}

function handleSInput(errs){
    let allIn = false; 
    human.autoBet = true;

    if(human.betAmount + human.bet >= human.chips + human.bet){
        allIn = true;
    }

    if(human.betAmount > human.chips+human.bet){
        err = 0;
        return true;
    }else if(human.betAmount < table.bet*2 && allIn == false){
        err = 1;
        return true;
    }else if(human.betAmount < table.minBet && allIn == false){
        err = 2;
        return true;
    }
    // else if(human.betAmount > ai.chips+ai.bet){
    //     err = 3;
    //     return true;
    // }

    table.bet = human.betAmount;
    human.raise(human.betAmount);
    turn = "ai";

    s_held = true;
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