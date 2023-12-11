

function makeAIDecision(){

    let probability = 0;

    if(Math.random() > 0.5){
        probability = 1/3;
    }

    let seed = Math.random();

    console.log("seed "+seed)
    console.log("scene "+scene)

    // ai is player one
    if(dealer != "ai"){
        console.log("probability " + probability)

        if(ai.card.card == "J"){
            // fold, if bet into or if luck > probability
            if(scene == 1){
                console.log("pass jack")
                winner = "human";
                check.play();
                command = "A.I. Passes, Human Wins";
                scene = 2;
                timer = -1;
                return;
            }

            // bet 1/3 of the time
            if(seed < probability){
                ai.betAction();
                command = "A.I. Bets";
                playChipNoise();
                timer = 40;
                turn = "human";
                scene = 1;
                console.log("bet jack")
                return;
            }

            console.log("pass jack")
            turn = "human";
            check.play();
            timer = 40;
            command = "A.I. Passes";
        }

        if(ai.card.card == "K"){
            // bet if bet into
            if(scene == 1){
                ai.betAction();
                command = "A.I. Bets";
                playChipNoise();
                table.showDown();
                console.log("bet king required")
                return;
            }

            // bet if we get lucky, basically a 50/50 shot
            if(scene == 0 && seed < 3*probability){
                ai.betAction();
                command = "A.I. Bets";
                playChipNoise();
                timer = 40;
                turn = "human";
                scene = 1;
                console.log("bet king not required")
                return;
            }
            

            // check;
            check.play();
            command = "A.I. Passes";
            timer = 40;
            turn = "human";
            console.log("pass king")
        }

        if(ai.card.card == "Q"){
            // check when we can
            if(scene == 0){
                check.play();
                command = "A.I. Passes";
                timer = 40;
                turn = "human";
                console.log("pass queen")
                return;
            }

            if(scene == 1 && seed < probability+1/3){
                ai.betAction();
                command = "A.I. Bets";
                playChipNoise();
                table.showDown();
                console.log("bet queen")
                return;
            }

            // fold;
            winner = "human";
            check.play();
            command = "A.I. Passes, Human Wins";
            scene = 2;
            timer = -1;
            console.log("fold queen")
        }

        return;
    }

    // ai is player two
    if(ai.card.card == "K"){
        ai.betAction();
        command = "A.I. Bets";
        playChipNoise();

        console.log("bet king")

        if(scene == 1){
            table.showDown();
        }else{
            timer = 40;
            turn = "human";
            scene = 1;
        }
        return;
    }

   
    if(ai.card.card == "Q"){
        if(scene == 0){
            command = "A.I. Passes";
            check.play();
            table.showDown();
            console.log("pass queen")
            return;
        }

        if(seed < 1/3){
            ai.betAction();
            command = "A.I. Bets";
            console.log("bet queen")
            playChipNoise();
            table.showDown();
            return;
        }

        winner = "human";
        check.play();
        command = "A.I. Passes, Human Wins";
        scene = 2;
        timer = -1;
        console.log("fold queen")
    }

    if(ai.card.card == "J"){
        if(scene == 1){
            winner = "human";
            check.play();
            command = "A.I. Passes, Human Wins";
            scene = 2;
            timer = -1;
            console.log("fold jack")
            return;
        }

        if(seed < 1/3){
            ai.betAction();
            command = "A.I. Bets";
            playChipNoise();
            timer = 40;
            turn = "human";
            scene = 1;
            console.log("bet jack")
            return;
        }

        command = "A.I. Passes";
        check.play();
        table.showDown();
        console.log("pass jack")
    }
}