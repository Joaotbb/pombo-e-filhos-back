const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./database/connection')
const supplierRoutes = require('./routes/supplierRoutes')
const productsRoutes = require('./routes/productsRoutes')
const ordersRoutes = require('./routes/ordersRoutes')
const usersRoutes = require('./routes/usersRoutes')
const auth = require('./routes/authRoutes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

require('dotenv').config()
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))
app.use(errorHandler)

app.use('/api/v1/', auth)
app.use('/api/v1/', productsRoutes)
app.use('/api/v1/', supplierRoutes)

app.use('/api/v1/', ordersRoutes)
app.use('/api/v1/', usersRoutes)

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
