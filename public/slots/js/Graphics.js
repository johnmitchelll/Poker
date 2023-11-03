

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 675;
const RED = "rgb(169,0,7)";
const WHITE = "rgb(252,252,252)";
const SLOT_PIC_WIDTH = 248;
const SLOT_PIC_HEIGHT = 168;

const SLOT_ITEM_WIDTH = [11,16,16,16,16,16,15];
const SLOT_ITEM_IMG_POS = [0,15,35,55,75,95,115];
const SLOT_ITEM_GAP = 4;

var slotMachine = document.createElement("img");
var slotIcons = document.createElement("img");
slotMachine.src = "./content/slotmachine.png";
slotIcons.src = "./content/icons.png";

var prevWindowDimentions = {width:0, height:0};

function drawAll(){
	canvasAlign();

	colorRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, RED);

	canvasContext.clearRect(32/SLOT_PIC_WIDTH*CANVAS_WIDTH+8/SLOT_PIC_WIDTH*CANVAS_WIDTH, 70+15/SLOT_PIC_HEIGHT*CANVAS_HEIGHT-20, 31/SLOT_PIC_WIDTH*CANVAS_WIDTH, 83/SLOT_PIC_HEIGHT*CANVAS_HEIGHT+40);
	canvasContext.clearRect(32/SLOT_PIC_WIDTH*CANVAS_WIDTH+48/SLOT_PIC_HEIGHT*CANVAS_HEIGHT+8/SLOT_PIC_WIDTH*CANVAS_WIDTH, 70+15/SLOT_PIC_HEIGHT*CANVAS_HEIGHT-20, 31/SLOT_PIC_WIDTH*CANVAS_WIDTH, 83/SLOT_PIC_HEIGHT*CANVAS_HEIGHT+40);
	canvasContext.clearRect(32/SLOT_PIC_WIDTH*CANVAS_WIDTH+48/SLOT_PIC_HEIGHT*CANVAS_HEIGHT*2+8/SLOT_PIC_WIDTH*CANVAS_WIDTH, 70+15/SLOT_PIC_HEIGHT*CANVAS_HEIGHT-20, 31/SLOT_PIC_WIDTH*CANVAS_WIDTH, 83/SLOT_PIC_HEIGHT*CANVAS_HEIGHT+40);

	drawSlotSlot(32/SLOT_PIC_WIDTH*CANVAS_WIDTH,70,0);
	drawSlotSlot(32/SLOT_PIC_WIDTH*CANVAS_WIDTH+48/SLOT_PIC_HEIGHT*CANVAS_HEIGHT,70,1);
	drawSlotSlot(32/SLOT_PIC_WIDTH*CANVAS_WIDTH+48/SLOT_PIC_HEIGHT*CANVAS_HEIGHT*2,70,2);

	drawImageFromSpriteSheetWithRotation(slotMachine, 182, 16, 52, 136, 182/SLOT_PIC_WIDTH*CANVAS_WIDTH, 40, 52/SLOT_PIC_WIDTH*CANVAS_WIDTH, 136/SLOT_PIC_HEIGHT*CANVAS_HEIGHT);
	drawImageFromSpriteSheetWithRotation(slotMachine, 16, 18, 16, 141, 16/SLOT_PIC_WIDTH*CANVAS_WIDTH, 10, 16/SLOT_PIC_WIDTH*CANVAS_WIDTH, 141/SLOT_PIC_HEIGHT*CANVAS_HEIGHT);

	handleMenu();

	handleSlotItems();

	drawMulitplier();
	drawWinners();
}

function drawSlotSlot(x,y,i){
	drawImageFromSpriteSheetWithRotation(slotMachine, 32, 32, 48, 111, x, y, 48/SLOT_PIC_HEIGHT*CANVAS_HEIGHT, 111/SLOT_PIC_HEIGHT*CANVAS_HEIGHT);
	canvasContext.clearRect(x+8/SLOT_PIC_WIDTH*CANVAS_WIDTH, y+15/SLOT_PIC_HEIGHT*CANVAS_HEIGHT, 31/SLOT_PIC_WIDTH*CANVAS_WIDTH, 83/SLOT_PIC_HEIGHT*CANVAS_HEIGHT);
	
	colorSlotsRect(x+8/SLOT_PIC_WIDTH*CANVAS_WIDTH, y+15/SLOT_PIC_HEIGHT*CANVAS_HEIGHT-20, 31/SLOT_PIC_WIDTH*CANVAS_WIDTH, 83/SLOT_PIC_HEIGHT*CANVAS_HEIGHT+40, WHITE);
	drawSlotItems(i);
}

function canvasAlign(){
	if(prevWindowDimentions.width != window.innerWidth || prevWindowDimentions.height != window.innerWidth){
		prevWindowDimentions.width = window.innerWidth;
		prevWindowDimentions.height = window.innerHeight;
	}

	let gameCanvas = document.getElementById("gameCanvas");
	let slotsCanvas = document.getElementById("slotsCanvas");
	

	// when screen is skinny
	let possibleHeight = 675*window.innerWidth/1000;
	if(possibleHeight <= window.innerHeight){
		gameCanvas.style.width = window.innerWidth + "px";
		gameCanvas.style.height = possibleHeight + "px";
		slotsCanvas.style.width = window.innerWidth + "px";
		slotsCanvas.style.height = possibleHeight + "px";
		return;
	}

	// when screen is wide
	gameCanvas.style.width = 1000*window.innerHeight/675 + "px";
	gameCanvas.style.height = window.innerHeight + "px";
	slotsCanvas.style.width = 1000*window.innerHeight/675 + "px";
	slotsCanvas.style.height = window.innerHeight + "px";
}

function getCharWidth(char, font) {
	canvasContext.font = font;        
	var width = canvasContext.measureText(char).width;
    return width;
}