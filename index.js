//HTML Elements
const closeButton = document.getElementById('closeButton');
const openButton = document.getElementById('openButton');
const tabBar = document.getElementById('TabBar');
const mainDiv = document.getElementById('main');
const headerText = document.getElementById('headerText');
const headerImage = document.getElementById('headerImage')
const tabList = document.getElementsByTagName('h3');
const homepageMain = document.getElementsByClassName('HomepageMain')[0];
const homepageDivs = document.getElementsByClassName('HomepageDiv');
const leaderboardD = document.getElementById('LeaderboardDaily');
const leaderboardW = document.getElementById('LeaderboardWeekly');
const inspiration = document.getElementById('InspirationalQuote');
const challengeD = document.getElementById('ChallengeDiv');
const healthLog = document.getElementById('HealthLogTable');
const healthLogger = document.getElementById('HealthLoggerContainer');
const healthBoxes = document.getElementsByClassName('ExtraInfo');
const loggerSubmit = document.getElementById("LoggerSubmit");
const challengeInputs = [document.getElementById("ChallengeInput1"),
document.getElementById("ChallengeInput2"),
document.getElementById("ChallengeInput3")];
const challengeChecks = document.getElementsByClassName('ChallengeCheck');
const loggerSearch = document.getElementById("LoggerSearch");
const homepageStats = document.getElementById("HomepageStats").children;
const ratingGraph = document.getElementById("ratingGraph");

//Variables
var tabIndex = 0; //0=Homepage 1=MA 2=Dia 3=HL 4HL  5=ACC
var tabNames = ['Homepage', 'MentalAssistant', 'Diagnostic', 'HealthLogger', 'HealthLog', 'Account'];
var leaderboardDaily = [];
var leaderboardWeekly = [];
var healthLogData = [];
var points = { "HealthPoints": 0, "PhysicalRating": 0, "MentalRating": 0, "DayStreak": 1, "PointsToday": 0, "PointsWeek": 0}

var challenges = [
	{"Title": "30 Push-Ups", "Days": 1, "Points": 30},
	{"Title": "Run 5 Miles", "Days": 3, "Points": 100},
	{"Title": "Run 1 Mile", "Days": 1, "Points": 40},
	{"Title": "Sleep 8 Hours", "Days": 1, "Points": 20},
];
var alphabet = JSON.parse(alphabet);
var names = JSON.parse(names);
var quotes = JSON.parse(quotes);
var loggerData = JSON.parse(logger);
var colorList = JSON.parse(colorlist);
var swears = JSON.parse(swears)


var loggerStrings = []; // List of all Names of Logger Items
var loggerIndexesArray = []; // Indexes of Logger Items that Match Search
var activeLogger = ['', 0]; //Name of Logger, Index of Logger

//All Event Listeners
headerText.addEventListener('click', function() { tabIndex = 0; changeTab(); miniChangeTab(-1) });
headerImage.addEventListener('click', function() { tabIndex = 0; changeTab(); miniChangeTab(-1) });
tabList[1].addEventListener('click', function() { tabIndex = 0; changeTab() });
tabList[2].addEventListener('click', function() { tabIndex = 1; changeTab() });
tabList[3].addEventListener('click', function() { tabIndex = 2; changeTab() });
tabList[4].addEventListener('click', function() { tabIndex = 3; changeTab() });
tabList[5].addEventListener('click', function() { tabIndex = 4; changeTab() });
tabList[6].addEventListener('click', function() { tabIndex = 5; changeTab() });
loggerSearch.addEventListener("keyup", updateSearch)
homepageDivs[2].addEventListener('click', injectQuote);
healthBoxes[0].addEventListener("keyup", function(event) { event.preventDefault(); if (event.keyCode === 13) { completedLogger(); } });
healthBoxes[1].addEventListener("keyup", function(event) { event.preventDefault(); if (event.keyCode === 13) { completedLogger(); } });
challengeInputs[0].addEventListener("keyup", function(event) { event.preventDefault(); if (event.keyCode === 13) { appendChallenge(); } });
challengeInputs[1].addEventListener("keyup", function(event) { event.preventDefault(); if (event.keyCode === 13) { appendChallenge(); } });
challengeInputs[2].addEventListener("keyup", function(event) { event.preventDefault(); if (event.keyCode === 13) { appendChallenge(); } });

