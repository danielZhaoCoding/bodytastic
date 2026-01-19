// Type == MC or INPUT
// Choice = List of Choices, or Placeholder Text
var diagnostic_info = [[0, 0], [0, 0]] // Scores
var diagnostic_innerHTML = [] // Combined innerHTML
var all_questions = [];
var diagnosticContainer = document.getElementById('DiagnosticContainer');
var diagnosticStartButton = document.getElementById('DiagnosticFirstButton');
var resultPage = document.getElementById('DiagnosticResult');
var question_info = {};
var diagnostic_info = [[0, 0], [0, 0]];   //Physical Minimum, Physical Maximum, Mental Minimum, Mental Maximum
var physicalScore = 0;
var mentalScore = 0;
var currentQuestion = 1; //Base 1
var allIDS = []

//Diagnostic Data
d_data = [
	{ Question: 'Which Gender Do You Identify As?', Type: 'MC', Choices: ['Male', 'Female', 'Non-Binary/Other'], Function: 'function1(this.selected)', Selected: '' },
	{ Question: 'How Old Are You?', Type: 'INPUT', Choices: 'years old', Function: 'function2(this.value)', Selected: '' },
	{ Question: 'How Tall Are You?', Type: 'MINPUT', Choices: ['feet', 'inches'], Function: 'function3(parseFloat(this.value[0]*12) + parseFloat(this.value[1]))', Selected: '' },
	{ Question: 'How Much do you Weigh?', Type: 'INPUT', Choices: 'pounds', Function: 'function4(this.value)', Selected: '' },
	{ Question: 'What Do You Think Your Quality of Life is?', Type: 'MC', Choices: ['Bad', 'Mediocre', 'Good', 'Great'], Function: 'function5(this.selected)', Selected: '' },
	{ Question: 'How much do you sleep a day?', Type: 'INPUT', Choices: 'hours', Function: 'function6(this.value)', Selected: '' },
	{ Question: 'Do you have any extreme addictions?', Type: 'MC', Choices: ['Yes', 'No'], Function: 'function7(this.selected)', Selected: '' },
	{ Question: 'How much do you exercise a week?', Type: 'MINPUT', Choices: ['hours of intense exercise', 'hours of normal exercise'], Function: 'function8(parseFloat(this.value[0]) * 1.4 + parseFloat(this.value[1]))', Selected: '' },
	{ Question: 'How much junk/unhealthy food do you eat?', Type: 'MC', Choices: ['None', 'A Bit', 'A Decent Amount', 'A Lot'], Function: 'function9(this.selected)', Selected: '' },
	{ Question: 'How much healthy food do you eat?', Type: 'MC', Choices: ['None', 'A Bit', 'A Decent Amount', 'A Lot'], Function: 'function10(this.selected)', Selected: '' },
	{ Question: 'How much stress do you experience?', Type: 'MC', Choices: ['No Stress', 'A Small Amount', 'A Decent Amount', 'Constant Stress'], Function: 'function11(this.selected)', Selected: '' },
	{ Question: 'How often does stress interfere with your daily life?', Type: 'MC', Choices: ['Not at all', 'Sometimes', 'Often', 'Constantly'], Function: 'function12(this.selected)', Selected: '' },
	{ Question: 'How many fluid ounces of fluid do you drink a day?', Type: 'INPUT', Choices: 'fluid ounces', Function: 'function13(this.value)', Selected: '' }
]

d_descriptions = ['', '', '', '', '', '', 'This include things like drugs, alchohol, smoking, vaping, etc.', '', 'Fried Foods, Soda, Highly Processed Foods, Chips, and other types of junk food are included', 'Vegetables, Fruit, Vitamin Rich Foods, and Fish are just some common healthy foods', '', 'This can include panic attacks, trouble focusing, trouble sleeping, and excessive amounts of crying.', '1 Normal Sized Cup is about 8 fluid oz. and an average water bottle is 16-24 fl oz.']


var total_questions = d_data.length;

