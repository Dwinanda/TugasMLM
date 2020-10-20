var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

const { Client } = require('pg')
const connectionString = 'postgres://postgres:thehunter1@localhost:5432/mahasiswa';
const client = new Client({
    connectionString: connectionString
});

client.connect()
    .then(res => console.log("Connected successfully..."))
    .catch(err => console.log("Connection failed..."));

//assign dust engine to .dust files
app.engine('dust', cons.dust);

//set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req, res) {
    client.query('SELECT * from mahasiswa', function(err, result) {
        if (err) {
            return console.error('error running query');
        }
        console.log(result.rows);
        res.render('index', {user: result.rows});
    });
});

app.post('/add', function(req, res) {
        client.query("INSERT INTO mahasiswa(id, first_name, last_name, gender, date_of_birth) VALUES($1, $2, $3, $4, $5)",
        [req.body.id, req.body.first_name, req.body.last_name, req.body.gender, req.body.date_of_birth]);
        
        console.log("data input succeedd");
        res.redirect('/');
});
    
app.delete('/delete/:id', function(req, res){
        client.query("DELETE FROM mahasiswa WHERE id = $1;",
        [req.params.id], function(err, result){
            if (err) {
                return console.error('error running query', err);
            }
            client.query('SELECT * from mahasiswa', function(err, result) {
                if (err) {
                    return console.error('error running query');
                }
                console.log(result.rows);
                res.render('index', {user: result.rows});
            });
        });
});

app.post('/edit', function(req, res){
    client.query("UPDATE mahasiswa SET first_name=$1, last_name=$2, gender=$3, date_of_birth=$4 WHERE id = $5",
    [req.body.first_name, req.body.last_name, req.body.gender, req.body.date_of_birth, req.body.id]);
    
    console.log("data input succeedd");
    res.redirect('/');

})

//server
app.listen(3000, function(){
    console.log('server started on port 3000');
});

