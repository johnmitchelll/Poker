function Card(card, sx, sy){
    this.card = card;
    this.sx = sx;
    this.sy = sy;
    this.faceDown = false;
    this.animate = true;
    this.x = 42;
    this.y = 42;

    this.display = function(dx, dy){

        if(this.animate){
            this.animateUpdate(dx, dy);
            return;
        }


        if(this.faceDown){
            drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, dx, dy, CARD_WIDTH, CARD_HEIGHT);
            return;
        }

        drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, dx, dy, CARD_WIDTH, CARD_HEIGHT, 0, false);
    }

    this.animateUpdate = function(dx, dy){
        let angleBetweenPosAndDestination = Math.atan2(this.y - dy, this.x - dx);

        let currentDist = distanceOfTwoPoints(this.x, this.y, 42, 42);
        let wholeDist = distanceOfTwoPoints(dx, dy, 42, 42);

        this.x -= Math.cos(angleBetweenPosAndDestination)*wholeDist/30;
        this.y -= Math.sin(angleBetweenPosAndDestination)*wholeDist/30;

        let percentComplete = currentDist / wholeDist;

        if(this.faceDown){
            drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH, CARD_HEIGHT);
        }else{
            if(percentComplete <= 0.5){
                drawImageFromSpriteSheetWithRotation(cardsPic, 160, 437, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(1-percentComplete*2), CARD_HEIGHT);
            }else{
                drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, this.x, this.y, CARD_WIDTH*(2*percentComplete-1), CARD_HEIGHT, 0, false);
            }
        }

        let distToTarget = distanceOfTwoPoints(dx, dy, this.x, this.y);

        // animation is done
        if(distToTarget <= 1){
            this.animate = false;
        }
    }
}

function Deck(){
    this.cards = [];

    this.newDeck = function(){
        this.cards = [];

        for (var i = 0; i < cards.length; i++) {
            this.cards.push(new Card(cards[i].card, cards[i].sx, cards[i].sy));
        }

        // init();

        this.shuffle();
    }

    this.shuffle = function(){
        let tempCards = deepCopy(this.cards);
        this.cards = [];

        for (var i = 0; i < 52; i++) {
            let randomIndex = Math.floor(Math.random()*(52-i));
            let randomCard = tempCards[randomIndex];

            this.cards.push(new Card(randomCard.card, randomCard.sx, randomCard.sy));
            removeFromArray(tempCards,randomIndex);
        }
    }

    this.pop = function(){
        return this.cards.pop();
    }
}

