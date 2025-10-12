import Errors, { Message } from "../libs/types/Errors";
import { AUTH_TIMER } from "../libs/types/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { HttpCode } from "../libs/types/Errors";

class AuthService {
  private readonly secretToken: string;

  constructor() {
    // JWT siri faqat bitta env'dan olinadi
    this.secretToken = process.env.SECRET_TOKEN as string;

    // Secret yo'q bo'lsa — darrov aniq xato
    if (!this.secretToken || this.secretToken.trim().length === 0) {
      throw new Errors(
        HttpCode.UNAUTHORIZED,
        // Agar sizda boshqa xabar enumlari bo'lsa, shu yerda o'zgartiring
        Message.TOKEN_CREATION_FAILED
      );
    }
  }

  public async createToken(payload: Member) {
    return new Promise<string>((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`; // masalan: 24h

      jwt.sign(
        payload,
        this.secretToken, // faqat shu yerda ishlatamiz
        { expiresIn: duration },
        (err, token) => {
          if (err || !token) {
            return reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
            );
          }
          resolve(token);
        }
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    try {
      const result = jwt.verify(token, this.secretToken) as Member;
      console.log(`--- [AUTH] memberNick: ${result.memberNick} ----`);
      return result;
    } catch (err) {
      // verify yiqilsa — noto‘g‘ri yoki muddati o‘tgan token
      throw new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED);
    }
  }
}

export default AuthService;
