"use strict";
//document ready event handler
$(function() {
	//pulling course ID form query string
	let urlParams = new URLSearchParams(location.search);
	let courseId = urlParams.get("id");
	$("#editCourseTitle").html("Edit Course: " + courseId);

	//retrieving course data from json file
	$.getJSON("/api/courses/" + courseId, function(data) {
		$("#editCourseId").val(courseId);
		$("#editCourseName").val(data.Title);
		$("#editCategory").val(data.Category);
		$("#editFee").val(data.Fee);
		$("#editCourseLocation").val(data.Location);
		$("#editCourseMeets").val(data.Meets);
		$("#editCourseStartDate").val(data.StartDate);
		$("#editCourseEndDate").val(data.EndDate);
	});

	//register button click event
	$("#editCourseBtn").on("click", function() {
		let validationResult = validateEditForm();
		if (validationResult == true) {
			finishEditCourse();
		}
	});

	//go back button click event
	$("#clearEditCourseBtn").on("click", function() {
		//retrieving course data from json file
		$.getJSON("/api/courses/" + courseId, function(data) {
			$("#editCourseId").val(courseId);
			$("#editCourseName").val(data.Title);
			$("#editCategory").val(data.Category);
			$("#editFee").val(data.Fee);
			$("#editCourseLocation").val(data.Location);
			$("#editCourseMeets").val(data.Meets);
			$("#editCourseStartDate").val(data.StartDate);
			$("#editCourseEndDate").val(data.EndDate);
		});
	});

	//go back button click event
	$("#cxlEditCourseBtn").on("click", function() {
		window.location.assign("courses.html");
	});
});

function validateEditForm() {
	let errorArray = [];
	if (
		$("#editCourseId")
			.val()
			.trim() == ""
	) {
		errorArray[errorArray.length] = "Please enter a valid Course ID";
	}
	if (
		$("#editCourseName")
			.val()
			.trim() == ""
	) {
		errorArray[errorArray.length] = "Please enter a valid Course Title";
	}
	if (
		$("#editCategory")
			.val()
			.trim() == "-1"
	) {
		errorArray[errorArray.length] = "Please select a course category";
    }
    let editedFee = $("#editFee").val().trim();
	if ((editedFee == "") ||(isNaN(editedFee) == true)){
		errorArray[errorArray.length] = "Please enter a course fee";
	}
	if ($("#editCourseLocation").val() == "") {
		errorArray[errorArray.length] = "Please enter a valid Location";
	}
	if (
		$("#editCourseMeets")
			.val()
			.trim() == ""
	) {
		errorArray[errorArray.length] = "Please enter a valid Course meeting dates and times";
	}
	let datePattern = new RegExp(
		"^((0[1-9]|1[0-2])/([1-2]0|[0-2][1-9])|(0[1,3-9]|1[0-2])/30|(0[1,3,5,7,8]|1[0,2])/31)/[0-9][0-9]$"
	);
	let d = $("#editCourseStartDate").val();
	let answer = datePattern.test(d);
	if (answer != true) {
		errorArray[errorArray.length] = "Please enter a Start Date in the format MM/DD/YY";
	}
	if (datePattern.test($("#editCourseEndDate").val()) != true) {
		errorArray[errorArray.length] = "Please enter an End Date in the format MM/DD/YY";
	}

	if (errorArray.length == 0) {
		return true;
	}
	if (errorArray.length > 0) {
		$("#editErrorMessages").empty();
		for (let i = 0; i < errorArray.length; i++) {
			$("<li>" + errorArray[i] + "</li>").appendTo($("#editErrorMessages"));
		}
		return false;
	}
}


function finishEditCourse(){
    $.ajax({
        url: "/api/courses", 
        method: "PUT",
        data: $("#editCourseForm").serialize(),
        success: function(result)
        {
            alert("You're course has been successfully edit");
            window.location.assign("courses.html");
      }});
}
