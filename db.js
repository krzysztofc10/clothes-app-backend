const mysql = require('mysql2');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3309,
    password: "123456",
    database:"clothyApp"
})

module.exports = db;