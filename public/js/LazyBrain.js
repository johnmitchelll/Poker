

function LazyBrain(){
    // find the win percentage
    // if lower than threshold, fold, if higher bet, if too close to threshold no bet

    this.threshold = 0.3;
    this.actionMargin = 0.1;
	this.agression;

    this.makeDecision = function(phase){

        turn = "human";
		this.agression = Math.random()/2.5 - 1/5;
		let decision;
		let impliedBettingStrategy;
        
        if(phase == "preflop"){
            let aiHandValue = getPreflopValue(ai);
            let humanHandValue = getPreflopValue(human);
			let aiHandStrength = aiHandValue - humanHandValue
			impliedBettingStrategy = aiHandStrength / handRanking.length;

			decision = makeDecisionPreflop(impliedBettingStrategy);
        }

		if(phase == "postflop"){
			let postflopValue = -1;

			if(table.board.length == 3){
				postflopValue = getPostFlopValue();
			}else if(table.board.length == 4){
				postflopValue = getPostFlopValue(true);
			}else if(table.board.length == 5){
				postflopValue = getPostFlopValue(false, true);
			}

			impliedBettingStrategy = postflopValue * 2 - 1;

			decision = makeDecisionPreflop(impliedBettingStrategy);
		}

		// console.log(impliedBettingStrategy)


		// fold
		if(decision == -1){
			command = ["A.I. Folds"];
			human.chips += ai.bet + human.bet + table.pot;
			human.betAmount = 0;
			ai.betAmount = 0;
			table.pot = 0;
			ai.cards = [];
			stage = 3;
			return;
		}
		
		// check
		if(decision == -2){
			command = ["A.I. Checks"];
			
			if(ai.dealer){
				table.seeNext();
			}

			return;
		}

		// call
		if(decision == -3){
			command = ["A.I. Calls"];
			ai.call();

			// console.log(stage, scene, human.straddle)

			// if ai calls for either its all in or human all in
			if(stage == -1 || scene == -1){
				console.log("stuck scene")
				return;
			}

			if(scene == 2 || ai.dealer){
				table.seeNext();
			}					

			if(human.straddle){
				human.straddle = false;
				return;
			}

			if(human.straddle == false && stage == 1 && table.bet != table.minBet){
				table.seeNext();
			}

			return;
		}

		// raise
		ai.raise(decision, true);
    }
}


function getPreflopValue(player){
    let rawCard = organizeCardsLTG([player.cards[0].card, player.cards[1].card], true);
	let card = [rawCard[0].slice(0,-1), rawCard[1].slice(0,-1),"u"];
	let index = 0;

	// if the suits r the same lol
	if(rawCard[0][rawCard[0].length-1] == rawCard[1][rawCard[1].length-1]){
		card[2] = "s";
	}

	for (var i = 0; i < handRanking.length; i++) {
		for (var j = 0; j < 3; j++) {
			if(handRanking[i][j] != card[j]){
				break;
			}

			if(j == 2){
				index = i;
			}
		}
	}

	return handRanking.length - index;
}




function getPostFlopValue(river, finalBets){

	// against these run outs
	let wins = [];
	let losses = [];
	let chops = [];

	let aiHand = deepCopy(ai.cards);
	let humanHand = deepCopy(human.cards);

	let deckCopy = deepCopy(deck.cards);

	if(finalBets){
		aiHand = table.board.concat(aiHand);
		humanHand = table.board.concat(humanHand);

		let result = getWinner(humanHand, aiHand, true);

		if(result.winner == "hand1"){
			return 0;
		}

		return Math.random()/2 + 0.5;
	}


	for (var i = 0; i < deckCopy.length; i++) {

		if(river){
			getOutcomeOfInstance(humanHand, aiHand, deckCopy, losses, wins, chops, river, i, 0)
			continue;
		}

		for (var j = 0; j < deckCopy.length; j++) {
			if(i == j){
				continue;
			}

			getOutcomeOfInstance(humanHand, aiHand, deckCopy, losses, wins, chops, river, i, j)
		}	
	}

	return wins.length / (losses.length + wins.length);
}

