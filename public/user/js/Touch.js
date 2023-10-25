

function handleButtons(x, y, w, h, text, keycode, func){
	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	drawText("black", "32px customfont", text, x+10, y+32);

	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		prevMouseDown = true;
		func(keycode);
	}
}


function mouseOverGraphDisplay(){
	if(sessionData.length <= 1){
		return;
	}
	

	if(mouseX >= CANVAS_WIDTH/8 && mouseY >= CANVAS_HEIGHT/10 
	&& mouseX <= CANVAS_WIDTH/8+6*CANVAS_WIDTH/8
	&& mouseY <= CANVAS_HEIGHT/10+CANVAS_HEIGHT/2){	

		let mouseIndexPos = sessionData.length*(mouseX-CANVAS_WIDTH/8)/(6*CANVAS_WIDTH/8-40);
		mouseIndexPos = Math.round(Math.min(mouseIndexPos, sessionData.length-1));
		let vertexPercentDown = (maxVal-sessionData[mouseIndexPos])/Math.abs(maxVal - minVal);
		
		colorRect(CANVAS_WIDTH/8+mouseIndexPos*inputWidth-7.5, CANVAS_HEIGHT/10+25+vertexPercentDown*(CANVAS_HEIGHT/2-50)-7.5, 15, 15, "white");
		drawText("black", "24px customfont", sessionData[mouseIndexPos], CANVAS_WIDTH/8+mouseIndexPos*inputWidth+8, CANVAS_HEIGHT/10+25+vertexPercentDown*(CANVAS_HEIGHT/2-50)-8);
	}
}