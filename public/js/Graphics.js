const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 675;

const CARD_PIC_WIDTH = 73;
const CARD_PIC_HEIGHT = 105;

const CAR_PIC_GAP = 3;

const PIC_COLS = 13;
const PIC_ROWS = 4;

const GREEN = "rgb(64,122,93)";

const SCREEN_AREA = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT);

const CARD_WIDTH = Math.max(SCREEN_AREA/8, 300/8);
const CARD_HEIGHT = Math.max(SCREEN_AREA/5, 300/5);


var cardsPic = document.createElement("img");
var chipsPic = document.createElement("img");
var chips2Pic = document.createElement("img");
var betFramePic = document.createElement("img");
var buttonFramePic = document.createElement("img");

var largeFont = SCREEN_AREA/30;
var smallFont = SCREEN_AREA/40;

// load the images
cardsPic.src = "imgs/cards.png";
chipsPic.src = "imgs/chips.png";
chips2Pic.src = "imgs/chips2.png";
betFramePic.src = "imgs/bet_frame.png";
buttonFramePic.src = "imgs/button_frame.png";


function drawAll(){

	colorRect(0, 0, canvas.width, CANVAS_HEIGHT, GREEN);

	//drawDeck
	for (var i = 0; i < 5; i++) {
		drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT,50+i*-2,50+i*-2, CARD_WIDTH, CARD_HEIGHT);
	}

	canvasAlign();

	table.display();

}

var cards = [{"card":"As","sx":7,"sy":7},{"card":"Ah","sx":7,"sy":115},{"card":"Ac","sx":7,"sy":222},{"card":"Ad","sx":7,"sy":329},
			 {"card":"2s","sx":84,"sy":7},{"card":"2h","sx":84,"sy":115},{"card":"2c","sx":84,"sy":222},{"card":"2d","sx":84,"sy":329},
			 {"card":"3s","sx":160,"sy":7},{"card":"3h","sx":160,"sy":115},{"card":"3c","sx":160,"sy":222},{"card":"3d","sx":160,"sy":329},
			 {"card":"4s","sx":236,"sy":7},{"card":"4h","sx":236,"sy":115},{"card":"4c","sx":236,"sy":222},{"card":"4d","sx":236,"sy":329},
			 {"card":"5s","sx":313,"sy":7},{"card":"5h","sx":313,"sy":115},{"card":"5c","sx":313,"sy":222},{"card":"5d","sx":313,"sy":329},
			 {"card":"6s","sx":389,"sy":7},{"card":"6h","sx":389,"sy":115},{"card":"6c","sx":389,"sy":222},{"card":"6d","sx":389,"sy":329},
			 {"card":"7s","sx":465,"sy":7},{"card":"7h","sx":465,"sy":115},{"card":"7c","sx":465,"sy":222},{"card":"7d","sx":465,"sy":329},
			 {"card":"8s","sx":542,"sy":7},{"card":"8h","sx":542,"sy":115},{"card":"8c","sx":542,"sy":222},{"card":"8d","sx":542,"sy":329},
			 {"card":"9s","sx":618,"sy":7},{"card":"9h","sx":618,"sy":115},{"card":"9c","sx":618,"sy":222},{"card":"9d","sx":618,"sy":329},
			 {"card":"10s","sx":694,"sy":7},{"card":"10h","sx":694,"sy":115},{"card":"10c","sx":694,"sy":222},{"card":"10d","sx":694,"sy":329},
			 {"card":"Js","sx":771,"sy":7},{"card":"Jh","sx":771,"sy":115},{"card":"Jc","sx":771,"sy":222},{"card":"Jd","sx":771,"sy":329},
			 {"card":"Qs","sx":847,"sy":7},{"card":"Qh","sx":847,"sy":115},{"card":"Qc","sx":847,"sy":222},{"card":"Qd","sx":847,"sy":329},
			 {"card":"Ks","sx":923,"sy":7},{"card":"Kh","sx":923,"sy":115},{"card":"Kc","sx":923,"sy":222},{"card":"Kd","sx":923,"sy":329}]


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