function getOutcomeOfInstance(humanHand, aiHand, deckCopy, losses, wins, chops, river, i, j){
	let humanPossibleHand = table.board.concat(humanHand.concat([deckCopy[i], deckCopy[j]]));
	let aiPossibleHand = table.board.concat(aiHand.concat([deckCopy[i], deckCopy[j]]));

	if(river){
		humanPossibleHand = table.board.concat(humanHand.concat([deckCopy[i]]));
		aiPossibleHand = table.board.concat(aiHand.concat([deckCopy[i]]));
	}

	let result = getWinner(humanPossibleHand, aiPossibleHand, true);

	if(result.winner == "hand1"){
		losses.push([deckCopy[i].card, deckCopy[j].card]);
		return;
	}else if(result.winner == "hand2"){
		wins.push([deckCopy[i].card, deckCopy[j].card]);
		return;
	}

	chops.push([deckCopy[i].card, deckCopy[j].card]);
}



function makeDecisionPreflop(impliedBettingStrategy){

	let equityLossAllowance;

	// console.log("////////////////////////////////")

	// console.log("impliedBettingStrategy: " + impliedBettingStrategy);

	if(impliedBettingStrategy < 0){
		if(ai.dealer && table.bet == table.minBet && scene == 1){
			// check
			return -2;
		}

		if(table.bet == 0 && stage == 1){
			// check
			return -2;
		}

		// if human puts us all in then we fold when we are down.
		if(table.bet >= ai.chips + ai.bet){
			return -1;
		}

		equityLossAllowance = (table.minBet*4+ai.bet)/Math.min(table.bet, ai.chips+ai.bet);
		equityLossAllowance *= -1;
		equityLossAllowance = Math.max(equityLossAllowance, -1);
		// console.log("equityLossAllowance: " + equityLossAllowance);
		
		if(Math.random() < 0.2 && scene == 2 && impliedBettingStrategy > equityLossAllowance){
			// call postflop
			return -3;
		}

		if(Math.random() < 0.6 && scene == 1  && impliedBettingStrategy > equityLossAllowance){
			// call preflop
			return -3;
		}

		// fold
		return -1;
	}



	// calculating this because yes, we have the odds, but is our equity enough to win in the long run
	equityLossAllowance = Math.min(table.bet, ai.chips+ai.bet) / Math.max(table.pot+ai.bet, table.minBet*8)
	equityLossAllowance = equityLossAllowance*2 - 1;

	// we need to go all in or fold
	if(table.bet >= ai.chips + ai.bet){
		// console.log("equityLossAllowance: " + equityLossAllowance);
		if(impliedBettingStrategy >= 0.7){
			// console.log("we have the odds")
			// call
			return -3;
		}

		if(lazyBrain.agression + impliedBettingStrategy >= equityLossAllowance){
			// call
			return -3;
		}

		// fold
		return -1;
	}

	// raise
	let bettingRange = lazyBrain.agression + impliedBettingStrategy - lazyBrain.threshold;
	let seed = Math.random();

	// console.log("bettingRange: " + bettingRange)
	// console.log("seed:" + seed)

	// choosing our raise amount
	if(bettingRange > 0 && human.chips > 0 && seed < 0.8){
		let betAmount = (table.bet*2) * (bettingRange/2+1);

		if(table.bet == 0){
			// open bet
			betAmount = table.pot * bettingRange;
			betAmount = Math.max(betAmount, table.minBet);
		}

		// get the nearest multiple of 5
		return Math.round(Math.ceil(betAmount) / 5) * 5;
	}

	// if we are choosing to play it cool and we have the option too
	if(table.bet == 0 || (table.bet == table.minBet && scene == 1 && ai.dealer)){
		// check
		return -2;
	}

	// if the bet isnt too big or we just have the odds
	if(impliedBettingStrategy >= 0.5){
		// console.log("we have the odds")
		// call
		return -3;
	}else if(lazyBrain.agression + impliedBettingStrategy >= equityLossAllowance){
		// console.log("equityLossAllowance: " + equityLossAllowance);
		// call
		return -3;
	}

	// console.log("equityLossAllowance: " + equityLossAllowance);
	return -1
}


