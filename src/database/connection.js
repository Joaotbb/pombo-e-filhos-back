const mysql = require('mysql2')

// Connection to databse on Clever Cloud with .env file
const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
  })

  connection.connect((err) => {
    if (err) {
      console.error('Falha a ligar a base de dados MySQL.......', err)
    } else {
      console.log('Conectado à DB MySQL')
    }
  })

  return connection
}

module.exports = connectDB
