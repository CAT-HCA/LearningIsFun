"use strict";    
    
//document ready event handler
$(function() {
    let addCatDDObjs;
    $("#errorMessageDiv").css("background-color", "#f5baba" )

	//retrieving category data from json file
	$.getJSON("/api/categories", function(data) {
		addCatDDObjs = data;
		//loop to populate drop down options
		for (let i = 0; i < addCatDDObjs.length; i++) {
			$("#newCourseCategory").append('<option value="' + addCatDDObjs[i].Category + '">' + addCatDDObjs[i].Category + "</option>");
		}
    });
    
   
    	//register button click event
	$("#addCourseBtn").on("click", function() {
        let validationResult = validateForm();
        if (validationResult == true){
            postNewCourse()
        }
		
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
        errorArray[errorArray.length] = "Please enter a valid Course Title"
    }
    if($("#newCourseCategory").val().trim() == "-1"){
        errorArray[errorArray.length] = "Please select a course category"
    }
    let addedFee = $("#newCourseFee").val().trim();
	if ((addedFee == "") ||(isNaN(addedFee) == true)){
		errorArray[errorArray.length] = "Please enter a course fee (numeric only)";
	}
    if($("#newCourseLocation").val() == ""){
        errorArray[errorArray.length] = "Please enter a valid Location"
    }
    if($("#newCourseMeets").val().trim() == ""){
        errorArray[errorArray.length] = "Please enter a valid Course meeting dates and times"
    }
    let datePattern = new RegExp ("^((0[1-9]|1[0-2])\/([1-2]0|[0-2][1-9])|(0[1,3-9]|1[0-2])\/30|(0[1,3,5,7,8]|1[0,2])\/31)\/[0-9][0-9]$");
    let d = $("#newCourseStartDate").val();
    let answer = datePattern.test(d)
    if( answer!= true){
        errorArray[errorArray.length] = "Please enter a Start Date in the format MM/DD/YY"
    }
    if(datePattern.test($("#newCourseEndDate").val()) != true){
        errorArray[errorArray.length] = "Please enter an End Date in the format MM/DD/YY"
    }

    if(errorArray.length == 0){
        return true;
    }
    if(errorArray.length > 0){
        $("#errorMessages").empty();
        for(let i = 0; i < errorArray.length; i++){
            $("<li>" + errorArray[i] + "</li>").appendTo($("#errorMessages"))
        }
        return false;
    }
}


function postNewCourse() {
	$.post("/api/courses", $("#newCourseForm").serialize(), function(data) {});
	window.location.assign("/courses.html");
}
