const express = require('express')
const app = express()
const router = express.Router()

require('dotenv').config()

const connectDB = require('./database/connection')
const auth = require('./routes/authRoute')

app.use('/api/v1/', auth)


const start = async () => {
  try {
    await connectDB()
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.log(err)
  }
}

start()
