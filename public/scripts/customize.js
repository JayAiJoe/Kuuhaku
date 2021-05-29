var num_choices = [[20,35],[20,20],[11,10],[7,13]];
var types = ["hairfront","hairbehind","face","outfit"];
var currType = 0;
var row_limit = 5;
var sex = "female";
var sex_index = 0;
var optionHolder = [1,1,1,1];


document.addEventListener('DOMContentLoaded', function() {
	$.get('/getAvatar', {}, function(data, status){
		if(data.gender=="male"){
			sex = "male";
			sex_index = 1;
			$('#toggleSex').prop('checked', true);
		}
		resetAvatar();
		showOptions(0);
	});
}, false);

function saveChanges(){
	
	//save avatar changes
	$.get('/editAvatar', {gender:sex, hairf:optionHolder[0], hairb:optionHolder[1], face:optionHolder[2], outfit:optionHolder[3]}, function(data, status){
		if(data != null){
			window.location = "account";
		}
	});
	
}

function clearOptions() {
	
	var options = document.getElementById("types").children;
	var table = document.getElementById("options-table");
	
	for (var i = 0; i < options.length; i++) {
		options[i].firstChild.style.backgroundColor = "#1B0E44";
		options[i].firstChild.style.color = "#FFCB17";
	}

	for(var i = table.rows.length - 1; i > 0; i--)
	{
		table.deleteRow(i);
	}
	
	
}

function showOptions(n){
	
	clearOptions();
	
	var options = document.getElementById("types").children;
	var table = document.getElementById("options-table");
	var row;
	var rowCtr = 0;
	
	currType = n;
	options[n].firstChild.style.backgroundColor  = "gold";
	options[n].firstChild.style.color = "#1B0E44";
	
	for (var j = 1 ; j <= num_choices[n][sex_index]; j++) {
		if (rowCtr == 0) {
			row = document.createElement("tr");
		}
		
		if(rowCtr < row_limit)
		{ 
			row.innerHTML += "<td><input type=\"radio\" onclick=\"selectOption(" + j + ")\" name=\"" + types[n] 
								+ "\" id=\"" + types[n] + j + "\" value=\"" + types[n] + j 
								+ "\"><label for=\"" + types[n] + j + "\"><img src=\"images/avatar/" 
								+ types[n] + "/" + sex + "/" + j + ".png\" class=\"option\"></label></td>";
			rowCtr += 1;
		}
		else {
			table.appendChild(row);
			rowCtr = 0;
			j -= 1;
		}
		
		if(rowCtr > 0){
			table.appendChild(row)
		}
	}	
}

function selectOption(n) {
	var overlay = document.getElementById(types[currType] + "-overlay");
	
	overlay.src = "images/avatar/" + types[currType] + "/" + sex + "/" + n + ".png";
	optionHolder[currType] = n;
}

function resetAvatar() {

	$.get('/getAvatar', {}, function(data, status){
		if(data.gender == sex) {
			$('#body-overlay').attr('src', "images/avatar/body/" + sex + "/1.png");
			$('#hairfront-overlay').attr('src', "images/avatar/hairfront/" + sex + "/" + data.hairf + ".png"); // change
			$('#hairbehind-overlay').attr('src', "images/avatar/hairbehind/" + sex + "/" + data.hairb + ".png"); // change
			$('#face-overlay').attr('src', "images/avatar/face/" + sex + "/" + data.face + ".png");
			$('#outfit-overlay').attr('src', "images/avatar/outfit/" + sex + "/" + data.outfit + ".png");

			optionHolder[0] = data.hairf; // change
			optionHolder[1] = data.hairb; // change
			optionHolder[2] = data.face;
			optionHolder[3] = data.outfit;
		}
		else {
			$('#body-overlay').attr('src', "images/avatar/body/" + sex + "/1.png");
			$('#hairfront-overlay').attr('src', "images/avatar/hairfront/" + sex + "/1.png"); // change
			$('#hairbehind-overlay').attr('src', "images/avatar/hairbehind/" + sex + "/1.png"); // change
			$('#face-overlay').attr('src', "images/avatar/face/" + sex + "/1.png");
			$('#outfit-overlay').attr('src', "images/avatar/outfit/" + sex + "/1.png");

			optionHolder[0] = 1; // change
			optionHolder[1] = 1; // change
			optionHolder[2] = 1;
			optionHolder[3] = 1;

		}
		
	});
	
	

}

function changeSex() {
	if (sex=="male")
	{
		sex = "female";
		sex_index = 0;
	}
	else
	{
		sex = "male";
		sex_index = 1;
	}
	resetAvatar();
	clearOptions();
	showOptions(currType);
}
