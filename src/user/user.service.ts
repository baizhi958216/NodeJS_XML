import { UserRepository } from "./user.repository";
import { IUser } from "./dto/user.dto";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async createUser(
    userDto: IUser
  ): Promise<{ success: boolean; message: any }> {
    return new Promise((resolve, reject) => {
      this.userRepository
        .createUser(userDto)
        .then((res) => {
          resolve({ success: true, message: res });
        })
        .catch((err) => {
          resolve({ success: false, message: err });
        });
    });
  }

  async deleteUser(userid: number) {
    const result = await this.userRepository.removeUserById(userid);
    return { success: !!result, message: result };
  }

  async updateUser(
    userDto: IUser
  ): Promise<{ success: boolean; message: any }> {
    return new Promise((resolve, reject) => {
      this.userRepository
        .updateUser(userDto)
        .then((res) => {
          resolve({ success: true, message: res });
        })
        .catch((err) => {
          resolve({ success: false, message: err });
        });
    });
  }
}
