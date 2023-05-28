import { DataSource, DataSourceOptions } from "typeorm"
import { MessageEntity } from "./entity/message.entity"
import { UserEntity } from "./entity/user.entity"
import { TokenEntity } from "./entity/token.entity";
import dotenv from "dotenv"; dotenv.config()

const config: DataSourceOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [MessageEntity, UserEntity, TokenEntity],
    migrations: ["dist/db/migrations/*.js"],
}

export const dataSource = new DataSource(config)