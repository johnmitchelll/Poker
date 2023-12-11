
var table;

const ANIMATION_SEQUENCE = ["m", "m", "r", "m", "m"];

function Card(card, sx){
	this.card = card;
	this.sx = sx;
	this.faceDown = true;

	this.animation = false;
	this.desiredFaceDown = true;
	this.dx = 0;
	this.dy = 0;
	this.bx = 0;
	this.by = 0;

	this.x = CANVAS_WIDTH/8-CARD_WIDTH/2;
	this.y = CANVAS_HEIGHT/2-CARD_HEIGHT/2;

	this.vel = 0;

	this.display = function(){
		if(this.animation){
			this.animate();
			return;
		}

		if(this.faceDown){
			drawImageFromSpriteSheetWithRotation(cardsPic, 0, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x,this.y, CARD_WIDTH, CARD_HEIGHT);
			return;
		}

		drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x,this.y, CARD_WIDTH, CARD_HEIGHT);
	}

	this.animate = function(){
		if(this.animation == "m"){
			this.move();
		}

		if(this.animation == "r"){
			this.rotate();
		}
	}

	this.setAnimationQueues = function(face, vel){
		this.bx = this.x;
		this.by = this.y;
		this.desiredFaceDown = face;
		this.animation = ANIMATION_SEQUENCE[table.deck.animationIndex];
		this.vel = vel;
	}

	this.move = function(){
		let angleBetweenPosAndDestination = Math.atan2(this.y - this.dy, this.x - this.dx);

        let currentDist = distanceOfTwoPoints(this.x, this.y, this.bx, this.by);
        let wholeDist = distanceOfTwoPoints(this.dx, this.dy, this.bx, this.by);

		let distToTarget = distanceOfTwoPoints(this.dx, this.dy, this.x, this.y);

        this.x -= Math.cos(angleBetweenPosAndDestination)*this.vel;
        this.y -= Math.sin(angleBetweenPosAndDestination)*this.vel;

		let newDist = distanceOfTwoPoints(this.dx, this.dy, this.x, this.y);

		if(newDist > distToTarget){
			this.x = this.dx;
			this.y = this.dy;
		}

        let percentComplete = currentDist / wholeDist;

		if(this.faceDown && this.desiredFaceDown){
            drawImageFromSpriteSheetWithRotation(cardsPic, 0, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT);
        }else{
			if(this.desiredFaceDown == false){
				if(percentComplete <= 0.5){
					drawImageFromSpriteSheetWithRotation(cardsPic, 0, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x+CARD_WIDTH*percentComplete, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT);
				}else{
					drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x+CARD_WIDTH*(1-percentComplete), this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, 0, false);
				}
			}else{
				if(percentComplete <= 0.5){
					drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x+CARD_WIDTH*percentComplete, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT);
				}else{
					drawImageFromSpriteSheetWithRotation(cardsPic, 0, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x+CARD_WIDTH*(1-percentComplete), this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT);
				}
			}
        }


        // animation is done
        if(distToTarget <= 1){
			this.animation = false;

			if(this.desiredFaceDown == false){
				this.faceDown = false;
			}else{
				this.faceDown = true;
			}
        }	
	}

	this.rotate = function(){
		let ang = Math.atan2(this.y - this.dy, this.x - this.dx);

		let circumfrence = 2*Math.PI*50;
		let dist = circumfrence/50;
		let additionalDist = dist/50;

		this.x = CANVAS_WIDTH/8-CARD_WIDTH/2+50*Math.cos(ang+additionalDist);
		this.y = CANVAS_HEIGHT/2-CARD_HEIGHT/2+50*Math.sin(ang+additionalDist);

		drawImageFromSpriteSheetWithRotation(cardsPic, 0, 0, CARDS_IMG_WIDTH, CARDS_IMG_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT);

		let distToBeginning = distanceOfTwoPoints(this.bx, this.by, this.x, this.y);

        // animation is done
        if(distToBeginning < 3){
			this.animation = false;
			this.faceDown = true;
        }
	}
}


