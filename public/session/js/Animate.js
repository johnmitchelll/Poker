let inputWidth;
let realInputWidth;
let outputWidth = (CANVAS_HEIGHT/2-60)/VERT_NUM_TICS;
let maxVal = -Infinity;
let minVal = Infinity;
let wins = 0;
let losses = 0;
let chops = 0;
let realSpaceWidth;
let width;

function loadSessionData(){
    inputWidth = (6*CANVAS_WIDTH/8-40)/sessionData.length;
    realInputWidth = (6*CANVAS_WIDTH/8-40)/Math.min(sessionData.length-1, 10);
    minVal = Infinity;
    maxVal = -Infinity;
    wins = 0;
    losses = 0;
    chops = 0;

    for (let i = 0; i < sessionData.length; i++) {
        if(sessionData[i] > maxVal){
            maxVal = sessionData[i];
        }

        if(sessionData[i] < minVal){
            minVal = sessionData[i];
        }

        if(i < sessionData.length-1){
            if(sessionData[i+1] > sessionData[i]){
                wins++;
            }else if(sessionData[i+1] < sessionData[i]){
                losses++;
            }else{
                chops++;
            }
        }
    }

    realSpaceWidth = Math.abs(maxVal - minVal)/(VERT_NUM_TICS);
}


function drawSessionStats(){
    
    // boarder
    colorRectNoFill(CANVAS_WIDTH/8, CANVAS_HEIGHT/10, 6*CANVAS_WIDTH/8, CANVAS_HEIGHT/2, 'rgba(255,255,255,0.2)', 2)

    // y axis
    drawLine(CANVAS_WIDTH/8,6*CANVAS_HEIGHT/10+30,CANVAS_WIDTH/8,CANVAS_HEIGHT/10-30,3,"white");
    drawLine(CANVAS_WIDTH/8,6*CANVAS_HEIGHT/10+30,CANVAS_WIDTH/8-7,6*CANVAS_HEIGHT/10+30-15,2,"white");
    drawLine(CANVAS_WIDTH/8,6*CANVAS_HEIGHT/10+30,CANVAS_WIDTH/8+7,6*CANVAS_HEIGHT/10+30-15,2,"white");
    drawLine(CANVAS_WIDTH/8,CANVAS_HEIGHT/10-30,CANVAS_WIDTH/8-7,CANVAS_HEIGHT/10-30+15,2,"white");
    drawLine(CANVAS_WIDTH/8,CANVAS_HEIGHT/10-30,CANVAS_WIDTH/8+7,CANVAS_HEIGHT/10-30+15,2,"white");

    // labels
    width = measureText("Hand Number", 16, "customfont");
    drawText("black", "16px customfont", "Hand Number", CANVAS_WIDTH/2-width.width/2, 6*CANVAS_HEIGHT/10+55);
    

    let width1 = measureText("Losses: "+losses, 16, "customfont").width;
    drawText("black", "16px customfont", "Losses: "+losses, CANVAS_WIDTH/2-width1/2, 7*CANVAS_HEIGHT/10+55);
    let width2 = measureText("Wins: "+wins, 16, "customfont").width;
    drawText("black", "16px customfont", "Wins: "+wins, CANVAS_WIDTH/2-100-width2/2-width1/2, 7*CANVAS_HEIGHT/10+55);
    let width3 = measureText("Chops: "+chops, 16, "customfont").width;
    drawText("black", "16px customfont", "Chops: "+chops, CANVAS_WIDTH/2+100-width3/2+width1/2, 7*CANVAS_HEIGHT/10+55);
    drawLine(CANVAS_WIDTH/2-100, 7*CANVAS_HEIGHT/10+65, CANVAS_WIDTH/2+100, 7*CANVAS_HEIGHT/10+65, 2, 'rgba(255,255,255,0.2)');

    // y nums
    for (let i = 0; i < VERT_NUM_TICS+1; i++){
        width = measureText((minVal+i*realSpaceWidth).toFixed(2), 16, "customfont");
        drawText("black", "16px customfont", (minVal+i*realSpaceWidth).toFixed(2), CANVAS_WIDTH/8-20-width.width, 6*CANVAS_HEIGHT/10-25-i*outputWidth);
        drawLine(CANVAS_WIDTH/8-5,6*CANVAS_HEIGHT/10-25-i*outputWidth-5,CANVAS_WIDTH/8+5,6*CANVAS_HEIGHT/10-25-i*outputWidth-5,2,"white");
    }

    // x axis
    let percentDown = maxVal/Math.abs(maxVal - minVal);
    drawLine(CANVAS_WIDTH/8,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5,CANVAS_WIDTH/8+6*CANVAS_WIDTH/8+30,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5,3,"white");
    drawLine(CANVAS_WIDTH/8+6*CANVAS_WIDTH/8+30,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5,CANVAS_WIDTH/8+6*CANVAS_WIDTH/8+30-15,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5-7,2,"white");
    drawLine(CANVAS_WIDTH/8+6*CANVAS_WIDTH/8+30,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5,CANVAS_WIDTH/8+6*CANVAS_WIDTH/8+30-15,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5+7,2,"white");

    // chips lost/won. needs to be infront of x
    drawText("black", "16px customfont", "Chips", 7*CANVAS_WIDTH/8+40, 3*CANVAS_HEIGHT/10+20);
    drawText("black", "16px customfont", "Lost/Won", 7*CANVAS_WIDTH/8+25, 3*CANVAS_HEIGHT/10+40);

    // vertecies
    let lastYPos = CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5;
    for (let i = 1; i < sessionData.length; i++) {
        let vertexPercentDown = (maxVal-sessionData[i])/Math.abs(maxVal - minVal);
        
        drawLine(CANVAS_WIDTH/8+(i-1)*inputWidth, lastYPos,CANVAS_WIDTH/8+i*inputWidth, CANVAS_HEIGHT/10+25+vertexPercentDown*(CANVAS_HEIGHT/2-50)+5,2,"white");
        lastYPos = CANVAS_HEIGHT/10+25+vertexPercentDown*(CANVAS_HEIGHT/2-50)+5;
    }


    // x nums/TICS
    for (let i = sessionData.length-1; i >= 1; i -= Math.ceil(sessionData.length/10)) {
        width = measureText(Math.floor(sessionData.length*i/sessionData.length), 16, "customfont");
        drawText("black", "16px customfont", Math.floor(sessionData.length*i/sessionData.length), CANVAS_WIDTH/8+i*inputWidth-width.width, 6*CANVAS_HEIGHT/10+19);
        drawLine(CANVAS_WIDTH/8+i*inputWidth,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5+5,CANVAS_WIDTH/8+i*inputWidth,CANVAS_HEIGHT/10+25+percentDown*(CANVAS_HEIGHT/2-50)+5-5,2,"white");
    }    


    mouseOverGraphDisplay();
}