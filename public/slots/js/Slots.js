

var slotsItems = [[],[],[]];
var slotsItemsLowestY = [385, 385, 385];
var slotsItemSpinning = [false, false, false];

var coins = 1000;
var maxCoins = 10000000;

var multiplier = 0;

var insertCoin = new Audio('./content/insertcoin.mp3');
var stop = new Audio('./content/stop.mp3');
var win = new Audio('./content/win.mp3');

// goes from top diagnal thru all rows then bottom diagnal
var winners = [false, false, false, false, false];

function drawSlotItems(i){
    for (let j = 0; j < slotsItems[i].length; j++) {
        drawSlotImageFromSpriteSheetWithRotation(slotIcons, 
            SLOT_ITEM_IMG_POS[slotsItems[i][j]], 0, 
            SLOT_ITEM_WIDTH[slotsItems[i][j]], 16, 
            32/SLOT_PIC_WIDTH*CANVAS_WIDTH+48/SLOT_PIC_HEIGHT*CANVAS_HEIGHT*i+85-(SLOT_ITEM_WIDTH[slotsItems[i][j]]/2)/SLOT_PIC_WIDTH*CANVAS_HEIGHT, 
            slotsItemsLowestY[i]-j*120, SLOT_ITEM_WIDTH[slotsItems[i][j]]/SLOT_PIC_WIDTH*CANVAS_WIDTH, 
            16/SLOT_PIC_HEIGHT*CANVAS_HEIGHT);
    }
}


function drawSlotImageFromSpriteSheetWithRotation(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, ang, antiAli){
    slotItemCanvasContext.save();
    slotItemCanvasContext.translate(dx, dy);
    slotItemCanvasContext.rotate(ang);
     slotItemCanvasContext.imageSmoothingEnabled = false; 
    if(antiAli){
        slotItemCanvasContext.imageSmoothingEnabled = true; 
    }
    slotItemCanvasContext.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
    slotItemCanvasContext.restore();
}


function colorSlotsRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    slotItemCanvasContext.fillStyle = fillColor;
    slotItemCanvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}


function handleSlotItems(){

    for (let i = 0; i < slotsItemsLowestY.length; i++) {
        if(slotsItemSpinning[i] == false){
            continue;
        }   


        slotsItemsLowestY[i] += 30;

        if(slotsItemsLowestY[i] >= 465){
            slotsItems[i].shift();
            slotsItems[i].push(Math.floor(Math.random()*7));
            slotsItemsLowestY[i] -= 120;
        }
    }
}


function spinSlots(){
    if(slotsItemSpinning.includes(true)){
        return;
    }

    if(betSize > coins){
        return;
    }

    insertCoin.play();

    winners = [false, false, false, false, false];
    slotsItemSpinning = [true, true, true];

    coins -= betSize;

    setTimeout(() => {
        slotsItemsLowestY[0] = 385;
        slotsItemSpinning[0] = false;
        stop.play();
    }, 1000);

    setTimeout(() => {
        slotsItemsLowestY[1] = 385;
        slotsItemSpinning[1] = false;
        stop.play();
    }, 2000);

    setTimeout(() => {
        slotsItemsLowestY[2] = 385;
        slotsItemSpinning[2] = false;
        stop.play();
        handleWin();
    }, 3500);
}


function handleWin(){
    let runningTotal = 0;

    for (let i = 0; i < 7; i++) {
        // runningTotal += getAmountInCols(i);
        runningTotal += getAmountInRows(i);
        runningTotal += getAmountInDiagnals(i);
    }

    coins += runningTotal*betSize;
    multiplier = runningTotal;

    if(multiplier > 0){
        win.play();
    }

    if(coins > maxCoins){
        updateUserStats();
        maxCoins = coins;
        console.log("NEW HIGH SCORE");
    }
}

function getAmountInCols(inputSlotValue){
    let amounts = [0,0,0];
    let payout = 0;

    for (let i = 0; i < slotsItems.length; i++) {
        for (let j = 0; j < 3; j++) {
            if(slotsItems[i][j] == inputSlotValue){
                amounts[i]++;
            }
        }

        if(amounts[i] == 2 && slotsItems[i][1] == 2 && inputSlotValue == 2){
            payout += 5;
        }else if(amounts[i] == 3){
            payout += getPayoutFromNum(slotsItems[i][1]);
        }
    }

    return payout;
}

function getAmountInRows(inputSlotValue){
    let amounts = [0,0,0];
    let payout = 0;

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < slotsItems.length; i++) {
            if(slotsItems[i][j] == inputSlotValue){
                amounts[j]++;
            }
        }

        if(amounts[j] == 2 && slotsItems[1][j] == 2 && inputSlotValue == 2){
            payout += 5;
             winners[3-j] = true;
        }else if(amounts[j] == 3){
            payout += getPayoutFromNum(slotsItems[1][j]);
             winners[3-j] = true;
        }
    }

    return payout;
}

function getAmountInDiagnals(inputSlotValue){
    let amounts = [0,0];
    let payout = 0; 

    for (let i = 0; i < slotsItems.length; i++) {
        if(slotsItems[2-i][i] == inputSlotValue){
            amounts[0]++;
        }

        if(slotsItems[i][i] == inputSlotValue){
            amounts[1]++;
        }
    }

    for (let i = 0; i < amounts.length; i++) {
        if(amounts[i] == 2 && slotsItems[1][1] == 2 && inputSlotValue == 2){
            payout += 5;
            winners[i*4] = true;
        }else if(amounts[i] == 3){
            payout += getPayoutFromNum(slotsItems[1][1]);
            winners[i*4] = true;
        }
    }

    return payout;
}


function getPayoutFromNum(index){
    if(index == 0){
        return 1000;
    }

    if(index == 1){
        return 500;
    }

    if(index == 2){
        return 10;
    }

    if(index == 3){
        return 100;
    }

    if(index == 4){
        return 20;
    }

    if(index == 5){
        return 50;
    }

    if(index == 6){
        return 200;
    }
}