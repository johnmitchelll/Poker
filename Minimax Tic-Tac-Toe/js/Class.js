function Board(arr){
this.array = arr;
this.score = 0;
}

function NodeClass(col,row){
    this.type = 0;
	this.i = col;
	this.j = row;
  this.w = BRICK_W;
  this.h = BRICK_H;
	this.index = col + BRICK_COLS * row;

	this.showNode = function(color){
		this.color = color;
		canvasContext.fillStyle = color;
        canvasContext.fillRect(this.i*BRICK_W+BRICK_GAP,this.j*BRICK_H+BRICK_GAP, 
        						BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP);
	}

  this.drawXorO = function(){
    if(brickGrid.array[this.i][this.j].type == 2){
        canvasContext.lineWidth = 5;
        canvasContext.strokeStyle = '#FDFBF8';
        canvasContext.beginPath();
        var x = this.i * BRICK_W + BRICK_W/2; // x coordinate
        var y = this.j * BRICK_H + BRICK_H/2; // y coordinate
        var radius = BRICK_W-185; // Arc radius
        var startAngle = 0; // Starting point on circle
        var endAngle = 2*Math.PI; // End point on circle

        canvasContext.arc(x, y, radius, startAngle, endAngle);
        canvasContext.stroke();
    }

    if(brickGrid.array[this.i][this.j].type == 1){
        canvasContext.lineWidth = 5;
        canvasContext.strokeStyle = '#FDFBF8';
        canvasContext.beginPath();
        canvasContext.translate(this.i*BRICK_W+75, this.j*BRICK_H+75)
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(BRICK_W-150, BRICK_H-150);
        canvasContext.stroke();
        canvasContext.translate(-1*(this.i*BRICK_W+75), -1*(this.j*BRICK_H+75))
        

        canvasContext.beginPath();
        canvasContext.translate(this.i*BRICK_W+BRICK_W-75, this.j*BRICK_H+75)
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(-1*BRICK_W+150, BRICK_H-150);
        canvasContext.stroke();
        canvasContext.translate(-1*(this.i*BRICK_W+BRICK_W-75), -1*(this.j*BRICK_H+75))
    }
  }
}