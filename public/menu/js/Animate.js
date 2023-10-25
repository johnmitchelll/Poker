let animationInterval;
let animationScene = 0;
let animationIndex = 0;
let animation = "mnf"
let animateDir = -1;
let lowestZ = 0;
let highestZ = 51;
let cardVel = 10;
let intervalTiming = 50;


function Card(card, sx, sy, x, y){
    this.card = card;
    this.face = -1;
    this.ang = 0;
    this.animate = false;
    this.z = 0;
    this.i = 0;

    this.sx = sx;
    this.sy = sy;
    this.dx; 
    this.dy;
    this.x = x;
    this.y = y;
    this.origX = x;
    this.origY = y;

    this.display = function(){

        if(this.animate == "mnf"){
            this.moveAndFlip();
            return;
        }

        if(this.animate == "m"){
            this.move();
            return;
        }

        if(this.animate == "f"){
            this.flip();
            return;
        }


        if(this.face == -1){
            drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT);
            return;
        }

        drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT, 0, false);
    }

    this.moveAndFlip = function(){
        let angleBetweenPosAndDestination = Math.atan2(this.y - this.dy, this.x - this.dx);

        let currentDist = distanceOfTwoPoints(this.x, this.y, this.origX, this.origY);
        let wholeDist = distanceOfTwoPoints(this.dx, this.dy, this.origX, this.origY);

        this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/cardVel;
        this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/cardVel;

        let percentComplete = currentDist / wholeDist;

        if(this.face == -1){
            if(percentComplete <= 0.5){
                drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*percentComplete, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT);
            }else{
                drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*(1-percentComplete), this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, 0, false);
            }
        }else{
            if(percentComplete <= 0.5){
                drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*percentComplete, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT, 0, false);
            }else{
                drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*(1-percentComplete), this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT);
            }
        }

        let distToTarget = distanceOfTwoPoints(this.dx, this.dy, this.x, this.y);

        // animation is done
        if(distToTarget <= 1){
            this.animate = false;
            this.face *= -1;
        }
    }

    this.move = function(){
        let angleBetweenPosAndDestination = Math.atan2(this.y - this.dy, this.x - this.dx);
        let wholeDist = distanceOfTwoPoints(this.dx, this.dy, this.origX, this.origY);
        this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/cardVel;
        this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/cardVel;


        if(this.face == -1){
            drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT);
        }else{
            drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT, 0, false);
        }

        let distToTarget = distanceOfTwoPoints(this.dx, this.dy, this.x, this.y);

        // animation is done
        if(distToTarget <= 1){
            this.animate = false;
        }
    }

    this.flip = function(){

        this.ang += 0.05;

        if(this.face == -1){
            if(this.ang <= 0.5){
                drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*this.ang, this.y, CARD_WIDTH*(1-this.ang*2), CARD_HEIGHT);
            }else{
                drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*(1-this.ang), this.y, CARD_WIDTH*(2*this.ang-1), CARD_HEIGHT, 0, false);
            }
        }else{
            if(this.ang <= 0.5){
                drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*this.ang, this.y, CARD_WIDTH*(1-this.ang*2), CARD_HEIGHT, 0, false);
            }else{
                drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x+CARD_WIDTH*(1-this.ang), this.y, CARD_WIDTH*(2*this.ang-1), CARD_HEIGHT);
            }
        }

        if(this.ang >= 1){
            this.ang = 0;
            this.animate = false;
            this.face *= -1;
        }
    }
}



