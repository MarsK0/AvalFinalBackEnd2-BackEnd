import { Repository } from "typeorm"
import { UserEntity } from "../db/entity/user.entity"
import database from "../db/database"
import IUser from "../models/interfaces/IUser"


class UserRepository{

  private userRepository: Repository<UserEntity>

  constructor(){
    this.userRepository = database.client.manager.getRepository(UserEntity)
  }

  async createUser(user: IUser): Promise<void>{
    const newUser = new UserEntity()
    newUser.username = user.username
    newUser.password = user.password

    await this.userRepository.save(newUser)
  }

  async findUser(username: string): Promise<UserEntity|null>{
    const user = await this.userRepository.findOne({
      where: { username }
    })

    return user
  }

  async findUserById(userId: number): Promise<UserEntity|null>{
    const user = await this.userRepository.findOne({
      where: {id: userId}
    })

    return user
  }

}

export default UserRepository