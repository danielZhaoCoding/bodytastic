const express = require('express');
const app = express();
const Database = require("@replit/database");
const db = new Database();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let userData = {
	"Password":"", //Done
	"Last-Day":"0",
	"Health-Log":"[]", //Done
	"Physical-Rating":"0", //Done
	"Mental-Rating":"0", //Done
	"Health-Points":"0", //Done
	"Day-Streak": "1", //Done
	"Challenges":'', //Done
	"Chat": "[]",
	"Points-Today":'0',
	"Username": '',
	"Last-Week": '0',
	"Points-Week":'0',
	'Requests-Sent':'0'
							 }
let lastDailyLeaderboard = Date.now()
let dailyLeaderboard = [];

let lastWeeklyLeaderboard = Date.now()
let weeklyLeaderboard = [];

db.get('AllUsernames').then(value => {console.log(value)})
db.list().then(keys => {console.log(keys)})

app.get('/sentData', (req, res) => {
	const response = openai.createCompletion({
	  model: "text-curie-001",
	  prompt: `Act like a therapist and give advice to this statement in a short length paragraph under 330 letters. Make sure to follow these rules:\n1-No sexual responses and do not respond to anything school related like math,science,history,writing questions:\n ${req.query.question};\n`,
  	temperature: 0.79,
  	max_tokens: 120,
  	top_p: 1,
  	frequency_penalty: 0,
  	presence_penalty: 0,
		stop: ["Finally"]
	}).then(value => {res.status(200).json(value.data.choices[0].text)})
})

app.get('/getLoginAccept', (req, res) => {
	db.get("AllUsernames").then(value => {
		let tempAllUsernameList = JSON.parse(value);
		if (tempAllUsernameList.includes(req.query.username)){
			db.get(req.query.username).then(userInfo => {
				let tempUserInfo = JSON.parse(userInfo);
				if (tempUserInfo["Password"] == req.query.password){
					let tempDay = new Date();
					tempDay.setHours(0,0,0,0);
					res.status(200).json({'userInfo': userInfo, 'date': tempDay.getTime()})
				} else {
					res.status(200).json('2: Password Incorrect')
				}
			})
		} else {
			res.status(200).json('1: Username Correct')
		}
	});
})

app.get('/getSignUpAccept', (req, res) => {
	db.get("AllUsernames").then(value => {
		if (JSON.parse(value).includes(req.query.username) || req.query.username == 'AllUsernames' || req.query.username == '' || req.query.username.toLowerCase() == 'you'){
			res.status(200).json('Username already taken or invalid');
		} else {
			let tempDay = new Date();
			tempDay.setHours(0,0,0,0);
			
			let tempAllUsernameList = (eval(JSON.parse(value)))
			let tempNewUser = userData;
			tempNewUser["Password"] = req.query.password;
			tempNewUser["Username"] = req.query.username;
			tempNewUser["Last-Day"] = `${tempDay.getTime()}`;
			tempNewUser["Last-Week"] = `${Math.floor(tempDay.getTime()/604800000)}`;
			tempAllUsernameList.push(req.query.username)
			db.set(req.query.username, JSON.stringify(tempNewUser)).then(value => {});
			db.set("AllUsernames", JSON.stringify(tempAllUsernameList)).then(value => {})
			res.status(200).json('Success');
		}
	});
})

app.get('/dataSendingLog', (req, res) => {
	db.get(req.query.username).then(value => {
		let userData = JSON.parse(value)
		let userHealthLog = JSON.parse(userData['Health-Log'])
		//userHealthLog.unshift(req.query.info)
		userData['Health-Log'] = req.query.info;
		//db.set(req.query.username, JSON.stringify(userData))
		db.set(req.query.username, JSON.stringify(userData));
	})
})

app.get('/dataSendingChat', (req, res) => {
	db.get(req.query.username).then(value => {
		let userData = JSON.parse(value)
		let userChat = JSON.parse(userData['Chat']);
		let userRequests = JSON.parse(userData['Requests-Sent']);
		userChat.push(req.query.text1)
		userChat.push(req.query.text2)
		userData['Chat'] = JSON.stringify(userChat);
		userData['Requests-Sent'] = `${parseInt(userRequests) + 1}`;
		db.set(req.query.username, JSON.stringify(userData))
	})
})

app.get('/dataSendingChallenges', (req, res) => {
	db.get(req.query.username).then(value =>{
		let userData = JSON.parse(value)
		userData['Challenges'] = req.query.info;
		db.set(req.query.username, JSON.stringify(userData));
	})
});

app.get('/dataSendingCompletedC', (req, res) => {
	db.get(req.query.username).then(value =>{
		let tempDay = new Date();
		tempDay.setHours(0,0,0,0);
		
		let userData = JSON.parse(value);
		userData['Challenges'] = req.query.challenge;
		userData['Health-Log'] = req.query.log;
		userData['Health-Points'] = req.query.points;
		userData['Day-Streak'] = req.query.streak;
		userData['Physical-Rating'] = req.query.pr;
		userData['Mental-Rating'] = req.query.mr;
		userData['Points-Today'] = req.query.pointsToday;
		userData['Points-Week'] = req.query.pointsWeek;
		db.set(req.query.username, JSON.stringify(userData));
	})
});

app.get('/dataSendingCompletedD', (req, res) => {
	db.get(req.query.username).then(value =>{
		let userData = JSON.parse(value);
		userData['Health-Log'] = req.query.log;
		userData['Physical-Rating'] = req.query.pr;
		userData['Mental-Rating'] = req.query.mr;
		db.set(req.query.username, JSON.stringify(userData));
	})
});

