"use strict";

$(function() {
	let urlParams = new URLSearchParams(location.search);
	let courseId = urlParams.get("id");

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

		let regBtnTag =
			'<div class="text-center"><a class="btn btn-primary w-25 text-center" href="register.html?id=' +
			courseId +
			'" id="registerBtn">REGISTER FOR THIS COURSE</a></div>';
		$("#detailTblOutputForm").append(regBtnTag);

		if (data.Students.length > 0) {
			$("#studentTblOutput").show();
			for (let i = 0; i < data.Students.length; i++) {
				buildStudentRow(data.Students[i].StudentName, data.Students[i].Email);
			}
		} else {
			$("#noStudentsDiv").show();
		}
	});
});

function buildRow(property, value) {
	let propString = property.split(" ");
	let inputId = propString.join("").toLowerCase() + "OutputField";
	let markup = "<tr><td>" + property + '</td><td id="' + inputId + '">' + value + "</td></tr>";
	$("#tableBody").append(markup);
}

function buildStudentRow(property, value) {
	let propString = property.split(" ");
	let studentInputId = propString.join("").toLowerCase() + "OutputField";
	let studentMarkup = "<tr><td>" + property + '</td><td id="' + studentInputId + '">' + value + "</td></tr>";
	$("#studentTableBody").append(studentMarkup);
}
