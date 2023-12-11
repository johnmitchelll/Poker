
const CARD_HOLDER_WIDTH = CARD_WIDTH+25;
const CARD_HOLDER_HEIGHT = CARD_HEIGHT+25;

function drawScene(){

	if(dealer == "ai"){
		colorRectNoFill(CANVAS_WIDTH/2-CARD_HOLDER_WIDTH/2, CANVAS_HEIGHT/8, CARD_HOLDER_WIDTH, CARD_HOLDER_HEIGHT, "rgba(255,255,255,1)", 5);
		colorRectNoFill(CANVAS_WIDTH/2-CARD_HOLDER_WIDTH/2, CANVAS_HEIGHT-CANVAS_HEIGHT/8-CARD_HOLDER_HEIGHT, CARD_HOLDER_WIDTH, CARD_HOLDER_HEIGHT, "rgba(255,255,255,0.2)", 5)
	}else{
		colorRectNoFill(CANVAS_WIDTH/2-CARD_HOLDER_WIDTH/2, CANVAS_HEIGHT/8, CARD_HOLDER_WIDTH, CARD_HOLDER_HEIGHT, "rgba(255,255,255,0.2)", 5)
		colorRectNoFill(CANVAS_WIDTH/2-CARD_HOLDER_WIDTH/2, CANVAS_HEIGHT-CANVAS_HEIGHT/8-CARD_HOLDER_HEIGHT, CARD_HOLDER_WIDTH, CARD_HOLDER_HEIGHT, "rgba(255,255,255,1)", 5)
	}

	drawPlayersStack(CANVAS_WIDTH/2-CARD_HOLDER_WIDTH-20, CANVAS_HEIGHT/8+CARD_HOLDER_HEIGHT/2-CHIP_DIM/2, ai.chips)
	drawPlayersStack(CANVAS_WIDTH/2-CARD_HOLDER_WIDTH-20, CANVAS_HEIGHT-CANVAS_HEIGHT/8-CARD_HOLDER_HEIGHT/2-CHIP_DIM/2, human.chips)

	drawPlayersBet(CANVAS_HEIGHT/8+CARD_HOLDER_HEIGHT+40, ai.bet);
	drawPlayersBet(CANVAS_HEIGHT-CANVAS_HEIGHT/8-CARD_HOLDER_HEIGHT-40, human.bet);

	table.deck.display();
	table.displayCommand();

	handleButtons(20, CANVAS_HEIGHT-60, 215, 40, "Leave Table", ENTER, handleKeyPressed);

	if(scene == -1){
		let nextAnimation = true;

		for (let i = 0; i < table.deck.cards.length; i++) {
			if(table.deck.cards[i].animation){
				nextAnimation = false;
			}
		}

		if(nextAnimation){
			table.deck.nextAnimation();
		}
		return;
	}

	if(scene == 2){
		handleButtons(CANVAS_WIDTH/2-180/2, CANVAS_HEIGHT-CANVAS_HEIGHT/8+20, 180, 40, "Next Hand", S, handleKeyPressed);
		return;
	}

	if(turn == "human"){
        handleButtons(CANVAS_WIDTH/2-97, CANVAS_HEIGHT-CANVAS_HEIGHT/8+20, 95, 40, "Pass", P, handleKeyPressed);
	    handleButtons(CANVAS_WIDTH/2+2, CANVAS_HEIGHT-CANVAS_HEIGHT/8+20, 95, 40, "Bet", B, handleKeyPressed);
		return;
    }

	console.log("AI IS MAKING DECISION");
	makeAIDecision();
}


function handleButtons(x, y, w, h, text, keycode, func){
	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	let drawX = x+w/2-getCharWidth(text)/2;
	drawText("black", "32px customfont", text, drawX, y+32);


	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		prevMouseDown = true;

		func(keycode);
	}
}