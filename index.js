
const express = require("express");
const session = require("express-session");

require('./database');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/edit');
const readRoute = require('./routes/read');

const app = express();
app.use(express.json());


app.use(
    session({
        secret: "ASDFGHJKJHGFDSASDFGH",
        resave: false, 
        saveUninitialized: false
    })
);

app.use((req, res, next) =>{
    // console.log(req.method + ':' + req.url);
    next();
});


app.use('/edit', userRoute);
app.use('/auth', authRoute);
app.use('/read', readRoute);
// app.use('/socket', socketRoute);

const port = process.env.PORT || 3001;
const serv = app.listen(port, () => console.log("server running"));
app.use(express.static("public"));

const socketio = require('socket.io');
const io = socketio(serv);

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var GAME_LIST = [];
 
function Player(id){
    this.id = id;
    this.name;
    this.bet = 0;
    this.chips = 1000;
    this.playerOne = false;
    this.allIn = false;
    this.dealer = false;
    this.straddle = false;
    this.command = -1;

    this.deal = false;
}   

function Game(p1){
    this.p1 = p1;
    this.turn = p1.id;
    this.p2;

    this.board = [];
    this.p1Cards = [];
    this.p2Cards = [];

    this.pot = 0;
    this.scene = 0;
    this.stage = 0;
    this.winner;
    this.timer = 256;
    this.bet = 20;

    this.restart = function(){
        this.board = [];
        this.p1Cards = [];
        this.p2Cards = [];

        this.pot = 0;
        this.scene = 0;
        this.stage = 0;
        this.winner;
        this.timer = 256;
        this.command = -1;
        this.bet = 20;

        if(this.p1){    
            this.p1.bet = 0;
            this.p1.chips = 1000;
            this.p1.playerOne = false;
            this.p1.allIn = false;
            this.p1.dealer = false;
            this.p1.straddle = false;
        }

        if(this.p2){
            this.p2.bet = 0;
            this.p2.chips = 1000;
            this.p2.playerOne = false;
            this.p2.allIn = false;
            this.p2.dealer = false;
            this.p2.straddle = false;
        }
    }
}
 
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
 
	var player = new Player(socket.id);
	PLAYER_LIST[socket.id] = player;

    for (let i = 0; i < GAME_LIST.length; i++) {
        if(GAME_LIST[i].p1 == undefined){
            GAME_LIST[i].p1 = player;
            GAME_LIST[i].p1.playerOne = true;
            break;
        }
        if(GAME_LIST[i].p2 == undefined){
            GAME_LIST[i].p2 = player;
            break;
        }

        if(i == GAME_LIST.length-1){
            GAME_LIST.push(new Game(player));
            break;
        }
    }

    if(GAME_LIST.length == 0){
        GAME_LIST.push(new Game(player));
    }
 
	socket.on('disconnect',function(){
        for (let i = 0; i < GAME_LIST.length; i++) {
           if(GAME_LIST[i].p1 && GAME_LIST[i].p1.id == player.id){
                GAME_LIST[i].p1 = undefined;
                if(GAME_LIST[i].p2){
                    GAME_LIST[i].turn = GAME_LIST[i].p2.id;
                    GAME_LIST[i].restart();
                    GAME_LIST[i].p2.dealer = true;
                }
            }else if(GAME_LIST[i].p2 && GAME_LIST[i].p2.id == player.id){
                GAME_LIST[i].p2 = undefined;
                if(GAME_LIST[i].p1){
                    GAME_LIST[i].turn = GAME_LIST[i].p1.id;
                    GAME_LIST[i].restart();
                    GAME_LIST[i].p1.dealer = true;
                }
            }

            if(GAME_LIST[i].p1 == undefined && GAME_LIST[i].p2 == undefined){
                GAME_LIST.splice(i, 1);
            }
        }

        delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});
 
	socket.on('updateGame',function(data){
        for (let i = 0; i < GAME_LIST.length; i++) {
           if((GAME_LIST[i].p1 && GAME_LIST[i].p1.id == player.id) || 
              (GAME_LIST[i].p2 && GAME_LIST[i].p2.id == player.id)){

                for (let j = 0; j < data.length; j++) {

                    if((data.attribute == "board" || data.attribute == "p1Cards" || data.attribute == "p2Cards")){
                        if(player.dealer == true){
                            GAME_LIST[i][data[j].attribute] = data[j].value;
                        }
                    }else{
                        GAME_LIST[i][data[j].attribute] = data[j].value;
                    }
                }
           }
        }
	});

    socket.on('updateOponent',function(data){
        for (let i = 0; i < GAME_LIST.length; i++) {
            let oponentAttribute = false;

            if(GAME_LIST[i].p1 && GAME_LIST[i].p1.id == data.oponent){
                oponentAttribute = "p1";
            }else if(GAME_LIST[i].p2 && GAME_LIST[i].p2.id == data.oponent){
                oponentAttribute = "p2";
            }

            if(oponentAttribute){
                for (let j = 0; j < data.data.length; j++) {
                    GAME_LIST[i][oponentAttribute][data.data[j].attribute] = data.data[j].value;
                }
            }
         }
    });

    socket.on('updatePlayer',function(data){
        for (let i = 0; i < data.length; i++) {
            player[data[i].attribute] = data[i].value;
         }
	});
});
 
setInterval(function(){
    for (let i = 0; i < GAME_LIST.length; i++) {
        
        // both players in
        if(GAME_LIST[i].p1 && GAME_LIST[i].p2){
            GAME_LIST[i].timer--;
        }

        
        for(var player in PLAYER_LIST){
            let pack;
            let hit = true;

            if(GAME_LIST[i].p1 && GAME_LIST[i].p1.id == PLAYER_LIST[player].id){
                pack = {game:GAME_LIST[i], oponent:GAME_LIST[i].p2};
            }else if(GAME_LIST[i].p2 && GAME_LIST[i].p2.id == PLAYER_LIST[player].id){
                pack = {game:GAME_LIST[i], oponent:GAME_LIST[i].p1};
            }else{
                hit = false;
            }

            if(hit){
                let socket = SOCKET_LIST[PLAYER_LIST[player].id];
                socket.emit('newData',JSON.stringify(pack));
            }
        }
    }
},1000/25);