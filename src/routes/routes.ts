import { Router } from "express";
import handleCookies from "../middlewares/handleCookies";
import handleToken from "../middlewares/handleToken";
import UserController from "../controllers/User.controller";
import MessageController from "../controllers/Message.controller";

export const routes = Router()

const userController = new UserController()
const messageController = new MessageController()

routes.get("/checklogin", handleCookies, handleToken, (_req, res) => res.sendStatus(200))
routes.post("/createuser", (req, res) => userController.createUser(req, res))
routes.post("/login", (req, res) => userController.loginUser(req, res))
routes.post("/logout", (req, res) => userController.logoutUser(req, res))
routes.post("/createmessage", handleCookies, handleToken, (req, res) => messageController.createMessage(req, res))
routes.put("/archive", handleCookies, handleToken, (req, res) => messageController.archiveMessage(req, res))
routes.put("/unarchive", handleCookies, handleToken, (req, res) => messageController.unarchiveMessage(req, res))
routes.delete("/deletemessage", handleCookies, handleToken, (req, res) => messageController.deleteMessage(req, res))
routes.put("/editmessage", handleCookies, handleToken, (req, res) => messageController.editMessage(req, res))
routes.get("/getmessages", handleCookies, handleToken, (req, res) => messageController.getMessages(req, res))