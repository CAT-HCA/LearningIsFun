"use strict";

//document ready event handler
$(function() {
	//pulling course ID form query string
	let urlParams = new URLSearchParams(location.search);
	let courseId = urlParams.get("id");
	$("#courseRegisterTitle").html("Register for: " + courseId);
	//retrieving course data from json file
	$.getJSON("/api/courses/" + courseId, function(data) {
		let courseName = data.Title
	$("#courseDetailTHead").html('<span class="font-weight-light">Registering for: </span>' + courseName);
	});

	let previousUrl = document.referrer;

	//populating breadcrumb to direct back to course details for course id
	let markup = $("<li class='breadcrumb-item'><a href='details.html?id=" + courseId + "'>Course Details</a></li>");
	markup.insertBefore("#registerBreadcrumb");

	//pre-filling locked down course ID from query string
	$("#courseIdField").val(courseId);

	//register button click event
	$("#confirmRegBtn").on("click", function() {
		let nameValidationResult = validateNameField();
		//if the name doesn't validate, call disable button function
		if (nameValidationResult == false) {
			disableButton();
		}
		//if it does, check email validation, if it fails, call disable button function
		else {
			let emailValidationResult = validateEmailField(courseId);
			if (emailValidationResult == false) {
				disableButton();
			}
			//if all validation passed, call function to post student
			else {
				postNewStudent(courseId);
			}
		}
	});

	//cancel button click event
	$("#cancelBtn").on("click", function() {
		$("#studentNameInput").val("");
		$("#studentEmailInput").val("");
		$("#errorDiv").hide();
		$("#errorDiv").html("");
		$("#confirmRegBtn").prop("disabled", false);
	});

	//cancel button click event
	$("#goBackBtn").on("click", function() {
		window.location.assign(previousUrl);
	});
});

//function for validating name field
function validateNameField() {
	if (($("#studentNameInput").val()).trim() == "") {
		$("#errorDiv").html("Please enter a valid name");
		$("#errorDiv").show();
		return false;
	} else {
		//in case revalidating after user updated field
		$("#errorDiv").hide();
		$("#errorDiv").html("");
		return true;
	}
}
//function to validate email field
function validateEmailField(courseId) {
	//check for empty
	if (($("#studentEmailInput").val()).trim() == "") {
		$("#errorDiv").html("Please enter a valid email address");
		$("#errorDiv").show();
		return false;
	} else {
		//in case revalidating after user updated field
		$("#errorDiv").hide();
		$("#errorDiv").html("");
		let emailPattern = new RegExp(
			"^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$"
		);
		//check against regex pattern
		if (emailPattern.test($("#studentEmailInput").val()) != true) {
			$("#errorDiv").html("Please enter a valid email address");
			$("#errorDiv").show();
			return false;
		}
		//in future - work on implementing code saved in notepad for confirming if email address already registered for course
		//email validation passed
		else {
			return true;
		}
	}
}

//disable and re-enable button function
function disableButton() {
	$("#confirmRegBtn").prop("disabled", true);

	//when user changes email field
	$("#studentNameInput").change(function() {
		$("#confirmRegBtn").prop("disabled", false);
		return true;
	});

	//when user changes email field
	$("#studentEmailInput").change(function() {
		$("#confirmRegBtn").prop("disabled", false);
		return true;
	});
}

//function to call api to post new student
function postNewStudent(courseId) {
	$.post("/api/register", $("#registerTblForm").serialize(), function(data) {});
	window.location.assign("/details.html?id=" + courseId);
	//in future, would like pass a param in query string to
	//details page to display success and highlight last table body child green
}
