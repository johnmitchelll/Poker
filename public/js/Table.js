function Card(card, sx, sy){
    this.card = card;
    this.sx = sx;
    this.sy = sy;
    this.faceDown = false;

    this.display = function(dx, dy){
        if(this.faceDown == false){
            drawImageFromSpriteSheetWithRotation(cardsPic, this.sx, this.sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, dx, dy, CARD_WIDTH, CARD_HEIGHT, 0, false);
            return;
        }

        drawImageFromSpriteSheetWithRotation(cardsPic, 12+(2*128), 12+(4*180), CARD_PIC_WIDTH, CARD_PIC_HEIGHT, dx, dy, CARD_WIDTH, CARD_HEIGHT);
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
        colorRectNoFill(CANVAS_WIDTH/2-(CARD_WIDTH+40), CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);
        colorRectNoFill(CANVAS_WIDTH/2+15, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);

        // board
        for (var i = 0; i < 5; i++) {
            colorRectNoFill(CANVAS_WIDTH/2-(CARD_WIDTH*5+50*5)/2+i*(CARD_WIDTH+50)+15, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2, CARD_WIDTH+25, CARD_HEIGHT+25, "white", 5);
        }

        // pot
        width = measureText("Pot: $" + this.pot, largeFont, "32px customfont");
        drawText("black", "32px customfont", "Pot: $" + this.pot, CANVAS_WIDTH/2-width.width, CANVAS_HEIGHT/2+CARD_PIC_HEIGHT/2+largeFont);

        // ai and human cards
        if(ai.cards[0]){
            ai.cards[0].display(CANVAS_WIDTH/2-(CARD_WIDTH+28), CARD_PIC_HEIGHT/8+12);
            ai.cards[1].display(CANVAS_WIDTH/2+27, CARD_PIC_HEIGHT/8+12);
        }

        if(human.cards[0]){
            human.cards[0].display(CANVAS_WIDTH/2-(CARD_WIDTH+28), CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+12);
            human.cards[1].display(CANVAS_WIDTH/2+27, CANVAS_HEIGHT-9*CARD_PIC_HEIGHT/8+12);
        }

        // board cards
        for (var i = 0; i < 5; i++) {
            if(this.board[i]){
                this.board[i].display(CANVAS_WIDTH/2-(CARD_WIDTH*5+50*5)/2+i*(CARD_WIDTH+50)+27, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2+12);
            }
        }

        this.displayUserInfo();

    }

    this.displayUserInfo = function(){

        // ai stack
        let width = measureText("Stack: $" + ai.chips, largeFont, "32px customfont");
        drawText("black", "32px customfont", "Stack: $" + ai.chips, CANVAS_WIDTH/2-width.width, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2-largeFont-8);

        // human stack
        width = measureText("Stack: $" + human.chips, largeFont, "32px customfont");
        drawText("black", "32px customfont", "Stack: $" + human.chips, CANVAS_WIDTH/2-width.width, CANVAS_HEIGHT-3);

        // dealer chip
        if(ai.dealer){
            drawImageFromSpriteSheetWithRotation(chips2Pic, 30-1, 0, 30, 30, CANVAS_WIDTH/2+width.width*1.2, CANVAS_HEIGHT/2-CARD_PIC_HEIGHT/2-largeFont*2, 30, 30);
        }else{
            drawImageFromSpriteSheetWithRotation(chips2Pic, 30-1, 0, 30, 30, CANVAS_WIDTH/2+width.width, CANVAS_HEIGHT/2+CARD_PIC_HEIGHT/2, 30, 30);
        }
    }

    this.deal = function(){

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
        }
    }

    this.flop = function(){
        this.board.push(deck.pop());
        // this.board.push(deck.pop());
        // this.board.push(deck.pop());
    }

    this.turnAndRiver = function(){
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
        this.pot += human.betAmount + ai.betAmount;
        human.betAmount = 0;
        ai.betAmount = 0;
        human.bet = 0;
        ai.bet = 0;
        table.bet = 0;
    }


    this.seeNext = function(){
        this.pushBets();

        turn = "ai";
        if(ai.dealer){
            turn = "human";
        }
        
        if(this.board.length == 0){
            stage = -1;

            setTimeout(() => { 
                table.flop();
                setTimeout(() => { 
                    table.flop();
                    setTimeout(() => { 
                        table.flop();
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
                table.turnAndRiver();
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

    // bet amount is amount displayed bet is actual bet
    this.betAmount = 0;
    this.bet = 0;
    this.allIn = false;

    this.raise = function(amount, display){
        let totalChips = this.chips + this.bet;

        this.chips = totalChips - amount;
        this.betAmount = amount;
        this.bet = amount;

        stage = 0;

        if(amount > table.bet){
            table.bet = amount;
        }
        
        if(totalChips - amount <= 0){
            // this.allIn = true;
            this.chips = 0;
            this.betAmount = totalChips;
            this.bet = totalChips;
            table.bet = totalChips;
            amount = totalChips;
        }

        if(display){
            command = ["A.I. Raises To:", "$"+String(amount)];
        }
    }

    this.call = function(display){ 
        if(table.bet > this.chips + this.bet){
            this.betAmount += this.chips;
            this.bet += this.chips;
            this.chips = 0;

            this.allIn = true;
            // all in
            return 1;
        }

        if(ai.chips <= 0 || human.chips <= 0){
            ai.allIn = true;
        }

        stage = 1;

        let falseCall = false;

        if(table.bet - this.bet <= 0){
            falseCall = true;
        }

        this.chips -= table.bet - this.bet;
        this.betAmount += table.bet - this.bet;
        this.bet += table.bet - this.bet;

        if(display && falseCall == false){
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

        colorRect(CANVAS_WIDTH/2+CARD_PIC_WIDTH*1.5, 25, CARD_PIC_WIDTH*2.35, CARD_PIC_HEIGHT, "WHITE");
        let width;
        let font = largeFont*1.5;

        for (var i = 0; i < command.length; i++) {
            width = measureText(command[i], font, font + "px customfont");
            
            drawText("black", + font + "px customfont", command[i], 
                CANVAS_WIDTH/2+CARD_PIC_WIDTH*1.5+10, 15+(i+1)*(font+20));
        }

        setTimeout(() => { 
            if(stop){
                command = -1;
            }
        }, 1000);
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

    human.betAmount = 0;
    ai.betAmount = 0;
    human.bet = 0;
    ai.bet = 0;

    if(ai.chips <= 0){
        ai.chips = 1000;
    }

    if(human.chips <= 0){
        human.chips = 1000;
    }

    pushBlinds();
    scene = 0;
    stage = 0;
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


