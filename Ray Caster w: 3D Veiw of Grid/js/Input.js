const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const UP_ARROW = 38;
const DOWN_ARROW = 40;

var keyHeld_Left = false;
var keyHeld_Right = false;
var keyHeld_Up = false;
var keyHeld_Down = false;

function setKeyHoldState(thisKey, setTo) {
	if(thisKey == LEFT_ARROW){
		keyHeld_Left = setTo;
	}
	if(thisKey == RIGHT_ARROW){
		keyHeld_Right = setTo;
	}
	if(thisKey == UP_ARROW){
		keyHeld_Up = setTo;
	}
	if(thisKey == DOWN_ARROW){
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

var mouseX;
var mouseY;

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}






