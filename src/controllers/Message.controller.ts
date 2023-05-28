import { Request, Response } from "express"
import messageSchema from "../utils/validations/message"
import MessageRepository from "../repository/Message.repo"
import UserRepository from "../repository/User.repo"
import { MessageEntity } from "../db/entity/message.entity"

class MessageController{

  async createMessage(req: Request, res: Response){
    const userId = req.body.userId
    const title = req.body.title
    const description = req.body.description
    const date_message = req.body.date

    const messageRepository = new MessageRepository()
    const userRepository = new UserRepository()

    try{
      try{
        messageSchema.parse({
          date_message,
          title,
          description
        })
      }catch(error){
        console.log(error)
        return res.status(400).json({message: "Informações inválidas!"})
      }

      const user = await userRepository.findUserById(userId)
  
      await messageRepository.createMessage({
        title,
        description,
        date_message
      }, user!)
      
      return res.status(201).json({message: "Recado criado!"})

    }catch(error){
      console.log(error)
      return res.status(500).json({message: "Erro interno!"})
    }
  }

  async archiveMessage(req: Request, res: Response){
    const userId = req.body.userId
    const messageId = req.body.messageId

    const messageRepository = new MessageRepository()

    try{
      const userMessage = await messageRepository.getMessageById(messageId)
      
      if(!userMessage) return res.status(400).json({message:"Informações inválidas!"})
      
      if(userMessage.user.id != userId) return res.status(401).json({message: "Usuário não autorizado!"})

      await messageRepository.archiveMessage(messageId)

      return res.status(200).json({message: "Mensagem arquivada!"})
    }catch(error){
      console.log(error)
      return res.status(500).json({message: "Erro interno!"})
    }
  }

  async unarchiveMessage(req: Request, res: Response){
    const userId = req.body.userId
    const messageId = req.body.messageId

    const messageRepository = new MessageRepository()

    try{
      const userMessage = await messageRepository.getMessageById(messageId)

      if(!userMessage) return res.status(400).json({message:"Informações inválidas!"})

      if(userMessage.user.id != userId) return res.status(401).json({message: "Usuário não autorizado!"})

      await messageRepository.unarchiveMessage(messageId)

      return res.status(200).json({message: "Mensagem arquivada!"})
    }catch(error){
      console.log(error)
      return res.status(500).json({message: "Erro interno!"})
    }
  }

  async deleteMessage(req: Request, res: Response){
    const userId = req.body.userId
    const messageId = req.query.messageId

    const messageRepository = new MessageRepository()

    try{

      if(typeof messageId != "string") return res.status(400).json({message:"Informações inválidas!"})

      const userMessage = await messageRepository.getMessageById(parseInt(messageId))

      if(!userMessage) return res.status(400).json({message:"Informações inválidas!"})

      if(userMessage.user.id != userId) return res.status(401).json({message: "Usuário não autorizado!"})

      await messageRepository.deleteMessageById(parseInt(messageId))

      return res.status(200).json({message: "Mensagem excluída!"})

    }catch(error){
      console.log(error)
      return res.status(500).json({message: "Erro interno!"})
    }
  }

  async editMessage(req: Request, res: Response){
    const userId = req.body.userId
    const messageId = req.body.messageId
    const date = req.body.date
    const title = req.body.title
    const description = req.body.description
    
    const messageRepository = new MessageRepository()

    try{
      try{
        messageSchema.parse({
          date_message: date,
          title,
          description
        })
      }catch(error){
        console.log(error)
        return res.status(400).json({message: "Informações inválidas!"})
      }
  
      const userMessage = await messageRepository.getMessageById(messageId)

      if(!userMessage) return res.status(400).json({message: "Informações inválidas!"})

      if(userMessage.user.id != userId) return res.status(401).json({message: "Informações inválidas!"})

      await messageRepository.editMessage({
        title,
        description,
        date_message: date 
      }, messageId)

      return res.status(200).json({message: "Mensagem editada!"})

    }catch(error){
      console.log(error)
      return res.status(500).json({message: "Erro interno!"})
    }
  }

  async getMessages(req: Request, res: Response){
    const userId = req.body.userId
    const filter = req.query.filter
    const archived = req.query.archived

    const messageRepository = new MessageRepository()

    if(typeof archived != "string") return res.status(400).json({message: "Informações inválidas! 1"})
    const isArchived = archived === "true"
    
    try{
      const userMessages = await messageRepository.getUserMessages(userId)

      if(!userMessages) return res.status(401).json({message: "Nenhuma mensagem encontrada!"})

      const messages = userMessages.filter((msg) =>{
        return (msg.archived === isArchived)
      })

      if(!filter) return res.status(200).json(messages)

      if(typeof filter != "string") return res.status(400).json({message: "Informações inválidas! 2"})
  
      const filteredMessages = messages.filter((msg) => {
        return (msg.date_message.indexOf(filter) > -1 ||
                msg.title.indexOf(filter) > -1 ||
                msg.description.indexOf(filter) > -1)
          
      })

      return res.status(200).json(filteredMessages)
      
    }catch(error){
      console.log(error)
      return res.status(500).json({message: "Erro interno!"})
    }
  }
}

export default MessageController