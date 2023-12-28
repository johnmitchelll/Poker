
var order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var suitOrder = ["s", "c", "d", "h"];
var handOrder = ["Royal Flush", "Strait Flush", "Four of A Kind", "Full House", "Flush", 
				"Strait", "Three of A Kind", "Two Pair", "One Pair", "High Card"];

function getWinner(hand1Input, hand2Input, doNotDisplay){
	let hand1 = deepCopy(hand1Input);
	let hand2 = deepCopy(hand2Input);

	// if we give the hand as arr of card objects
	if(hand1[0].card || hand2[0].card){
		for (var i = 0; i < hand1.length; i++) {
			let card1 = hand1[i].card;

			if(hand2[i]){
				let card2 = hand2[i].card;
				hand2[i] = card2;
			}
			
			hand1[i] = card1;
		}
	}


	let best1 = bestFive(hand1);
	let best2 = bestFive(hand2);
	let rank1 = handOrder.indexOf(best1.message);
	let rank2 = handOrder.indexOf(best2.message);

	// make sure that we always get the win screen
	timers[2] = 0;

	let us = "p1";
	let them = "p2";
	if(socketData.game.p1.id == socketData.oponent.id){
		us = "p2";
		them = "p1";
	}

	if(rank1 != rank2){
		if(rank1 < rank2){
			if(!doNotDisplay){

				command = getCommandFromWin(socketData.game[us].name, best1.message);
			}
			
			return {winner:"hand1", rank: rank1};
		}

		if(!doNotDisplay){
			command = getCommandFromWin(socketData.game[them].name, best2.message);
		}
		
		return {winner:"hand2", rank: rank2};
	}

	for (var i = 0; i < best1.cards.length; i++) {
		if(best1.cards[i] > best2.cards[i]){
			if(!doNotDisplay){
				command = getCommandFromWin(socketData.game[us].name, best1.message, getCardNameFromNumber(best1.cards[i]), i);
			}

			return {winner:"hand1", rank: rank1};
		}
		if(best1.cards[i] < best2.cards[i]){
			if(!doNotDisplay){
				command = getCommandFromWin(socketData.game[them].name, best2.message, getCardNameFromNumber(best2.cards[i]), i);
			}
			
			return {winner:"hand2", rank: rank2};
		}
	}

	if(!doNotDisplay){
		command = ["Chop Cheese"];
	}
	
	return {winner:"chop", rank: rank1};
}

function bestFive(hand){
	// royal flush, strait flush, four, full house, flush, strait, three, two pair, one, high	
	let outcome = {message:"", cards:[]};;
	hand = organizeCardsLTG(hand);

	let lowAceHand = deepCopy(hand);
	setLowAceHand(lowAceHand);
	lowAceHand = organizeCardsLTG(lowAceHand);

	let flush = isFlush(hand);
	flush = numerizeHand(flush);

	if(flush){
		flush.sort(function(a, b){return b - a});
	}

	 let highAceStrait = longestStrait(hand);
	 let lowAceStrait = longestStrait(lowAceHand);

	 let strait = lowAceStrait;

	 if(highAceStrait){
	 		strait = highAceStrait;
	 }

	let bestPairs = pairsInHand(hand);

	let bestFiveCards = getHighCards(bestPairs.message, numerizeHand(hand), bestPairs.cards);

	// royal 
	if(flush && strait.length >= 5 && strait.lastCard == 14){
		return {message:"Royal Flush", cards:strait}
	}

	// strait flush
	if(flush && strait.length >= 5){
		return {message:"Strait Flush", cards:strait}
	}

	// four
	if(bestPairs.message == "four"){
		return {message:"Four of A Kind", cards:bestFiveCards}
	}	

	// full house
	if(bestPairs.message == "boat"){
		return {message:"Full House", cards:bestPairs.cards}
	}

	// flush
	if(flush){
		return {message:"Flush", cards:flush}
	}

	// strait
	if(strait){
		return {message:"Strait", cards:strait}
	}
 
 	// three, two, one pair(s)
	if(bestPairs.cards.length > 0){
		return {message:bestPairs.message, cards:bestFiveCards}
	}

	// return highcard
	return {message:"High Card", cards:bestFiveCards}
}


