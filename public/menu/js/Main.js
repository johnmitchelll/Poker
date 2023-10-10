
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	loadImages();
	start();

    var framesPerSecond = 30;
	setInterval(function(){
		drawAll(); 
		playHand();
	},1000/framesPerSecond);
}

function start(){
	deck = new Deck();
	table = new Table();
	ai = new Player();
	human = new Player();
	lazyBrain = new LazyBrain();

	human.dealer = true;
	if(Math.random() > 0.5){
		ai.dealer = true;
		human.dealer = false;
	}

	deck.newDeck();

	cardsRef.style.display = "none";
}



