var canvas;
var canvasContext;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;
var fpsClock;
var fps;

var userData;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = 1000;
	canvas.height = 675;
	
	startTime = Date.now();
	updateTimeSteps(); 

	start();

    var framesPerSecond = 30;
	setInterval(function(){
		drawAll(); 
		updateTimeSteps(); 
	},1000/framesPerSecond);
}


function start(){
	userData = localStorage.getItem("userData");

	if(!userData){
		window.location.href = "../signin";
		return;
	}

	loadImages();
	deck = [];

	mouseDown = false;
    prevMouseDown = false;

	animationInterval = setInterval(animateNextCard,intervalTiming);

	for (let i = 0; i < cards.length; i++) {
		deck[i] = new Card(cards[i].card, cards[i].sx, cards[i].sy, canvas.width/2-CARD_WIDTH/2, canvas.height/2-CARD_HEIGHT/2);
		deck[i].dx = 10+i*((CANVAS_WIDTH-CARD_WIDTH-20)/52);
		deck[i].dy = 10;
		deck[i].z = cards.length+i;
		deck[i].i = i;
	}
}


