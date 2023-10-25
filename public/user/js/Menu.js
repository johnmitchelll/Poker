

function handleMenu(keycode){

    colorRectNoFill(20, CANVAS_HEIGHT/20-10, CANVAS_WIDTH-40, 300, "rgba(255,255,255,0.5)", 2)

    drawText("black", "42px customfont", "Username: " + userData.username, CANVAS_WIDTH/20, CANVAS_HEIGHT/8)
    drawText("black", "42px customfont", "Date Joined: " + formatDate(userData.created), CANVAS_WIDTH/20, CANVAS_HEIGHT/8+50)
    drawText("black", "42px customfont", "Total Winnings: " + userData.totalWinnings, CANVAS_WIDTH/20, CANVAS_HEIGHT/8+100)
    drawText("black", "42px customfont", "Best Session Score: " + userData.bestSessionWinnings, CANVAS_WIDTH/20, CANVAS_HEIGHT/8+150)
    drawText("black", "42px customfont", "Hands Played: " + userData.handsPlayed, CANVAS_WIDTH/20, CANVAS_HEIGHT/8+200)

    handleTextBoxes(CANVAS_WIDTH/2-200, CANVAS_HEIGHT-CANVAS_HEIGHT/3-50, 400, 45, textBoxes[0]);
    handleButtons(CANVAS_WIDTH/2-150, 9*CANVAS_HEIGHT/10-150, 300, 40, "Change Username", R, changeUsername);

    let width = getCharWidth(error, "32px customfont");
	drawText("black", "32px customfont", error, CANVAS_WIDTH/2-width/2, 8*CANVAS_HEIGHT/10+20)

    handleButtons(CANVAS_WIDTH/2-95, 9*CANVAS_HEIGHT/10, 190, 40, "Main Menu", ENTER, goBackToMenu);
}

async function changeUsername(){
    console.log("HI")
    let response = await changeUsernameServer(localStorageUserData.username, localStorageUserData.password, ["name"], [textBoxes[0].text]);

    if(response.msg == "Success"){
        userData.username = textBoxes[0].text;
        localStorageUserData.username = textBoxes[0].text;
        localStorage.setItem("userData", JSON.stringify({ username:textBoxes[0].text, password:localStorageUserData.password }));
        error = "Success";
        return;
    }

    error = response.msg;
}

function goBackToMenu(){
    window.location.href = "../menu"
}


function formatDate(date) {
    date = date.substring(0, date.indexOf('T'));
    date = new Date(date);

    // Array of month names for formatting
    const months = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
        'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
    ];

    // Get month, day, and year from the date object
    const monthIndex = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    // Format the date as "Month Day Year"
    const formattedDate = months[monthIndex] + ' ' + day + ' ' + year;
    return formattedDate;
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

function getCharWidth(char, font) {
	canvasContext.font = font;        
	var width = canvasContext.measureText(char).width;
    return width;
}