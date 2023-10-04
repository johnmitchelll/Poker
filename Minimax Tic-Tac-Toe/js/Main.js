
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	start();

	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

}

function updateAll() {
	drawAll();
}

function start(){
	BRICK_W = (canvas.width-BRICK_GAP)/BRICK_COLS;
    BRICK_H = (canvas.height-BRICK_GAP)/BRICK_ROWS;

    brickGrid = new Board;
    brickGrid.array = new Array(BRICK_COLS);

	for(var i=0;i<BRICK_COLS;i++){
		brickGrid.array[i] = new Array(BRICK_ROWS);
	}

	for(i = 0; i < BRICK_COLS; i++){
        for(j = 0; j < BRICK_ROWS; j++){
		      brickGrid.array[i][j] = new NodeClass(i,j);
          }
    }

    // console.log(brickGrid)

}




// function getBestLocation(){
// 	let bestScore = -Infinity;
// 	let move;

// 	let tempBoard = new Array(BRICK_COLS)
// 	for(var i=0;i<BRICK_COLS;i++){
// 		tempBoard[i] = new Array(BRICK_ROWS);
// 	}

// 	for(i = 0; i < BRICK_COLS; i++){
//         for(j = 0; j < BRICK_ROWS; j++){
// 		     tempBoard[i][j] = brickGrid[i][j];
//           }
//     }

// 	for(i=0;i<BRICK_COLS;i++){
// 		for(j = 0;j<BRICK_ROWS;j++){
			
// 			if(tempBoard[i][j].type == 0){
// 				tempBoard[i][j].type = ai;
// 				var col = i;
// 				var row = j;
// 				let score = miniMax(tempBoard,0,false);
// 				tempBoard[col][row].type = 0;
				

// 				if(score > bestScore){
// 					bestScore = score;
// 					move = [Math.floor(i/BRICK_COLS),Math.floor(j/BRICK_ROWS)]
// 				}

// 			}
// 		}
// 	}
// 		console.log(move)
// 		currentPlayer = human;
// 		brickGrid[move[0]][move[1]].type = ai;
		
// }

// // var scores = {
// // 	X:1,
// // 	O:-1,
// // 	tie:0
// // }

// function miniMax(board,depth,isMaximizing){
// 	// console.log(board)
// 	let winner = checkForWinner();
// 	if(winner !== undefined){ 
// 		return winner;
// 	}

// 	let tempBoard = new Array(BRICK_COLS)
// 	for(var i=0;i<BRICK_COLS;i++){
// 		tempBoard[i] = new Array(BRICK_ROWS);
// 	}

// 	for(i = 0; i < BRICK_COLS; i++){
//         for(j = 0; j < BRICK_ROWS; j++){
// 		     tempBoard[i][j] = board[i][j];
//           }
//     }

// 	if(isMaximizing){
// 		let bestScore = -Infinity;
// 		for(i=0;i<BRICK_COLS;i++){
// 			for(j = 0;j<BRICK_ROWS;j++){

// 				if(board[i][j].type == 0){
// 					tempBoard[i][j].type = ai;
// 					var col = i;
// 					var row = j;
// 					let score = miniMax(tempBoard,depth+1,false);
// 					tempBoard[col][row].type = 0;

// 					if(score > bestScore){
// 						bestScore = score;
// 					}
// 				}

// 			}
// 		}
// 		return bestScore
// 	}else{
// 		let bestScore = Infinity;
// 		for(i=0;i<BRICK_COLS;i++){
// 			for(j =0;j<BRICK_ROWS;j++){

// 				if(board[i][j].type == 0){
// 					tempBoard[i][j].type = human;
// 					var col = i;
// 					var row = j;
// 					let score = miniMax(tempBoard,depth+1,true);
// 					tempBoard[col][row].type = 0;

// 					if(score < bestScore){
// 						bestScore = score;
// 					}
// 				}

// 			}
// 		}
// 		return bestScore
// 	}

// }



