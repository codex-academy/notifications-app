const express = require('express');
const exphbs  = require('express-handlebars');

const app = express();
const PORT =  process.env.PORT || 3017;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(function(req, res, next) {
	// check if the current user is logged in
	console.log('in middleware...')
	next();
});



let counter = 0;

app.get('/', function(req, res) {
	res.render('index', {
		counter
	});
});

app.post('/count', function(req, res) {
	counter++;
	res.redirect('/')
});


// we use global state to store data

const reminders = [];

app.post('/reminder', function(req, res){

	console.log(req.body);

	reminders.push(req.body);

	res.redirect('/reminder')

});

app.get('/reminder', function(req, res){

	res.render('reminder', {
		reminders
	});

});

app.get('/reminder/:dayCount/days', function(req, res){

	// find me all the reminders for the current Day count
	const filteredReminders = reminders.filter(function(reminder){
		return reminder.dayCount == Number(req.params.dayCount)
	})

	res.render('reminder', {
		reminders : filteredReminders
	});
	
});






// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`App started on port ${PORT}`)
});