class MultipleChoice {
	constructor(question_number, function_name, choices, question, type, des) {
		this.question_number = question_number;
		this.function_name = function_name;
		this.choices = choices;
		this.question = question;
		this.id = `Question${question_number}`;
		this.indexing = question_number - 1;
		this.innerHTML = '';
		this.selected = '';
		this.type = type;
		this.description = des;
	}
	//Generating HTML and Adding the Question
	createHTML() {
		var createdQuestion = document.createElement('div');
		createdQuestion.classList.add('diagnosticQuestion');
		createdQuestion.id = this.id;

		var createdHeader = document.createElement('h2');
		createdHeader.innerHTML = this.question;
		createdQuestion.appendChild(createdHeader);

		var createdDes = document.createElement('p');
		createdDes.innerHTML = this.description;
		createdQuestion.appendChild(createdDes);

		for (let index = 0; index < this.choices.length; index++) {
			var createdInputBox = `<input type="button" value="${this.choices[index]}" onclick="multipleChoiceChange(${this.indexing}, this)">`;
			createdQuestion.innerHTML += createdInputBox;
		}

		if (this.indexing == 0){
			createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"><button class="diagnosticMove" onclick="nextQuestion()">Next</button> </div>'
		} else if (this.indexing == d_data.length - 1){
			createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"> <button class="diagnosticMove" onclick="previousQuestion()">Previous</button>';
		} else {
		createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"> <button class="diagnosticMove" onclick="previousQuestion()">Previous</button> <button class="diagnosticMove" onclick="nextQuestion()">Next</button> </div>';
		}
		this.innerHTML = `<div class="diagnosticQuestion" id="${this.id}">${createdQuestion.innerHTML}</div>`;
		diagnosticContainer.appendChild(createdQuestion);
	}
	//Submitting the Value
	submitValue() {
		var tempInfo = eval(this.function_name);
		diagnostic_info[tempInfo[0]][0] += parseFloat(tempInfo[1]);
		diagnostic_info[tempInfo[0]][1] += parseFloat(tempInfo[2]);
	}
}

class InputBox {
	constructor(question_number, function_name, extra_text, question, type, des) {
		this.question_number = question_number;
		this.function_name = function_name;
		this.extra_text = extra_text;
		this.question = question;
		this.id = `Question${question_number}`;
		this.indexing = question_number - 1;
		this.innerHTML = '';
		this.value = 0;
		this.type = type;
		this.description = des;
	}
	// Creating the HTML and adding the Question
	createHTML() {
		var createdQuestion = document.createElement('div');
		createdQuestion.id = this.id;
		createdQuestion.classList.add('diagnosticQuestion');

		var createdHeader = document.createElement('h2');
		createdHeader.innerHTML = this.question;
		createdQuestion.appendChild(createdHeader);

		var createdDes = document.createElement('p');
		createdDes.innerHTML = this.description;
		createdQuestion.appendChild(createdDes);

		var createdInput = `<input type="number" placeholder="${this.extra_text}" onchange="inputBoxChange()">`;
		createdQuestion.innerHTML += createdInput;
		if (this.indexing == 0){
			createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"><button class="diagnosticMove" onclick="nextQuestion()">Next</button> </div>'
		} else if (this.indexing == d_data.length - 1){
			createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"> <button class="diagnosticMove" onclick="previousQuestion()">Previous</button>';
		} else {
		createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"> <button class="diagnosticMove" onclick="previousQuestion()">Previous</button> <button class="diagnosticMove" onclick="nextQuestion()">Next</button> </div>';
		}
		this.innerHTML = `<div class="diagnosticQuestion" id="${this.id}">${createdQuestion.innerHTML}</div>`;
		diagnosticContainer.appendChild(createdQuestion);

	}
	//Getting the Value
	getValue() {
		this.value = document.getElementById(this.id).getElementsByTagName('input')[0].value;
		d_data[this.indexing]['Selected'] = this.value;
	}
	//Submitting the Value
	submitValue() {
		var tempInfo = eval(this.function_name);
		diagnostic_info[tempInfo[0]][0] += parseFloat(tempInfo[1]);
		diagnostic_info[tempInfo[0]][1] += parseFloat(tempInfo[2]);
	}
}

