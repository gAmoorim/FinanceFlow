const express = require('express')
const rotas = require('./routers/routers')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}))

app.use(express.json())
app.use(rotas)

module.exports = app