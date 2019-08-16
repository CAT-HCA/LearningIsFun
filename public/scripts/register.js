"use strict";

$(function() {
	//pulling course ID form query string
	let urlParams = new URLSearchParams(location.search);
	let courseId = urlParams.get("id");

	//populating breadcrumb to direct back to course details
	let markup = $("<li class='breadcrumb-item'><a href='details.html?id=" + courseId + "'>Course Details</a></li>");
	markup.insertBefore("#registerBreadcrumb");

	//pre-filling locked down course ID from query string
	$("#courseIdField").val(courseId);

	//register button click event
	$("#confirmRegBtn").on("click", function() {
        if ($("#studentNameInput").val() == "") 
        {
			$("#errorDiv").html("Please be sure you have filled out all fields");
			$("#errorDiv").show();
        } 
        else 
        {
            if ($("#emailInput").val() == "") 
            {
				$("#errorDiv").html("Please be sure you have filled out all fields");
				$("#errorDiv").show();
            } 
            else 
            {
				$("#errorDiv").hide();
				let emailValidation = validateEmail($("#emailInput").val());
                if (emailValidation == false) 
                {
					$("#errorDiv").html("Please enter a valid email address");
					$("#errorDiv").show();
                } 
                else 
                {
                    $("#errorDiv").hide();
                    
					$.post("/api/register", $("#registerTblForm").serialize(), function(data) {});
					window.location.assign("/details.html?id=" + courseId);
				}
			}
		}
	});

	//cancel button click event
	$("#cancelBtn").on("click", function() {
		$("#studentNameInput").val("");
		$("#emailInput").val("");
		$("#errorDiv").hide();
	});
});

function validateEmail(email) {
	let emailPattern = new RegExp("^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$");

	if (emailPattern.test(email)) {
		return true;
    } 
    else 
    {
		return false;
	}
}