class MultipleInputBox {
	constructor(question_number, function_name, extra_text, question, type, des) {
		this.length = extra_text.length;
		this.question_number = question_number;
		this.function_name = function_name;
		this.extra_text = extra_text;
		this.question = question;
		this.id = `Question${question_number}`;
		this.indexing = question_number - 1;
		this.innerHTML = '';
		this.value = [0, 0];
		for (let index = 0; index < this.length; index++) {
			this.value.push(0)
		}
		this.type = type;
		this.description = des;
	}
	// Creating the HTML and adding the Question
	createHTML() {
		var createdQuestion = document.createElement('div');
		createdQuestion.id = this.id;
		createdQuestion.classList.add('diagnosticQuestion');

		var createdHeader = document.createElement('h2');
		createdHeader.innerHTML = this.question;
		createdQuestion.appendChild(createdHeader);

		var createdDes = document.createElement('p');
		createdDes.innerHTML = this.description;
		createdQuestion.appendChild(createdDes);

		for (let index = 0; index < this.length; index++) {
			var createdInput = `<input type="number" placeholder="${this.extra_text[index]}" onchange="mInputBoxChange(${index})">`;
			createdQuestion.innerHTML += createdInput;
		}
		if (this.indexing == 0){
			createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"><button class="diagnosticMove" onclick="nextQuestion()">Next</button> </div>'
		} else if (this.indexing == d_data.length - 1){
			createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"> <button class="diagnosticMove" onclick="previousQuestion()">Previous</button>';
		} else {
		createdQuestion.innerHTML += '<div class="diagnosticMoveContainer"> <button class="diagnosticMove" onclick="previousQuestion()">Previous</button> <button class="diagnosticMove" onclick="nextQuestion()">Next</button> </div>';
		}
		this.innerHTML = `<div class="diagnosticQuestion" id="${this.id}">${createdQuestion.innerHTML}</div>`;
		diagnosticContainer.appendChild(createdQuestion);

	}
	//Getting the Value
	getValue() {
		for (let index = 0; index < this.length; index++) {
			this.value[index] = document.getElementById(this.id).getElementsByTagName('input')[index].value;
		}
		d_data[this.indexing]['Selected'] = this.value;
	}
	//Submitting the Value
	submitValue() {
		var tempInfo = eval(this.function_name);
		diagnostic_info[tempInfo[0]][0] += parseFloat(tempInfo[1]);
		diagnostic_info[tempInfo[0]][1] += parseFloat(tempInfo[2]);
	}
}

function previousQuestion(){
	document.getElementById(`Question${currentQuestion}`).style.display = 'none';
	currentQuestion -= 1;
	document.getElementById(`Question${currentQuestion}`).style.display = 'block';
	if (d_data.length == currentQuestion){
		document.getElementById("DiagnosticLastButton").style.display = 'block';
	}
	if (d_data.length != currentQuestion){
		document.getElementById("DiagnosticLastButton").style.display = 'none';
	}
}

function nextQuestion(){
	document.getElementById(`Question${currentQuestion}`).style.display = 'none';
	currentQuestion += 1;
	document.getElementById(`Question${currentQuestion}`).style.display = 'block';
	if (d_data.length == currentQuestion){
		document.getElementById("DiagnosticLastButton").style.display = 'block';
	}
	if (d_data.length != currentQuestion){
		document.getElementById("DiagnosticLastButton").style.display = 'none';
	}
}


//Tracking Progress for Multiple Choice Questions
function multipleChoiceChange(index, element) {
	d_data[index]['Selected'] = element.value;
	all_questions[index].selected = element.value;
	for (i = 0; i < d_data[index]['Choices'].length; i++) {
		document.getElementById(`Question${index + 1}`).getElementsByTagName('input')[i].classList.remove('selectedQuestion');
	}
	element.classList.toggle('selectedQuestion');
	//Stuff for Choosing activated values
	//Toggle the class selected
}

