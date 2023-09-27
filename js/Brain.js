	
function Brain(){
	this.strategy = [0, 0, 0];

	this.makeDecision = function(phase){


		if(phase == "preflop"){
			ai.call();
			// console.log(preflop());
		}

		if(phase == "postFlop"){
			ai.call(true);

			getHandOuts();
			handCurrentStrength();
			// console.log(postFlop());
		}

	}
}

/* 
	gather info first:
		outs
		hands that can beat me

*/

function preflop(){
	let rawCard = organizeCardsLTG([ai.cards[0].card, ai.cards[1].card], true);
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

	if(Math.random() < index / handRanking.length){
		return "Hit";
	}

	return "Fold";
}	

function postFlop(){
	if(Math.random() < handCurrentStrength()){
		return "Hit";
	}

	return "Fold";
}

function getHandOuts(){
	// get all possible cards that will make hand better
	// add them to a ranking system and calculate how 
	// likely it is that that rank will occurr

	let aiHand = table.board.concat(ai.cards);
	let ranks = new Array(handOrder.length);
	let length = 0;

	let deckCopy = deepCopy(deck.cards);
	deckCopy = deckCopy.concat(human.cards);

	for (var i = 0; i < deckCopy.length; i++) {

		// only looking ahead two cards if we are post flop
		if(table.board.length == 4){
			
			let possibleHand = aiHand.concat(deckCopy[i]);

			let result1 = getWinner(possibleHand, aiHand);

			if(!ranks[result1.rank]){
				ranks[result1.rank] = [{card:deckCopy[i].card, chance: 1/deckCopy.length}];
			}else{
				ranks[result1.rank].push({card:deckCopy[i].card, chance: 1/deckCopy.length})
			}

			length ++;
		}

		for (var j = 0; j < deckCopy.length; j++) {
			if(i == j){
				continue;
			}

			possibleHand = aiHand.concat([deckCopy[i], deckCopy[j]]);
			result2 = getWinner(possibleHand, aiHand);

			if(!ranks[result2.rank]){
				ranks[result2.rank] = [{card1: deckCopy[i].card, card2:deckCopy[j].card, chance: 1/deckCopy.length * 1/(deckCopy.length-1)}];
			}else{
				ranks[result2.rank].push({card1: deckCopy[i].card, card2:deckCopy[j].card, chance: 1/deckCopy.length * 1/(deckCopy.length-1)})
			}

			length++;
		}
	}

	console.log(ranks)
	return {length: length, ranks: ranks};
}


function handCurrentStrength(){

	// against these hands
	let wins = [];
	let losses = [];
	let chops = [];

	let aiHand = table.board.concat(ai.cards);

	let deckCopy = deepCopy(deck.cards);
	deckCopy = deckCopy.concat(human.cards);

	let runningTotal = 0;

	for (var i = 0; i < deckCopy.length; i++) {
		for (var j = 0; j < deckCopy.length; j++) {
			if(i == j){
				continue;
			}


			for (var e = 0; e < deckCopy.length; e++) {
				if(j == e || i == e){
					continue;
				}


				let possibleHand = table.board.concat([deckCopy[i], deckCopy[j], deckCopy[e]]);
				let result = getWinner(possibleHand, aiHand);

				if(result.winner == "hand1"){
					losses.push([deckCopy[i].card, deckCopy[j].card, deckCopy[e].card]);
					continue;
				}else if(result.winner == "hand2"){
					wins.push([deckCopy[i].card, deckCopy[j].card, deckCopy[e].card]);
					runningTotal++;
					continue;
				}

				chops.push([deckCopy[i].card, deckCopy[j].card, deckCopy[e].card]);
			}
		}	
	}


	console.log("wins: " + wins.length, wins);
	console.log("losses: " + losses.length, losses);
	console.log("chops: " + chops.length, chops);
	console.log("win loss: " + ((wins.length+chops.length)/(wins.length+chops.length+losses.length)));
	// return runningTotal / (lossses.length + wins.length)
}


