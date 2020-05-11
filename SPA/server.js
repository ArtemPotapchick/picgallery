require('dotenv').config(); // read .env files
const express = require('express');
var mysql = require('mysql');

var session = require('express-session');
var bodyParser = require('body-parser');
const app = express();


var mysql      = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "nodelogin",
    password: 'password'
  });
   connection.connect(function(err){
      if (err) {
        return console.error("Ошибка: " + err.message);
      }
      else{
        console.log("Подключение к серверу MySQL успешно установлено");
      }
   });
module.exports = connection; 


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());




const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
//app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.get('/', function(request, response) {
	response.sendFile(path.join(`${__dirname}/public/index.html`));
});
app.get('/login', function(request, response) {
	response.sendFile(path.join(`${__dirname}/login.html`));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});








// Listen for HTTP requests on port 3000
app.listen(port, () => {
  console.log('listening on %d', port);
});


