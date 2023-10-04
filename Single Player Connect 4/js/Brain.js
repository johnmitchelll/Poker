var currentPlayer = 1;
var ai = 1;
var human = 2;
var gameOver = false;

function getBestMove(){
		var children = getChildren(ai,brickGrid);
		var maxEval = -Infinity;
		var move;

		for (var i = 0; i < children.length; i++) {
			var currentEval = miniMax(children[i], 0,-Infinity,Infinity, false);
			children[i].score = currentEval;
			if(currentEval > maxEval){
				maxEval = currentEval;
				move = children[i];
			}else if(move == undefined && i == children.length-1){
				move = children[1];
			}	
		}

		currentPlayer = human;
		brickGrid.array = move.array;
		
}

function miniMax(board, depth,alpha, beta, isMaximising){
	var terminalScore = checkForWinner(board);//last time a board will be called it is an end state
	
	if(terminalScore == Infinity || terminalScore == -Infinity){
		return terminalScore;
	}else if(depth > 4){
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

		for(var i = 0; i < BRICK_COLS; i++) {
		for(var j = 0; j < BRICK_ROWS; j++) {

		if(board.array[i][0].type != 0){
			break;
		}
		if(board.array[i][j].type != 0 && gameOver == false){
			tempBoard = new Board(deepCopy(board.array));
			tempBoard.array[i][j-1].type = player;
			children.push(tempBoard);

			break;
		}else if(j == BRICK_ROWS-1 && gameOver == false){
			tempBoard = new Board(deepCopy(board.array));
			tempBoard.array[i][j].type = player;
			children.push(tempBoard);

			break;
		}

		}
	}
	

	return children;
}

function getWinner(board){
	var temp = checkForWinner(board);

	if(temp == Infinity){
		console.log("YOU LOSE!");
		return 1
	}
	if(temp == "tie"){
		console.log("TIE!");
		return 1
	}
	if(temp == -Infinity){
		console.log("YOU WIN!");
		return 1
	}

	return undefined;
}

function checkForWinner(board){
	let winner;
	let score = 0;
	let mult = 1;

	for (var i = 0; i < BRICK_COLS; i++) {
		for (var j = 0; j < BRICK_ROWS; j++) {

			if(board.array[i][j].type != 0){

					//horizontal check
					if(i >= 3){
						let left = [];
						for (var e = 0; e < 4; e++) {
							left.push(board.array[i-e][j])
						}
						score += getScore(left)
				 	}
				 	if(i <= 3){
				 		let right = [];
				 		for (var e = 0; e < 4; e++) {
							right.push(board.array[i+e][j])
						}
						score += getScore(right)
				 	}


				 	//vertical check
				 	if(j >= 3){
						let up = [];
						for (var e = 0; e < 4; e++) {
							up.push(board.array[i][j-e])
						}
						score += getScore(up)
				 	}else{
						let down = [];
						for (var e = 0; e < 4; e++) {
							down.push(board.array[i][j+e])
						}
						score += getScore(down)
				 	}


				 	//diagonal from top right check
				 	if(j <= 2 && i >= 3){
				 		let downLeft = [];
				 		for (var e = 0; e < 4; e++) {
							downLeft.push(board.array[i-e][j+e])
						}
				 		score += getScore(downLeft)
				 	}else if(j >= 3 && i <= 3){
						let upRight = [];
						for (var e = 0; e < 4; e++) {
							upRight.push(board.array[i+e][j-e])
						}
				 		score += getScore(upRight)
				 	}


				 	//diagonal from top left check
				 	if(j >= 3 && i >= 3){
				 		let upLeft = [];
				 		for (var e = 0; e < 4; e++) {
							upLeft.push(board.array[i-e][j-e])
						}
				 		score += getScore(upLeft)
				 	}else if(j <= 2 && i <= 3){
				 		let downRight = [];
				 		for (var e = 0; e < 4; e++) {
							downRight.push(board.array[i+e][j+e])
						}
				 		score += getScore(downRight)
				 	}

			}//if grid space is not blank 

		}//for rows
	}//for cols

		let availibleSpots = [];
		for(i=0;i<BRICK_COLS;i++){
		for(j = 0;j<BRICK_ROWS;j++){
			if(board.array[i][j].type == 0){
				availibleSpots.push(board.array[i][j])
			}
		}
		}


		if(availibleSpots.length == 0){
			if(score != -Infinity || score != Infinity){
				return "tie";
			}
		}else{
			return score;
		}
}


function getScore(array){
	let score = 0;
	let root = array[0];
	let mult = 1;
	if(root.type == human){
		mult = -1;
	}
	let otherPlayer = human;
	if(root.type == human){
		otherPlayer = ai;
	}

		//singles
		if(array[1].type != root.type && 
			array[2].type != root.type && array[3].type != root.type){
				if(root.i == 3){
					score += 200 * mult;
				}
				if(root.i == 0 || root.i == 6){
					score += 40 * mult;
				}
				if(root.i == 1 || root.i == 5){
					score += 70 * mult;
				}
				if(root.i == 2 || root.i == 4){
					score += 120 * mult;
				}
		}
		//doubles
		if(array[1].type == root.type && 
			array[2].type == 0 && array[3].type == 0){
				score += 10000 * mult;
		}
		if(array[1].type == root.type && 
			array[2].type == 0 && array[3].type == otherPlayer){
				score += 5000 * mult;
		}
		if(array[1].type == 0 && 
			array[2].type == root.type && array[3].type == otherPlayer){
				score += 5000 * mult;
		}

		//triples
		if(array[1].type == root.type && 
			array[2].type == root.type && array[3].type == 0){
				score += 50000 * mult;
		}
		if(array[1].type == root.type && 
			array[2].type == 0 && array[3].type == root.type){
				score += 50000 * mult;
		}

		//a Win
		if(array[1].type == root.type && 
			array[2].type == root.type && array[3].type == root.type){
				score = Infinity * mult;
		}


	return score;

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