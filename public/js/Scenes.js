// scenes
// 0 pre deal
// 1 pre flop
// 2 post flop
// -1 all in run-out


// stages
// 0 call / raise / fold
// 1 && 2 check / bet
// 3 next hand
// 4 all in or fold

function playHand(keycode){
	handleChipsOnBet(ai.betAmount, CANVAS_WIDTH/2-(CARD_WIDTH*2.75), CARD_PIC_HEIGHT/2);
	handleChipsOnBet(human.betAmount, CANVAS_WIDTH/2-(CARD_WIDTH*3), CANVAS_HEIGHT-CANVAS_HEIGHT/8);

	// console.log(stage, scene,)
	// console.log(ai.allIn , human.allIn , ai.chips <= 0 , human.chips <= 0)

	if(ai.allIn || human.allIn){
		ai.display(true);

		setTimer(2, () =>{
			table.seeNext()
		});

		return; 
	}

	if(stage == -1 || scene == -1){
		ai.display(true);
		return;
	}

	if(table.winner){
		stage = 3;
	}

	// show down get to next hand
	if(stage == 3){
		let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
	    drawText("black", "32px customfont", "Press \"s\" to", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont);
	    drawText("black", "32px customfont", "play the next hand...", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*2.5);

	    ai.display();

	    Stage3Input(keycode);
	    return;
	}

	ErrorHandling();

	ai.display(true);

	// pre deal
	if(scene == 0){

		if(human.dealer){

			let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
        	drawText("black", "32px customfont", "Enter Straddle:", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont);
        	drawText("black", "32px customfont", human.betAmount, CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*2.5);

        	drawText("black", "32px customfont", "To continue", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*4);
        	drawText("black", "32px customfont", "press: \"s\"", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*5.5);

        	Scene0Input(keycode);
        	return;
		}

		// console.log("PRE DEAL AI DECISION")

		turn = "human";
		ai.raise(table.minBet);
		human.raise(table.minBet/2);
		human.autoBet = true;
		table.deal();
		scene = 1;
	}

	// pre flop
	if(scene == 1 && turn == "ai"){
		// console.log("PRE FLOP AI DECISION");
		lazyBrain.makeDecision("preflop");
		return;
	}


	// post flop
	if(scene == 2 && turn == "ai"){
		// console.log("POST FLOP AI DECISION");
		lazyBrain.makeDecision("postflop");
		return;
	}


	if(turn == "human"){

		// bet into you
		if(stage == 0){
			let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
	        drawText("black", "32px customfont", "Fold: \"f\"", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont);
	        drawText("black", "32px customfont", "Call: \"c\"", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*2.5);

	        drawText("black", "32px customfont", "Input Raise Amount:", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*4);
	        drawText("black", "32px customfont", human.betAmount, CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*5.5);
	        drawText("black", "32px customfont", "Enter Raise: \"s\"", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*7);

	        Stage0Input(keycode);
		}

		// option (no bet into you)
		if(stage == 1 || stage == 2){
			let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
	        drawText("black", "32px customfont", "Check: \"c\"", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont);
	        drawText("black", "32px customfont", "Input Bet Amount:", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*2.5);
	        drawText("black", "32px customfont", human.betAmount, CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*4);
	        drawText("black", "32px customfont", "Enter Bet: \"s\"", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*5.5);

	        Stage1Input(keycode);
		}

		// all in or fold
		if(stage == 4){
			let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
	        drawText("black", "32px customfont", "Press \"a\" to", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont);
	        drawText("black", "32px customfont", "go all in", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*2.5);
	        drawText("black", "32px customfont", "Press \"f\"", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*4);
	        drawText("black", "32px customfont", "to fold...", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+largeFont*5.5);

	        Stage4Input(keycode);
		}
	}
}


function handleChipsOnBet(bet, X, Y){

	if(bet == 0){
		return;
	}

	let copy = bet;

	let fiveHundreds = Math.floor(copy / 500);
	copy -= fiveHundreds * 500;

	let hundreds = Math.floor(copy / 100);
	copy -= hundreds * 100;

	let twentyFives = Math.floor(copy / 25);
	copy -= twentyFives * 25;

	let fives = Math.floor(copy / 5);
	copy -= fives * 5;

	let ones = copy;

	for (var i = 0; i < fiveHundreds; i++) {
		drawImageFromSpriteSheetWithRotation(chips2Pic, 0, 0, 30, 30, X-60, Y-i*3, 30, 30);
	}

	for (var i = 0; i < hundreds; i++) {
		drawImageFromSpriteSheetWithRotation(chipsPic, 1*30-1, 0, 30, 30, X-30, Y-i*3, 30, 30);
	}

	for (var i = 0; i < twentyFives; i++) {
		drawImageFromSpriteSheetWithRotation(chipsPic, 0, 0, 30, 30, X, Y-i*3, 30, 30);
	}

	for (var i = 0; i < fives; i++) {
		drawImageFromSpriteSheetWithRotation(chips2Pic, 2*30-1, 0, 30, 30, X+30, Y-i*3, 30, 30);
	}

	for (var i = 0; i < ones; i++) {
		drawImageFromSpriteSheetWithRotation(chipsPic, 2*30-1, 0, 30, 30, X+60, Y-i*3, 30, 30);
	}

	let width = measureText("$" + bet, largeFont, "32px customfont");
    drawText("black", "32px customfont", "$" + bet, X-width.width/2, Y+largeFont*3);
}



function ErrorHandling(){

	if(err == -1){
		return;
	}

	colorRect(CANVAS_WIDTH/2-(CARD_WIDTH*5+50*5)/2+13, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2-8, (CARD_WIDTH*5+46*5), CARD_HEIGHT+36, "white");

	// bet more than stack
	if(err == 0){
		let width = measureText("Your Max Bet is $" + (human.chips+human.bet), (largeFont*2), (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Your Max Bet is $" + (human.chips+human.bet), CANVAS_WIDTH/2-width.width/1.75, CANVAS_HEIGHT/2);

    	setTimer(1, function(){
    		err = -1;
    	});
	}

	// less than min raise
	if(err == 1){
		let width = measureText("Your Min Raise is $" + table.bet*2, (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Your Min Raise is $" + table.bet*2, CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, function(){
    		err = -1;
    	});
	}

	// less than min bet
	if(err == 2){
		let width = measureText("Your Min Bet is $" + table.minBet, (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Your Min Bet is $" + table.minBet, CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, function(){
    		err = -1;
    	});
	}

	// all in for ai
	if(err == 3){
		let width = measureText((ai.chips+ai.bet) + "$ max bet for A.I.", (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", (ai.chips+ai.bet) + "$ max bet for A.I.", CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, function(){
    		err = -1;
    	});
	}

}

function setTimer(time, func){
	if(timer == 0){
    	timer = totalTime;
    }		

    if(totalTime - timer > time){
    	func();
    	timer = 0;
    }
}








