require('dotenv').config();

module.exports = {
    HOST: process.env.MYSQL_DB_HOST, //hostname
    USER: process.env.MYSQL_DB_USER, //username
    PASSWORD: process.env.MYSQL_DB_PASSWORD, //user password
    DB: process.env.MYSQL_DB_NAME, //database name
    dialect: "mysql",
    pool: {        
        max: 5, //max no of connections in pool        
        min: 0, //min no of connections in pool
        acquire: 30000, //max time the pool will try to get connections
        idle: 10000 //max time in ms that a connection
    }
}