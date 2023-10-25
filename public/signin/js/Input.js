// Mouse Input
var mouseX;
var mouseY;
var mouseDown = false;
var prevMouseDown = false;
var shiftHeld = false;

const ENTER = 13;

function keyPressed(evt){ 
    goToMenuOption(evt.keyCode);
    handleTextBoxInput(evt.keyCode);
    evt.preventDefault();
}

function keyReleased(evt){ 
    keyHoldRelease(evt.keyCode, false);
    evt.preventDefault();
}

function keyHoldRelease(keyCode, held){
    if(keyCode == 16){
        shiftHeld = held;
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

function goToMenuOption(keycode){   

}

function handleTextBoxInput(keycode){
    // shift is on
    if(keycode == 16){
        shiftHeld = true;
        return;
    }

    for (let i = 0; i < textBoxes.length; i++) {
        if(textBoxes[i].enabled == false){
            continue;
        }

        if(keycode == 37){
            textBoxes[i].i = Math.max(0, textBoxes[i].i-1);
            calculateIW(textBoxes[i]);
            continue;
        }
        if(keycode == 39){
            textBoxes[i].i = Math.min(textBoxes[i].text.length, textBoxes[i].i+1);
            calculateIW(textBoxes[i]);
            continue;
        }
        if(keycode == 8 && textBoxes[i].i > 0){
            textBoxes[i].text = textBoxes[i].text.substring(0, textBoxes[i].i-1) + textBoxes[i].text.substring(textBoxes[i].i);
            textBoxes[i].i = Math.max(0, textBoxes[i].i-1);
            calculateIW(textBoxes[i]);
            continue;
        }else if(keycode == 8){
            continue;
        }


        let charToInput = String.fromCharCode(keycode);
        if(shiftHeld == false){
            charToInput = charToInput.toLowerCase();
        }

        if((charToInput >= 'a' && charToInput <= 'z') || (charToInput >= 'A' && charToInput <= 'Z') || (charToInput >= '0' && charToInput <= '9')){
            textBoxes[i].text = textBoxes[i].text.slice(0, textBoxes[i].i) + charToInput + textBoxes[i].text.slice(textBoxes[i].i);
            textBoxes[i].i++;
            calculateIW(textBoxes[i]);
        }
    }
    

    // console.log(String.fromCharCode(keycode), keycode)
}

function calculateIW(textBox){
    textBox.iW = 0;
    for (let j = 0; j < textBox.i; j++) {
        textBox.iW += getCharWidth(textBox.text[j], "32px customfont");
    }
}