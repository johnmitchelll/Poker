const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 675;

const CARD_WIDTH = CANVAS_HEIGHT/8;
const CARD_HEIGHT = CANVAS_HEIGHT/5;
const CARDS_IMG_WIDTH = 74;
const CARDS_IMG_HEIGHT = 105;
const CARD_IMG_GAP = 2;

const CHIP_DIM = 29;

const BLACK = "rgb(40,40,40)";

const MAX_CHIP_STACK = 5;

var prevWindowDimentions = {width:0, height:0};
var localStorageUserData;

const cardsPic = document.createElement("img");
const chipPic = document.createElement("img");
cardsPic.src = "./kuhncards.png";
chipPic.src = "./chip.png";

const cards = [{sx:76, value:"J"}, {sx:152, value:"Q"}, {sx:228, value:"K"}];


function drawAll(){
	canvasAlign();
	colorRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, BLACK);

	drawScene();

	// console.log(human.chips, human.bet, ai.chips, ai.bet, dealer)

	// for (let i = 0; i < 4; i++) {
		// drawImageFromSpriteSheetWithRotation(chipPic, 0, 0, CHIP_DIM, CHIP_DIM, 100,100, CHIP_DIM, CHIP_DIM);
	// }
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