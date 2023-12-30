var deck;
var table;
var ai;
var human;

var scene = 0;
var stage = 0;
var prevCards = [[],[]];
var prevBoard = [];

var dealing = false;

var turn;
var err = -1;
var command = -1;

var prevWindowDimentions = {width:0, height:0};

var betKnobRelativePos = 0;

var timers = [0,0,0];

var userData;

var socket;
var socketData;

var playerOne = true;

var menu = true;
