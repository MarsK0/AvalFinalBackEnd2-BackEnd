import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import ICookie from "../models/interfaces/ICookie";
import tokenIsBlackListed from "../utils/functions/tokenIsBlackListed";

async function handleToken(req: Request, res: Response, next: NextFunction){
  const handledCookies = req.body.handledCookies as Array<ICookie>

  try{
    const cookieToken = handledCookies.find((cookie) => cookie.name === "token")

    if(!cookieToken) return res.status(400).json({message: "Informações inválidas!"})

    const token = cookieToken.value

    let userId: string

    try{
      const tokenPayload = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET: "dev") as JwtPayload
      userId = tokenPayload.userId
    }catch{
      return res.status(400).json({message: "Informações inválidas!"})
    }

    const tokenBlackListed = await tokenIsBlackListed(token)

    if(!tokenBlackListed) return res.status(400).json({message: "Informações inválidas!"})

    req.body.userId = userId
    req.body.token = token

    next()

  }catch(error){
    console.log(error)
    return res.status(500).json({message: "Erro interno!"})
  }
}

export default handleToken