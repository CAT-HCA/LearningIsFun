"use strict";
//document ready event handler
$(function() {
	//pulling course ID form query string
	let urlParams = new URLSearchParams(location.search);
	let courseId = urlParams.get("id");
	$("#courseTitle").html("Course Details: " + courseId)

	//retrieving course data from json file
	$.getJSON("/api/courses/" + courseId, function(data) {
		buildRow("Course ID", courseId);
		buildRow("Course Name", data.Title);
		buildRow("Category", data.Category);
		buildRow("Location", data.Location);
		buildRow("Start Date", data.StartDate);
		buildRow("End Date", data.EndDate);
		buildRow("Meets", data.Meets);
		buildRow("Fee", "$" + data.Fee);
		buildRow("Students Enrolled", data.Students.length);

		//dynamically populating register button to pass query string with course ID
		let regBtnTag =
			'<div class="text-center"><a class="btn btn-primary w-25 text-center" href="register.html?id=' +
			courseId + '&name=' + data.Title + '" id="registerBtn">REGISTER FOR THIS COURSE</a></div>';
			$("#detailTblOutputForm").append(regBtnTag);

		//if there are students registered for the class, show the table
		if (data.Students.length > 0) {
			$("#studentTblOutput").show();

			//looping through student data array to pass to buildStudentRow function
			for (let i = 0; i < data.Students.length; i++) {
				buildStudentRow(data.Students[i].StudentName, data.Students[i].Email);
			}
		} 
		//if there are no students enrolled, show div with message
		else {
			$("#noStudentsDiv").show();
		}
	});
});

/*
*This function will dynamically create and populate the course details table
* @param property (string) - name of property
* @param value (string) - value of property for selected course
*/
function buildRow(property, value) {
	let propString = property.split(" ");
	let inputId = propString.join("").toLowerCase() + "OutputField";
	let markup = "<tr><td>" + property + '</td><td id="' + inputId + '">' + value + "</td></tr>";
	$("#tableBody").append(markup);
}

/*
*This function will dynamically create and populate the students enrolled table
* @param property (string) - name of property
* @param value (string) - value of property for selected course
*/
function buildStudentRow(property, value) {
	let propString = property.split(" ");
	let studentInputId = propString.join("").toLowerCase() + "OutputField";
	let studentMarkup = "<tr><td>" + property + '</td><td id="' + studentInputId + '">' + value + "</td></tr>";
	$("#studentTableBody").append(studentMarkup);
}
