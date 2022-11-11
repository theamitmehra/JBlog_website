// packages
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');

// use of express
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));
const saltRounds = 10;

/** session middleware **/
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        secure:false, maxAge: 60*60000
    }
}))

/** ends here **/
const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    database:process.env.DATABASE,
    user:process.env.USER,
    password:process.env.PASSWORD
});

/** db connection **/
connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection successfull");
    }
});

app.get("/", function (req, res) {
    if(req.session.userID){
        res.redirect("home");
    }
    else res.render("index");
});

app.get("/register", function (req, res) {
    if(req.session.userID){
        res.redirect("home");
    }
    else{
        res.render("register");
    }
})
app.post("/register", function(req, res){

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err) throw err;
        else{

            connection.query(`INSERT INTO persons values ('${name}', '${email}', '${hash}')`, function(err, result){
                if(err) {
                    res.render("failure2");
                }
                else{
                    console.log("succesfully registered");
                    req.session.userID = email;
                    res.redirect("home");
                
                } 
            })
        }
    })
});

/** LOGIN ROUTES **/
app.get("/login", function (req, res) {

    if(req.session.userID){
        res.redirect("home");
    }
    else{
        res.render("login");
    }
})

app.post("/login", function(req, res){

    let email = req.body.email;
    let plainpassword  = req.body.password;

    connection.query(`SELECT passwordl FROM persons WHERE email = '${email}'`, function(err, result){
        
        if(err) console.log(err);
        
        else
        {
            bcrypt.compare(plainpassword, result[0].passwordl, function(error, match) {
                if(error){ 
                    console.log(error);
                    res.redirect("login");
                }
                else if (match) {
                    req.session.userID = email;
                    res.redirect("home");}
                else{
                    res.render("failure1");
                }
            })
        }    
    })
});



/** HOME ROUTE **/
app.get("/home", function (req, res){
    if(req.session.userID){
        connection.query(`select * from blogs where email = '${req.session.userID}' `, function(err, result){
            if(err) console.log(err);
            else {
                    res.render("home", {
                        dummy:result
                    });
            }
        });
    }
    else{
        res.statusCode = 404;
        console.log("cannot find login page please check.");
        res.redirect("login");
    }
})

/** COMPOSE ROUTES **/
app.get("/compose", function (req, res){

    if(req.session.userID){
        res.render("compose");
    }
    else{
        console.log("cannotfind login page please check.");
        res.redirect("login");
    }

});

app.get("/feed", function (req, res){

    if(req.session.userID){
        connection.query(`select * from blogs`, function(err, result){
            if(err) console.log(err);
            else {
                    res.render("feed", {
                        dummy:result
                    });
            }
        });
    }
    else{
        res.statusCode = 404;
        console.log("cannot find login page please check.");
        res.redirect("login");
    }

});

app.post("/compose", function(req, res){

    let title = req.body.title;
    let content = req.body.content;
    
    console.log(title, content);

    connection.query(`INSERT INTO blogs values ('${title}', '${content}', '${req.session.userID}')`, function(err, result){
        if(err) {
            console.log("sorry some error occured");
            console.log(err);
        }
        else{
            console.log("succesfully indserted blog.");
            res.redirect("/home");
        }
    });
    
});


/** LOGOUT ROUTES **/
app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/");
})


/** LISTENING AT PORT **/
app.listen(process.env.LISTENING_PORT, function () {
    console.log("app is listening on port",process.env.LISTENING_PORT);
});
