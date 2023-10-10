

function handleButtons(x, y, w, h, text, keycode, func){

	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	drawText("black", "32px customfont", text, x+10, y+32);

	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseInBetKnob == false && mouseDown && prevMouseDown == false){
		prevMouseDown = true;	
		func(keycode);
	}
}


function handleBetFrame(x, y){
	let betKnobWidth = 15;

	betKnobRelativePos = Math.min(human.betAmount, human.bet+human.chips)/(human.bet+human.chips);
	betKnobRelativePos *= 250;

	// draw bet background pattern
	let widthCount = 0;
	while(widthCount < betKnobRelativePos){
		if(widthCount+CARD_WIDTH < betKnobRelativePos){
			drawImageFromSpriteSheetWithRotation(cardsPic, 162,437,CARD_PIC_WIDTH-4,22, x+widthCount+5,y+2,CARD_PIC_WIDTH-4,22);
			widthCount += CARD_PIC_WIDTH-4;
			continue;
		}

		drawImageFromSpriteSheetWithRotation(cardsPic, 162,437,betKnobRelativePos-widthCount,22, x+widthCount+5,y+2,betKnobRelativePos-widthCount,22);
		break;
	}

	// bet frame
	drawImageFromSpriteSheetWithRotation(betFramePic, 0, 0, 250, 25,x,y, 250, 25);

	// bet knob
	colorRect(x+betKnobRelativePos-betKnobWidth/2, y, 15, 25, "#334458");

	if(mouseX >= x && mouseX <= x+250 && mouseY >= y && mouseY <= y+25 && mouseDown && prevMouseDown == false){
		mouseInBetKnob = true;
	}

	if(mouseInBetKnob){
		if(mouseX-x < 0){
			betKnobRelativePos = 0;
		}else if(mouseX-x > 250){
			betKnobRelativePos = 250;
		}else{
			betKnobRelativePos = mouseX-x;
		}

		human.autoBet = true;
		human.betAmount = Math.floor(betKnobRelativePos/250 * (human.chips+human.bet));
		human.betAmount = Math.round(Math.ceil(human.betAmount) / 5) * 5;
		human.betAmount = Math.min(human.betAmount, human.bet+human.chips);
		human.betAmount = Math.min(human.betAmount, ai.bet+ai.chips);
	}
}