function Table(){
    this.board = [];
    this.players;
    this.pot = 0;
    this.burnCards = [];
    this.bet = 20;
    this.minBet = 20;
    this.winner;

    this.display = function(){
        // top card space     
        colorRectNoFill(CANVAS_WIDTH/2-(CARD_WIDTH+40), CARD_PIC_HEIGHT/8, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);
        colorRectNoFill(CANVAS_WIDTH/2+15, CARD_PIC_HEIGHT/8, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);

        // bottom card space 
        colorRectNoFill(CANVAS_WIDTH/2-(CARD_WIDTH+40), CANVAS_HEIGHT-240, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);
        colorRectNoFill(CANVAS_WIDTH/2+15, CANVAS_HEIGHT-240, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);

        // board
        for (var i = 0; i < 5; i++) {
            colorRectNoFill(CANVAS_WIDTH/2.5-(CARD_WIDTH*5+50*5)/2+i*(CARD_WIDTH+50)+15, CANVAS_HEIGHT/2-100, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);
        }

        // pot
        width = measureText("Pot: $" + this.pot, largeFont, "32px customfont");
        drawText("black", "32px customfont", "Pot: $" + this.pot, CANVAS_WIDTH/2+CANVAS_WIDTH/2.75-width.width, CANVAS_HEIGHT/2+CARD_HEIGHT/2-50);
        colorRectNoFill(CANVAS_WIDTH/2+CANVAS_WIDTH/3.5-20, CANVAS_HEIGHT/2+CARD_HEIGHT/2-130, 185, 45, "white", 3);

        // pot chips
        handleChipsOnBet(this.pot, CANVAS_WIDTH/2+CANVAS_WIDTH/2.75-width.width/4, CANVAS_HEIGHT/2+CARD_HEIGHT/2-122, false);


        // ai and human cards
        if(ai.cards[0]){
            ai.cards[0].display(CANVAS_WIDTH/2-(CARD_WIDTH+28), CARD_PIC_HEIGHT/8+12);
            ai.cards[1].display(CANVAS_WIDTH/2+27, CARD_PIC_HEIGHT/8+12);
        }

        if(human.cards[0]){
            human.cards[0].display(CANVAS_WIDTH/2-(CARD_WIDTH+28), CANVAS_HEIGHT-240+12);
            human.cards[1].display(CANVAS_WIDTH/2+27, CANVAS_HEIGHT-240+12);
        }

        // board cards
        for (var i = 0; i < 5; i++) {
            if(this.board[i]){
                this.board[i].display(CANVAS_WIDTH/2.5-(CARD_WIDTH*5+50*5)/2+i*(CARD_WIDTH+50)+27, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2-35);
            }
        }

        this.displayUserInfo();

    }

    this.displayUserInfo = function(){

        // ai stack
        let width = measureText("Stack: $" + ai.chips, largeFont, "32px customfont");
        drawText("black", "32px customfont", "Stack: $" + ai.chips, CANVAS_WIDTH/2-width.width+10, CANVAS_HEIGHT/2-125);

        // human stack
        width = measureText("Stack: $" + human.chips, largeFont, "32px customfont");
        drawText("black", "32px customfont", "Stack: $" + human.chips, CANVAS_WIDTH/2-width.width+10, CANVAS_HEIGHT-40);

        // dealer chip
        if(ai.dealer){
            drawImageFromSpriteSheetWithRotation(chips2Pic, 30-1, 0, 30, 30, CANVAS_WIDTH/2+110, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2-largeFont*4-5, 30, 30);
        }else{
            drawImageFromSpriteSheetWithRotation(chips2Pic, 30-1, 0, 30, 30, CANVAS_WIDTH/2+160, CANVAS_HEIGHT/2+CARD_PIC_HEIGHT/2+25, 30, 30);
        }
    }

    this.deal = function(){

        playCardNoise();

        setTimeout(() => { 
            playCardNoise();
        }, 500);

        if(ai.dealer == true){
            human.cards.push(deck.pop());
            ai.cards.push(deck.pop());
            human.cards.push(deck.pop());
            ai.cards.push(deck.pop());
        }

        if(human.dealer == true){
            ai.cards.push(deck.pop());
            human.cards.push(deck.pop());
            ai.cards.push(deck.pop());
            human.cards.push(deck.pop());
        }

        // turn AI cards over
        for (var i = 0; i < 2; i++) {
            ai.cards[i].faceDown = true;

            human.cards[i].animate = true;
        }
    }

    this.flipNextCard = function(){
        this.board.push(deck.pop());
    }

    this.showDown = function(){
        ai.cards[0].faceDown = false;
        ai.cards[1].faceDown = false;

        let hand1 = table.board.concat(human.cards);
        let hand2 = table.board.concat(ai.cards);

        for (var i = 0; i < 7; i++) {
            hand1[i] = hand1[i].card;
            hand2[i] = hand2[i].card;
        }

        stage = 3;
        scene = 2;

        this.winner = getWinner(hand1, hand2).winner;
    }

    this.pushBets = function(){
        this.pot += human.bet + ai.bet;
        human.betAmount = 0;
        ai.betAmount = 0;
        human.bet = 0;
        ai.bet = 0;
        table.bet = 0;
        betKnobRelativePos = 0;
    }


    this.seeNext = function(){
        this.pushBets();

        turn = "ai";
        if(ai.dealer){
            turn = "human";
        }

        if(this.board.length < 5 && (stage == -1 || scene == -1)){
            table.flipNextCard();
        }
        
        if(this.board.length == 0){
            stage = -1;

            setTimeout(() => { 
                table.flipNextCard();
                playCardNoise()
                setTimeout(() => { 
                    table.flipNextCard();
                    playCardNoise()
                    setTimeout(() => { 
                        table.flipNextCard();
                        playCardNoise()
                        setTimeout(() => { 
                            scene = 2;
                            stage = 1;
                        }, 1000);
                    }, 1000);
                }, 750);
            }, 500);
                
            return;
        }   

        if(this.board.length < 5){
            stage = -1;
            setTimeout(() => { 
                table.flipNextCard();
                playCardNoise()
                setTimeout(() => { 
                    stage = 1;
                }, 1000);
            }, 1000);
           
            return;
        }   

        this.showDown();
        human.allIn = false;
        ai.allIn = false;
    }
}

