import { Request, Response } from "express"
import IUser from "../models/interfaces/IUser"
import bcrypt from "bcrypt"
import CreateUserSchema from "../utils/validations/createUser"
import LoginUserSchema from "../utils/validations/loginUser"
import generateToken from "../utils/functions/generateToken"
import IToken from "../models/interfaces/IToken"
import UserRepository from "../repository/User.repo"
import TokenRepository from "../repository/Token.repo"

class UserController {

  async createUser(req: Request, res: Response) {
    const username = req.body.username
    const password = req.body.password
    const repeatPassword = req.body.repeatPassword

    const userRepository = new UserRepository()

    try {
      CreateUserSchema.parse({
        username,
        password,
        repeatPassword
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: "Informações inválidas!" })
    }

    try {
      const userIsAlreadyRegistered = await userRepository.findUser(username)

      if (userIsAlreadyRegistered) return res.status(400).json({ message: "Usuário já cadastrado!" })

      const hashedPassword = await bcrypt.hash(password, 10)

      userRepository.createUser({
        username,
        password: hashedPassword,
      })

      return res.status(201).json({ message: "Usuário criado!" })
    } catch (error) {

      console.log(error)
      return res.status(500).json({ message: "Erro interno!" })

    }
  }

  async loginUser(req: Request, res: Response) {
    const username = req.body.username
    const password = req.body.password

    const userRepository = new UserRepository()
    const tokenRepository = new TokenRepository()

    try {
      LoginUserSchema.parse({
        username,
        password
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: "Credenciais inválidas!" })
    }

    try {
      const userFound = await userRepository.findUser(username)

      if (!userFound) return res.status(400).json({ message: "Credenciais inválidas!" })

      const passwordIsValid = await bcrypt.compare(password, userFound.password)

      if (!passwordIsValid) return res.status(400).json({ message: "Credenciais inválidas" })

      const userId = userFound.id

      const token = generateToken(userId)

      await tokenRepository.blackListUserTokens(userId)
      await tokenRepository.insertToken(userFound, token)

      res.cookie("token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "strict"
      })

      return res.status(200).json({ message: "Login efetuado com sucesso!" })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Erro interno!" })
    }

  }

  async logoutUser(req: Request, res: Response) {
    try {
      const userId = req.body.userId
      const tokenRepository = new TokenRepository()

      if(userId) await tokenRepository.blackListUserTokens(userId)

      res.clearCookie("token")

      return res.status(200).json({ message: "Usuário deslogado com sucesso!" })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Erro interno!" })
    }

  }

}

export default UserController
