import IToken from "../../models/interfaces/IToken";
import TokenRepository from "../../repository/Token.repo";

async function tokenIsBlackListed(token: string): Promise<boolean> {

  const tokenRepository = new TokenRepository()

  const tokenIsBlackListed = await tokenRepository.checkBlackList(token)

  return tokenIsBlackListed

}

export default tokenIsBlackListed