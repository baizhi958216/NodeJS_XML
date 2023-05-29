import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { IncomingMessage, ServerResponse } from "http";

export class UserModule {
  userRepository = new UserRepository();
  userService = new UserService(this.userRepository);
  userController = new UserController(this.userService);

  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {}

  listen() {
    switch (this.req.method) {
      case "POST":
        this.userController.createUser(this.req, this.res);
        break;
      case "DELETE":
        this.userController.deleteUser(this.req, this.res);
        break;
      case "PUT":
        this.userController.updateUser(this.req, this.res);
        break;
      case "GET":
        this.userController.getAllUsers(this.res);
        break;
      default:
        this.res.statusCode = 404;
        this.res.end();
        break;
    }
  }
}
