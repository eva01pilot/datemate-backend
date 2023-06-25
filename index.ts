import cors from 'cors'
import express from 'express'

import isAuthenticated from "./src/middleware/auth.js";
import authController from "./src/controllers/auth-controller.js";
import dateController from "./src/controllers/date-controller.js";
import { cookieValidation, makeGetEndpoint, makePostEndpoint } from "./src/helpers/validation.js";
import { cookieSchema, loginSchema, signupSchema } from "./src/validation-schemas/auth-validation.js";
import { getUserSchema, likeUserSchema } from "./src/validation-schemas/date-validation.js";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

const PORT = 3001

const app = express()
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

app.use(cookieParser())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})

app.post('/api/user/me', cookieValidation(authController.verifyLogin, cookieSchema))

app.post('/api/user/login', makePostEndpoint(authController.login, loginSchema))
app.post('/api/user/signup', makePostEndpoint( authController.signUp, signupSchema))

app.get('/api/dates/:id', isAuthenticated, makeGetEndpoint(dateController.getUser, getUserSchema))
app.get('/api/dates', isAuthenticated, makeGetEndpoint(dateController.getDates))
app.get('/api/dates/matches', isAuthenticated, makeGetEndpoint(dateController.getMatches))
app.get('/api/dates/like', isAuthenticated, makeGetEndpoint(dateController.getLikes))
app.post('/api/dates/like', isAuthenticated, makePostEndpoint(dateController.likePerson, likeUserSchema))
