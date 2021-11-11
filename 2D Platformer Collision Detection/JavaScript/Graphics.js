var player;
var mouseRay;

const BRICK_GAP = 1;
const BRICK_COLS = 10;
const BRICK_ROWS = 10;
var BRICK_W;
var BRICK_H;

var map = [0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,1,0,0,
		   0,0,0,0,0,0,0,0,0,0,
		   0,0,0,1,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,
		   0,0,0,0,0,0,0,0,0,0,
		   1,0,0,0,0,0,0,0,0,1,
		   1,1,1,1,1,1,1,1,1,1,];

var walls = [];

function drawEverything (){
	colorRect(0, 0, canvas.width, canvas.height, 'rgb(18,18,18)');

	for (var i = 0; i < map.length; i++) {
		if(map[i] != 0){
			map[i].show('green');
		}
	}


	// let col = Math.floor(mouseX/BRICK_W);
	// let row = Math.floor(mouseY/BRICK_H);
	// let index = col + BRICK_COLS * row;
	// drawText('yellow', '30px Arial', index, mouseX, mouseY)

	
	handlePlayerMovement();
	player.show('red');
	
}

function initMap(){
    for (var i = 0; i < BRICK_COLS; i++) {
      for (var j = 0; j < BRICK_ROWS; j++) {
        let index = i + BRICK_COLS * j;
            if(map[index] == 1){
                map[index] = new Rect(i*BRICK_W+BRICK_GAP, j*BRICK_H+BRICK_GAP, BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP);
            }
      }
    }
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
	canvasContext.fill();	
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function drawLine(x1,y1,x2,y2,width,color){
    canvasContext.lineWidth = width;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath()
    canvasContext.moveTo(x1, y1);
    canvasContext.lineTo(x2, y2);
    canvasContext.stroke();
}

  function drawText(color, font, words, X, Y){
    canvasContext.fillStyle = color;
    canvasContext.font = font;
    canvasContext.fillText(words, X, Y);
  }

	// mouseRay.pos.x = player.pos.x + player.size.x/2;
	// mouseRay.pos.y = player.pos.y + player.size.y/2;
	// mouseRay.dir.x = mouseX - mouseRay.pos.x;
	// mouseRay.dir.y = mouseY - mouseRay.pos.y;
	// mouseRay.show('white');
