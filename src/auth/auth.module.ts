import { IncomingMessage, ServerResponse } from "http";
import { UserRepository } from "../user/user.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

export class AuthModule {
  userRepository = new UserRepository();
  authService = new AuthService(this.userRepository);
  authController = new AuthController(this.authService);

  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {}

  listen() {
    switch (this.req.method) {
      case "POST":
        this.authController.userAuth(this.req, this.res);
        break;
      default:
        this.res.statusCode = 404;
        this.res.end();
        break;
    }
  }
}
