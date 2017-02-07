var express = require('express');
var router = express.Router();
var config = require('../custom_modules/config.js');
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : config.host,
	user     : config.username,
	password : config.password,
	database : config.database
});

// after this line runs, we are connected to mysql
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	// var taskArray = [];
	var selectQuery = "SELECT * FROM tasks";
	connection.query(selectQuery, (error, results, field)=>{
		// res.json(results);
		res.render('index', { taskArray: results });
	})
	
});

router.post('/addNew', (req, res, next)=>{
	// res.json(req.body);
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	var insertQuery = "INSERT INTO tasks (task_name, task_date) VALUES ('"+newTask+"','"+taskDate+"')";
	// res.send(query);
	connection.query(insertQuery, (error, results, field)=>{
		if (error) throw error;
		res.redirect('/');
	});
});


module.exports = router;
