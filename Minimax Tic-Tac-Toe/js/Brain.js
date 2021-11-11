var currentPlayer = 2;
var ai = 1;
var human = 2;
var gameOver = false;

function getBestMove(){
		var tempBoard = new Board(brickGrid.array)
		var children = getChildren(ai,tempBoard);
		var maxEval = -Infinity;
		var move;

		for (var i = 0; i < children.length; i++) {
			var currentEval = miniMax(children[i], 0,-Infinity,Infinity, false);
			children[i].score = currentEval;
			if(currentEval > maxEval){
				maxEval = currentEval;
				move = children[i];
			}	
		}

		brickGrid.array = move.array;
		currentPlayer = human;
}

function miniMax(board, depth,alpha, beta, isMaximising){
	var terminalScore = checkForWinner(board);//last time a board will be called it is an end state
	if(terminalScore != undefined){
		return terminalScore;
	}


	if(isMaximising){
		var children = getChildren(ai,board);
		var maxEval = -Infinity;

		for (var i = 0; i < children.length; i++) {
			var currentEval = miniMax(children[i], depth+1, alpha, beta, false);
			children[i].score = currentEval;
			maxEval = Math.max(maxEval,currentEval)
			alpha = Math.max(alpha,currentEval)
			if(beta <= alpha){
				break;
			}
		}
		return maxEval;	
	}else{
		var children = getChildren(human,board);
		var minEval = Infinity;

		for (var i = 0; i < children.length; i++) {
			var currentEval = miniMax(children[i], depth+1, alpha, beta, true);
			children[i].score = currentEval;
			minEval = Math.min(minEval,currentEval)
			beta = Math.min(beta,currentEval)
			if(beta <= alpha){
				break;
			}
		}
		return minEval;	
	}
}

function getChildren(player, board){
	var children = [];

	var tempBoard = [];

		for(var i = 0; i < 3; i++) {
		for(var j = 0; j < 3; j++) {
			if(board.array[i][j].type == 0){
				tempBoard = new Board(deepCopy(board.array));
				tempBoard.array[i][j].type = player;
				children.push(tempBoard);

			}

		}
	}

	return children;
}


function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}
// Helper function to deal with Objects
function deepCopyObject(obj){
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj;
}

function getWinner(board){
	var temp = checkForWinner(board);

	if(temp == 10){
		console.log("X WINS!");
		return 1
	}
	if(temp == 0){
		console.log("TIE!");
		return 1
	}
	if(temp == -10){
		console.log("O WINS!");
		return 1
	}

	return undefined;
}

function checkForWinner(board){
	let winner;
	//horizontal check 
	for (var i = 0; i < BRICK_ROWS; i++) {
		if(board.array[0][i].type == board.array[1][i].type && board.array[0][i].type == board.array[2][i].type
			&& board.array[0][i].type !== 0){
			// console.log(board.array[0][i].type+" WINS! horizontaly")
			winner = board.array[0][i].type;
		}
	}
	//vertical check 
	for (var i = 0; i < BRICK_COLS; i++) {
		if(board.array[i][0].type == board.array[i][1].type && board.array[i][0].type == board.array[i][2].type
			&& board.array[i][0].type !== 0){
			// console.log(board.array[i][0].type+" WINS! verticaly")
			winner = board.array[i][0].type
		}
	}
	//diagonal check 
		if(board.array[0][0].type == board.array[1][1].type && board.array[0][0].type == board.array[2][2].type
			&& board.array[0][0].type !== 0){
			// console.log(board.array[0][0].type+" WINS! diagonaly")
			winner = board.array[0][0].type
		}
		if(board.array[2][0].type == board.array[1][1].type && board.array[2][0].type == board.array[0][2].type
			&& board.array[2][0].type !== 0){
			// console.log(board.array[2][0].type+" WINS! diagonaly")
			winner = board.array[2][0].type
		}

		let availibleSpots = [];
		for(i=0;i<BRICK_COLS;i++){
		for(j = 0;j<BRICK_ROWS;j++){
			if(board.array[i][j].type == 0){
				availibleSpots.push(board.array[i][j])
			}
		}
		}

		if(winner == undefined && availibleSpots.length == 0){
			return 0;
		}else if(winner == 2){
			return -10;
		}else if(winner == 1){
			return 10;
		}else{
			undefined;
		}

}