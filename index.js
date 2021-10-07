const express = require('express');
const exphbs = require('express-handlebars');

// import sqlite modules
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const PORT = process.env.PORT || 3017;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support
app.engine('handlebars', exphbs({
	layoutsDir: './views/layouts'
}));


app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
	// check if the current user is logged in
	// console.log(req.headers);
	next();
});

open({
	filename: './notifications.db',
	driver: sqlite3.Database
}).then(async function (db) {

	// run migrations
	await db.migrate();

	app.get('/', async function (req, res) {

		const notifications = await db.all('select * from notifications');

		res.render('index', {
			notifications
		});

	});

	app.post('/count', function (req, res) {
		counter++;
		res.redirect('/')
	});

	app.post('/reminder', async function (req, res) {

		// read more about destructoring here - https://exploringjs.com/impatient-js/ch_destructuring.html
		const { firstName, dayCount, bookCount } = req.body;

		if (!firstName && !dayCount) {
			// nothing is added
			return res.redirect('/');
		}

		const insertNotificationSQL = 'insert into notifications (first_name, book_count, days_due_in) values (?, ?, ?)';
		await db.run(insertNotificationSQL, firstName, bookCount, dayCount);

		res.redirect('/')

	});


	app.get('/reminder/:dayCount/days', function (req, res) {

		// find me all the reminders for the current Day count
		const filteredReminders = reminders.filter(function (reminder) {
			return reminder.dayCount == Number(req.params.dayCount)
		})

		res.render('reminder', {
			reminders: filteredReminders
		});

	});

	app.post('/return/:id', async function(req, res){

		const bookId = req.params.id;
		const deleteNotificationSQL = 'delete from notifications where id = ?';
		await db.run(deleteNotificationSQL, bookId);
		res.redirect('/');
		
	});

	app.get('/edit/:id', function (req, res) {
		res.render("edit");
	});



	// only setup the routes once the database connection has been established

})




// we use global state to store data

const reminders = [];



// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});