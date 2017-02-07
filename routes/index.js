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

	var msg = req.query.msg;
	if(msg === 'updated'){
		msg = "Your post has been updated";
	}
	// res.send(msg)
	// var taskArray = [];
	var selectQuery = "SELECT * FROM tasks";
	connection.query(selectQuery, (error, results, field)=>{
		// res.json(results);
		res.render('index', { taskArray: results, msg: msg });
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

// edit get
router.get('/edit/:id', (req, res, next)=>{
	// res.send(req.params.id);
	var selectQuery = "SELECT * FROM tasks WHERE id ="+req.params.id;
	// res.send(selectQuery);
	connection.query(selectQuery, (error,results,fields)=>{
		// res.json(results);
		// var date = results[0].task_date;
		var days = results[0].task_date.getDate();
		if(days < 10){
			days = "0"+days;
		}
		var months = results[0].task_date.getMonth() + 1;
		if(months < 10){
			months = "0"+months;
		}		
		var years = results[0].task_date.getFullYear();
		var mysqlDate = years + '-' + months + '-' + days;
		results[0].task_date = mysqlDate;
		// res.json(date);
		res.render('edit', { task:results[0] } );
	})
});

// edit post
router.post('/edit/:id', (req, res, next)=>{
	var id = req.params.id
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	var updateQuery = "UPDATE tasks SET task_name='"+newTask+"', task_date='"+taskDate+"' WHERE ID = "+id;
	// res.send(selectQuery)
	// res.send(updateQuery);
	connection.query(updateQuery, (error, results, fields)=>{
		if (error) throw error;
			res.redirect('/?msg=updated');
	})
})

//delete get
router.get('/delete/:id', (req, res, next)=>{
var selectQuery = "SELECT * FROM tasks WHERE id="+req.params.id;
	// res.send(req.params.id);
})

// delete post
router.post('/delete/:id', (req, res, next)=>{
	res.send(req.params.id);
})

module.exports = router;
