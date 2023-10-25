

function handleMenu(keycode){

	let width = getCharWidth("Sign In or Register", "60px customfont");
	drawText("black", "60px customfont", "Sign In or Register", CANVAS_WIDTH/2-width/2, CANVAS_HEIGHT/6)


	width = getCharWidth(errorMessage, "32px customfont");
	drawText("red", "32px customfont", errorMessage, CANVAS_WIDTH/2-width/2, CANVAS_HEIGHT/3)

	width = getCharWidth("Username", "32px customfont");
	drawText("black", "32px customfont", "Username", CANVAS_WIDTH/2-width/2, CANVAS_HEIGHT/2-10)
	handleTextBoxes(CANVAS_WIDTH/2-250,CANVAS_HEIGHT/2, 500, 45, textBoxes[0])

	width = getCharWidth("Password", "32px customfont");
	drawText("black", "32px customfont", "Password", CANVAS_WIDTH/2-width/2, 2*CANVAS_HEIGHT/3-10);drawText("black", "32px customfont", "Password", CANVAS_WIDTH/2-width/2, 2*CANVAS_HEIGHT/3-10)
	handleTextBoxes(CANVAS_WIDTH/2-250,2*CANVAS_HEIGHT/3, 500, 45, textBoxes[1])


    handleButtons(CANVAS_WIDTH/2-67, 9*CANVAS_HEIGHT/10-55, 135, 40, "Sign In", signIn);
	handleButtons(CANVAS_WIDTH/2-82, 9*CANVAS_HEIGHT/10, 165, 40, "Register", register);
}

async function signIn(){

	if(textBoxes[0].text == "" || textBoxes[1].text == ""){
		errorMessage = "Input Username and Password";
		return;
	}

	let result = await signInServer(textBoxes[0].text, textBoxes[1].text);

	if(result.msg == "Success"){
		localStorage.setItem("userData", JSON.stringify({ username:textBoxes[0].text, password:textBoxes[1].text }));
		window.location.href = "../menu";
		return;
	}

	errorMessage = result.msg;
}

async function register(){
	if(textBoxes[0].text == "" || textBoxes[1].text == ""){
		errorMessage = "Input Username and Password";
		return;
	}

	let result = await registerServer(textBoxes[0].text, textBoxes[1].text);

	if(result.msg == "Success"){
		localStorage.setItem("userData", JSON.stringify({ username:textBoxes[0].text, password:textBoxes[1].text }));
		window.location.href = "../menu";
		return;
	}

	errorMessage = result.msg;
}


function handleButtons(x, y, w, h, text, func){
	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	drawText("black", "32px customfont", text, x+10, y+32);

	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		prevMouseDown = true;
		func();
	}
}


function TextBox(){
	this.i = 0;
	this.iW = 0;
	this.text = "";
	this.enabled = false;
}


function handleTextBoxes(x, y, w, h, textBox){
	colorRect(x, y, w, h, "#edfbfc");
	colorRectNoFill(x, y, w, h, "#334458", 2);
	drawText("black", "32px customfont", textBox.text, x+10, y+32);

	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && mouseDown && prevMouseDown == false){
		textBox.enabled = true;
	}else if(mouseDown && prevMouseDown == false){
		textBox.enabled = false;
	}


	if(textBox.enabled){
		drawLine(10+x+textBox.iW,y+5,10+x+textBox.iW,y+h-5,2,"grey");
	}
}