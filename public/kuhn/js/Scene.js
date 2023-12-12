
const CARD_HOLDER_WIDTH = CARD_WIDTH+25;
const CARD_HOLDER_HEIGHT = CARD_HEIGHT+25;

var rules = false;

function drawScene(){

	if(rules){
		drawRulesScreen();
		return;
	}	

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

	handleButtons(20, CANVAS_HEIGHT-110, 110, 40, "Rules", R, handleKeyPressed);
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

	makeAIDecision();
}


function handleButtons(x, y, w, h, text, keycode, func){
	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	let drawX = x+w/2-getCharWidth(text, "32px customfont")/2;
	drawText("black", "32px customfont", text, drawX, y+32);


	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		prevMouseDown = true;

		func(keycode);
	}
}

function drawRulesScreen(){
	let width = getCharWidth("Welcome to Kuhn Poker", "46px customfont");
	drawText("white", "46px customfont", "Welcome to Kuhn Poker", CANVAS_WIDTH/2-width/2, 100);

	width = getCharWidth("Rules:", "32px customfont");
	drawText("white", "32px customfont", "Rules:", CANVAS_WIDTH/2-width/2, 140);

	width = getCharWidth("Each Player is Dealt One Card", "32px customfont");
	drawText("white", "32px customfont", "Each Player is Dealt One Card", CANVAS_WIDTH/2-width/2, 210);
	width = getCharWidth("Out of Three Total Cards in the Deck", "32px customfont");
	drawText("white", "32px customfont", "Out of Three Total Cards in the Deck", CANVAS_WIDTH/2-width/2, 250);

	width = getCharWidth("<", "32px customfont");
	for (let i = 1; i < 4; i++) {
		drawImageFromSpriteSheetWithRotation(cardsPic, (4-i)*(CARDS_IMG_WIDTH+CARD_IMG_GAP), 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, CANVAS_WIDTH/2-(i-2)*CARD_WIDTH*2-CARD_WIDTH/2,290, CARD_WIDTH, CARD_HEIGHT);
		
		if(i == 3){
			continue;
		}

		drawText("white", "32px customfont", "<", CANVAS_WIDTH/2-(i-1)*CARD_WIDTH*2-CARD_WIDTH/2+CARD_WIDTH+CARD_WIDTH/2-width/2,290+CARD_HEIGHT/2);
	}

	width = getCharWidth("After a Round of Betting,", "32px customfont");
	drawText("white", "32px customfont", "After One Round of Betting,", CANVAS_WIDTH/2-width/2, 500);

	width = getCharWidth("Win by the A.I. Folding or Winning in a Showdown", "32px customfont");
	drawText("white", "32px customfont", "Win by the A.I. Folding or Winning in a Showdown", CANVAS_WIDTH/2-width/2, 540);

	handleButtons(CANVAS_WIDTH/2-140, CANVAS_HEIGHT-80, 280, 40, "Play Kuhn Poker", R, handleKeyPressed);
}