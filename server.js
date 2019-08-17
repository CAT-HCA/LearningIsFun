let express = require('express');
let bodyParser = require('body-parser');
let fs = require("fs");
let app = express();

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

function logOneCourse(course)
{
    console.log("ID: " + course.CourseId + 
                " Title:" + course.Title + 
                " Location:" + course.Location + 
                " Starts:" + course.StartDate +
                " Ends:" + course.EndDate +
                " Meets:" + course.Meets +
                " Fee:" + course.Fee +
                " Enrollment: " + course.Students.length);
       
}

function logArrayOfCourses(arr)
{
    for(let i=0; i < arr.length; i++)
    {
        logOneCourse(arr[i])
    }
}

function getMatchingCourseById(id, data)
{
    let match = null;
    for(let i = 0; i < data.length; i++)
    {
        if (data[i].CourseId == id)
        {
            match = data[i];
            break;
        }
    }
    return match;
}

function getCategoryTextByValue(value, data)
{
    let match = null;
    for(let i = 0; i < data.length; i++)
    {
        if (data[i].Value == value)
        {
            match = data[i];
            break;
        }
    }
    return match;
}

function getMatchingCoursesByCategory(category, data)
{
    let matches = [];
    for(let i = 0; i < data.length; i++)
    {
        if (data[i].Category == category)
        {
            matches[matches.length] = data[i];
        }
    }
    return matches;
}


app.get('/', function (req, res) {
   console.log("Got a GET request at /");
   res.send('Training Site');
})

/* THIS CODE ALLOWS REQUESTS FOR THE PAGES THROUGH */

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/public/" + "index.html" );
 })

 app.get('/courses.html', function (req, res) {
    res.sendFile( __dirname + "/public/" + "courses.html" );
 })

 app.get('/details.html', function (req, res) {
    res.sendFile( __dirname + "/public/" + "details.html" );
 })

 app.get('/register.html', function (req, res) {
    res.sendFile( __dirname + "/public/" + "register.html" );
 })

 /* THIS CODE ALLOWS REQUESTS FOR THE PAGES THROUGH */

 app.get('/api/categories', function (req, res) {
    console.log("Got a GET request for categories");
    let data = fs.readFileSync( __dirname + "/data/" + "categories.json", 'utf8');
    data = JSON.parse(data);
    //console.log("Returned data is: ");
    //logArrayOfCourses(data);
    res.end( JSON.stringify(data) );
});

app.get('/api/courses', function (req, res) {
    console.log("Got a GET request for ALL courses");
    let data = fs.readFileSync( __dirname + "/data/" + "coursesOffered.json", 'utf8');
    data = JSON.parse(data);
    //console.log("Returned data is: ");
    //logArrayOfCourses(data);
    res.end( JSON.stringify(data) );
});

app.get('/api/courses/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for course " + id);

    let data = fs.readFileSync( __dirname + "/data/" + "coursesOffered.json", 'utf8');
    data = JSON.parse(data);

    let match = getMatchingCourseById(id, data)
    console.log("# founds = " + match.length)

    console.log( "Returned data is: " );
    logOneCourse(match);
    res.end( JSON.stringify(match) );
})

app.get('/api/courses/bycategory/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for course category " + id);                      

    let categories = fs.readFileSync( __dirname + "/data/" + "categories.json", 'utf8');
    categories = JSON.parse(categories);

    let selectedCategory = getCategoryTextByValue(id, categories).Category
    console.log( "Value was : " + id + " which matched category " + selectedCategory);

    let data = fs.readFileSync( __dirname + "/data/" + "coursesOffered.json", 'utf8');
    data = JSON.parse(data);

    // find the matching courses
    let matches = getMatchingCoursesByCategory(selectedCategory, data);

    //console.log( "Returned data is: " );
    //logArrayOfCourses(matches);
    res.end( JSON.stringify(matches) );
})

/* REGISTERS A STUDENT FOR THE COURSE */

app.post('/api/register', urlencodedParser, function (req, res) {
    console.log("Got a POST request to register student");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let selectedCourseId = req.body.courseid;
    let student = {
        StudentName:req.body.studentname,        
        Email:req.body.email
    };

    let data = fs.readFileSync( __dirname + "/data/" + "coursesOffered.json", 'utf8');
    data = JSON.parse( data );

    // Find the course
    var matchingCourse = data.find(function(course) {
        return course.CourseId == selectedCourseId;
      });

    matchingCourse.Students[matchingCourse.Students.length] = student;

    fs.writeFileSync(__dirname + "/data/" + "coursesOffered.json", JSON.stringify(data));
   
    console.log('Courses saved with new student added!');
    res.status(200).send();
 })


/* Adds a course but we don't need it */

app.post('/api/courses', urlencodedParser, function (req, res) {
    console.log("Got a POST request for courses");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync( __dirname + "/data/" + "coursesOffered.json", 'utf8');
    data = JSON.parse( data );

    let course = {
        CategoryId:req.body.courseid,
        Title:req.body.title,        
        category:req.body.category,
        Location:req.body.location,
        Instructor:req.body.instructor,
        StartDate:req.body.startdate,        
        EndDate:req.body.enddate,       
        Meets:req.body.meets,
        numDays:req.body.numdays
    };
    //console.log( "New course: " );
    //logOneCourse(course);

    data[data.length] = course;

    //console.log( "New data after add: " );
    //logArrayOfCourses(data);

    fs.writeFileSync(__dirname + "/data/" + "coursesOffered.json", JSON.stringify(data));
   
    console.log('New course saved!');
    res.status(200).send();
 })

 /*
 app.put('/api/courses', function (req, res) {
    console.log("Got a PUT request for courses");
    res.send('Courses PUT');
 })
 
 app.delete('/api/courses', function (req, res) {
    console.log("Got a DELETE request for courses");
    res.send('Courses DELETE');
 })
 */
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

let server = app.listen(8081, function () {
   //let host = server.address().address
   let port = server.address().port
   
   console.log("App listening at port %s", port)
})
