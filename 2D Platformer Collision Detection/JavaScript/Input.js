const UP = 38;
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;

var keyHeld_Up = false;
var keyHeld_Left = false;
var keyHeld_Right = false;
var keyHeld_Down = false;

function setKeyHoldState(thisKey, setTo) {
	if(thisKey == UP){
		keyHeld_Up = setTo;
	}
	if(thisKey == LEFT){
		keyHeld_Left = setTo;
	}
	if(thisKey == RIGHT){
		keyHeld_Right = setTo;
	}
	if(thisKey == DOWN){
		keyHeld_Down = setTo;
	}
}

function keyPressed(evt){
	setKeyHoldState(evt.keyCode, true);
	evt.preventDefault();
}

function keyReleased(evt){
	setKeyHoldState(evt.keyCode, false);
}

function handleMouseClick(evt) {

}

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);


var mouseX;
var mouseY;

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}

document.addEventListener('mousemove', updateMousePos);

function handleMouseClick(){
	
}

