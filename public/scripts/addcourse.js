"use strict";    
    
//document ready event handler
$(function() {
	let addCatDDObjs;

	//retrieving category data from json file
	$.getJSON("/api/categories", function(data) {
		addCatDDObjs = data;
		//loop to populate drop down options
		for (let i = 0; i < addCatDDObjs.length; i++) {
			$("#newCourseCategory").append('<option value="' + addCatDDObjs[i].Value + '">' + addCatDDObjs[i].Category + "</option>");
		}
    });
    
   
    	//register button click event
	$("#addCourseBtn").on("click", function() {
        let validationResult = validateForm();
		
    });
    
    	//go back button click event
	$("#cxlAddCourseBtn").on("click", function() {
		window.location.assign("courses.html");
    });


});


//function to validate text fields (course ID, course title, location, validate meeting times)

function validateForm(){
    let errorArray = [];
    if($("#newCourseId").val().trim() == ""){
        errorArray[errorArray.length] = "Please enter a valid Course ID"
    }
    if($("#newCourseTitle").val().trim() == ""){
        errorArray[errorArray.length] = "Please enter a valid Course Name"
    }
    if($("#newCourseLocation").val().trim() == ""){
        errorArray[errorArray.length] = "Please enter a valid Location"
    }
    if($("#newCourseMeets").val().trim() == ""){
        errorArray[errorArray.length] = "Please enter a valid Course meeting dates and times"
    }
    let datePattern = new RegExp("^\d{1,2}\/\d{1,2}\/\d{2}$");
    if($(datePattern.text("#newCourseStartDate").val()) == ""){
        errorArray[errorArray.length] = "Please enter a Start Date in the format MM/DD/YY"
    }
    if($(datePattern.text("#newCourseEndDate").val()) == ""){
        errorArray[errorArray.length] = "Please enter an End Date in the format MM/DD/YY"
    }
}


function postNewCourse() {
	$.post("/api/courses", $("#newCourseForm").serialize(), function(data) {});
	window.location.assign("/courses.html");
}
