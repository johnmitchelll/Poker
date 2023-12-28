var canvas;
var canvasContext;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;
var fpsClock;
var fps;

window.onload = async function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	await start();
	
    var framesPerSecond = 30;
	setInterval(function(){
		updateTimeSteps(); 
		drawAll(); 
		playHand();
	},1000/framesPerSecond);
}

async function start(){
	let localStorageUserData = localStorage.getItem("userData");

	if(localStorageUserData == null){
		window.location.href = "../signin";
		return;
	}

	deck = new Deck();
	table = new Table();
	ai = new Player();
	human = new Player();

	canvas.width  = 1000;
	canvas.height = 675;

	startTime = Date.now();

	deck.newDeck();

	socket = io();

	socket.on('newData', function(data){
		data = JSON.parse(data);
		socketData = data;
	});

	// wait for the socketData
	while (socketData === undefined) {
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	sendNewPlayerVals(["name"], [JSON.parse(localStorageUserData).username])
	human.name = JSON.parse(localStorageUserData).username;

	human.dealer = true;
	ai.dealer = false;
	if(socketData.oponent && socketData.game.turn == socketData.oponent.id){
		human.dealer = false;
		ai.dealer = true;
		turn = "ai";
		return;
	}else{
		sendNewPlayerVals(["dealer"], [true])
	}
}
