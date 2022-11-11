/*********** FOR CREATING DATABASE ************/

// // packages
// const mysql = require('mysql2');

// /** ends here **/
// const connection = mysql.createConnection({
//     host: process.env.HOST,
//     port: process.env.PORT,
//     database:process.env.DATABASE,
//     user:process.env.USER,
//     password:process.env.PASSWORD
// });

// /** db connection **/
// connection.connect(function (err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("connection successfull");
//     }
// });

// connection.query(`CREATE DATABASE blogdb`, function(err, res){
//    if(err){
//       console.log(err);
//    }
//    else{

//       console.log('database created');
//       connection.query(`USE blogdb`, (er)=>{
//          if(err){
//             console.log(er);
//          }
//          else{
//             connection.query(`CREATE TABLE persons(name varchar(255), email varchar(255) primary key, passwordl varchar(255))`, function(error){
//                if(error) console.log(err);
//                else{
//                   "persons table created";
//                   connection.query(`CREATE TABLE blog(title varchar(255), content varchar(255), email varchar(255) references persons.email)`, function(error){
//                      if(error) console.log(err);
//                      else{
//                         "blog table created";
//                      }
            
//                   })
//                }
      
//             })
//          }
//       })

//    }
// })