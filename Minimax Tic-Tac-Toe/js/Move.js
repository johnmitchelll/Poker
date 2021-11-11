var mouseX;
var mouseY;

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}

function handleMouseClick(){
	if(brickGrid.array[mouseCol][mouseRow].type == 0 && gameOver == false){
		brickGrid.array[mouseCol][mouseRow].type = currentPlayer;
		if(currentPlayer == 2){
			currentPlayer = 1;
		}else{
			currentPlayer = 2;
		}
	}
}

var mouseCol;
var mouseRow;
function getMouseIndex(){
	mouseCol = Math.floor(mouseX/BRICK_W);
	mouseRow = Math.floor(mouseY/BRICK_H);

	colorText(mouseCol+","+mouseRow, mouseX,mouseY, 'black')
}

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mousedown', handleMouseClick);


