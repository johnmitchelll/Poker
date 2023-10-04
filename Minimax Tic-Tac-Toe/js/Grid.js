const BRICK_COLS = 3;
const BRICK_ROWS = 3;
var BRICK_W;
var BRICK_H;
const BRICK_GAP = 5;

var brickGrid;

function drawAll() {
	colorRect(0,0, canvas.width,canvas.height,'#FDFBF8')

	for(i = 0; i < BRICK_COLS; i++){
    for(j = 0; j < BRICK_ROWS; j++){
          brickGrid.array[i][j].showNode('rgb(18,18,18)');

          if(brickGrid.array[i][j].type == 1){
            brickGrid.array[i][j].drawXorO();
          }
          if(brickGrid.array[i][j].type == 2){
            brickGrid.array[i][j].drawXorO();
          }

      }
    }

  if(getWinner(brickGrid) == undefined){
    if(currentPlayer == 1){
      getBestMove();
    }else if(currentPlayer == 2){
      getMouseIndex();
    }
  }

  
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, 10, 0,Math.PI*2, true);
	canvasContext.fill();
}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}
