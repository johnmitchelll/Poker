var maxVel = 3;
function handlePlayerMovement(){
	player.acc.y += 0.25;

	if(keyHeld_Up){
		player.acc.y -= 0.5;
	}
	if(keyHeld_Left){
		player.acc.x -= 0.5;
	}
	if(keyHeld_Right){
		player.acc.x += 0.5;
	}

	player.vel.x += player.acc.x;
	player.vel.y += player.acc.y;

	if(player.vel.x > maxVel){
		player.vel.x = maxVel;
	}
	if(player.vel.x < -maxVel){
		player.vel.x = -maxVel;
	}
	if(player.vel.y > maxVel){
		player.vel.y = maxVel;
	}
	if(player.vel.y < -maxVel){
		player.vel.y = -maxVel;
	}

	handlePlayerCollision();

	player.pos.x += player.vel.x;
	player.pos.y += player.vel.y;

	player.acc.x *= 0;
	player.acc.y *= 0;
}


function handlePlayerCollision(){
	let prevXPos = player.pos.x;
	let prevYPos = player.pos.y;

	//get search area
	let searchArea = new Rect(player.pos.x - Math.abs(player.vel.x)*2,player.pos.y - Math.abs(player.vel.y)*2,
							player.size.x + Math.abs(player.vel.x)*4,player.size.y + Math.abs(player.vel.y)*4);

	let searchIndexs = [];
	let searchIndex = new Vector(Math.floor(searchArea.pos.x/BRICK_W),Math.floor(searchArea.pos.y/BRICK_H));
	let searchSize = new Vector(searchIndex.x+Math.floor(searchArea.size.x/BRICK_W)+1,
								searchIndex.y+Math.floor(searchArea.size.y/BRICK_H)+1);


	//gather all map indexes that are around player
	for (var col = searchIndex.x; col <= searchSize.x; col++) {
		for (var row = searchIndex.y; row <= searchSize.y; row++) {

			// colorRect(BRICK_W*col, BRICK_H*row, BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP, 'yellow');
			let index = col + BRICK_COLS * row;
			if(map[index] != 0 && index > 0 && index < BRICK_COLS*BRICK_ROWS-1){
				searchIndexs.push(index);
			}
		}
	}

	//check if any walls in the search area are colliding
	let collisionList = [];
	for (var i = 0; i < searchIndexs.length; i++) {
		
		let currentIndex = searchIndexs[i];
		let collision = dynamicRect_In_Rect(player,map[currentIndex]);

		if(collision){
			collisionList.push({i:currentIndex,t:collision.t});
		}
	}

	//sort collisions based off distance to player
	collisionList.sort(function(a, b){return a.t-b.t});


	//resolve collisions in correct order
	for (var i = 0; i < collisionList.length; i++) {
		//checking again for a collision after each collision is resolved in order
		let sortedCollision = dynamicRect_In_Rect(player,map[collisionList[i].i])

		if(sortedCollision !== false){
			player.vel.x += sortedCollision.cn.x * Math.abs(player.vel.x) * (1-sortedCollision.t);
			player.vel.y += sortedCollision.cn.y * Math.abs(player.vel.y) * (1-sortedCollision.t);
		}
	}

	//set speed to zero if in the same spot, fixes bug so u cant walk through walls
	if((player.pos.x + player.vel.x).toFixed(2) == prevXPos.toFixed(2)){
		player.vel.x = 0;
	}
	if((player.pos.y + player.vel.y).toFixed(2) == prevYPos.toFixed(2)){
		player.vel.y = 0;
	}
}