function Player(){
    this.chips = 1000;
    this.cards = [];
    this.dealer = false;
    this.autoBet = false;
    this.straddle = false;
    this.extraBuyIn = 0;

    // bet amount is amount displayed bet is actual bet
    this.betAmount = 0;
    this.bet = 0;
    this.allIn = false;

    this.raise = function(amount, display){
        let totalChips = this.chips + this.bet;

        playChipNoise();

        this.chips = totalChips - amount;
        this.betAmount = amount;
        this.bet = amount;

        stage = 0;

        if(amount > table.bet){
            table.bet = amount;
        }
        
        if(totalChips - amount <= 0){
            this.chips = 0;
            this.betAmount = totalChips;
            this.bet = totalChips;
            table.bet = totalChips;
            amount = totalChips;

            if(display){
                command = ["A.I. is all in"];
            }

            return;
        }

        if(display){
            command = ["A.I. Raises To:", "$"+String(amount)];
        }
    }

    this.call = function(display){ 
        let totalChips = this.chips + this.bet;

        playChipNoise();

        if(table.bet >= totalChips){
            this.betAmount = totalChips;
            this.bet = totalChips;
            this.chips = 0;

            this.allIn = true;
            stage = -1;
            scene = -1;
            // all in
            return 1;
        }

        stage = 1;

        this.chips = totalChips - table.bet;
        this.betAmount = table.bet;
        this.bet = table.bet;

        if(ai.allIn || human.allIn || ai.chips <= 0 || human.chips <= 0){
            stage = -1;
            scene = -1;
            ai.allIn = true;
        }

        if(display){
            command = ["A.I. Calls"];
        }
    }

    this.display = function(stop){
        if(command == -1){
            return;
        }

        if(this == human){
            return;
        }

        colorRect(CANVAS_WIDTH/2+150, 15, 300, 175, "WHITE");
        let width;
        let font = largeFont*1.5;

        for (var i = 0; i < command.length; i++) {
            width = measureText(command[i], font, font + "px customfont");
            
            drawText("black", + font + "px customfont", command[i], 
            CANVAS_WIDTH/2+150+10, 5+(i+1)*(font+20));
        }

        setTimer(1, 2, () => {
            if(stop){
                command = -1;
            }
        })
    }
}

function newHand(){
    // console.log("NEW HAND")

    command = -1;
    deck.newDeck();
    human.cards = [];
    ai.cards = [];
    table.bet = table.minBet;
    table.board = [];
    table.pot = 0;
    table.winner = undefined;

    human.straddle = false;
    human.betAmount = 0;
    ai.betAmount = 0;
    human.bet = 0;
    ai.bet = 0;

    if(ai.chips <= 0){
        ai.chips = 1000;
        ai.extraBuyIn += 1000;
    }

    if(human.chips <= 0){
        human.chips = 1000;
        human.extraBuyIn += 1000;
    }

    pushBlinds();
    scene = 0;
    stage = 0;


    if((sessionData.length-1) % 10 == 0){
        updateUserStats();
    }
}

function pushBlinds(){
    if(ai.dealer){
        human.dealer = true;
        ai.dealer = false;
        return;
    }

    human.dealer = false;
    ai.dealer = true;
}


