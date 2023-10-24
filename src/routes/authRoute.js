const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
  res.send('LOGIN OK')
})

router.post('/register', (req, res) => {
  res.send('REGISTER OK')
})

module.exports = router