
// scene:
// -1 in animation
// 0 No Bet Required
// 1 Bet required
// 2 next Scene
var scene = 0;
var turn = "human";
var command;
var winner;

var timer = 0;

var human;
var ai;

var dealer = "ai";

const CARD_RANKINGS = ["J", "Q", "K"];

function handleSceneInput(keyCode){
    // only can be in here if it is our turn, durrrrrrrr

    if(scene == 2 && keyCode == S){
        if(winner == "human"){
			human.chips += ai.bet + human.bet;
			ai.bet = 0;
			human.bet = 0;
		}else{
			ai.chips += ai.bet + human.bet;
			ai.bet = 0;
			human.bet = 0;
		}

        timer = 1;

        table.deck.animationIndex = 0;
        table.deck.nextAnimation();
        return;
    }


    if(dealer == "human" && scene == 0 && keyCode == P){
        command = "Human Passes"
        table.showDown();
        check.play();
        return;
    }

    if(scene == 1 && keyCode == P){
        winner = "ai";
        check.play();
        scene = 2;
        timer = -1;
        command = "Human Passes, A.I. Wins"
        return;
    }

    if(scene == 0 && keyCode == B){
        human.betAction();
        playChipNoise();
        scene = 1;
        command = "Human Bets";
        turn = "ai";
        return;
    }

    if(scene == 1 && keyCode == B){
        human.betAction();
        playChipNoise();
        command = "Human Bets"
        scene = 2;
        table.showDown();
        return;
    }

    turn = "ai";
    command = "Human Passes"
}


function goBackToMenu(){
    window.location.href = "../menu"
}

function getCharWidth(char, font) {
	canvasContext.font = font;        
	var width = canvasContext.measureText(char).width;
    return width;
}