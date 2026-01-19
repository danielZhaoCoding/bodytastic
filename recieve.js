//Mental Assistant
const mentalButton = document.getElementById("MentalQuestionSubmit");
const mentalInput = document.getElementById("MentalQuestionInput");
const mentalResult = document.getElementById("MentalQuestionResult");

//Login
const usernameBox = document.getElementById("LoginUsername");
const passwordBox = document.getElementById("LoginPassword");
const loginSubmit = document.getElementById("LoginSubmit");
const loginButton = document.getElementById("LoginButton");

let userUsername = '';
let userPassword = '';
let userLoginLast = 0;

//Login Pages
const loginPage = document.getElementById("LoginPage");
const signUpPage = document.getElementById("SignUpPage");
const signedInPage = document.getElementById("SignedInPage");

//SignUp
const signUpButton = document.getElementById("SignUpButton");
const signUpUsername = document.getElementById("SignUpUsername");
const signUpPassword = document.getElementById("SignUpPassword");
const signUpConfirmPassword = document.getElementById("SignUpConfirmPassword");
const signUpSubmit = document.getElementById("SignUpSubmit");

//LogOut
const logoutButton = document.getElementById("LogOutButton");



//OPENAI Response
async function getInfo(){
	if (userUsername == ''){
		alert('Please Login or Signup to use our Chat');
		return;
	}
	let userInput = mentalInput.value
	const baseURL = `https://bodytastic.repl.co/sentData?question=${mentalInput.value}`;
	mentalResult.innerHTML += `<p class="userText">You: ${mentalInput.value}</p>`
	mentalResult.innerHTML += '<p id="lastAIText" class="aiText">Loading...</p>'
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json()
	data.then(function(result) {
		document.getElementById("lastAIText").innerHTML = result;
		document.getElementById("lastAIText").id = '';
		dataSendingChat(userInput, result)
	})
}

//Accepting Login Information
async function getLoginAccept(){
	if (loginSubmit.innerHTML == 'Loading...'){
		return;
	}
	const baseURL = `https://bodytastic.repl.co/getLoginAccept?username=${usernameBox.value}&password=${passwordBox.value}`;
	const userLoginInputs = {'Username': usernameBox.value, 'Password': passwordBox.value};
	loginSubmit.innerHTML = 'Loading...';
	let temporaryUserUsername = usernameBox.value;
	let temporaryUserPassword = passwordBox.value;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
	data.then(function(result) {
		if (result[0] == '1'){
			alert('Please Enter a Valid Username');
			usernameBox.value = '';
			passwordBox.value = '';
			loginSubmit.innerHTML = 'Log In';
		} else if (result[0] == '2'){
			alert('Password Incorrect');
			passwordBox.value = '';
			loginSubmit.innerHTML = 'Log In';
		} else {
			userUsername = temporaryUserUsername;
			userPassword = temporaryUserPassword;
			usernameBox.value = '';
			passwordBox.value = '';
			loginPage.classList.add('removeDivContent');
			signUpPage.classList.add('removeDivContent')
			signedInPage.classList.remove('removeDivContent')
			signedInPage.getElementsByTagName('h4')[0].innerHTML += userUsername;

			//Setting Up Stuff
			//userInfo is the whole hashmap
			let userInfo = JSON.parse(result.userInfo);
			//Basic Stats
			let tempUserStat1 = JSON.parse(userInfo["Health-Points"]);
			points["HealthPoints"] = parseInt(tempUserStat1);
			let tempUserStat2 = JSON.parse(userInfo['Physical-Rating']);
			points["PhysicalRating"] = parseInt(tempUserStat2);
			let tempUserStat3 = JSON.parse(userInfo['Mental-Rating']);
			points["MentalRating"] = parseInt(tempUserStat3);
			let tempUserStat4 = JSON.parse(userInfo['Day-Streak']);
			points["DayStreak"] = parseInt(tempUserStat4);
			let tempUserStat5 = JSON.parse(userInfo['Points-Today']);
			points["PointsToday"] = parseInt(tempUserStat5);
			let tempUserStat6 = JSON.parse(userInfo['Points-Week']);
			points["PointsWeek"] = parseInt(tempUserStat6);
			
			//Health Log
			let userLog = JSON.parse(userInfo["Health-Log"])
			healthLogData = []
			for (i=0;i<userLog.length;i++){
				healthLogData.push(JSON.parse(userLog[i]))
			}
			createLog();

			//Chat
			let userChat = JSON.parse(userInfo['Chat'])
			for (i=0; i<userChat.length; i++){
				if (i%2 == 0){
					mentalResult.innerHTML += `<p class="userText">You: ${userChat[i]}</p>`;
				} else if (i%2 == 1){
					mentalResult.innerHTML += `<p class="aiText">${userChat[i]}</p>`;
				}
			}

			//Streaks
			let tempUserLastDay = JSON.parse(userInfo['Last-Day']);
			userLoginLast = parseInt(tempUserLastDay)
			if (result.date - parseInt(tempUserLastDay) == 86400000){
				points["DayStreak"] += 1;	
				points["PointsToday"] = 0;

			} else if (result.date != parseInt(tempUserLastDay)){
				points["DayStreak"] = 1;
				points["PointsToday"] = 0;
			}
			let tempUserLastWeek = JSON.parse(userInfo['Last-Week']);
			if (Math.floor(result.date/604800000) != parseInt(tempUserLastWeek)){
				points["PointsWeek"] = 0;
				console.log('hi')
			}
			
			//Challenges
			let userChallenges = JSON.parse(userInfo['Challenges'])
			let removeChallengesList = [];
			challenges = [];
			for (i=0; i < userChallenges.length;i++){
				challenges.push(JSON.parse(userChallenges[i]))
			}
			//Subtrating Days
			if (result.date - parseInt(tempUserLastDay) == 86400000){
				for (i=0; i<challenges.length; i++){
					challenges[i].Days -= 1
					if (challenges[i].Days <= 0){
						removeChallengesList.push(challenges[i])
					}
				}
			} else if (result.date != parseInt(tempUserLastDay)){
				for (i=0; i<challenges.length; i++){
					challenges[i].Days -= (result.date - parseInt(tempUserLastDay))/86400000;
					if (challenges[i].Days <= 0){
						removeChallengesList.push(challenges[i])
					}
				}
			}

			for (i=0; i<removeChallengesList.length; i++){
				challenges.splice(challenges.indexOf(removeChallengesList[i]), 1);
			}
			
			challengeD.innerHTML = '';
			loadChallenges()


			
			sendLogin();
			updateHomepage();
			requestLeaderboard();
			requestLeaderboard2();
		}
	})
	
}

