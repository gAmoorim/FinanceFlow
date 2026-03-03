const express = require('express')
const rotas = require('./routers/routers')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: '*',
  credentials: false
}))

app.use(express.json())
app.use(rotas)

module.exports = app