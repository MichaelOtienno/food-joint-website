const mysql = require ('mysql');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'foodjoint',

});

connection.connect ((err)=>{
    if(err){
        errror(err)
    }
    console.log('connected to database');
})

module.exports = connection