function getHighCards(outcome, hand, cards){
	// four, three, two, one, high card
	let highCards = deepCopy(hand);
	let result = deepCopy(cards);

	if(outcome == ""){
		highCards = selectHighCards(highCards, undefined, 5);
	}

	if(outcome == "Four of A Kind"){
		highCards = selectHighCards(highCards, cards[0], 1);
	}

	if(outcome == "Three of A Kind"){
		highCards = selectHighCards(highCards, cards[0], 2);
	}

	if(outcome == "Two Pair"){
		highCards = removeElementFromArray(highCards, cards[0]);
		highCards = removeElementFromArray(highCards, cards[1]);
		highCards.sort(function(a, b){return b - a});
		highCards.length = 1;
	}

	if(outcome == "One Pair"){
		highCards = selectHighCards(highCards, cards[0], 3);
	}

	return result.concat(highCards);
}	

function selectHighCards(list, card, len){
		list = removeElementFromArray(list, card);
		list.sort(function(a, b){return b - a});
		list.length = len;

		return list;
}


function bestPairs(pairs){
	// four of a kind, full house, three, two pair, single pair

	let outcome = {message:"", cards:[]};
	let pairsOfLength = [[],[],[]];

	for (var i = 0; i < pairs.length; i++) {

		// make them numbers for convienence 
		for (var j = 0; j < pairs[i].length; j++) {
			pairs[i][j] = getNumberFromCard(pairs[i][j]);
		}

		pairsOfLength[pairs[i].length-2].push(pairs[i][0]);
	}

	// sort for convienence
	for (var i = 0; i < pairsOfLength.length; i++) {
		pairsOfLength[i].sort(function(a, b){return b - a});
	}



	// four
	if(pairsOfLength[2].length > 0){
		outcome = {message:"Four of A Kind", cards:[pairsOfLength[2][0]]};
		return outcome;
	}

	// full house
	if((pairsOfLength[1].length > 0 && pairsOfLength[0].length > 0) || 
		pairsOfLength[1].length > 1){

		let bestThreePair = pairsOfLength[1][0];
		let bestTwoPair = pairsOfLength[0][0];
		let potentialTwoPairs = deepCopy(pairsOfLength[0]);

		if(pairsOfLength[1].length > 1){

			for (var i = 1; i < pairsOfLength[1].length; i++) {
				potentialTwoPairs.push(pairsOfLength[1][i]);
			}

			potentialTwoPairs.sort(function(a, b){return b - a});

			bestTwoPair = potentialTwoPairs[0];
		}

		outcome = {message:"Full House", cards:[bestThreePair, bestTwoPair]};
		return outcome;
	}

	// three
	if(pairsOfLength[1].length > 0){
		outcome = {message:"Three of A Kind", cards:[pairsOfLength[1][0]]};
		return outcome;
	}

	// two pair
	if(pairsOfLength[0].length > 1){
		outcome = {message:"Two Pair", cards:[pairsOfLength[0][0], pairsOfLength[0][1]]};
		return outcome;
	}


	// one pair
	if(pairsOfLength[0].length == 1){
		outcome = {message:"One Pair", cards:[pairsOfLength[0][0]]};
		return outcome;
	}

	return outcome;
}

function pairsInHand(hand){
	let copy = [];
	let pairs = [];

	// init copy
	for (var i = 0; i < hand.length; i++) {
		copy.push(hand[i].slice(0, hand[i].length - 1));
	}

	for (var i = 0; i < hand.length; i++) {

		let pair = [copy[i]];

		let skip = false;
		for (var j = 0; j < pairs.length; j++) {
			if(pairs[j].includes(copy[i])){
				skip = true;
			}
		}

		if(skip){
			continue;
		}

		for (var j = 0; j < hand.length; j++) {
			if(j == i){
				continue;
			}

			if(copy[i] == copy[j]){
				pair.push(copy[j]);
			}
		}

		if(pair.length > 1){
			pairs.push(pair);
		}
	}

	return bestPairs(pairs);
}

function isFlush(hand){
	// check for flush
	// suit count: spade, club, diamond, heart
	let suitCount = [[],[],[],[]];

	for (var i = 0; i < hand.length; i++) {

		for (var j = 0; j < suitOrder.length; j++) {
			if(hand[i][hand[i].length-1] == suitOrder[j]){
				suitCount[j].push(hand[i]);

				if(suitCount[j].length >= 5){	
					return suitCount[j];
				}
			}
		}
	}

	return false;
}

