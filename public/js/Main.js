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


	let results = [];

	for (let a = 0; a < 10; a++) {
		for (let b = 0; b < 10; b++) {
			results.push(a * recursion(Math.abs(a+b), Math.abs(a-b)) - b * recursion(Math.abs(b-a), Math.abs(b+a)));
		}
	}

	console.log(JSON.stringify(results))

	// getWinner(["2c", "Qh"], ["10h", "3h"]);
}




function recursion(x, y) {
   if (x <= 0 && y <= 0){
		return 0;
   }else if (x > 0 && y <= 0){
    	return x;
   }else if (x <= 0 && y > 0){
    	return y;
   }else{
       return recursion(x-1, y) + recursion(x, y-1);
   }




} 

