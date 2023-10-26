const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
app.use(express.json())
app.use(cors())

const connectDB = require('./database/connection')
const supplierRoutes = require('./routes/supplierRoutes')
const productsRoutes = require('./routes/productsRoutes')
const auth = require('./routes/authRoutes')

app.use('/api/v1/', auth)
app.use('/api/v1/', productsRoutes)
app.use('/api/v1/', supplierRoutes)

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