var handRanking = [["A","A","u"],["K","K","u"],["Q","Q","u"],["A","K","s"],
				   ["J","J","u"],["A","Q","s"],["K","Q","s"],["A","J","s"],["K","J","s"],
				   ["10","10","u"],["A","K","u"],["A","10","s"],["Q","J","s"],["K","10","s"],
				   ["Q","10","s"],["J","10","s"],["9","9","u"],["A","Q","u"],["A","9","s"],
				   ["K","Q","u"],["8","8","u"],["K","9","s"],["10","9","s"],["A","8","s"],
				   ["Q","9","s"],["J","9","s"],["A","J","u"],["A","5","s"],["7","7","u"],
				   ["A","7","s"],["K","J","u"],["A","4","s"],["A","6","s"],["Q","J","u"],
				   ["6","6","u"],["K","8","s"],["10","8","s"],["A","2","s"],["9","8","s"],
				   ["J","8","s"],["A","10","u"],["Q","8","s"],["K","7","s"],["K","10","u"],
				   ["5","5","u"],["J","10","u"],["8","7","s"],["Q","10","u"],["4","4","u"],
				   ["2","2","u"],["3","3","u"],["K","6","s"],["9","7","s"],["K","5","s"],
				   ["7","6","s"],["10","7","s"],["K","4","s"],["K","3","s"],["K","2","s"],
				   ["Q","7","s"],["8","6","s"],["6","5","s"],["J","7","s"],["5","4","s"],
				   ["Q","6","s"],["7","5","s"],["9","6","s"],["Q","5","s"],["6","4","s"],
				   ["Q","4","s"],["Q","3","s"],["10","9","u"],["10","6","s"],["Q","2","s"],
				   ["A","9","u"],["5","3","s"],["8","5","s"],["J","6","s"],["J","9","u"],
				   ["K","9","u"],["J","5","s"],["Q","9","u"],["4","3","s"],["7","4","s"],
				   ["J","4","s"],["J","3","s"],["9","5","s"],["J","2","s"],["6","3","s"],
				   ["A","8","u"],["5","2","s"],["10","5","s"],["8","4","s"],["10","4","s"],
				   ["10","3","s"],["4","2","s"],["10","2","s"],["9","8","u"],["10","8","u"],
				   ["A","5","u"],["A","7","u"],["7","3","s"],["A","4","u"],["3","2","s"],
				   ["9","4","s"],["9","3","s"],["J","8","u"],["A","3","u"],["6","2","s"],
				   ["9","2","s"],["K","8","u"],["A","6","u"],["8","7","u"],["Q","8","u"],
				   ["8","3","s"],["A","2","u"],["8","2","s"],["9","7","u"],["7","2","s"],
				   ["7","6","u"],["K","7","u"],["6","5","u"],["10","7","u"],["K","6","u"],
				   ["8","6","u"],["5","4","u"],["K","5","u"],["J","7","u"],["7","5","u"],
				   ["Q","7","u"],["K","4","u"],["K","3","u"],["K","2","u"],["9","6","u"],
				   ["6","4","u"],["Q","6","u"],["5","3","u"],["8","5","u"],["10","6","u"],
				   ["Q","5","u"],["4","3","u"],["Q","4","u"],["Q","3","u"],["Q","2","u"],
				   ["7","4","u"],["J","6","u"],["6","3","u"],["J","5","u"],["5","2","u"],
				   ["J","4","u"],["J","3","u"],["4","2","u"],["J","2","u"],["8","4","u"],
				   ["10","5","u"],["10","4","u"],["10","3","u"],["10","2","u"],["3","2","u"],
				   ["7","3","u"],["6","2","u"],["9","4","u"],["9","3","u"],["9","2","u"],
				   ["8","3","u"],["8","2","u"],["7","2","u"]];