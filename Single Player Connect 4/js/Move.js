var mouseX;
var mouseY;

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}

function handleMouseClick(){
	for (var i = 0; i < BRICK_ROWS; i++) {
		if(brickGrid.array[mouseCol][0].type != 0){
			break;
		}
		if(brickGrid.array[mouseCol][i].type != 0 && gameOver == false){
			brickGrid.array[mouseCol][i-1].type = currentPlayer;
			if(currentPlayer == 2){
				currentPlayer = 1;
			}else{
				currentPlayer = 2;
			}
			break;
		}else if(i == BRICK_ROWS-1 && gameOver == false){
			brickGrid.array[mouseCol][i].type = currentPlayer;
			if(currentPlayer == 2){
				currentPlayer = 1;
			}else{
				currentPlayer = 2;
			}
			break;
		}

	}
}

var mouseCol;
var mouseRow;
function getMouseIndex(){
	mouseCol = Math.floor(mouseX/BRICK_W);
	mouseRow = Math.floor(mouseY/BRICK_H);

	// colorText(mouseCol+","+mouseRow, mouseX,mouseY, 'white')
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', handleMouseClick);

