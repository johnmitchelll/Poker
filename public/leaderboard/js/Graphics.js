

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 675;

const GREEN = "rgb(64,122,93)";

const VERT_NUM_TICS = 5;
const VERTEX_SIZE = 10;

var prevWindowDimentions = {width:0, height:0};

var sessionData = [0];

function drawAll(){
	canvasAlign();

	colorRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, GREEN);

	handleMenu();
}

function handleButtons(x, y, w, h, text, keycode, func){
	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	drawText("black", "32px customfont", text, x+10, y+32);

	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		prevMouseDown = true;
		func(keycode);
	}
}

function canvasAlign(){
	if(prevWindowDimentions.width != window.innerWidth || prevWindowDimentions.height != window.innerWidth){
		prevWindowDimentions.width = window.innerWidth;
		prevWindowDimentions.height = window.innerHeight;
	}

	let gameCanvas = document.getElementById("gameCanvas");

	// when screen is skinny
	let possibleHeight = 675*window.innerWidth/1000;
	if(possibleHeight <= window.innerHeight){
		gameCanvas.style.width = window.innerWidth + "px";
		gameCanvas.style.height = possibleHeight + "px";
		return;
	}

	// when screen is wide
	gameCanvas.style.width = 1000*window.innerHeight/675 + "px";
	gameCanvas.style.height = window.innerHeight + "px";
}