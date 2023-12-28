// scenes
// 0 pre deal
// 1 pre flop
// 2 post flop
// -1 all in run-out


// stages
// 0 call / raise / fold
// 1 && 2 check / bet
// 3 next hand

function playHand(keycode){	
	handleChipsOnBet(ai.betAmount, CANVAS_WIDTH/2-(CARD_WIDTH*2.75), 100);
	handleChipsOnBet(human.bet, CANVAS_WIDTH/2-(CARD_WIDTH*2.75), CANVAS_HEIGHT-150);

	// menu button
	handleButtons(20, CANVAS_HEIGHT-60, 215, 40, "Leave Table", M, goToMenu);


	// check if the other player leaves mid hand set yourself to be the dealer
	if(!socketData.oponent){
		human.dealer = true;
		ai.dealer = false;
		turn = "human";
		command = ["Waiting For", "New Oponent"]
		ai.display();	
		return;
	}

	gatherDataFromServer();

	if(ai.allIn || human.allIn){
		ai.display(true);
		return;
	}

	if(stage == -1 || scene == -1){
		ai.display(true);
		return;
	}

	drawTimer();
	ErrorHandling();

	// show down get to next hand
	if(stage == 3){
		let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
		handleButtons(CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-210+largeFont+10, 265, 43, "Play Next Hand", S, Stage3Input)

	    ai.display();
	    Stage3Input(keycode);
	    return;
	}

	goToMenu(keycode);
	ai.display(true);

	// pre deal
	if(scene == 0){

		if(human.dealer){

			let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
        	drawText("black", "32px customfont", "Enter Straddle:", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-210+largeFont);
        	
			handleBetFrame(640, 495);
			drawText("black", "32px customfont", human.betAmount, CANVAS_WIDTH-CANVAS_WIDTH/10, CANVAS_HEIGHT-210+largeFont*2.5);

			handleButtons(CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-210+80, 165, 40, "Continue", S, Scene0Input);

        	Scene0Input(keycode);
        	return;
		}

		// Oponents turn basically just wait for them to make a move
	}

	// Oponents turn basically just wait for them to make a move


	if(turn == "human"){

		// bet into you
		if(stage == 0){
			let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
			handleButtons(CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-220, 97, 40, "Fold", F, Stage0Input);
			handleButtons(CANVAS_WIDTH/2+width.width*1.75+130, CANVAS_HEIGHT-220, 90, 40, "Call", C, Stage0Input);

	        drawText("black", "32px customfont", "Input Raise Amount:", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-210+largeFont*3);
	        
			handleBetFrame(640, 540);
			drawText("black", "32px customfont", human.betAmount, CANVAS_WIDTH-CANVAS_WIDTH/10, CANVAS_HEIGHT-210+largeFont*4.5);
	       
			handleButtons(CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-210+largeFont*5.5, 217, 40, "Enter Raise", S, Stage0Input);

	        Stage0Input(keycode);
		}

		// option (no bet into you)
		if(stage == 1 || stage == 2){
			let width = measureText("Fold: \"f\"", largeFont, "32px customfont");
			handleButtons(CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-220, 115, 40, "Check", C, Stage1Input);

	        drawText("black", "32px customfont", "Input Bet Amount:", CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-210+largeFont*2.5+15);
	        
			handleBetFrame(640, 545);
			drawText("black", "32px customfont", human.betAmount, CANVAS_WIDTH-CANVAS_WIDTH/10, CANVAS_HEIGHT-210+largeFont*4+15);
	       
			handleButtons(CANVAS_WIDTH/2+width.width*1.75, CANVAS_HEIGHT-210+largeFont*5.5, 217, 40, "Enter Raise", S, Stage0Input);

	        Stage1Input(keycode);
		}
	}
}


function handleChipsOnBet(bet, X, Y, displayNum){

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

	if(displayNum == false){
		return;
	}

	let width = measureText("$" + bet, largeFont, "32px customfont");
    drawText("black", "32px customfont", "$" + bet, X-width.width/2, Y+largeFont*3);
}



