
var betSize = 25;


function handleMenu(keycode){
	handleButtons(20, CANVAS_HEIGHT-60, 190, 40, "Main Menu", handleKeyPress, ENTER);
	handleButtons(CANVAS_WIDTH/2-130, 9*CANVAS_HEIGHT/10-60, 95, 40, "Spin", spinSlots);

	let width = getCharWidth("Credits: "+coins, "32px customfont");
	colorRect(CANVAS_WIDTH/2-width/2-95, 19*CANVAS_HEIGHT/20-35, width+20, 43, "#121212");
	colorRectNoFill(CANVAS_WIDTH/2-width/2-95, 19*CANVAS_HEIGHT/20-35, width+20, 43, "white", 2);
	drawText("white", "32px customfont", "Credits: "+coins, CANVAS_WIDTH/2-width/2-85, 19*CANVAS_HEIGHT/20);

	handleLightUpButtons(CANVAS_WIDTH/2-270-75, 9*CANVAS_HEIGHT/10-60, 75, 40, "25$", 25, [0,225,0]);
	handleLightUpButtons(CANVAS_WIDTH/2-270+8, 9*CANVAS_HEIGHT/10-60, 75, 40, "50$", 50, [225,0,0]);
	handleLightUpButtons(CANVAS_WIDTH/2+20, 9*CANVAS_HEIGHT/10-60, 90, 40, "100$", 100, [225,0,225]);
	handleLightUpButtons(CANVAS_WIDTH/2+120, 9*CANVAS_HEIGHT/10-60, 90, 40, "250$", 250, [0,0,225]);
}


function handleButtons(x, y, w, h, text, func, keycode){
	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	drawText("black", "32px customfont", text, x+10, y+32);

	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		prevMouseDown = true;
		func(keycode);
	}
}

function handleLightUpButtons(x, y, w, h, text, val, rgb){

	let brightness = 0.4;
	if(betSize == val){
		brightness = 1;
	}

	colorRect(x, y, w, h, "rgb("+ rgb[0]*brightness +", "+ rgb[1]*brightness +", "+ rgb[2]*brightness +")");
	colorRectNoFill(x, y, w, h, "rgb("+ 255*brightness +", "+ 255*brightness +", "+ 255*brightness +")", 2);
	drawText("rgb("+ 255*brightness +", "+ 255*brightness +", "+ 255*brightness +")", "32px customfont", text, x+10, y+32);

	if(slotsItemSpinning.includes(true)){
        return;
    }

	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		prevMouseDown = true;
		betSize = val;
	}
}


function drawMulitplier(){
	let width = getCharWidth("X "+multiplier, "32px customfont");
	colorRect(CANVAS_WIDTH-width-75, 19*CANVAS_HEIGHT/20-35, width+20, 43, "#121212");
	colorRectNoFill(CANVAS_WIDTH-width-75, 19*CANVAS_HEIGHT/20-35, width+20, 43, "white", 2);
	drawText("white", "32px customfont", "X "+multiplier, CANVAS_WIDTH-width-65, 19*CANVAS_HEIGHT/20);
}

function drawWinners(){
	if(!winners.includes(true) || Math.floor(totalTime*3) % 2 != 0){
		return;
	}

	for (let i = 0; i < winners.length; i++) {
		if(winners[i] == false){
			continue;
		}

		for (let j = 0; j < 10; j++) {
			colorCircle(77+13/2, 17+33/2+130*i, j*5, "rgba(150,150,255, "+(0.2-j*0.01)+")")
		}
	}
}