import express from "express";
import cors from "cors";
import dotenv from "dotenv"; dotenv.config()
import database from "./db/database";
import { routes } from "./routes/routes";

const server = express()
server.use(cors({
  credentials: true,
  origin: `${process.env.CORS_ORIGIN}`,
}))
server.use(express.json())
server.use(routes)

database.connect()
  .then(() => server.listen(3333, () => console.log("Servidor rodando...")))
  .catch((error) => console.log(error))
