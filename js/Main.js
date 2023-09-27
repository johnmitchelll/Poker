var canvas;
var canvasContext;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;
var fpsClock;
var fps;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = 1000;
	canvas.height = 675;

	loadImages();

	startTime = Date.now();

	start();

    var framesPerSecond = 30;
	setInterval(function(){
		updateTimeSteps(); 
		drawAll(); 
		playHand();
	},1000/framesPerSecond);
}

function start(){
	deck = new Deck();
	table = new Table();
	ai = new Player();
	human = new Player();
	brain = new Brain();
	lazyBrain = new LazyBrain();

	human.dealer = true;
	if(Math.random() > 0.5){
		ai.dealer = true;
		human.dealer = false;
	}

	deck.newDeck();

	cardsRef.style.display = "none";


	// getWinner(["2c", "Qh"], ["10h", "3h"]);
}