//Switching to Sign Up
async function switchToSignUp(){
	signUpPage.classList.remove('removeDivContent');
	loginPage.classList.add('removeDivContent');
}

//Switching to Sign In
async function switchToLogin(){
	signUpPage.classList.add('removeDivContent');
	loginPage.classList.remove('removeDivContent');
}

//Sending Sign Up Data
async function signUpAccept(){

	if (signUpSubmit.innerHTML == 'Loading...'){
		return;
	}
	if (signUpConfirmPassword.value != signUpPassword.value){
		alert('Your passwords do not match');
		signUpConfirmPassword.value = '';
		signUpPassword.value = '';
		return;
	}
	if (signUpConfirmPassword.value == '' || signUpPassword.value == '' || signUpUsername == ''){
		alert('Make sure to fill in all inputs');
		signUpUsername.value = ''
		signUpConfirmPassword.value = '';
		signUpPassword.value = '';
		return;
	}
  if (censorCheck(signUpUsername.value) == 'Includes'){
    alert('Username may be inappropriate');
    signUpUsername.value = '';
    return;
  }

	let temporaryUserUsername = signUpUsername.value;
	let temporaryUserPassword = signUpPassword.value;
	signUpSubmit.innerHTML = 'Loading...';
	const baseURL = `https://bodytastic.repl.co/getSignUpAccept?username=${signUpUsername.value}&password=${signUpPassword.value}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
	data.then(function(result){
		if (result != 'Success'){
			alert(result);
			signUpSubmit.innerHTML = 'Sign Up'
			signUpUsername.value = '';
		} else if (result == 'Success'){
			signUpSubmit.innerHTML = 'Sign Up'
			userUsername = temporaryUserUsername;
			userPassword = temporaryUserPassword;
			dataSendingChallenges();
			updateHomepage()
			saveUserLogin();
			signUpUsername.value = '';
			signUpPassword.value = '';
			signUpConfirmPassword.value = '';
			loginPage.classList.add('removeDivContent');
			signUpPage.classList.add('removeDivContent')
			signedInPage.classList.remove('removeDivContent')
			signedInPage.getElementsByTagName('h4')[0].innerHTML += userUsername;
			location.reload();
		}
	})
}

//Saving User Log
async function dataSendingLog(text){
	if (userUsername == ''){return;}
	let tempHealthLog = [];
	for (i=0;i<healthLogData.length;i++){
		tempHealthLog.push(JSON.stringify(healthLogData[i]))
	}
	const baseURL = `https://bodytastic.repl.co/dataSendingLog?info=${JSON.stringify(tempHealthLog)}&username=${userUsername}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
}

//Saving User Chat
async function dataSendingChat(text1, text2){
	if (userUsername == ''){return;}
	const baseURL = `https://bodytastic.repl.co/dataSendingChat?text1=${text1}&username=${userUsername}&text2=${text2}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
}

//Saving Challenges
async function dataSendingChallenges(info){
	if (userUsername == ''){return;}
	let tempUserChallenges = [];
	for (i=0; i<challenges.length; i++){
		tempUserChallenges.push(JSON.stringify(challenges[i]))
	}
	const baseURL = `https://bodytastic.repl.co/dataSendingChallenges?username=${userUsername}&info=${JSON.stringify(tempUserChallenges)}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
}

