import { CustomerTokenInterface } from "src/conversations/interfaces/customer-token.interface";
import { TokenInterface } from "src/users/interfaces/token.interface";

declare global {
  namespace Express {
    interface Request {
      jwt?: TokenInterface | CustomerTokenInterface
    }
  }
} 