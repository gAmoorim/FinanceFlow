const express = require('express')
const rotas = require('./routers/routers')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: ['https://financefloweb.vercel.app', 'http://localhost:3001'],
  credentials: false
}))

app.use(express.json())
app.use(rotas)

module.exports = app