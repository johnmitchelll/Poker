

function handleMenu(keycode){
    drawText("black", "24px customfont", "#1 - Royal Flush", CANVAS_WIDTH/30, CANVAS_WIDTH/25);
    drawFiveCards([0,48,44,40,36], CANVAS_WIDTH/30, CANVAS_WIDTH/25+20);

    drawText("black", "24px customfont", "#2 - Strait Flush", CANVAS_WIDTH/30, CANVAS_WIDTH/25+130);
    drawFiveCards([17,13,9,5,1], CANVAS_WIDTH/30, CANVAS_WIDTH/25+150);

    drawText("black", "24px customfont", "#3 - Four of a Kind", CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*2);
    drawFiveCards([0,1,2,3,4], CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*2+20);

    drawText("black", "24px customfont", "#4 - Full House", CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*3);
    drawFiveCards([36,37,38,4,5], CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*3+20);

    drawText("black", "24px customfont", "#5 - Flush", CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*4);
    drawFiveCards([3,47,35,19,11], CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*4+20);

    drawText("black", "24px customfont", "#6 - Strait", 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25);
    drawFiveCards([50,47,41,36,34], 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+20);

    drawText("black", "24px customfont", "#7 - Three of a Kind", 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130);
    drawFiveCards([28,29,30,48,10], 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130+20);

    drawText("black", "24px customfont", "#8 - Two Pair", 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*2);
    drawFiveCards([0,1,20,21,40], 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*2+20);

    drawText("black", "24px customfont", "#9 - One Pair", 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*3);
    drawFiveCards([35,34,51,41,11], 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*3+20);

    drawText("black", "24px customfont", "#10 - High Card", 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*4);
    drawFiveCards([51,32,14,10,7], 20*CANVAS_WIDTH/30, CANVAS_WIDTH/25+130*4+20);


    handleButtons(CANVAS_WIDTH/2-95, 9*CANVAS_HEIGHT/10, 190, 40, "Main Menu", ENTER, goBackToMenu);
}

function drawFiveCards(arr, x, y){
    for (let i = 0; i < arr.length; i++) {
        drawImageFromSpriteSheetWithRotation(cardsPic, cards[arr[i]].sx, cards[arr[i]].sy, CARD_PIC_WIDTH, CARD_PIC_HEIGHT, x+i*(CARD_WIDTH+10), y, CARD_WIDTH, CARD_HEIGHT);
    }
}   


function goBackToMenu(){
    window.location.href = "../menu"
}