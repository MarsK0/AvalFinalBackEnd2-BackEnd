import jwt from "jsonwebtoken"

function generateToken(userId: number): string{

  const payload = {
    userId
  }
  
  const token = jwt.sign(payload, process.env.JWT_SECRET ? process.env.JWT_SECRET: "DevEnvironment",{
    expiresIn: 600, //Token expira em 15min
  })

  return token
}

export default generateToken