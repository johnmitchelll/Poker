
const menuOptions = [
    {
        goTo:"../handrankings",
        keycode: 49
    },
    {
        goTo:"../session",
        keycode: 50
    },
    {
        goTo:"../leaderboard",
        keycode: 51
    },
    {
        goTo:"../user",
        keycode: 52
    },
    {
        goTo:"../slots",
        keycode: 53
    },
    {
        goTo:"../kuhn",
        keycode: 54
    },
    {
        goTo:"../",
        keycode: ENTER
    },
]


function handleMenu(keycode){
    // drawText("black", "64px customfont", "POKER", CANVAS_WIDTH/2-100, CANVAS_HEIGHT/4)

    // goToMenuOption(keycode);

    handleButtons(CANVAS_WIDTH/2-258/2, CANVAS_HEIGHT/5, 258, 40, "Hand Rankings", 49, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-255/2, CANVAS_HEIGHT/5+50, 255, 40, "Session Stats", 50, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-235/2, CANVAS_HEIGHT/5+100, 235, 40, "Leaderboard", 51, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-95/2, CANVAS_HEIGHT/5+150, 95, 40, "User", 52, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-105/2, CANVAS_HEIGHT/5+200, 105, 40, "Slots", 53, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-95/2, CANVAS_HEIGHT/5+250, 95, 40, "Kuhn", 54, goToMenuOption);
    

    handleButtons(CANVAS_WIDTH/2-120, CANVAS_HEIGHT-CANVAS_HEIGHT/4, 240, 40, "Play AI Poker", ENTER, goToMenuOption);
}