
const menuOptions = [
    {
        goTo:"../session",
        keycode: 49
    },
    {
        goTo:"../leaderboard",
        keycode: 51
    },
    {
        goTo:"../handrankings",
        keycode: 52
    },
    {
        goTo:"../user",
        keycode: 53
    },
    {
        goTo:"../",
        keycode: ENTER
    },
]


function handleMenu(keycode){
    // drawText("black", "64px customfont", "POKER", CANVAS_WIDTH/2-100, CANVAS_HEIGHT/4)

    // goToMenuOption(keycode);

    handleButtons(CANVAS_WIDTH/2-258/2, CANVAS_HEIGHT/4, 258, 40, "Hand Rankings", 52, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-255/2, CANVAS_HEIGHT/4+50, 255, 40, "Session Stats", 49, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-235/2, CANVAS_HEIGHT/4+100, 235, 40, "Leaderboard", 51, goToMenuOption);
    handleButtons(CANVAS_WIDTH/2-95/2, CANVAS_HEIGHT/4+150, 95, 40, "User", 53, goToMenuOption);
    

    handleButtons(CANVAS_WIDTH/2-120, CANVAS_HEIGHT-CANVAS_HEIGHT/4, 240, 40, "Play AI Poker", ENTER, goToMenuOption);
}