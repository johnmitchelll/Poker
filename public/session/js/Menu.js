

function handleMenu(keycode){
    handleButtons(CANVAS_WIDTH/2-145, 9*CANVAS_HEIGHT/10-50, 290, 40, "Restart Session", R, resetSessionStats);
    handleButtons(CANVAS_WIDTH/2-95, 9*CANVAS_HEIGHT/10, 190, 40, "Main Menu", ENTER, goBackToMenu);
}

function resetSessionStats(){
    sessionData = [0];
    localStorage.setItem('envState', undefined);
    loadSessionData();
}

function goBackToMenu(){
    window.location.href = "../menu"
}