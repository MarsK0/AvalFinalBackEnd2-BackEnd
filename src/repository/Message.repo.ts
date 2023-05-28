import { Repository } from "typeorm"
import { MessageEntity } from "../db/entity/message.entity"
import database from "../db/database"
import IMessage from "../models/interfaces/IMessage"
import { UserEntity } from "../db/entity/user.entity"


class MessageRepository{

  private messageRepository: Repository<MessageEntity>

  constructor(){
    this.messageRepository = database.client.manager.getRepository(MessageEntity)
  }

  async createMessage(message: IMessage, user: UserEntity): Promise<void> {
    this.messageRepository.save({
      title: message.title,
      description: message.description,
      date_message: message.date_message,
      user
    })
  }

  async getUserMessages(userId: number): Promise<Array<Omit<MessageEntity, "user">>|null>{
    const messagesQry = await this.messageRepository.find({
      relations:["user"],
      where: {
        user: {
          id: userId
        }
      }
    })

    const messages = messagesQry.map((msg) => {
      const { user, ...rest } = msg
      return rest
    })
    
    return messages
  }

  async getMessageById(messageId: number): Promise<MessageEntity|null>{
    const message = await this.messageRepository.findOne({
      where: {id: messageId},
      relations: ["user"]
    })

    return message
  }

  async archiveMessage(messageId: number): Promise<void>{
    await this.messageRepository
      .createQueryBuilder()
      .update(MessageEntity)
      .set({archived: true,
            date_modification: ()=>"now()"})
      .where(`id = ${messageId}`)
      .execute()
  }

  async unarchiveMessage(messageId: number): Promise<void>{
    await this.messageRepository
      .createQueryBuilder()
      .update(MessageEntity)
      .set({archived: false,
            date_modification: ()=>"now()"})
      .where(`id = ${messageId}`)
      .execute()
  }

  async deleteMessageById(messageId: number): Promise<void>{
    await this.messageRepository.delete({id: messageId})
  }

  async editMessage(message: IMessage, messageId: number): Promise<void>{
    await this.messageRepository
      .createQueryBuilder()
      .update(MessageEntity)
      .set({title: message.title,
            description: message.description,
            date_message: message.date_message,
            date_modification: ()=>"now()"})
      .where(`id = ${messageId}`)
      .execute()
  }
}

export default MessageRepository