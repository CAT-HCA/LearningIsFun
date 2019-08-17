"use strict";

//document ready event handler
$(function() {
	//pulling course ID form query string
	let urlParams = new URLSearchParams(location.search);
	let courseId = urlParams.get("id");
	let courseName = urlParams.get("name");
	$("#courseRegisterTitle").html("Register for: " + courseName)
	$("#courseNameField").html(courseName);
	let previousUrl = document.referrer;

	//populating breadcrumb to direct back to course details for course id
	let markup = $("<li class='breadcrumb-item'><a href='details.html?id=" + courseId + "'>Course Details</a></li>");
	markup.insertBefore("#registerBreadcrumb");

	//pre-filling locked down course ID from query string
	$("#courseIdField").val(courseId);

	//register button click event
	$("#confirmRegBtn").on("click", function() {
		let nameValidationResult = validateNameField();
		if (nameValidationResult == false) {
			disableButton();
		}else{
			let emailValidationResult = validateEmailField(courseId);
			if (emailValidationResult == false) {
			disableButton();
			} 
			else {
			postNewStudent(courseId)
		}
	}
	});

	//cancel button click event
	$("#cancelBtn").on("click", function() {
		$("#studentNameInput").val("");
		$("#studentEmailInput").val("");
		$("#errorDiv").hide();
		$("#errorDiv").html("")
		$("#confirmRegBtn").prop("disabled", false);
	});

		//cancel button click event
		$("#goBackBtn").on("click", function() {
			window.location.assign(previousUrl);
		});


});

//function for validating name field
function validateNameField() {
	if ($("#studentNameInput").val() == "") {
		$("#errorDiv").html("Please enter a valid name");
		$("#errorDiv").show();
		return false;
	} else {
		//in case revalidating after user updated field
		$("#errorDiv").hide();
		$("#errorDiv").html("")
		return true;
	}
}

function validateEmailField(courseId) {
	//if is it empty?
	if ($("#studentEmailInput").val() == "") {
		$("#errorDiv").html("Please enter a valid email address");
		$("#errorDiv").show();
		return false;
	} else {
		//in case revalidating after user updated field
		$("#errorDiv").hide();
		$("#errorDiv").html("")
		let emailPattern = new RegExp(
			"^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$"
		);

		if (emailPattern.test($("#studentEmailInput").val()) != true) {
			$("#errorDiv").html("Please enter a valid email address");
			$("#errorDiv").show();
			return false;
		} else {
			return true;
		}
	}
}

//disable button function
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
function postNewStudent(courseId){
	$.post("/api/register", $("#registerTblForm").serialize(), function(data) {});
	window.location.assign("/details.html?id=" + courseId); //add param for if successful for details page to catch
}
