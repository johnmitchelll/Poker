

var card1 = new Audio('../sounds/card1.mp3');
var card2 = new Audio('../sounds/card2.mp3');
var card3 = new Audio('../sounds/card3.mp3');
var chips1 = new Audio('../sounds/chips1.mp3');
var chips2 = new Audio('../sounds/chips2.mp3');
var chips3 = new Audio('../sounds/chips3.mp3');
var chips4 = new Audio('../sounds/chips4.mp3');
var chips5 = new Audio('../sounds/chips5.mp3');
var shuffle = new Audio('../sounds/shuffle.mp3');
var check = new Audio('../sounds/check.mp3');


function playChipNoise(){
	let seed = Math.random();

	if(seed < 0.2){
		chips1.play();
	}else if(seed >= 0.2 && seed < 0.4){
		chips2.play();
	}else if(seed >= 0.4 && seed < 0.6){
		chips3.play();
	}else if(seed >= 0.6 && seed < 0.8){
		chips4.play();
	}else if(seed >= 0.8){
		chips5.play();
	}
}

function playCardNoise(){
	let seed = Math.random();

	if(seed < 0.3){
		card1.play();
	}else if(seed >= 0.3 && seed < 0.6){
		card2.play();
	}else if(seed >= 0.6){
		card3.play();
	}
}