import { QueryError, ResultSetHeader } from "mysql2";
import { IStuClass } from "./dto/stuclass.dto";
import { StuClassRepository } from "./stuclass.repository";

export class StuClassService {
  constructor(private readonly stuClassRepository: StuClassRepository) {}

  async getClasses() {
    return await this.stuClassRepository.getClasses();
  }

  async getClass(class_id: string) {
    return await this.stuClassRepository.getClass(class_id);
  }

  async addClass(stuClassDto: IStuClass): Promise<{
    success: boolean;
    message: ResultSetHeader | QueryError;
  }> {
    return new Promise((resolve, reject) => {
      this.stuClassRepository
        .addClass(stuClassDto)
        .then((res) =>
          resolve({
            success: true,
            message: res,
          })
        )
        .catch((err) =>
          resolve({
            success: false,
            message: err,
          })
        );
    });
  }

  async updateClass(stuClassDto: IStuClass): Promise<{
    success: boolean;
    message: ResultSetHeader | QueryError;
  }> {
    return new Promise((resolve, reject) => {
      this.stuClassRepository
        .updateClass(stuClassDto)
        .then((res) =>
          resolve({
            success: true,
            message: res,
          })
        )
        .catch((err) =>
          resolve({
            success: false,
            message: err,
          })
        );
    });
  }

  async removeClass(id: number): Promise<{
    success: boolean;
    message: ResultSetHeader | QueryError;
  }> {
    return new Promise((resolve, reject) => {
      this.stuClassRepository
        .removeClass(id)
        .then((res) =>
          resolve({
            success: true,
            message: res,
          })
        )
        .catch((err) =>
          resolve({
            success: false,
            message: err,
          })
        );
    });
  }
}
