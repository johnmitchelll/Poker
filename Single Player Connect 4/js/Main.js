cheats = true;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	start();

	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
	
}

function updateAll() {
	drawAll();
}

function start(){
	BRICK_W = (canvas.width-BRICK_GAP)/BRICK_COLS;
	BRICK_H = (canvas.height-BRICK_GAP)/BRICK_ROWS;

	for(var i=0;i<BRICK_COLS;i++){
		brickGrid.array[i] = new Array(BRICK_ROWS);
	}

	for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
		     brickGrid.array[i][j] = new NodeClass(i, j)
          }
    }

	current = brickGrid.array[0][0];
}



