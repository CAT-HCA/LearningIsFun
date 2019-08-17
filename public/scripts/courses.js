"use strict";

//document ready event handler
$(function() {
	let ddObjs;

	//retrieving category data from json file
	$.getJSON("/api/categories", function(data) {
		ddObjs = data;
		//loop to populate drop down options
		for (let i = 0; i < ddObjs.length; i++) {
			$("#catSelect").append('<option value="' + ddObjs[i].Value + '">' + ddObjs[i].Category + "</option>");
		}
	});
	// call to courses api to pull courses matching selected category
	$("#catSelect").on("change", function() {
		$.getJSON("/api/courses/bycategory/" + $("#catSelect").val(), function(data) {
			let coursesObjs = data;
			createCourseTable(coursesObjs);
		});
	});
	// show all button on click event handler
	$("#showAllBtn").on("click", function() {
		$.getJSON("/api/courses/", function(data) {
			let coursesObjs = data;
			createCourseTable(coursesObjs);
		});
	});
});

/*
*This function will dynamically create and populate the course table
*and show the table header
* @param coursesObjs (Object) - object of course data
*/
function createCourseTable(coursesObjs) {
	$("#coursesTableBody").empty();
	let objLen = coursesObjs.length;
	for (let i = 0; i < objLen; i++) {
		let dynamicTableRow =
			"<tr><td>" +
			coursesObjs[i].CourseId +
			"</td><td>" +
			coursesObjs[i].Title +
			"</td><td>" +
			coursesObjs[i].StartDate +
			"</td><td><a href='details.html?id=" +
			coursesObjs[i].CourseId +
			"'>View Details</a></td></tr>";
		$("#coursesTableBody").append(dynamicTableRow);
		$("#courseTblOutput").show();
	}
}
