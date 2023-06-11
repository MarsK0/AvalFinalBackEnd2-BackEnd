import { Repository } from "typeorm"
import { TokenEntity } from "../db/entity/token.entity"
import database from "../db/database"
import { UserEntity } from "../db/entity/user.entity"


class TokenRepository{

  private tokenRepository: Repository<TokenEntity>

  constructor(){
    this.tokenRepository = database.client.manager.getRepository(TokenEntity)
  }

  async blackListUserTokens(userId: number): Promise<void>{
    this.tokenRepository
      .createQueryBuilder()
      .update(TokenEntity)
      .set({valid: false})
      .where(`userId = ${userId}`)
      .execute()
  }

  async insertToken(user: UserEntity, token: string): Promise<void>{

    await this.tokenRepository.insert({
      token,
      user
    })
  }

  async checkBlackList(token: string): Promise<boolean>{
    const tokenInfo = await this.tokenRepository.findOne({
      where: {token}
    })

    if(tokenInfo?.valid) return true

    return false
  }

}

export default TokenRepository
