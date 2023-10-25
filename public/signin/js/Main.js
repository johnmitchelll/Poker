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

	start();

    var framesPerSecond = 30;
	setInterval(function(){
		drawAll(); 
		updateTimeSteps(); 
	},1000/framesPerSecond);
}


function start(){
	canvas.width  = 1000;
	canvas.height = 675;
	
	startTime = Date.now();

	textBoxes.push(new TextBox());
	textBoxes.push(new TextBox());

	// console.log(signIn("Johnny", "Cooper10"));

	// var retrievedEnvState = localStorage.getItem("envState");

	// if(retrievedEnvState != 'undefined'){
	// 	retrievedEnvState = JSON.parse(localStorage.getItem("envState"));
	// 	sessionData = retrievedEnvState.sessionData;
	// }
}


