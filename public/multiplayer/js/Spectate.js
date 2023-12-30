

function handleMenu(){
	handleButtons(CANVAS_WIDTH/2-265/2, 3*CANVAS_HEIGHT/8, 265, 40, "Spectate Game", S, handleMenuingInput);
	handleButtons(CANVAS_WIDTH/2-185/2, 3*CANVAS_HEIGHT/8+60, 185, 40, "Join Game", P, handleMenuingInput);

	handleButtons(CANVAS_WIDTH/2-95, 9*CANVAS_HEIGHT/10+10, 190, 40, "Main Menu", ENTER, goToMenu);
}

function spectateGame(){
	console.log("HO")
}

function startGame(){
	console.log("HU")
	menu = false;
}