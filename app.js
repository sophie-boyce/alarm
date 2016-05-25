"use strict";

var lame = require("lame");
var fs = require("fs");
var Speaker = require("speaker");
var keypress = require("keypress");
keypress(process.stdin);
var isPlaying = false;
var audioStream;

function numberToStringDayOfWeek(number) {
	if(number == 0)
		return "sunday";
	if(number == 1)
		return "monday";
	if(number == 2)
		return "tuesday";
	if(number == 3)
		return "wednesday";
	if(number == 4)
		return "thursday";
	if(number == 5)
		return "friday";
	if(number == 6)
		return "saturday";
}

function isItAlarmTime() {
	var dayAsString = numberToStringDayOfWeek(new Date().getDay());
	var todayTime = settings[dayAsString + "Time"];

	if(!todayTime) {
		return false;
	}

	var currentTime = getCurrentTime();
	return currentTime == todayTime;	
}

function getCurrentTime() {
	var date = new Date();
	var hours = date.getHours();
	var ampm = "am";
	if (hours > 12) {
		hours = hours - 12;
		ampm = "pm";
	}
	var minutes = date.getMinutes();
	//console.log(hours + ":" + minutes + " " + ampm);
	return "6:00 am";
}

function playFile(fileName) {
	audioStream = fs.createReadStream(fileName).pipe(new lame.Decoder()).pipe(new Speaker());
}

var settings = JSON.parse(fs.readFileSync("settings.json", "utf-8"));
console.log("Here are the current settings.")
console.log(settings);



setInterval(function() {
	if(isPlaying)
		return;
		
	if(isItAlarmTime()) {
		var dayAsString = numberToStringDayOfWeek(new Date().getDay());
		var todayFile = settings[dayAsString + "File"];
		isPlaying = true; 
		playFile(todayFile);
	}
}, 1000 * 30);

process.stdin.on("keypress", function(ch, key) {
	if(key && key.name == "c" && key.ctrl)
		process.exit();

	audioStream.end();
});

process.stdin.setRawMode(true);
process.stdin.resume();
