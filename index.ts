import userController from "./src/controllers/user-controller.js";
import http from 'http'
import express from 'express'
const PORT = 3000

const app = express()

app.listen(PORT, ()=>{
  console.log(`Listening on ${PORT}`)
})

app.post('/user/signup', userController.getUser)
app.get('/user/signup', userController.getUser)