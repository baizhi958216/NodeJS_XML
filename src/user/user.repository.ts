import { OkPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db.config";
import { UserEntity } from "./entity/user.entity";
import { IUser } from "./dto/user.dto";

export class UserRepository {
  findAll(): Promise<UserEntity[]> {
    return new Promise((resolve, reject) => {
      pool.query<UserEntity[]>("select * from users", (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  findById(id: number): Promise<UserEntity | undefined> {
    return new Promise((resolve, reject) => {
      pool.query<UserEntity[]>(
        "select * from users where id=?",
        [id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  findByName(name: string): Promise<UserEntity | undefined> {
    return new Promise((resolve, reject) => {
      pool.query<UserEntity[]>(
        "select * from users where username=?",
        [name],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  createUser(user: IUser): Promise<IUser> {
    return new Promise((resolve, reject) => {
      pool.query<OkPacket>(
        "insert into users (username,password) values(?,?)",
        [user.username, user.password],
        (err, res) => {
          if (err) reject(err);
          else
            this.findById(res.insertId)
              .then((user) => resolve(user!))
              .catch(reject);
        }
      );
    });
  }

  updateUser(user: IUser): Promise<string> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        "update users set password=? where username=?",
        [user.password, user.username],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.info);
        }
      );
    });
  }

  removeUserById(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query<OkPacket>(
        "delete from users where id = ?",
        [id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  removeUserByUserName(username: string): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query<OkPacket>(
        "delete from users where username = ?",
        [username],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }
}
