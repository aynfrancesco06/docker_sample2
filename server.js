var express = require('express');
var path = require('path');
var fs = require ('fs');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, "index.html"));
});

// whn starting app locally
let mongoUrlLocal = 'mongodb://admin:password@localhost:27017'

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.get('/get-profile', function(req, res){
    let response = {};
    //connect to the database
    MongoClient.connect(mongoUrlLocal,mongoClientOptions , function (err,client){
        if (err) throw err;

        var db = client.db('user-account');
        var myquery = { userid: 1 };
        db.collection('users').findOne(myquery, function (err, result){
            if (err) throw err;
            client.close();
            response.send(result);
        });
    });
});

app.post('/update-profile', function (req, res){
        var userObj = req.body;
        var response = res;

        console.log('connecting to the db...');

        MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client){
        if (err) throw err;

        var db = client.db('user-account');
        userObj['userid'] = 1

        var myquery = { userid: 1 };
        var newValues = { $set: userObj };

        console.log('successfully connected to the user-account db');

        db.collection('users').updateOne(myquery, newValues, {upsert: true}, function (err,res){
            if(err) throw err;
            console.log('Successfully updated/inserted');
            client.close();
            response.send(userObj);
        });
    });
});

app.get('/profile-picture', function (req, res){
    var img = fs.readFileSync('profile-picture.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.end(img, 'binary');
});

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});