var canvas;
var canvasContext;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;

	start();

	var framesPerSecond = 60;
	setInterval(function(){update();},1000/framesPerSecond);

	canvas.addEventListener('mousemove',updateMousePos);	

	}
	function update(){
		drawEverything();
	}

	function start(){
		document.addEventListener('keydown', keyPressed);
		document.addEventListener('keyup', keyReleased);

		halfScreen = canvas.width/2;
		BRICK_W = halfScreen/BRICK_COLS;
		BRICK_H = canvas.height/BRICK_ROWS;

		player = new Particle();
	}