function longestStrait(hand){
	let copy = [];
	let runCount;
	let maxRunCount = {length: 0, lastCard: undefined};

	// init copy
	for (var i = 0; i < hand.length; i++) {
		copy.push(hand[i].slice(0, hand[i].length - 1));
	}

	copy = deleteDuplicates(copy);

	for (var i = 0; i < hand.length; i++) {

		runCount = 0;
		
		for (var j = order.indexOf(copy[i]); j < order.length; j++) {

			if(copy[i+runCount] == order[j]){
				runCount++;
				continue;
			}

			break;
		}

		if(runCount > maxRunCount.length){	
			maxRunCount.length = runCount;
			maxRunCount.lastCard = copy[i+runCount-1];
		}
	}

	if(maxRunCount.length < 5){
		return false;
	}

	return maxRunCount.lastCard;
}

function organizeCardsLTG(hand, gtl){
	let numerized = deepCopy(hand);
	let suits = new Array(hand.length);

	for (var i = 0; i < numerized.length; i++) {

		// add the suits to the suits list
		suits[i] = numerized[i][numerized[i].length-1];

		numerized[i] = getNumberFromCard(numerized[i].slice(0, numerized[i].length - 1));

		numerized[i] = parseInt(numerized[i]);
	}

	for(var i = 0; i < numerized.length; i++){
     	for(var j = 0; j < (numerized.length - i - 1); j++){

    		if(numerized[j] > numerized[j + 1] && !gtl){
    			swap(numerized, j);
    			swap(suits, j);
    		}


    		if(numerized[j] < numerized[j + 1] && gtl){
				swap(numerized, j);
    			swap(suits, j);
    		}
    	}
    }

	for (var i = 0; i < numerized.length; i++) {
		if(numerized[i] == 11){ numerized[i] = "J"; }
		if(numerized[i] == 12){ numerized[i] = "Q"; }
		if(numerized[i] == 13){ numerized[i] = "K"; }	
		if(numerized[i] == 14){ numerized[i] = "A"; }

		numerized[i] = String(numerized[i]);
		numerized[i] += suits[i];
	}

	return numerized;
}

function swap(arr, j){
	let temp = arr[j];
    arr[j] = arr[j+1];
    arr[j+1] = temp;
}

function getNumberFromCard(card){
	if(!card){
		return;
	}

	if(card == "J"){ return 11; }
	if(card == "Q"){ return 12; }
	if(card == "K"){ return 13; }	
	if(card == "A"){ return 14; }

	return parseInt(card);
}

function getCardFromNumber(card){
	if(card == 11){ return "J"; }
	if(card == 12){ return "Q"; }
	if(card == 13){ return "K"; }	
	if(card == 14){ return "A"; }

	return String(card);
}

function numerizeHand(hand){
	if(!hand){
		return;
	}

	let copy = deepCopy(hand);

	for (var i = 0; i < hand.length; i++) {
		copy[i] = getNumberFromCard(hand[i].slice(0, hand[i].length - 1));
	}

	return copy;
}

function deleteDuplicates(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }
  return result;
}

function removeElementFromArray(array, element) {
	let arr = deepCopy(array);
	
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] === element) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

function setLowAceHand(lowAceHand){
	for (var i = 0; i < lowAceHand.length; i++) {
		if(lowAceHand[i][0] == "A"){
			lowAceHand[i] = "1" + lowAceHand[i][1];
		}
	}
}

function getCardNameFromNumber(card){
	if(card == 11){ return "Jack"; }
	if(card == 12){ return "Queen"; }
	if(card == 13){ return "King"; }	
	if(card == 14){ return "Ace"; }

	return String(card);
}

function getCommandFromWin(winner, type, kicker, i){
	let result = [winner, "Wins:"];

	result.push(type);

	if(!kicker){
		return result;
	}

	result.push(kicker);

	if(type == "Two Pair" || type == "Full House"){
		if(i > 1){
			result[3] += " Kicker";
			return result;
		}
	}else if(i > 0){
		result[3] += " Kicker";
		return result;
	}

	// i == 0
	if(type == "Four of A Kind" || type == "Three of a Kind" || type == "One Pair"){
		result[3] += "\'s";
		return result;
	}

	result[3] += " High";
	return result;
	
}

