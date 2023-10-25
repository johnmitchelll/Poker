var canvas;
var canvasContext;

var elaspedTime;
var prevTotalTime;
var totalTime;
var startTime;
var fpsClock;
var fps;

window.onload = async function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	await start();
	
    var framesPerSecond = 30;
	setInterval(function(){
		updateTimeSteps(); 
		drawAll(); 
		playHand();
	},1000/framesPerSecond);
}

async function start(){
	let localStorageUserData = localStorage.getItem("userData");


	if(localStorageUserData == null){
		window.location.href = "../signin";
		return;
	}

	localStorageUserData = JSON.parse(localStorageUserData);
	userData = await readUser(localStorageUserData.username, localStorageUserData.password);
	userData = userData.userDB;
	userData.password = localStorageUserData.password;

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

	canvas.width  = 1000;
	canvas.height = 675;

	startTime = Date.now();

	deck.newDeck();


	var retrievedEnvState = localStorage.getItem("envState");
	if(retrievedEnvState != 'undefined'){
		retrievedEnvState = JSON.parse(retrievedEnvState);
		setState(retrievedEnvState);
	}
}



function setState(retrievedEnvState){

	for (let i = 0; i < retrievedEnvState.human.cards.length; i++) {
		human.cards.push(new Card());
	}
	for (let i = 0; i < retrievedEnvState.ai.cards.length; i++) {
		ai.cards.push(new Card());
	}
	for (let i = 0; i < retrievedEnvState.table.board.length; i++) {
		table.board.push(new Card());
	}

	updateObjectVariables(deck, retrievedEnvState.deck);
	updateObjectVariables(table, retrievedEnvState.table);
	updateObjectVariables(ai, retrievedEnvState.ai);
	updateObjectVariables(human, retrievedEnvState.human);
	updateObjectVariables(lazyBrain, retrievedEnvState.lazyBrain);
	scene = retrievedEnvState.scene;
	stage = retrievedEnvState.stage;
	turn = retrievedEnvState.turn;
	err = retrievedEnvState.err;
	command = retrievedEnvState.command;
	prevWindowDimentions = retrievedEnvState.prevWindowDimentions;
	betKnobRelativePos = retrievedEnvState.betKnobRelativePos;
	if(retrievedEnvState.sessionData){
		sessionData = retrievedEnvState.sessionData;
	}
	
	console.log(retrievedEnvState);
}

function updateObjectVariables(obj, newValues) {
    for (let key in obj) {

        // Check if the property is not a function and is included in newValues
        if (obj.hasOwnProperty(key) && typeof obj[key] !== 'function' && newValues.hasOwnProperty(key)) {

			if(Array.isArray(newValues[key])){
				for (let i = 0; i < newValues[key].length; i++) {
					updateObjectVariables(obj[key][i], newValues[key][i]);
				}
				continue;
			}

			if(typeof obj[key] === 'object'){
				updateObjectVariables(obj[key], newValues[key]);
				continue;
			}

            obj[key] = newValues[key];
        }
    }
}