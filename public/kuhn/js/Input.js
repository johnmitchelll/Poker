// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;
var prevMouseDown = false;

const ENTER = 13;
const B = 66;
const P = 80;
const S = 83;
const R = 82;

function keyPressed(evt){ 
    handleKeyPressed(evt.keyCode);
    evt.preventDefault();
}

function keyReleased(evt){ 
    keyHoldRelease(evt.keyCode, false);
    evt.preventDefault();
}

function keyHoldRelease(keyCode, held){
    if(keyCode == 16){
        return;
    }
}

document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyReleased)

document.addEventListener('mousemove', updateMousePos);
document.addEventListener('mouseup', setMouseUp);
document.addEventListener('mousedown', setMouseDown);

document.addEventListener('touchstart', setMouseDown, { passive: false});
document.addEventListener('touchend', setMouseUp, { passive: false});
document.addEventListener('touchmove', touchMove, { passive: false});

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  let width = document.getElementById("gameCanvas").style.width;
  let height = document.getElementById("gameCanvas").style.height;

  width = parseFloat(width.slice(0, -2));
  height = parseFloat(height.slice(0, -2));

  mouseX = (evt.clientX - rect.left)/width * CANVAS_WIDTH;
  mouseY = (evt.clientY - rect.top)/height  * CANVAS_HEIGHT;
}

function setMouseDown(evt){
    let width = document.getElementById("gameCanvas").style.width;
    let height = document.getElementById("gameCanvas").style.height;

    width = parseFloat(width.slice(0, -2));
    height = parseFloat(height.slice(0, -2));

    let gameCanvas = document.getElementById("gameCanvas").getBoundingClientRect();

	if(evt.changedTouches && evt.changedTouches[0]){
		mouseX = (evt.changedTouches[0].pageX-gameCanvas.left)/width * CANVAS_WIDTH;
		mouseY = (evt.changedTouches[0].pageY-gameCanvas.top)/height * CANVAS_HEIGHT;
	}

    mouseDown = true;
    evt.preventDefault();
    keyHoldRelease(evt.keyCode, true); 
}
function setMouseUp(evt){
    mouseDown = false;
    prevMouseDown = false;
}
function touchMove(evt){
    let width = document.getElementById("gameCanvas").style.width;
    let height = document.getElementById("gameCanvas").style.height;

    width = parseFloat(width.slice(0, -2));
    height = parseFloat(height.slice(0, -2));

    let gameCanvas = document.getElementById("gameCanvas").getBoundingClientRect();

	if(evt.changedTouches[0]){
		mouseX = (evt.changedTouches[0].pageX-gameCanvas.left)/width * CANVAS_WIDTH;
		mouseY = (evt.changedTouches[0].pageY-gameCanvas.top)/height * CANVAS_HEIGHT;
	}

    evt.preventDefault();

	mouseDown = true;
}

//////////////////////////////////////////

function handleKeyPressed(keyCode){   

    if(keyCode == ENTER){
        goBackToMenu();
        return;
    }

    if(keyCode == R){
       
        if(rules){
            rules = false;
        }else{
            rules = true;
        }
        
        return;
    }

    handleSceneInput(keyCode);
}

