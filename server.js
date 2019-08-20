let express = require("express");

let bodyParser = require("body-parser");

let fs = require("fs");

let app = express();

// Create application/x-www-form-urlencoded parser

let urlencodedParser = bodyParser.urlencoded({ extended: false });

function logOneCourse(course) {
	console.log(
		"ID: " +
			course.CourseId +
			" Title:" +
			course.Title +
			" Location:" +
			course.Location +
			" Starts:" +
			course.StartDate +
			" Ends:" +
			course.EndDate +
			" Meets:" +
			course.Meets +
			" Fee:" +
			course.Fee +
			" Enrollment: " +
			course.Students.length
	);
}

function logArrayOfCourses(arr) {
	for (let i = 0; i < arr.length; i++) {
		logOneCourse(arr[i]);
	}
}

function getMatchingCourseById(id, data) {
	let match = null;

	for (let i = 0; i < data.length; i++) {
		if (data[i].CourseId == id) {
			match = data[i];

			break;
		}
	}

	return match;
}

function getCategoryTextByValue(value, data) {
	let match = null;

	for (let i = 0; i < data.length; i++) {
		if (data[i].Value == value) {
			match = data[i];

			break;
		}
	}

	return match;
}

function getMatchingCoursesByCategory(category, data) {
	let matches = [];

	for (let i = 0; i < data.length; i++) {
		if (data[i].Category == category) {
			matches[matches.length] = data[i];
		}
	}

	return matches;
}

/* THIS CODE ALLOWS REQUESTS FOR THE PAGES */

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/" + "index.html");
});

app.get("/index.html", function(req, res) {
	res.sendFile(__dirname + "/public/" + "index.html");
});

app.get("/courses.html", function(req, res) {
	res.sendFile(__dirname + "/public/" + "courses.html");
});

app.get("/details.html", function(req, res) {
	res.sendFile(__dirname + "/public/" + "details.html");
});

app.get("/register.html", function(req, res) {
	res.sendFile(__dirname + "/public/" + "register.html");
});


/* THIS CODE ALLOWS REQUESTS FOR THE API THROUGH */

// GET CATEGORIES

app.get("/api/categories", function(req, res) {
	console.log("Got a GET request for categories");

	let data = fs.readFileSync(__dirname + "/data/" + "categories.json", "utf8");

	data = JSON.parse(data);

	//console.log("Returned data is: ");

	//console.log(data.Category + " - " + data.Value);

	res.end(JSON.stringify(data));
});

// GET ALL COURSES

app.get("/api/courses", function(req, res) {
	console.log("Got a GET request for ALL courses");

	let data = fs.readFileSync(__dirname + "/data/" + "coursesOffered.json", "utf8");

	data = JSON.parse(data);

	//console.log("Returned data is: ");

	//logArrayOfCourses(data);

	res.end(JSON.stringify(data));
});

// GET ONE COURSE BY ID

app.get("/api/courses/:id", function(req, res) {
	let id = req.params.id;

	console.log("Got a GET request for course " + id);

	let data = fs.readFileSync(__dirname + "/data/" + "coursesOffered.json", "utf8");

	data = JSON.parse(data);

	let match = getMatchingCourseById(id, data);

	if (match == null) {
		res.status(404).send("Not Found");

		return;
	}

	//console.log( "Returned data is: " );

	//logOneCourse(match);

	res.end(JSON.stringify(match));
});

// GET MANY COURSES BY CATEGORY

app.get("/api/courses/bycategory/:id", function(req, res) {
	let id = req.params.id;

	console.log("Got a GET request for courses in category " + id);

	let categories = fs.readFileSync(__dirname + "/data/" + "categories.json", "utf8");

	categories = JSON.parse(categories);

	let selectedCategory = getCategoryTextByValue(id, categories).Category;

	console.log("Value was : " + id + " which matched category " + selectedCategory);

	let data = fs.readFileSync(__dirname + "/data/" + "coursesOffered.json", "utf8");

	data = JSON.parse(data);

	// find the matching courses

	let matches = getMatchingCoursesByCategory(selectedCategory, data);

	//console.log( "Returned data is: " );

	//logArrayOfCourses(matches);

	res.end(JSON.stringify(matches));
});

// REGISTER A STUDENT