//Completing a Challenge
async function dataSendingCompletedC(challenge, log, points, streak, pr, mr, pointsToday, pointsWeek){
	if (userUsername == ''){return;}
	let tempChallenge = [];
	let tempLog = [];
	for (i=0; i<healthLogData.length; i++){
		tempLog.push(JSON.stringify(healthLogData[i]));
	}
	for (let index=0; index<challenges.length; index++){
		tempChallenge.push(JSON.stringify(challenges[index]));
	}
	const baseURL = `https://bodytastic.repl.co/dataSendingCompletedC?username=${userUsername}&challenge=${JSON.stringify(tempChallenge)}&log=${JSON.stringify(tempLog)}&points=${points}&streak=${streak}&pr=${pr}&mr=${mr}&pointsToday=${pointsToday}&pointsWeek=${pointsWeek}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
}

//Completing Diagnostic
async function dataSendingCompletedD(){
	if (userUsername == ''){return;}
	let tempLog = [];
	let pr = points["PhysicalRating"];
	let mr = points["MentalRating"];
	for (i=0; i<healthLogData.length; i++){
		tempLog.push(JSON.stringify(healthLogData[i]));
	}
	const baseURL = `https://bodytastic.repl.co/dataSendingCompletedD?username=${userUsername}&log=${JSON.stringify(tempLog)}&pr=${pr}&mr=${mr}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
}

//Request Leaderboard
async function requestLeaderboard(){
	if (userUsername == ''){return;}
	const baseURL = `https://bodytastic.repl.co/dataSendLeaderboard`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
	data.then(function(result){
		let tempDailyLeaderboard = result;
		tempDailyLeaderboard.sort(function(a, b) {
    	return parseFloat(b.Points) - parseFloat(a.Points);
		});
		setLeaderboard(tempDailyLeaderboard);
	})
}

//Request Leaderboard Weekly
async function requestLeaderboard2(){
	if (userUsername == ''){return;}
	const baseURL = `https://bodytastic.repl.co/dataSendLeaderboard2`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	var data = res.json();
	data.then(function(result){
		let tempWeeklyLeaderboard = result;
		tempWeeklyLeaderboard.sort(function(a, b) {
    	return parseFloat(b.Points) - parseFloat(a.Points);
		});
		setLeaderboard2(tempWeeklyLeaderboard)
	})
}

//Login 
async function sendLogin(){
	if (userUsername == ''){return;}
	let tempChallenge = [];
	for (let index=0; index<challenges.length; index++){
		tempChallenge.push(JSON.stringify(challenges[index]));
	}
	const baseURL = `https://bodytastic.repl.co/dataSendLogin?username=${userUsername}&streak=${points["DayStreak"]}&pointsToday=${points["PointsToday"]}&challenge=${JSON.stringify(tempChallenge)}&pointsWeek=${points["PointsWeek"]}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
}

async function dataSendFunction(username, action, verification){
	const baseURL = `https://bodytastic.repl.co/dataSendingFunction?username=${username}&action=${action}&verification=${verification}`;
	const res = await fetch(baseURL, {
		method: "GET"
	});
	
}

function saveUserLogin(){
	if (userUsername == ''){
		localStorage.clear()
		return;
	}
	let data = [];
	data.push(userUsername);
	data.push(userPassword)
	localStorage.setItem('time', JSON.stringify(Date.now() / 1000));
	localStorage.setItem('user', btoa(JSON.stringify(data)));
	localStorage.setItem('stay', document.getElementById("stayLoggedIn").checked)
}

function loadSaved(){
	if (localStorage.length == 0){return;}
	let tempStay = JSON.parse(localStorage.getItem('stay'));
	let tempTime = Date.now()/1000 - parseInt(localStorage.getItem('time'));
	let tempLogin = JSON.parse(atob(localStorage.getItem("user")))
	if (tempStay == true ||( tempStay == false && tempTime < 36000)){
		document.getElementById("stayLoggedIn").checked = tempStay;
		usernameBox.value = tempLogin[0];
		passwordBox.value = tempLogin[1]
		getLoginAccept()
	}
}

function logoutUser(){
	localStorage.clear();
	userUsername = '';
	userPassword = '';
	location.reload();
}

function reloadPage(){
	if (userUsername == ''){
		return;
	}
	if (userLoginLast != Math.floor(Date.now()/86400000) * 86400000){
		location.reload()
	}
}

mentalButton.addEventListener('click', getInfo);
loginSubmit.addEventListener('click', getLoginAccept);
loginButton.addEventListener('click', switchToLogin)
signUpButton.addEventListener('click', switchToSignUp);
signUpSubmit.addEventListener('click', signUpAccept);
logoutButton.addEventListener('click', logoutUser)

//Setting Intervals
window.setInterval(saveUserLogin, 500)
window.setInterval(reloadPage, 2000)
window.setInterval(requestLeaderboard, 60000)
window.setInterval(requestLeaderboard2, 60000)


loadSaved()
