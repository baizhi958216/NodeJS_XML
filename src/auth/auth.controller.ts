import { IncomingMessage, ServerResponse } from "http";
import { AuthService } from "./auth.service";
import { reqdata } from "../util/reqdata.util";
import { IAuth } from "./dto/auth.dto";
import { resdata } from "../util/resdata.util";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async userAuth(req: IncomingMessage, res: ServerResponse) {
    const user = await reqdata<IAuth>(req);
    const data = await this.authService.auth(user);
    if (!data.success) {
      resdata(401, res, {
        success: false,
        message: data,
      });
    } else {
      resdata(200, res, {
        success: true,
        message: "登录成功",
      });
    }
  }
}