app.post("/api/register", urlencodedParser, function(req, res) {
	console.log("Got a POST request to register student");

	console.log("BODY -------->" + JSON.stringify(req.body));

	let selectedCourseId = req.body.courseid;

	let student = {
		StudentName: req.body.studentname,

		Email: req.body.email,
	};

	let data = fs.readFileSync(__dirname + "/data/" + "coursesOffered.json", "utf8");

	data = JSON.parse(data);

	// Find the course

	let match = getMatchingCourseById(selectedCourseId, data);

	console.log("match is " + match);

	if (match == null) {
		res.status(404).send("Not Found");

		return;
	}

	// Then add the student

	match.Students[match.Students.length] = student;

	fs.writeFileSync(__dirname + "/data/" + "coursesOffered.json", JSON.stringify(data));

	console.log("Courses saved with new student added!");

	// console.log(student.StudentName + " at: " + student.Email)

	res.status(200).send();
});

// UNREGISTER A STUDENT

app.post("/api/unregister", urlencodedParser, function(req, res) {
	console.log("Got a POST request to un-enroll student");

	console.log(req);

	console.log("BODY ------> " + JSON.stringify(req.body));

	let enrollmentRecord = {
		CourseId: req.body.courseid,

		StudentName: req.body.studentname,

		Email: req.body.email,
	};

	let data = fs.readFileSync(__dirname + "/data/" + "coursesOffered.json", "utf8");

	data = JSON.parse(data);

	// Find course

	let match = getMatchingCourseById(enrollmentRecord.CourseId, data);

	if (match == null) {
		res.status(404).send("Not Found");

		return;
	}

	console.log("Match: " + match.Title);

	// Find student to remove

	let foundAt = -1;

	for (let i = 0; i < match.Students.length; i++) {
		if (
			match.Students[i].StudentName == enrollmentRecord.StudentName &&
			match.Students[i].Email == enrollmentRecord.Email
		) {
			foundAt = i;

			console.log("Student is #" + i);

			break;
		}
	}

	if (foundAt == -1) {
		res.status(404).send("Not Found");

		return;
	}

	// Remove student

	//console.log("Size of students array before delete: " + match.Students.length)

	let removedStudent = match.Students.splice(foundAt, 1);

	//console.log("Size of students array after delete: " + match.Students.length)

	fs.writeFileSync(__dirname + "/data/" + "coursesOffered.json", JSON.stringify(data));

	console.log("Student " + removedStudent.StudentName + " un-enrolled for " + enrollmentRecord.CourseId);

	res.status(200).send();
});

// ADD A COURSE

app.post("/api/courses", urlencodedParser, function(req, res) {
	console.log("Got a POST request to add course");

	console.log("BODY -------->" + JSON.stringify(req.body));

	let data = fs.readFileSync(__dirname + "/data/" + "coursesOffered.json", "utf8");

	data = JSON.parse(data);

	let course = {
		CourseId: req.body.courseid,

		Title: req.body.title,

		Category: req.body.category,

		Location: req.body.location,

		StartDate: req.body.startdate,

		EndDate: req.body.enddate,

		Meets: req.body.meets,

		Fee: req.body.fee,

		Students: [],
	};

	data[data.length] = course;

	//console.log("New course catalog: ");

	//logArrayOfCourses(data);

	fs.writeFileSync(__dirname + "/data/" + "coursesOffered.json", JSON.stringify(data));

	console.log("New course saved!");

	//logOneCourse(course);

	res.status(200).send();
});

// EDIT A COURSE

app.put("/api/courses", urlencodedParser, function(req, res) {
	console.log("Got a PUT request for courses");

	console.log("BODY -------->" + JSON.stringify(req.body));

	let data = fs.readFileSync(__dirname + "/data/" + "coursesOffered.json", "utf8");

	data = JSON.parse(data);

	// Find the course

	let match = getMatchingCourseById(req.body.courseid, data);

	if (match == null) {
		res.status(404).send("Not Found");

		return;
	}

	// Update the fields

	match.Title = req.body.title;

	match.Category = req.body.category;

	match.Location = req.body.location;

	match.StartDate = req.body.startdate;

	match.EndDate = req.body.enddate;

	match.Meets = req.body.meets;

	match.Fee = req.body.fee;

	// Make the change

	fs.writeFileSync(__dirname + "/data/" + "coursesOffered.json", JSON.stringify(data));

	console.log("Course updated... new info is:");

	logOneCourse(match);

	res.status(200).send();
});

app.delete("/api/unregister", function(req, res) {
	console.log("Got a DELETE request for student enrollment record");

	console.log("Student " + removedStudent.StudentName + " un-enrolled for " + enrollmentRecord.CourseId);

	res.status(200).send();
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

let server = app.listen(8081, function() {
	//let host = server.address().address

	let port = server.address().port;

	console.log("App listening at port %s", port);
});