function animateDeck(){
    let animationStepDone = true;

    let deckCopy = deepCopy(deck);
    deckCopy.sort((a, b) => a.z - b.z);

    for (let i = 0; i < deckCopy.length; i++) {
        deck[deckCopy[i].i].display();

        if(deck[deckCopy[i].i].animate){
            animationStepDone = false;
        }
    }

    if(animationInterval || animationStepDone == false){
        return;
    }

    // set up new point of refrence
    for (let i = 0; i < deck.length; i++) {
        deck[i].origX = deck[i].x;
        deck[i].origY = deck[i].y;
    }

    // select next animation
    if(animationScene == 0){
        setUpNextAnimation("f", intervalTiming, animationScene+1)
        return;
    }

    if(animationScene == 1){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = 10;
            deck[i].dy = 10;
        }
        animateDir *= -1;
        setUpNextAnimation("m", intervalTiming, animationScene+1);
        return;
    }

    if(animationScene == 2){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = 10;
            deck[i].dy = 10+i*((CANVAS_HEIGHT-CARD_HEIGHT-20)/52);
        }
        animateDir *= -1;
        setUpNextAnimation("mnf", intervalTiming, animationScene+1)
        return;
    }

    if(animationScene == 3){
        setUpNextAnimation("f", intervalTiming, animationScene+1)
        return;
    }

    if(animationScene == 4){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = canvas.width/2-CARD_WIDTH/2;
            deck[i].dy = canvas.height/2-CARD_HEIGHT/2;
        }

        setUpNextAnimation("m", intervalTiming, animationScene+1)
        return;
    }

    if(animationScene == 5){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = 10+i*((CANVAS_WIDTH-CARD_WIDTH-20)/52);
            deck[i].dy = CANVAS_HEIGHT-CARD_HEIGHT-10;
        }
        setUpNextAnimation("mnf", intervalTiming, animationScene+1)
        return;
    }

    if(animationScene == 6){
       setUpNextAnimation("f", intervalTiming, animationScene+1)
        return;
    }

    if(animationScene == 7){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = CANVAS_WIDTH-CARD_WIDTH-10;
            deck[i].dy = CANVAS_HEIGHT-CARD_HEIGHT-10;
        }
        setUpNextAnimation("m", intervalTiming, animationScene+1)
        return;
    }
    if(animationScene == 8){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = CANVAS_WIDTH-CARD_WIDTH-10;
            deck[i].dy = 10+i*((CANVAS_HEIGHT-CARD_HEIGHT-20)/52);
        }
        setUpNextAnimation("mnf", intervalTiming, animationScene+1)
        return;
    }
    if(animationScene == 9){
        setUpNextAnimation("f", intervalTiming, animationScene+1)
         return;
     }
     if(animationScene == 10){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = canvas.width/2-CARD_WIDTH/2 ;
            deck[i].dy = canvas.height/2-CARD_HEIGHT/2;
        }
        setUpNextAnimation("m", intervalTiming, animationScene+1)
        return;
    }
    if(animationScene == 11){
        for (let i = 0; i < deck.length; i++) {
            deck[i].dx = 10+i*((CANVAS_WIDTH-CARD_WIDTH-20)/52);
		    deck[i].dy = 10;
        }
        setUpNextAnimation("mnf", intervalTiming, 0)
        return;
    }
}

function setUpNextAnimation(type, intervalVal, nextScene){
    animation = type;
    animationInterval = setInterval(animateNextCard, intervalVal);
    animationScene = nextScene;
}

function animateNextCard(){
    if(animationIndex == cards.length){
        clearInterval(animationInterval);
        animationInterval = undefined;
        animationIndex = 0;

        return;
    }

    if(animationIndex == 0){
        if(animation != "f"){
            lowestZ = deck.length;
            highestZ = deck.length*2-1;    
           }else{
            lowestZ = 0;
            highestZ = deck.length-1;
           }       
    }

    if(animateDir == 1){
        deck[animationIndex].animate = animation;
        
        if(animation == "f"){
            deck[animationIndex].z = highestZ+animationIndex+1;
        }else{
            deck[deck.length-animationIndex-1].z = animationIndex;
        }

    }else{
        deck[deck.length-animationIndex-1].z = animationIndex;
        deck[deck.length-animationIndex-1].animate = animation;
    }
    
    animationIndex++;
}
