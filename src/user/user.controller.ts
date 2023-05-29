import { IncomingMessage, ServerResponse } from "http";
import { UserService } from "./user.service";
import { reqdata } from "../util/reqdata.util";
import { UserEntity } from "./entity/user.entity";
import { resdata } from "../util/resdata.util";
import { IUser } from "./dto/user.dto";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(req: IncomingMessage, res: ServerResponse) {
    const user = await reqdata<UserEntity>(req);
    const data = await this.userService.createUser(user);
    if (!data.success) {
      resdata(500, res, data);
    } else {
      resdata(200, res, {
        success: true,
        message: "新建用户成功",
      });
    }
  }

  async deleteUser(req: IncomingMessage, res: ServerResponse) {
    const user = await reqdata<IUser>(req);
    const data = await this.userService.deleteUser(user.id!);
    if (!data.success) {
      resdata(500, res, data);
    } else {
      resdata(204, res);
    }
  }

  async updateUser(req: IncomingMessage, res: ServerResponse) {
    const user = await reqdata<UserEntity>(req);
    const data = await this.userService.updateUser(user);
    if (!data.success) {
      resdata(500, res, data);
    } else {
      resdata(200, res, {
        success: true,
        message: "更新用户信息成功",
      });
    }
  }

  async getAllUsers(res: ServerResponse) {
    const users = await this.userService.getAllUsers();
    if (!users) {
      resdata(500, res, {
        success: false,
        message: "",
      });
    } else {
      resdata(200, res, {
        success: true,
        message: users,
      });
    }
  }
}
