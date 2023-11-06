var canvas;
var canvasContext;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;
var fpsClock;
var fps;

var userData;

window.onload =	function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	start();

    var framesPerSecond = 30;
	setInterval(function(){
		drawAll(); 
		updateTimeSteps(); 
	},1000/framesPerSecond);
}


async function  start(){
	userData = localStorage.getItem("userData");

	if(!userData){
		window.location.href = "../signin";
		return;
	}

	canvas.width  = 1000;
	canvas.height = 675;
	
	startTime = Date.now();

	sessionLeaders = await getLeaderboardData(0);
	allTimeLeaders = await getLeaderboardData(1);
	slotsLeaders =  await getLeaderboardData(2);
}


