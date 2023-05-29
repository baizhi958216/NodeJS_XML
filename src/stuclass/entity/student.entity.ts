import { RowDataPacket } from "mysql2";

export interface StudentEntity extends RowDataPacket {
  /**
   * @param id 学生学号，主键
   */
  student_id: number;

  /**
   * @param name 学生姓名
   */
  name: string;

  /**
   * @param gender 学生性别
   */
  gender: string;

  /**
   * @param age 学生年龄
   */
  age: number;

  /**
   * @param class_id 学生所在班级的班级ID，外键，关联到班级表的ID
   */
  class_id: number;
}
