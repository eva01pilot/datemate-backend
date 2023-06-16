import authController from "./src/controllers/auth-controller.js";
import http from 'http'
import express from 'express'
const PORT = 3000

const app = express()

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})

app.post('/user/me', authController.verifyLogin)
app.post('/user/login', authController.login)
app.post('/user/signup', authController.signUp)