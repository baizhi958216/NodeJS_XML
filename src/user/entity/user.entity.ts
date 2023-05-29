import { RowDataPacket } from "mysql2";

export interface UserEntity extends RowDataPacket {
  /**
   * @param username 用户名
   */
  username: string;
  /**
   * @param password 密码
   */
  password: string;
}