app.get('/dataSendLogin', (req, res) => {
	db.get(req.query.username).then(value =>{
		let tempDay = new Date();
		tempDay.setHours(0,0,0,0);
		
		let userData = JSON.parse(value);
		userData["Last-Day"] = `${tempDay.getTime()}`;
		userData["Last-Week"] = `${Math.floor(tempDay.getTime()/604800000)}`;
		userData["Day-Streak"] = req.query.streak;	
		userData["Points-Today"] = req.query.pointsToday;
		userData["Points-Week"] = req.query.pointsWeek
		userData["Challenges"] = req.query.challenge;
		
		db.set(req.query.username, JSON.stringify(userData));
	})
});

app.get('/dataSendLeaderboard', (req, res) => {
	let tempDailyLeaderboard = [];
	let openedUsers = 0;
	let tempDay = new Date();
	tempDay.setHours(0,0,0,0);

	function leaderboardDone(leaderboard){
		dailyLeaderboard = leaderboard;
		res.status(200).json(leaderboard);
	}
	
	if (Date.now() - lastDailyLeaderboard > 10000){
		db.get("AllUsernames").then(value => {
			let allUsernameList = JSON.parse(value)
			for (i=0; i<allUsernameList.length; i++){
				let tempUsername = allUsernameList[i]
				db.get(allUsernameList[i]).then(userData => {
					openedUsers+=1;
					let tempUserData = JSON.parse(userData);
					if (tempUserData['Last-Day'] == tempDay.getTime()){
						tempDailyLeaderboard.push({
							'Points': parseInt(tempUserData['Points-Today']),
							'Username': tempUserData['Username']
						})
					} else {
						tempDailyLeaderboard.push({
							'Points': 0,
							'Username': tempUserData['Username']
						})
					}
					if (openedUsers == allUsernameList.length){
						leaderboardDone(tempDailyLeaderboard)
					}
				})
			}
		})
		lastDailyLeaderboard = Date.now();
	} else {
		leaderboardDone(dailyLeaderboard)
	}
});

app.get('/dataSendLeaderboard2', (req, res) => {
	let tempWeeklyLeaderboard = [];
	let openedUsers = 0;
	let tempDay = new Date();
	tempDay.setHours(0,0,0,0);

	function leaderboardDone(leaderboard){
		weeklyLeaderboard = leaderboard;
		res.status(200).json(leaderboard);
	}
	
	if (Date.now() - lastWeeklyLeaderboard > 10000){
		db.get("AllUsernames").then(value => {
			let allUsernameList = JSON.parse(value)
			for (i=0; i<allUsernameList.length; i++){
				let tempUsername = allUsernameList[i]
				db.get(allUsernameList[i]).then(userData => {
					openedUsers+=1;
					let tempUserData = JSON.parse(userData);
					if (tempUserData['Last-Week'] == Math.floor(tempDay.getTime()/604800000)){
						tempWeeklyLeaderboard.push({
							'Points': parseInt(tempUserData['Points-Week']),
							'Username': tempUserData['Username']
						})
					} else {
						tempWeeklyLeaderboard.push({
							'Points': 0,
							'Username': tempUserData['Username']
						})
					}
					if (openedUsers == allUsernameList.length){
						leaderboardDone(tempWeeklyLeaderboard)
					}
				})
			}
		})
		lastWeeklyLeaderboard = Date.now();
	} else {
		leaderboardDone(weeklyLeaderboard)
	}
});

app.get('/dataSendingFunction', (req, res) => {
	if (req.query.username == 'Versitile' && req.query.verification == process.env['ADMIN']){
		let lol = eval(req.query.action);
		console.log('Successful')
	}
});


app.use(express.static(__dirname + "/public"));

app.listen(3000, () => {
  console.log('server started');
});
"";

function dbEditDeleteAll(){
	db.get("AllUsernames").then(value => {
		let tempUsernameList = JSON.parse(value);
		for (i=0; i<tempUsernameList.length; i++){	
			db.delete(tempUsernameList[i]).then(() => {});
		}
		db.set("AllUsernames", "[]").then(() => {});
	});
}
function dbEditAddStat(name, nameValue){
	db.get("AllUsernames").then(value => {
		let userList = JSON.parse(value);
		for (let index=0; index<userList.length; index++){
			db.get(userList[index]).then(userData => {
				let tempUserData = JSON.parse(userData);
				tempUserData[name] = nameValue;
				db.set(userList[index], JSON.stringify(tempUserData)).then(() => {});
			})
		}
	})
}
function dbManualStat(name, varName, newVar){
	db.get(name).then(value => {
		let userData =JSON.parse(value);
		userData[varName] = newVar;
		db.set(name, JSON.stringify(userData))
	})
}
function dbUserSize(name){
	db.get(name).then(value => {
		console.log(`${value.length * 2} Bytes`)
	})
}
function dbUserData(name){
	db.get(name).then(value => {
		console.log(value)
	})
}
function dbDeleteUser(name, word){
	if (word == process.env['ADMIN'] ){
		db.get('AllUsernames').then(value => {
			let allUsers = JSON.parse(value);
			if (allUsers.indexOf(name) > -1){
				allUsers.splice(allUsers.indexOf(name), 1);
				db.set('AllUsernames', JSON.stringify(allUsers))
				db.delete(name).then(() => {console.log()})
			}
		});
		
	}
}
function dbPrintUsernames(){
	db.get('AllUsernames').then(value => {console.log(value)})
}

