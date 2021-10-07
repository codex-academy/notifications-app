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
app.engine('handlebars', exphbs({
    layoutsDir : './views/layouts'
}));


app.set('view engine', 'handlebars');

app.use(function(req, res, next) {
	// check if the current user is logged in
	console.log(req.headers);
	next();
});

app.get('/', function(req, res) {
	res.render('index', {
		reminders
	});
});

app.post('/count', function(req, res) {
	counter++;
	res.redirect('/')
});


// we use global state to store data

const reminders = [];

app.post('/reminder', function(req, res){

	const reminder = req.body;

	// read more about destructoring here - https://exploringjs.com/impatient-js/ch_destructuring.html

	const {firstName, dayCount, bookCount} = req.body;

	if (!firstName && !dayCount ){
		// nothing is added
		return res.redirect('/');
	}

	reminder.notLate = Number(dayCount) > 0;
	reminders.push({
		firstName, 
		dayCount, 
		bookCount
	});

	res.redirect('/')

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

app.get('/edit/:id', function(req, res){
	res.render("edit");
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`App started on port ${PORT}`)
});