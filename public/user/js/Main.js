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
		drawAll(); 
		updateTimeSteps(); 
	},1000/framesPerSecond);
}


async function start(){
	canvas.width  = 1000;
	canvas.height = 675;
	
	startTime = Date.now();

	textBoxes = [new TextBox()];

	localStorageUserData = localStorage.getItem("userData");

	if(localStorageUserData == null){
		window.location.href = "../signin";
		return;
	}

	localStorageUserData = JSON.parse(localStorageUserData);

	userData = await readUser(localStorageUserData.username, localStorageUserData.password);
	userData = userData.userDB;
}


