import jwt from 'jsonwebtoken'
import { env } from 'process'

class JSONWebToken {
  verify(access_token: string): boolean | string {
    try {
      const payload = jwt.verify(access_token, env['JWT_SECRET'])
      return String(payload)
    } catch (e) {
      return false
    }
  }

  sign(userID:number):string {
    return jwt.sign(String(userID), env['JWT_SECRET'])
  }
}

const jsonWebToken = new JSONWebToken()

export default jsonWebToken