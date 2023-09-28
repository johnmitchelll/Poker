const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 675;

const CARD_PIC_WIDTH = 124;
const CARD_PIC_HEIGHT = 176;

const CAR_PIC_GAP = 4;

const PIC_COLS = 13;
const PIC_ROWS = 4;

const GREEN = "rgb(64,122,93)";

const SCREEN_AREA = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT);

const CARD_WIDTH = Math.max(SCREEN_AREA/8, 300/8);
const CARD_HEIGHT = Math.max(SCREEN_AREA/5, 300/5);


var cardsPic = document.createElement("img");
var chipsPic = document.createElement("img");
var chips2Pic = document.createElement("img");

var largeFont = SCREEN_AREA/30;
var smallFont = SCREEN_AREA/40;;

function loadImages(){
	cardsPic.src = "imgs/cards.png";
	chipsPic.src = "imgs/chips.png";
	chips2Pic.src = "imgs/chips2.png";
}


function drawAll(){

	colorRect(0, 0, canvas.width, CANVAS_HEIGHT, GREEN);

	//drawDeck
	for (var i = 0; i < 5; i++) {
		drawImageFromSpriteSheetWithRotation(cardsPic, 12+(2*128), 12+(4*180), CARD_PIC_WIDTH, CARD_PIC_HEIGHT,50+i*-2,50+i*-2, CARD_WIDTH, CARD_HEIGHT);
	}

	// for (var i = 0; i < 3; i++) {
	// 	drawImageFromSpriteSheetWithRotation(chipsPic, i*30-1, 0, 30, 30, 200+i*30, 200, 30, 30);
	// }

	table.display();

	// console.log(stage)

	// drawText("black", "32px customfont", "hello", 400, 200)
}

var cards = [{"card":"As","sx":12,"sy":12},{"card":"Ah","sx":12,"sy":192},{"card":"Ac","sx":12,"sy":372},{"card":"Ad","sx":12,"sy":552},
			 {"card":"2s","sx":140,"sy":12},{"card":"2h","sx":140,"sy":192},{"card":"2c","sx":140,"sy":372},{"card":"2d","sx":140,"sy":552},
			 {"card":"3s","sx":268,"sy":12},{"card":"3h","sx":268,"sy":192},{"card":"3c","sx":268,"sy":372},{"card":"3d","sx":268,"sy":552},
			 {"card":"4s","sx":396,"sy":12},{"card":"4h","sx":396,"sy":192},{"card":"4c","sx":396,"sy":372},{"card":"4d","sx":396,"sy":552},
			 {"card":"5s","sx":524,"sy":12},{"card":"5h","sx":524,"sy":192},{"card":"5c","sx":524,"sy":372},{"card":"5d","sx":524,"sy":552},
			 {"card":"6s","sx":652,"sy":12},{"card":"6h","sx":652,"sy":192},{"card":"6c","sx":652,"sy":372},{"card":"6d","sx":652,"sy":552},
			 {"card":"7s","sx":780,"sy":12},{"card":"7h","sx":780,"sy":192},{"card":"7c","sx":780,"sy":372},{"card":"7d","sx":780,"sy":552},
			 {"card":"8s","sx":908,"sy":12},{"card":"8h","sx":908,"sy":192},{"card":"8c","sx":908,"sy":372},{"card":"8d","sx":908,"sy":552},
			 {"card":"9s","sx":1036,"sy":12},{"card":"9h","sx":1036,"sy":192},{"card":"9c","sx":1036,"sy":372},{"card":"9d","sx":1036,"sy":552},
			 {"card":"10s","sx":1164,"sy":12},{"card":"10h","sx":1164,"sy":192},{"card":"10c","sx":1164,"sy":372},{"card":"10d","sx":1164,"sy":552},
			 {"card":"Js","sx":1292,"sy":12},{"card":"Jh","sx":1292,"sy":192},{"card":"Jc","sx":1292,"sy":372},{"card":"Jd","sx":1292,"sy":552},
			 {"card":"Qs","sx":1420,"sy":12},{"card":"Qh","sx":1420,"sy":192},{"card":"Qc","sx":1420,"sy":372},{"card":"Qd","sx":1420,"sy":552},
			 {"card":"Ks","sx":1548,"sy":12},{"card":"Kh","sx":1548,"sy":192},{"card":"Kc","sx":1548,"sy":372},{"card":"Kd","sx":1548,"sy":552}]
