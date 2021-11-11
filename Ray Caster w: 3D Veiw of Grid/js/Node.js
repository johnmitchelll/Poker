function Ray(pos,ang){
  this.pos = {x:pos.x,y:pos.y};
  this.ang = ang;
  this.end = {x:undefined, y:undefined}
  this.or;
  this.dist;
  this.maxDOF = Math.floor(Math.sqrt(BRICK_COLS*BRICK_COLS + BRICK_ROWS*BRICK_ROWS));

  this.cast = function(){
    let currentCol = Math.floor(this.pos.x/BRICK_W);
    let currentRow = Math.floor(this.pos.y/BRICK_H);
    let xPosInCurrentCol = this.pos.x - (currentCol * BRICK_W);
    let yPosInCurrentRow = this.pos.y - (currentRow * BRICK_H);

    let rayX;let rayY;
    let xOff;let yOff;
    let dof = 0;

    if(this.ang < Math.PI){//if looking down
      rayY = this.pos.y + BRICK_H - yPosInCurrentRow + 0.5;
      let opositeSideLength = BRICK_H - yPosInCurrentRow;
      rayX = this.pos.x + opositeSideLength/Math.tan(this.ang)
      yOff = BRICK_H;
      xOff = BRICK_H/Math.tan(this.ang)
    }

    if(this.ang > Math.PI){//up
      rayY = this.pos.y - yPosInCurrentRow - 0.5;
      let opositeSideLength = yPosInCurrentRow;
      rayX = this.pos.x - opositeSideLength/Math.tan(this.ang)
      yOff = -BRICK_H;
      xOff = -BRICK_H/Math.tan(this.ang)
    }

        while(dof < this.maxDOF){
          let col = Math.floor(rayX/BRICK_W);
          let row = Math.floor(rayY/BRICK_H);
          let index = col + BRICK_COLS * row;

          if(index > 0 && index <= map.length-1 && map[index] > 0){
            dof = this.maxDOF;
          }else{
            rayY += yOff;
            rayX += xOff;
            dof++;
          }
        }

    let horDist = getDist(this.pos.x,this.pos.y,rayX,rayY)
    let horEnd = {x:rayX,y:rayY};

    dof = 0;
    if(this.ang > 3*Math.PI/2 || this.ang < Math.PI/2){//if looking right
      rayX = this.pos.x + BRICK_W - xPosInCurrentCol + 0.5;
      let adjesentSideLength = BRICK_W - xPosInCurrentCol;
      rayY = this.pos.y + adjesentSideLength*Math.tan(this.ang)
      yOff = BRICK_W*Math.tan(this.ang);
      xOff = BRICK_W;
    }
    if(this.ang < 3*Math.PI/2 && this.ang > Math.PI/2){//if looking left
      rayX = this.pos.x - xPosInCurrentCol - 0.5;
      let adjesentSideLength = xPosInCurrentCol;
      rayY = this.pos.y - adjesentSideLength*Math.tan(this.ang)
      yOff = -BRICK_W*Math.tan(this.ang);
      xOff = -BRICK_W;
    }

        while(dof < this.maxDOF){
          let col = Math.floor(rayX/BRICK_W);
          let row = Math.floor(rayY/BRICK_H);
          let index = col + BRICK_COLS * row;

          if(index > 0 && index <= map.length-1 && map[index] > 0){
            dof = this.maxDOF;
          }else{
            rayY += yOff;
            rayX += xOff;
            dof++;
          }
        }

    var vertDist = getDist(this.pos.x,this.pos.y,rayX,rayY)

    if(horDist > vertDist){
      drawLine(this.pos.x,this.pos.y,rayX,rayY,2,'blue')
      this.end = {x:rayX,y:rayY}
      this.or = 0;
    }else{
      drawLine(this.pos.x,this.pos.y,horEnd.x,horEnd.y,2,'blue')
      this.end = {x:horEnd.x,y:horEnd.y}
      this.or = 1;
    }
    this.dist = getDist(this.pos.x,this.pos.y,this.end.x,this.end.y);
  }
}