//Tracking Progress for Input Boxes
function inputBoxChange() {
	for (i = 0; i < all_questions.length; i++) {
		if (all_questions[i].type == 'INPUT') {
			all_questions[i].getValue();
		}
	}
}

//Tracking Progress for Multiple Boxes
function mInputBoxChange(index) {
	for (i = 0; i < all_questions.length; i++) {
		if (all_questions[i].type == 'MINPUT') {
			all_questions[i].getValue();
		}
	}
}

//Starting the Diangostic
function startDiagnostic() {
	currentQuestion = 1;
	document.getElementById("DiagnosticLastButton").style.display = 'none';
	diagnosticStartButton.style.display = 'none';
	diagnosticContainer.style.display = 'block';
	for (i=0;i<d_data.length;i++){
		document.getElementById(allIDS[i]).style.display = 'none';
	}
	document.getElementById(allIDS[0]).style.display = 'block';
}

//Calculating Scores
function endDiagnostic() {
	var completedDiagnostic = true;
	//Checking if the questions are completed
	for (i = 0; i < total_questions; i++) {
		if (d_data[i]['Selected'] == '') {
			completedDiagnostic = false;
			alert('Please fill out all questions');
			break;
		}
	}
	//If All Questions are filled out
	if (completedDiagnostic) {
		for (i = 0; i < total_questions; i++) {
			all_questions[i].submitValue();
		}
		//Evaluating Diangostic Info
		if (diagnostic_info[1][0] > diagnostic_info[1][1]) {
			diagnostic_info[1][0] = diagnostic_info[1][1] * 0.9;
		}
		if (diagnostic_info[1][0] < 0) {
			diagnostic_info[1][0] = 0;
		}
		if (diagnostic_info[0][0] > diagnostic_info[0][1]) {
			diagnostic_info[0][0] = diagnostic_info[0][1]
		}
		physicalScore = parseInt(diagnostic_info[0][0] / diagnostic_info[0][1] * 100);
		mentalScore = parseInt((1 - diagnostic_info[1][0] / diagnostic_info[1][1]) * 100);
		if (mentalScore < 0) {
			mentalScore = 0;
		}
		if (physicalScore < 0) {
			physicalScore = 0;
		}
		diagnosticContainer.style.display = 'none';
		resultPage.style.display = 'block';

		var newDiagnosticResult = document.createElement('h4');
		newDiagnosticResult.innerHTML += `Physical Rating: ${physicalScore}`;
		newDiagnosticResult.style.color = colorList[physicalScore];
		resultPage.insertBefore(newDiagnosticResult, document.getElementById("DiagnosticImage"))

		var newDiagnosticResult = document.createElement('h4');
		newDiagnosticResult.innerHTML += `Mental Rating: ${mentalScore}`;
		newDiagnosticResult.style.color = colorList[mentalScore];
		resultPage.insertBefore(newDiagnosticResult, document.getElementById("DiagnosticImage"))

		points["PhysicalRating"] = physicalScore;
		points["MentalRating"] = mentalScore;
		updateHomepage()
		appendLogAlt({
			'Date': `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
			'Type': 'Diagnostic',
			'Info': `Physical Rating: ${physicalScore}  Mental Rating: ${mentalScore}`
		})
		dataSendingCompletedD();
	}
}

//Reseting the Diagnostic
function clearDiagnostic() {
	diagnosticContainer.innerHTML = '';
	mentalScore = 0;
	physicalScore = 0;
	all_questions = [];

	//Adding the Challenges to the list
	for (i = 0; i < d_data.length; i++) {
		if (d_data[i]['Type'] == 'MC') {
			all_questions.push(new MultipleChoice(i + 1, d_data[i]['Function'], d_data[i]['Choices'], d_data[i]['Question'], d_data[i]['Type'], d_descriptions[i]));
		} else if (d_data[i]['Type'] == 'INPUT') {
			all_questions.push(new InputBox(i + 1, d_data[i]['Function'], d_data[i]['Choices'], d_data[i]['Question'], d_data[i]['Type'], d_descriptions[i]));
		} else if (d_data[i]['Type'] == 'MINPUT') {
			all_questions.push(new MultipleInputBox(i + 1, d_data[i]['Function'], d_data[i]['Choices'], d_data[i]['Question'], d_data[i]['Type'], d_descriptions[i]));
		}
		all_questions[i].createHTML();
	}

	diagnosticContainer.innerHTML += '<button id="DiagnosticLastButton" onclick="endDiagnostic()">Submit Diagnostic</button>';
	diagnosticContainer.style.display = 'none';
	resultPage.removeChild(resultPage.children[1]);
	resultPage.removeChild(resultPage.children[1]);
	resultPage.style.display = 'none';
	diagnosticStartButton.style.display = '';
	diagnostic_info = [[0, 0], [0, 0]];
	question_info = {};
	diagnostic_innerHTML = '';
	currentQuestion = 1;
	document.getElementById("DiagnosticLastButton").style.display = 'none';
}


function function1(selected) {
	question_info['Gender'] = selected;     //Algorithm
	if (selected == 'Non-Binary/Other') {
		depression_levels = 0.3
	} else if (selected == 'Female') {
		depression_levels = 0.4
	} else {
		depression_levels = 0.2
	}
	return [1, depression_levels, 2]
}

function function2(selected) {
	question_info['Age'] = parseInt(selected);
	selected = parseInt(selected);
	if (selected <= 1) {
		question_info['Class'] = 0;
	} else if (selected == 2) {
		question_info['Class'] = 1;
	} else if (2 < selected && selected < 6) {
		question_info['Class'] = 2;
	} else if (5 < selected && selected < 13) {
		question_info['Class'] = 3;
	} else if (12 < selected && selected < 19) {
		question_info['Class'] = 4;
	} else {
		question_info['Class'] = 5;
	}
	return [0, 0, 0]
}

function function3(selected) {
	question_info['Height'] = parseFloat(selected);
	return [1, 0, 0]
}

function function4(selected) {
	question_info['Weight'] = parseFloat(selected);
	question_info['BMI'] = (question_info["Weight"] / question_info["Height"] / question_info["Height"]) * 703;
	var extra = (question_info['Gender'] == "Male") ? 2 : 4;
	var score = (question_info["BMI"] > 30) ? parseFloat((question_info["BMI"] - 30) ** 1.21).toFixed(1) + extra : extra;
	return [1, score * 2, 40]
}

function function5(selected) {
	if (selected == 'Bad') {
		selected = 20;
	} else if (selected == 'Mediocre') {
		selected = 40;
	} else if (selected == 'Good') {
		selected = 70;
	} else if (selected == 'Great') {
		selected = 90;
	}
	question_info['QOL'] = selected;
	if (question_info["Age"] < 70 && question_info["QOL"] < 65) {
		var score = (80 - question_info["QOL"]) * 5 / question_info["Age"];
	} else {
		var score = (80 - question_info["QOL"]) / 2;
	}
	return [1, score, 25]
}

function function6(selected) {
	question_info['Sleep'] = parseFloat(selected);
	if (parseFloat(selected) >= 12 - question_info["Class"]) {
		diagnostic_info[1][0] += 0
		diagnostic_info[1][1] += 10
		return [0, 10, 10];
	} else if (12 - question_info["Class"] > parseFloat(selected)) {
		diagnostic_info[1][0] += 10 - (12 - question_info["Class"] - parseFloat(selected)) - (12 - question_info["Class"] - parseFloat(selected))
		diagnostic_info[1][1] += 10
		return [0, (10 - (12 - question_info["Class"] - parseFloat(selected))) - (12 - question_info["Class"] - parseFloat(selected)), 10];
	} else {
		diagnostic_info[1][0] += Math.abs(14 - question_info["Class"] - parseFloat(selected))
		diagnostic_info[1][1] += 10
		return [0, (10 - Math.abs(14 - question_info["Class"] - parseFloat(selected))), 10];
	}
}

function function7(selected) {
	question_info['Addiction'] = selected;
	var result = (selected == 'No') ? 5 : 1;
	return [0, result, 5]
}

function function8(selected) {
	if (parseInt(selected) > 9){
		selected = 9;
	}
	question_info['PA'] = parseFloat(selected);
	selected = parseFloat(selected) * 60;
	var exercise = (selected >= 150) ? 5 + (selected - 200) / 300 : selected / 30;
	var value = (question_info["Age"] < 20) ? 23 - (20 - question_info["Age"]) * .75 : 23;
	return [0, exercise * 3 + (10 - (Math.abs(question_info["BMI"] - value))), 15 + 10];
}

function function9(selected) {
	question_info['Junk'] = selected;
	if (selected == 'None') {
		return [0, 15, 15];
	} else if (selected == 'A Bit') {
		return [0, 12, 15];
	} else if (selected == 'A Decent Amount') {
		return [0, 5, 18];
	} else {
		return [0, 0, 20];
	}
}

function function10(selected) {
	question_info['Healthy'] = selected;
	if (selected == 'None') {
		return [0, 0, 15];
	} else if (selected == 'A Bit') {
		return [0, 3, 12]
	} else if (selected == 'A Decent Amount') {
		return [0, 7.5, 10]
	} else {
		return [0, 10, 10]
	}
}

function function11(selected) {
	question_info['Stress'] = selected;
	//var stringToValues = { 'No Stress': 5, 'A Small Amount': 25, 'A Decent Amount': 45, 'Constant Stress': 72 };
	return [1, 0, 0]
	//return [1, stringToValues[selected] / 25, 25];
}

function function12(selected) {
	question_info['StressImpact'] = selected;
	var finalValue = 0
	if (question_info['Stress'] == 'No Stress') {
		finalValue = { 'Not at all': 100, 'Sometimes': 95, 'Often': 90, 'Constantly': 85 }[selected]
	} 
	
	if (question_info['Stress'] == 'A Small Amount') {
		finalValue = { 'Not at all': 95, 'Sometimes': 86, 'Often': 76, 'Constantly': 64 }[selected]
	} 
	
	if (question_info['Stress'] == 'A Decent Amount') {
		finalValue = { 'Not at all': 92, 'Sometimes': 81, 'Often': 68, 'Constantly': 60 }[selected]
	}
	
	if (question_info['Stress'] == 'Constant Stress') {
		finalValue = { 'Not at all': 89, 'Sometimes': 76, 'Often': 65, 'Constantly': 40 }[selected]
	}
	return [1, 40 - (finalValue * .4), 40]
}

function function13(selected) {
	selected = parseFloat(selected);
	if (selected < question_info['Weight'] * .7) {
		return [0, 13 - .18 * (question_info["Weight"] * .7 - selected), 13]
	} else {
		return [0, 13, 13]
	}
}


//Adding the Challenges to the list
for (i = 0; i < d_data.length; i++) {
	if (d_data[i]['Type'] == 'MC') {
		all_questions.push(new MultipleChoice(i + 1, d_data[i]['Function'], d_data[i]['Choices'], d_data[i]['Question'], d_data[i]['Type'], d_descriptions[i]));
	} else if (d_data[i]['Type'] == 'INPUT') {
		all_questions.push(new InputBox(i + 1, d_data[i]['Function'], d_data[i]['Choices'], d_data[i]['Question'], d_data[i]['Type'], d_descriptions[i]));
	} else if (d_data[i]['Type'] == 'MINPUT') {
		all_questions.push(new MultipleInputBox(i + 1, d_data[i]['Function'], d_data[i]['Choices'], d_data[i]['Question'], d_data[i]['Type'], d_descriptions[i]));
	}
	allIDS.push(`Question${i+1}`)
	all_questions[i].createHTML();
}
diagnosticContainer.style.display = 'none';
diagnosticContainer.innerHTML += '<button id="DiagnosticLastButton" onclick="endDiagnostic()">Submit Diagnostic</button>';
resultPage.style.display = 'none';