var handRanking = [["A","A","u"],["A","K","s"],["A","Q","s"],["A","J","s"],
	["K","Q","s"],["A","10","s"],["K","J","s"],["K","K","u"],["K","10","s"],
	["Q","J","s"],["K","9","s"],["Q","10","s"],["Q","9","s"],["J","10","s"],
	["Q","8","s"],  ["J","9","s"],["Q","Q","u"],["A","5","s"],["J","8","s"],
	["10","9","s"],["A","4","s"],["J","7","s"],["10","8","s"],["A","3","s"],
	["10","7","s"],["9","8","s"],["A","2","s"],["10","6","s"],["9","7","s"],
	["J","J","u"],  ["9","6","s"],["8","7","s"],["9","5","s"],["8","6","s"],
	["8","5","s"],["7","6","s"],["8","4","s"],["7","5","s"],["10","10","u"],
	["7","4","s"], [ "6","5","s"],["7","3","s"],["6","4","s"],["6","3","s"],
	["5","4","s"],  ["6","2","s"],["5","3","s"],["9","9","u"],["5","2","s"],
	["4","3","s"],  ["4","2","s"],["3","2","s"],["8","8","u"],["7","7","u"],
	["A","K","u"], ["A","Q","u"],["A","J","u"],["K","Q","u"],["A","10","u"],
	["6","6","u"], ["K","J","u"],["A","9","s"],["K","10","u"],["Q","J","u"],
	["A","8","s"],[ "K","9","u"],["Q","10","u"],["A","7","s"],["K","8","s"],
	["Q","9","u"], ["J","10","u"],["A","6","s"],["5","5","u"],["K","7","s"],
	["Q","8","u"],  ["J","9","u"],["A","5","u"],["K","6","s"],["Q","7","s"],
	["J","8","u"], ["10","9","u"],["A","4","u"],["K","5","s"],["Q","6","s"],
	["J","7","u"], ["10","8","u"],["A","3","u"],["K","4","s"],["Q","5","s"],
	["J","6","s"], ["10","7","u"],["9","8","u"],["A","2","u"],["K","3","s"],
	["Q","4","s"], ["J","5","s"],["10","6","u"],["9","7","u"],["4","4","u"],
	["K","2","s"], ["Q","3","s"],["J","4","s"],["10","5","s"],["9","6","u"],
	["8","7","u"], ["Q","2","s"],["J","3","s"],["10","4","s"],["9","5","u"],
	["8","6","u"], ["J","2","s"],["10","3","s"],["9","4","s"],["8","5","u"],
	["7","6","u"], ["10","2","s"],["9","3","s"],["8","4","u"],["7","5","u"],
	["3","3","u"],  ["9","2","s"],["8","3","s"],["7","4","u"],["6","5","u"],
	["8","2","s"],  ["7","3","u"],["6","4","u"],["7","2","s"],["6","3","u"],
	["5","4","u"],  ["2","2","u"],["6","2","u"],["5","3","u"],["5","2","u"],
	["4","3","u"],  ["4","2","u"],["3","2","u"],["A","9","u"],["A","8","u"],
	["A","7","u"],  ["K","8","u"],["A","6","u"],["K","7","u"],["K","6","u"],
	["Q","7","u"],  ["K","5","u"],["Q","6","u"],["K","4","u"],["Q","5","u"],
	["J","6","u"],  ["K","3","u"],["Q","4","u"],["J","5","u"],["K","2","u"],
	["Q","3","u"], ["J","4","u"],["10","5","u"],["Q","2","u"],["J","3","u"],
	["10","4","u"],["J","2","u"],["10","3","u"],["9","4","u"],["10","2","u"],
	["9","3","u"],  ["9","2","u"],["8","3","u"],["8","2","u"],["7","2","u"]]
