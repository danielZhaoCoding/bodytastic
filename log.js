let selectLogCategory = document.getElementById("HealthLogSelect");
let allCategories = new Set();

//Logger Dropdowns
let monthDropdown = document.getElementById("loggerSelectMonth");
let dateDropdown = document.getElementById("loggerSelectDate");
let yearDropdown = document.getElementById("loggerSelectYear");

function setNewCategories() {
	let allCategories = new Set();
	for (let index = 0; index < healthLog.getElementsByTagName('tr').length; index++) {
		if (index == 0) {
		} else {
			let tempCategory = healthLog.getElementsByTagName('tr')[index].children[1].innerHTML;
			allCategories.add(tempCategory);
		}
	}
	selectLogCategory.innerHTML = '<option>All</option>';
	let tempCategoryList = Array.from(allCategories);
	for (let index = 0; index < tempCategoryList.length; index++) {
		selectLogCategory.innerHTML += `<option value="${tempCategoryList[index]}">${tempCategoryList[index]}</option>`
	}
}
function applyNewCategories() {
	let healthLogRows = healthLog.getElementsByTagName('tr')
	if (selectLogCategory.value == 'All') {
		for (let index = 0; index < healthLogRows.length; index++) {
			healthLogRows[index].style.display = '';
		}
		return;
	}
	for (let index = 1; index < healthLogRows.length; index++) {
		if (healthLogRows[index].children[1].innerHTML == selectLogCategory.value) {
			healthLogRows[index].style.display = '';
		} else {
			healthLogRows[index].style.display = 'none';
		}
	}
}
function setNewLoggerDropdowns() {
	let newOption;
	for (i = 0; i < 11; i++) {
		newOption = document.createElement('option');
		newOption.value = new Date().getFullYear() - i;
		newOption.innerText = `${newOption.value}`;
		yearDropdown.appendChild(newOption);
	}
	for (i = 1; i < 13; i++) {
		newOption = document.createElement('option');
		newOption.value = i
		newOption.innerText = `${i}`;
		monthDropdown.appendChild(newOption);
		monthDropdown.selectedIndex = new Date().getMonth();
	}
	for (i = 1; i < 32; i++) {
		newOption = document.createElement('option');
		newOption.value = i
		newOption.innerText = `${i}`;
		dateDropdown.appendChild(newOption);
		dateDropdown.selectedIndex = new Date().getDate() - 1;
	}
}
setNewCategories();
setNewLoggerDropdowns();
//{new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}
