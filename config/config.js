require('dotenv').config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "onlinementoring",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "onlinementoring",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false,
    "logging": false,
  }
}
