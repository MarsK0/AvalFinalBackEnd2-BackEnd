import { NextFunction, Request, Response } from "express"
import ICookie from "../models/interfaces/ICookie"

function handleCookies(req: Request, res: Response, next: NextFunction){
  const requestCookies = req.headers.cookie

  try{
    const splitedCookies = requestCookies? requestCookies.split(";") : null

    if(!splitedCookies) return res.status(400).json({message: "Informações inválidas!"})

    const cookies: Array<ICookie> = []

    splitedCookies.forEach((cookie) => {
      const cookieNameAndValue = cookie.split("=")
      const handledCookie: ICookie = {
        name: cookieNameAndValue[0],
        value: cookieNameAndValue[1]
      }
      
      cookies.push(handledCookie)
    })
    
    req.body.handledCookies = cookies
    next()
    
  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Erro interno!"})
  }
}

export default handleCookies