//Closing the TabBar in Portrait Mode
closeButton.addEventListener('click', closeTabBar);
//Opening the TabBar in Portrait Mode
openButton.addEventListener('click', function() {
	closeButton.style.fontSize = '5vw';
	tabBar.classList.remove('closedBar');
	closeButton.classList.remove('closeButton');
	mainDiv.classList.remove('normalMain');
});


//Function List

function censorCheck(tempUsername){
	for (i=0; i<swears.length; i++){
		if (tempUsername.toLowerCase().includes(swears[i])){
			return 'Includes'
		}
	}
	return 'Discludes'
}

function updateHomepage() {
	homepageStats[0].innerHTML = `Health Points: ${points["HealthPoints"]}`;
	homepageStats[1].innerHTML = `Physical Health Rating: ${points["PhysicalRating"]}`;
	homepageStats[2].innerHTML = `Mental Health Rating: ${points["MentalRating"]}`;
	homepageStats[3].innerHTML = `Active Day Streak: ${points["DayStreak"]}`;
} // Updates the Value for Homepage Stats

function compareNumbersSB(a, b) {
	return a - b;
} //Help Sort

function closeTabBar() {
	closeButton.style.fontSize = 0;
	tabBar.classList.add('closedBar');
	closeButton.classList.add('closedButton');
	mainDiv.classList.add('normalMain');
} //Close Mobile TabBar

function changeTab() {
	for (i = 0; i < 6; i++) {
		document.getElementById(tabNames[i]).style.display = 'none';
		tabList[i + 1].classList.remove('activeTab');
	}
	document.getElementById(tabNames[tabIndex]).style.display = 'block';
	tabList[tabIndex + 1].classList.add('activeTab');
	closeTabBar();
}; //Change Tab

function rRandint(min, max) {
	max += 1;
	return Math.floor(Math.random() * (max - min)) + min;
} //R.Randint()

function rChoice(list) {
	return list[rRandint(0, list.length - 1)];
} //Random Array Item

function rFloat(min, max) {
	return (Math.random() * (max - min)) + min;
} //Get a Random Float 

function miniChangeTab(index) {
	homepageMain.style.display = 'none';
	homepageDivs[0].style.display = 'none';
	homepageDivs[1].style.display = 'none';
	homepageDivs[2].style.display = 'none';
	if (index == -1) {
		homepageMain.style.display = 'block';
	} else {
		homepageDivs[index].style.display = 'block';
	}
} //Changing Homepage Tabs