function Particle(){
  this.pos = {x:halfScreen/2-1,y:canvas.height/2-1};

  while(map[Math.floor(this.pos.x/BRICK_W) + BRICK_COLS * Math.floor(this.pos.y/BRICK_H)] > 0){
    this.pos.y = Math.random() * canvas.height;
    this.pos.x = Math.random() * halfScreen;
  }

  this.rays = [];
  this.vel = 3;
  this.ang = 0;
  this.r = 10;
  this.turnRate = Math.PI/90;

  let angOfView = Math.PI/3;//60 Degrees
  for (var i = this.ang-(angOfView/2); i < this.ang+(angOfView/2); i += Math.PI/360) {
      this.rays.push(new Ray(this.pos,i))
  }

  this.handleMovement = function(){
    // this.pos.x = mouseX;
    // this.pos.y = mouseY;

    if(keyHeld_Left){
      this.ang -=  this.turnRate;
      for (var i = 0; i < this.rays.length; i++) {
        this.rays[i].ang -=  this.turnRate;
      }
    }

    if(keyHeld_Right){
      this.ang +=  this.turnRate;
      for (var i = 0; i < this.rays.length; i++) {
        this.rays[i].ang +=  this.turnRate;
      }
    }

    while(this.ang > 2*Math.PI){
        this.ang -= 2*Math.PI;
    }
    while(this.ang < 0){
        this.ang += 2*Math.PI;
    }

    let xo = Math.cos(this.ang)*this.r;
    let yo = Math.sin(this.ang)*this.r;

    let pXIndex = Math.floor(this.pos.x/BRICK_W);
    let pXIndex_addOff = Math.floor((this.pos.x+xo)/BRICK_W);
    let pXIndex_subOff = Math.floor((this.pos.x-xo)/BRICK_W);

    let pYIndex = Math.floor(this.pos.y/BRICK_H);
    let pYIndex_addOff = Math.floor((this.pos.y+yo)/BRICK_H);
    let pYIndex_subOff = Math.floor((this.pos.y-yo)/BRICK_H);

    if(keyHeld_Up){
      if(map[pYIndex * BRICK_COLS + pXIndex_addOff] == 0){
        this.pos.x += Math.cos(this.ang) * this.vel;
      }

      if(map[pYIndex_addOff * BRICK_COLS + pXIndex] == 0){
        this.pos.y += Math.sin(this.ang) * this.vel;
      }
    }

    if(keyHeld_Down){
      if(map[pYIndex * BRICK_COLS + pXIndex_subOff] == 0){
        this.pos.x -= Math.cos(this.ang) * this.vel;
      }

      if(map[pYIndex_subOff * BRICK_COLS + pXIndex] == 0){
        this.pos.y -= Math.sin(this.ang) * this.vel;
      }
    }

    if(this.pos.x - this.r < 0){
      this.pos.x = 0 + this.r;
    }
    if(this.pos.y - this.r < 0){
      this.pos.y = 0 + this.r;
    }
    if(this.pos.x + this.r > halfScreen){
      this.pos.x = halfScreen - this.r;
    }
    if(this.pos.y + this.r > canvas.height){
      this.pos.y = canvas.height - this.r;
    }

    for (var i = 0; i < this.rays.length; i++) {
      this.rays[i].pos.x = this.pos.x;
      this.rays[i].pos.y = this.pos.y;

      while(this.rays[i].ang > 2*Math.PI){
        this.rays[i].ang -= 2*Math.PI;
      }
      while(this.rays[i].ang < 0){
        this.rays[i].ang += 2*Math.PI;
      }
    }
  }

  this.show = function(color){
    colorCircle(this.pos.x, this.pos.y, this.r, color);
    // drawLine(this.pos.x,this.pos.y,this.pos.x+Math.cos(this.ang)*50,this.pos.y+Math.sin(this.ang)*50,2,'blue')
  }

  this.look = function(){
    for (var i = 0; i < this.rays.length; i++) {
      this.rays[i].cast();
    }

    //to remove screen tearing
    for (var i = 1; i < this.rays.length-1; i++) {
      if(this.rays[i].or != this.rays[i-1].or && this.rays[i].or != this.rays[i+1].or){
        if(this.rays[i].or == 0){
          this.rays[i].or = 1;  }else{  this.rays[i].or = 0;
        }
      }
    }

    let w = halfScreen / this.rays.length;
    console.log(w)
    let diagonalLen = Math.sqrt(halfScreen*halfScreen + canvas.height * canvas.height)

    for (var i = 0; i < this.rays.length; i++) {
      let dist = this.rays[i].dist;
      dist *= Math.cos(this.rays[i].ang - this.ang);

      let h = (BRICK_COLS * BRICK_ROWS * canvas.height)/dist;

      let or = this.rays[i].or;
      let alpha = mapVal(diagonalLen, 0.5, 1, dist)
      let color = 'rgb(0,0,'+255*alpha+')';
      if(this.rays[i].or == 0){ color = 'rgb(0,0,'+139*alpha+')'  }

      colorRect(halfScreen + (i * w),canvas.height/2 - h/2, w+1,h,color);
    }

  }
}