function Deck(){
	this.cards = [];
	this.animationIndex = 0;

	for (let i = 0; i < cards.length; i++) {
		this.cards.push(new Card(cards[i].value, cards[i].sx));
	}

	this.display = function(){
		for (let i = this.cards.length-1; i >= 0; i--) {
			this.cards[i].display();
		}
	}

	this.shuffle = function(){
		let deckCopy = deepCopy(this.cards);

		for (let i = 0; i < cards.length; i++) {
			let randomIndex = Math.floor(Math.random()*deckCopy.length);
			swapArrayElements(this.cards, i, randomIndex+i)
			removeFromArray(deckCopy, randomIndex);
		}
	}

	this.nextAnimation = function(){
		scene = -1;

		if(this.animationIndex == 0){
			for (let i = 0; i < this.cards.length; i++) {
				this.cards[i].dx = CANVAS_WIDTH/8-CARD_WIDTH/2;
				this.cards[i].dy = CANVAS_HEIGHT/2-CARD_HEIGHT/2;
				this.cards[i].setAnimationQueues(true, 20);
			}
			playCardNoise();
			this.animationIndex++;
			return;
		}

		if(this.animationIndex == 1){	
			for (let i = 0; i < this.cards.length; i++) {
				this.cards[i].dx = CANVAS_WIDTH/8-CARD_WIDTH/2+50*Math.cos(i/(this.cards.length)*Math.PI*2);
				this.cards[i].dy = CANVAS_HEIGHT/2-CARD_HEIGHT/2+50*Math.sin(i/(this.cards.length)*Math.PI*2);
				this.cards[i].setAnimationQueues(true, 5);
			}
			this.animationIndex++;
			return;
		}

		if(this.animationIndex == 2){	
			for (let i = 0; i < this.cards.length; i++) {
				this.cards[i].dx = CANVAS_WIDTH/8-CARD_WIDTH/2;
				this.cards[i].dy = CANVAS_HEIGHT/2-CARD_HEIGHT/2;
				this.cards[i].setAnimationQueues(true);
			}
			this.animationIndex++;
			return;
		}

		if(this.animationIndex == 3){	
			for (let i = 0; i < this.cards.length; i++) {
				this.cards[i].dx = CANVAS_WIDTH/8-CARD_WIDTH/2;
				this.cards[i].dy = CANVAS_HEIGHT/2-CARD_HEIGHT/2;
				this.cards[i].setAnimationQueues(true, 5);
			}
			table.deck.shuffle();
			this.animationIndex++;
			return;
		}

		if(this.animationIndex == 4){	
			for (let i = 1; i < this.cards.length; i++) {
				this.cards[i].setAnimationQueues(true, 20);
			}
			this.cards[0].dx = CANVAS_WIDTH/2-CARD_WIDTH/2;
			this.cards[0].dy = CANVAS_HEIGHT-CANVAS_HEIGHT/8-CARD_HOLDER_HEIGHT/2-CARD_HEIGHT/2;
			this.cards[0].setAnimationQueues(false, 20);

			this.cards[1].dx = CANVAS_WIDTH/2-CARD_WIDTH/2;
			this.cards[1].dy = CANVAS_HEIGHT/8+CARD_HOLDER_HEIGHT/2-CARD_HEIGHT/2;

			this.cards[2].dx = CANVAS_WIDTH/8-CARD_WIDTH/2;
			this.cards[2].dy = CANVAS_HEIGHT/2-CARD_HEIGHT/2;

			this.animationIndex++;
			playCardNoise();
			return;
		}

		table.nextHand();
	}
}