function setLeaderboard(sortedDailyLeaderboard) {
	//leaderboardD
	leaderboardD.innerHTML = '<tr><th>Name</th><th>Points</th><th>Rank</th></tr>';
	let userRank = 0
	for (i=0; i<sortedDailyLeaderboard.length; i++){
		if (sortedDailyLeaderboard[i]['Username'] == userUsername){
			userRank = i + 1
		}
	};
	if (userRank < 11){
		for (i=0; i<sortedDailyLeaderboard.length; i++){
			if (userUsername == sortedDailyLeaderboard[i]['Username']){
				leaderboardD.innerHTML += `<tr><td><b>YOU</b></td><td>${sortedDailyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			} else {
				leaderboardD.innerHTML += `<tr><td>${shorten(sortedDailyLeaderboard[i]['Username'])}</td><td>${sortedDailyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			}
			if (i > 8){
				break;
			}
		}
	} else {
		for (i=0; i<sortedDailyLeaderboard.length; i++){
			if (userUsername == sortedDailyLeaderboard[i]['Username']){
				leaderboardD.innerHTML += `<tr><td><b>YOU</b></td><td>${sortedDailyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			} else {
				leaderboardD.innerHTML += `<tr><td>${shorten(sortedDailyLeaderboard[i]['Username'])}</td><td>${sortedDailyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			}
			if (i > 7){
				break;
			}
		}
		leaderboardD.innerHTML += `<tr><td><b>YOU</b></td><td>${sortedDailyLeaderboard[userRank-1]['Points']}</td><td>${userRank}</td></tr>`;
	}
} //Set up the Leaderboard

function setLeaderboard2(sortedWeeklyLeaderboard) {
	//leaderboardD
	leaderboardW.innerHTML = '<tr><th>Name</th><th>Points</th><th>Rank</th></tr>';
	let userRank = 0
	for (i=0; i<sortedWeeklyLeaderboard.length; i++){
		if (sortedWeeklyLeaderboard[i]['Username'] == userUsername){
			userRank = i + 1
		}
	};
	if (userRank < 11){
		for (i=0; i<sortedWeeklyLeaderboard.length; i++){
			if (userUsername == sortedWeeklyLeaderboard[i]['Username']){
			leaderboardW.innerHTML += `<tr><td><b>YOU</b></td><td>${sortedWeeklyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			} else {
				leaderboardW.innerHTML += `<tr><td>${shorten(sortedWeeklyLeaderboard[i]['Username'])}</td><td>${sortedWeeklyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			}
			if (i > 8){
				break;
			}
		}
	} else {
		for (i=0; i<sortedWeeklyLeaderboard.length; i++){
			if (userUsername == sortedWeeklyLeaderboard[i]['Username']){
			leaderboardW.innerHTML += `<tr><td><b>YOU</b></td><td>${sortedWeeklyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			} else {
				leaderboardW.innerHTML += `<tr><td>${shorten(sortedWeeklyLeaderboard[i]['Username'])}</td><td>${sortedWeeklyLeaderboard[i]['Points']}</td><td>${i + 1}</td></tr>`;
			}
			if (i > 7){
				break;
			}
		}
		leaderboardW.innerHTML += `<tr><td><b>YOU</b></td><td>${sortedWeeklyLeaderboard[userRank-1]['Points']}</td><td>${userRank}</td></tr>`;
	}
} //Set up the Leaderboard

function injectQuote() {
	var currentQuote = inspiration.innerHTML;
	var newQuote;
	var differentQuote = false;
	while (differentQuote == false) {
		newQuote = rChoice(quotes);
		if (newQuote == currentQuote) {
			differentQuote = false;
		}
		else {
			differentQuote = true;
			inspiration.innerHTML = newQuote;
		}
	}
} //Change the Quote

function shorten(usernameString){
	if (usernameString.length > 10){
		return usernameString.slice(0,8) + '...';
	} else {
		return usernameString;
	}
}

function createLog() {
	healthLog.innerHTML = '<tr><th>Date</th><th>Type</th><th>Description</th></tr>'
	for (i = 0; i < healthLogData.length; i++) {
		var newLogged = document.createElement('tr');
		newLogged.innerHTML += `<td>${healthLogData[i]['Date']}</td>`;
		newLogged.innerHTML += `<td>${healthLogData[i]['Type']}</td>`;
		newLogged.innerHTML += `<td>${healthLogData[i]['Info']}</td>`;
		healthLog.appendChild(newLogged);
		setNewCategories();
	}
} //Load in the Log

function appendLog(dict) {
	var newLogged = document.createElement('tr');
	newLogged.innerHTML += `<td>${dict['Date']}</td>`;
	newLogged.innerHTML += `<td>${dict['Type']}</td>`;
	newLogged.innerHTML += `<td>${dict['Info']}</td>`;
	if (healthLog.childElementCount < 2) {
		healthLog.appendChild(newLogged);
	} else {
		healthLog.insertBefore(newLogged, healthLog.children[1]);
	}
	healthLogData.unshift(dict);
	if (`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` != dict['Date']){

		for (i=0;i<healthLogData.length;i++){
			let tempDateInfo = healthLogData[i]['Date'].split('/')
			healthLogData[i]['TempDate'] = new Date(tempDateInfo[2], parseInt(tempDateInfo[0])-1, tempDateInfo[1]);
		}
		let tempHealthLogData = healthLogData.sort((a, b) => b.TempDate - a.TempDate);
		createLog()
	}
	setNewCategories();
	dataSendingLog(JSON.stringify(dict))
} //Add new Logged Item to Health Log

function appendLogAlt(dict){
		var newLogged = document.createElement('tr');
	newLogged.innerHTML += `<td>${dict['Date']}</td>`;
	newLogged.innerHTML += `<td>${dict['Type']}</td>`;
	newLogged.innerHTML += `<td>${dict['Info']}</td>`;
	if (healthLog.childElementCount < 2) {
		healthLog.appendChild(newLogged);
	} else {
		healthLog.insertBefore(newLogged, healthLog.children[1]);
	}
	healthLogData.unshift(dict);
	if (`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}` != dict['Date']){

		for (i=0;i<healthLogData.length;i++){
			let tempDateInfo = healthLogData[i]['Date'].split('/')
			healthLogData[i]['TempDate'] = new Date(tempDateInfo[2], parseInt(tempDateInfo[0])-1, tempDateInfo[1]);
		}
		let tempHealthLogData = healthLogData.sort((a, b) => b.TempDate - a.TempDate);
		createLog()
	}
	setNewCategories();
} // Add new Logged Item without Saving to DB

function appendChallenge() {
	for (i = 0; i < 3; i++) {
		if (challengeInputs[i].value == '') {
			console.log(challengeInputs[i].value)
			alert('Please Fill Out All Inputs/Invalid Input')
			return;
		}
	}
	if (challengeInputs[2].value < 1 || challengeInputs[2].value > 150){
		alert('Please Enter a Valid Amount of Points')
		return;
	}
	//Creating New Element
	var newChallenge = document.createElement('div');
	newChallenge.classList.add('ChallengeContainer');
	newChallenge.innerHTML += `<h2>${challengeInputs[0].value}</h2>`;
	newChallenge.innerHTML += '<input type="checkbox" class="ChallengeCheck" onchange="checkChallenges()"></input>';
	newChallenge.innerHTML += `<h5>Days Left: ${challengeInputs[1].value}</h5>`;
	newChallenge.innerHTML += `<h5>Points: ${challengeInputs[2].value}</h5>`;
	challengeD.appendChild(newChallenge);
	//Adding Info to DataStorage
	challenges.push({ 'Title': challengeInputs[0].value, 'Days': challengeInputs[1].value, 'Points': challengeInputs[2].value })
	dataSendingChallenges()
	challengeInputs[0].value = '';
	challengeInputs[1].value = '';
	challengeInputs[2].value = '';
} //Adds a New Challenge

function removeChallenge(challengeIndex) {
	setTimeout(() => { challengeD.removeChild(document.getElementsByClassName('ChallengeContainer')[challengeIndex]) }, 300);
} //Remove Challenges

function checkChallenges() {
	for (let index = 0; index < challengeD.childElementCount; index++) {
		if (challengeChecks[index].checked) {
			var newData = { 'Date': '', 'Type': '', 'Info': '' };
			newData['Date'] = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
			newData['Type'] = 'Challenge';
			newData['Info'] = `Completed: ${challengeD.children[index].children[0].innerHTML}`;
			points["HealthPoints"] += parseInt(challenges[index]["Points"]);
			points["PointsToday"] += parseInt(challenges[index]["Points"])
			points["PointsWeek"] += parseInt(challenges[index]["Points"])
			challenges.splice(index, 1);
			removeChallenge(index);
			updateHomepage();
			appendLogAlt(newData);
			dataSendingCompletedC(challenges, healthLogData, points["HealthPoints"], points["DayStreak"], points["PhysicalRating"], points["MentalRating"], points["PointsToday"], points["PointsWeek"]);
		}
	}
} //Checks On the Completion of Challenges

function loadChallenges() {
	for (i = 0; i < challenges.length; i++) {
		var newChallenge = document.createElement('div');
		newChallenge.classList.add('ChallengeContainer');
		newChallenge.innerHTML += `<h2>${challenges[i]['Title']}</h2>`;
		newChallenge.innerHTML += '<input type="checkbox" class="ChallengeCheck" onchange="checkChallenges()"></input>';
		newChallenge.innerHTML += `<h5>Days Left: ${challenges[i]['Days']}</h5>`;
		newChallenge.innerHTML += `<h5>Points: ${challenges[i]['Points']}</h5>`;
		challengeD.appendChild(newChallenge);
	}
} //Initial Loading Challenges (Old Challenge)

function distance(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	if (a.length == 0) return b.length;
	if (b.length == 0) return a.length;

	var matrix = [];
	var i;
	for (i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}
	var j;
	for (j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}
	for (i = 1; i <= b.length; i++) {
		for (j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) == a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
					Math.min(matrix[i][j - 1] + 1,
						matrix[i - 1][j] + 1));
			}
		}
	}
	return 1 - (matrix[b.length][a.length] / ([a.length, b.length].sort(compareNumbersSB)[1]));
} //Levenshtein Distance

function updateLogger() {
	document.getElementsByClassName('HealthLoggerNode')[activeLogger[1]].style.backgroundColor = '';
	document.getElementsByClassName('HealthLoggerNode')[activeLogger[1]].style.color = '';
	document.getElementsByClassName('HealthLoggerNode')[activeLogger[1]].style.fontWeight = '';

	var loggerList = Array.prototype.slice.call(document.getElementsByClassName('HealthLoggerNode'));
	var loggerIndex = loggerList.indexOf(this);
	this.style.backgroundColor = '#afd9f3';
	this.style.setProperty("color", "black", "important");
	this.style.fontWeight = '400';
	activeLogger = [loggerData[loggerIndex]["Name"], loggerIndex];
	healthBoxes[0].style.display = 'none';
	healthBoxes[1].style.display = 'none';
	loggerSubmit.style.display = '';
	yearDropdown.style.display = '';
	monthDropdown.style.display = '';
	dateDropdown.style.display = '';

	
	if (loggerData[loggerIndex]["Inputs"][0]) {
		healthBoxes[0].style.display = '';
		healthBoxes[0].setAttribute('placeholder', loggerData[loggerIndex]["Back Text"][0]);
	}
	if (loggerData[loggerIndex]["Inputs"][1]) {
		healthBoxes[1].style.display = '';
		healthBoxes[1].setAttribute('placeholder', loggerData[loggerIndex]["Back Text"][1]);
	}
} // Activate Selected Health Logger Buttons/Inputs

function createLogger() {
	for (i = 0; i < loggerData.length; i++) {
		var newLogger = document.createElement('button');
		newLogger.classList.add('HealthLoggerNode');
		newLogger.innerHTML = loggerData[i]["Name"];
		newLogger.addEventListener('click', updateLogger);
		healthLogger.appendChild(newLogger);
	}
} // Load Logger Cards

function completedLogger() {
	for (i = 0; i < 2; i++) {
		if (healthBoxes[i].value == '' && loggerData[activeLogger[1]]["Inputs"][i]) {
			return;
		}
	}
	let tempDate = new Date();
	tempDate.setHours(0,0,0,0);
	if (tempDate.getTime() < new Date(yearDropdown.value, parseInt(monthDropdown.value) - 1, dateDropdown.value, 0,0,0,0).getTime()){
		alert('Please Enter A Valid Date')
		return;
	}
	var newData = { 'Date': '', 'Type': '', 'Info': '' };
	var tempString = loggerData[activeLogger[1]]["AppendText"]
	newData['Date'] = `${monthDropdown.value}/${dateDropdown.value}/${yearDropdown.value}`;
	newData['Type'] = activeLogger[0];
	if (tempString.includes('[0]')) {
		tempString = tempString.replace('[0]', healthBoxes[0].value)
	}
	if (tempString.includes('[1]')) {
		tempString = tempString.replace('[1]', healthBoxes[1].value)
	}
	newData['Info'] = tempString;
	healthBoxes[0].value = '';
	healthBoxes[1].value = '';
	healthBoxes[0].style.display = 'none';
	healthBoxes[1].style.display = 'none';
	loggerSubmit.style.display = 'none';
	yearDropdown.style.display = 'none';
	monthDropdown.style.display = 'none';
	dateDropdown.style.display = 'none';
	
	document.getElementsByClassName('HealthLoggerNode')[activeLogger[1]].style.backgroundColor = '';
	activeLogger = ['', 0]; //Reseting Stuff
	appendLog(newData);
} // Append Logger Information to Log

function updateSearch() {
	var tempStringArray = [];
	for (i = 0; i < loggerStrings.length; i++) {
		if (distance(loggerStrings[i], loggerSearch.value) > 0.5){
			tempStringArray.push(i);
		} else if (loggerSearch.value.length < loggerStrings[i].length) {
			var tempDistance = loggerStrings[i].length - loggerSearch.value.length;
			for (index = 0; index < tempDistance + 1; index++) {
				if (distance(loggerStrings[i].slice(0 + index, loggerSearch.value.length + index), loggerSearch.value) > 0.5) {
					tempStringArray.push(i);
				}
			}
		}
	}
	tempStringArray = [...new Set(tempStringArray)];
	loggerIndexesArray = tempStringArray;
	searchImplementLogger(); //Update Visuals
} // Updates Which Health Logger Items Match Search Box

function searchImplementLogger() {
	for (i = 0; i < loggerData.length; i++) {
		if (loggerIndexesArray.includes(i)) {
			document.getElementsByClassName('HealthLoggerNode')[i].style.display = '';
		} else {
			document.getElementsByClassName('HealthLoggerNode')[i].style.display = 'none';
		}
	}
} // Turns On/Off Items that are Active or Not

//Close the TabBar at the Start
closeTabBar();
changeTab();


//Adding Logger Strings to the Array
for (i = 0; i < loggerData.length; i++) {
	loggerStrings.push(loggerData[i]["Name"])
	loggerIndexesArray.push(i);
}

//Setting up Inspiration
injectQuote();

//Setting up Health Log
createLog();

//Setting up Challenges
loadChallenges();

//Setting up Health Logger
createLogger();
