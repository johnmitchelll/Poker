var canvas;
var canvasContext;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	canvas.addEventListener('mousedown', handleMouseClick);

	start();

	var framesPerSecond = 90;
	setInterval(function(){update();},1000/framesPerSecond);	
}

function update(){
	drawEverything();
}

function start(){
	BRICK_W = canvas.width/BRICK_COLS;
	BRICK_H = canvas.height/BRICK_ROWS;
	initMap();

	r = new Rect(200,200,100,300);
	player = new Rect(20,20,200,200);
	mouseRay = new Ray(20,20,100,100);
}

