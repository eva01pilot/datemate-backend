import * as bcrypt from 'bcrypt'
class Crypt {
  private static SALT_ROUNDS = 10
  async hash(password: string):Promise<string> {
    const hashed = await bcrypt.hash(password, await bcrypt.genSalt(Crypt.SALT_ROUNDS))
    return hashed
  }
}

const crypt = new Crypt()

export default crypt