var prevWindowDimentions = {width:0, height:0};

var timers = [0,0,0];

var deck;

function setTimer(time, index, func){
	if(timers[index] == 0){
		timers[index] = {
			"start": totalTime, 
			"func": func,
			"time": time
		};
		return;
	}	
}

function updateTimers(){
	for (let index = 0; index < timers.length; index++) {
		if(timers[index] != 0 && totalTime - timers[index].start > timers[index].time){
			timers[index] = 0;
            timers[index].func();
		}
	}
}