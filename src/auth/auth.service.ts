import { UserRepository } from "../user/user.repository";
import { IAuth } from "./dto/auth.dto";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
  async auth(authUser: IAuth): Promise<{ success: boolean; message: any }> {
    const { username, password } = authUser;
    return new Promise((resolve, reject) => {
      this.userRepository
        .findByName(username)
        .then((res) => {
          if (res && res.password == password) {
            resolve({
              success: true,
              message: res,
            });
          } else {
            resolve({
              success: false,
              message: "用户不存在或密码错误",
            });
          }
        })
        .catch((err) =>
          resolve({
            success: false,
            message: err,
          })
        );
    });
  }
}