function Table(){
	this.deck = new Deck();
	
	this.deal = function(){
		human.betAction();
		ai.betAction();

		for (let i = 0; i < this.deck.length; i++) {
			this.card.faceDown = true;
		}

		human.setCard(this.deck.cards[0]);
		human.card.faceDown = false;
		ai.setCard(this.deck.cards[1]);
	}

	this.showDown = function(){
		scene = 2;
		ai.card.faceDown = false;

		// keep it up till client press next hand
		timer = -1;

		console.log(command)

		if(CARD_RANKINGS.indexOf(human.card.card) > CARD_RANKINGS.indexOf(ai.card.card)){
			if(command){
				command += ", Human Wins"
			}else{
				command = "Human Wins"
			}
			winner = "human";
			return;
		}

		if(command){
			command += ", A.I. Wins"
		}else{
			command = "A.I. Wins"
		}
		winner = "ai";		
	}

	this.nextHand = function(){
		if(dealer == "human"){
			dealer = "ai";
			turn = "human";
		}else{
			dealer = "human";
			turn = "ai";
		}

		console.clear()

		scene = 0;

		this.deal();
	}

	this.displayCommand = function(){
		if(!command){
			return;
		}

		timer--;

		let width = getCharWidth(command, "32px customfont")+20;

		colorRect(CANVAS_WIDTH/2-width/2, CANVAS_HEIGHT/2-20, width, 40, "white");
		colorRectNoFill(CANVAS_WIDTH/2-width/2, CANVAS_HEIGHT/2-20, width, 40, "black", 3);

		drawText("black", "32px customfont", command, CANVAS_WIDTH/2-width/2+10, CANVAS_HEIGHT/2+12)

		if(timer == 0){
			command = false;
		}
	}
}


function Player(y){
	this.chips = 10;
	this.card;
	this.bet = 0;
	this.y = y;

	this.setCard = function(card){
		this.card = card;
		this.card.x = CANVAS_WIDTH/2-CARD_WIDTH/2;
		this.card.y = this.y;
	}

	this.betAction = function(){
		this.chips--;
		this.bet++;
		
		if(this.chips <= 0){
			this.chips = 10;
		}
	}
}

function drawPlayersStack(x, y, chips){
	
	for (let i = 0; i < chips; i++) {
		drawImageFromSpriteSheetWithRotation(chipPic, 0, 0, CHIP_DIM, CHIP_DIM, x-Math.floor(i/MAX_CHIP_STACK)*(CHIP_DIM+3),y-(i%MAX_CHIP_STACK)/MAX_CHIP_STACK*CHIP_DIM/2, CHIP_DIM, CHIP_DIM);
	}

	let textWidth = getCharWidth(chips, "32px customfont");
	let maxLeftPos = x-Math.floor((chips-1)/MAX_CHIP_STACK)*(CHIP_DIM+3);
	let midpoint = maxLeftPos + ((x+CHIP_DIM)-maxLeftPos)/2
	midpoint -= textWidth/2;

	drawText("white", "32px customfont", chips, midpoint, y+70);
}

function drawPlayersBet(y, bet){
	colorNoFillCircle(CANVAS_WIDTH/2-CHIP_DIM*1.5, y, CHIP_DIM/2+5, "rgba(255,255,255,0.1)", 3);
	colorNoFillCircle(CANVAS_WIDTH/2+CHIP_DIM*1.5, y, CHIP_DIM/2+5, "rgba(255,255,255,0.1)", 3);

	if(bet == 1){
		if(y > CANVAS_HEIGHT/2){
			drawImageFromSpriteSheetWithRotation(chipPic, 0, 0, CHIP_DIM, CHIP_DIM, CANVAS_WIDTH/2-CHIP_DIM*1.5-CHIP_DIM/2,y-CHIP_DIM/2, CHIP_DIM, CHIP_DIM);
		}else{
			drawImageFromSpriteSheetWithRotation(chipPic, 0, 0, CHIP_DIM, CHIP_DIM, CANVAS_WIDTH/2+CHIP_DIM*1.5-CHIP_DIM/2,y-CHIP_DIM/2, CHIP_DIM, CHIP_DIM);
		}
	}

	if(bet == 2){
		drawImageFromSpriteSheetWithRotation(chipPic, 0, 0, CHIP_DIM, CHIP_DIM, CANVAS_WIDTH/2-CHIP_DIM*1.5-CHIP_DIM/2,y-CHIP_DIM/2, CHIP_DIM, CHIP_DIM);
		drawImageFromSpriteSheetWithRotation(chipPic, 0, 0, CHIP_DIM, CHIP_DIM, CANVAS_WIDTH/2+CHIP_DIM*1.5-CHIP_DIM/2,y-CHIP_DIM/2, CHIP_DIM, CHIP_DIM);
	}
}