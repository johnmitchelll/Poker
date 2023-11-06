var canvas;
var canvasContext;

var slotItemCanvas;
var slotItemCanvasContext;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;
var fpsClock;
var fps;

window.onload = async function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	slotItemCanvas = document.getElementById('slotsCanvas');
	slotItemCanvasContext = slotItemCanvas.getContext('2d');

	canvasContext.globalCompositeOperation = "destination-out";

	start();

    var framesPerSecond = 30;
	setInterval(function(){
		drawAll(); 
		updateTimeSteps(); 
	},1000/framesPerSecond);

	let dbUserData = await readUser(userData.username, userData.password)
	dbUserData = dbUserData.userDB;
	dbUserData.password = userData.password;
	userData = dbUserData;
	maxCoins = userData.bestSessionSlots;
}


function start(){
	canvas.width  = 1000;
	canvas.height = 675;

	slotItemCanvas.width  = 1000;
	slotItemCanvas.height = 675;
	
	startTime = Date.now();

	userData = JSON.parse(localStorage.getItem("userData"));
	
	if(!userData){
		window.location.href = "../signin";
		return;
	}

	for (let i = 0; i < slotsItems.length; i++) {
		for (let j = 0; j < 5; j++) {
			slotsItems[i][j] = Math.floor(Math.random()*7);
		}	
		
	}
}