function ErrorHandling(){

	if(err == -1){
		return;
	}

	colorRect(0, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2-50, CANVAS_WIDTH, CARD_HEIGHT+36, "white");

	// bet more than stack
	if(err == 0){
		let width = measureText("Your Max Bet is $" + (human.chips+human.bet), (largeFont*2), (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Your Max Bet is $" + (human.chips+human.bet), CANVAS_WIDTH/2-width.width/1.75, CANVAS_HEIGHT/2);

    	setTimer(1, 0, function(){
    		err = -1;
    	});

		return;
	}

	// less than min raise
	if(err == 1){
		let width = measureText("Your Min Raise is $" + table.bet*2, (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Your Min Raise is $" + table.bet*2, CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, 0, function(){
    		err = -1;
    	});

		return;
	}

	// less than min bet
	if(err == 2){
		let width = measureText("Your Min Bet is $" + table.minBet, (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Your Min Bet is $" + table.minBet, CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, 0, function(){
    		err = -1;
    	});

		return;
	}

	// all in for ai
	if(err == 3){
		let width = measureText((ai.chips+ai.bet) + "$ max bet for Oponent", (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", (ai.chips+ai.bet) + "$ max bet for Oponent", CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, 0, function(){
    		err = -1;
    	});

		return;
	}

	if(err == 4){
		let width = measureText("Out of Time, Oponent's Turn", (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Out of Time, Oponent's Turn", CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, 0, function(){
    		err = -1;
    	});

		return;
	}

	if(err == 5){
		let width = measureText("Oponent is All In, Call or Fold", (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "Oponent is All In, Call or Fold", CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, 0, function(){
    		err = -1;
    	});

		return;
	}

	if(err == 6){
		let width = measureText("You Can't Raise More, Call or Fold", (largeFont*2) + "px customfont");
    	drawText("black", (largeFont*2) + "px customfont", "You Can't Raise More, Call or Fold", CANVAS_WIDTH/2-width.width*1.75, CANVAS_HEIGHT/2);

    	setTimer(1, 0, function(){
    		err = -1;
    	});

		return;
	}

}


function setTimer(time, index, func){
	if(timers[index] == 0){
		timers[index] = {
			"start": totalTime, 
			"func": func,
			"time": time
		};
		return;
	}	
}

function updateTimers(){
	for (let index = 0; index < timers.length; index++) {
		if(timers[index] != 0 && totalTime - timers[index].start > timers[index].time){
			timers[index].func();
			timers[index] = 0;
		}
	}
}


function drawTimer(){
	let radius = 16;

	let ang = Math.PI*2 * (socketData.game.timer/265)

	if(turn == "ai"){
		colorNoFillCircle(CANVAS_WIDTH/2-160, CANVAS_HEIGHT/2-140, radius, Math.PI*2, 10, "rgba(64,93,122,0.2)");
		colorNoFillCircle(CANVAS_WIDTH/2-160, CANVAS_HEIGHT/2-140, radius, ang, 10, BLUE);
	}else{
		colorNoFillCircle(CANVAS_WIDTH/2-160, CANVAS_HEIGHT-radius/2-40, radius, Math.PI*2, 10, "rgba(64,93,122,0.2)");
		colorNoFillCircle(CANVAS_WIDTH/2-160, CANVAS_HEIGHT-radius/2-40, radius, ang, 10, BLUE);
	}

	// console.log(socketData.game.timer)

	// if turn is our turn
	if(socketData.game.timer <= 0){
		if(socketData.game.turn != socketData.oponent.id){
			handleTimerOutOfTime();
		}
	}
}

function handleTimerOutOfTime(){
	if(stage == 3){
		s_held = false;
		Stage3Input(S);
		console.log("Going to next hand")
		return;
	}

	if(scene == 0){
		s_held = false;
		human.betAmount = 0;
		Scene0Input(S);
		console.log("NO Straddle")
		err = 4;
		return;
	}

	if(stage == 0){
		Stage0Input(F);
		console.log("Folding")
		err = 4;
		return;
	}

	if(stage == 1 || stage == 2){
		c_held = false;
		Stage1Input(C);
		console.log("Checking")
		err = 4;
		return;
	}
}
