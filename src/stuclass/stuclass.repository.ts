import { ResultSetHeader } from "mysql2";
import { pool } from "../config/db.config";
import { IStuClass } from "./dto/stuclass.dto";
import { StuClassEntity } from "./entity/stuclass.entity";

export class StuClassRepository {
  // 班级列表(id)
  getClass(class_id: string): Promise<StuClassEntity[]> {
    return new Promise((resolve, reject) => {
      pool.query<StuClassEntity[]>(
        `select
        class.name as class_name,
        class.id as class_id,
        student.student_id as student_id,
        student.gender as student_gender,
        student.age as student_age,
        student.class_id as student_class_id
        from class join student on class.id=student.class_id where class.id=?`,
        [class_id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  // 所有班级列表
  getClasses(): Promise<StuClassEntity[]> {
    return new Promise((resolve, reject) => {
      pool.query<StuClassEntity[]>(
        `select class.name,class.id from class`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }

  // 添加班级
  addClass(stuClassDto: IStuClass): Promise<ResultSetHeader> {
    /* 
    INSERT INTO class VALUES (class_id, class_name);
    */
    return new Promise((resolve, reject) => {
      pool.query(
        `
      insert into class value (?,?)
      `,
        [stuClassDto.id, stuClassDto.name],
        (err, res) => {
          if (err) reject(err);
          else resolve(res as ResultSetHeader);
        }
      );
    });
  }

  // 添加学生
  addStudent() {
    /* 
    INSERT INTO student VALUES (student_id, student_name, student_gender, student_age, student_class_id);
    */
  }

  // 修改班级
  updateClass(stuClassDto: IStuClass): Promise<ResultSetHeader> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        `
        update class set name=? where id=?
        `,
        [stuClassDto.name, stuClassDto.id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res as ResultSetHeader);
        }
      );
    });
  }

  // 修改学生
  updateStudent() {}

  // 删除班级
  removeClass(id: number): Promise<ResultSetHeader> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        "delete from class where id = ?",
        [id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res as ResultSetHeader);
        }
      );
    });
  }

  // 开除学生
  removeStudent() {}
}
