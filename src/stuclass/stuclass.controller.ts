import { IncomingMessage, ServerResponse } from "http";
import { StuClassService } from "./stuclass.service";
import { reqdata } from "../util/reqdata.util";
import { resdata } from "../util/resdata.util";
import { IStuClass } from "./dto/stuclass.dto";

export class StuClassController {
  constructor(private readonly stuClassService: StuClassService) {}
  // 添加班级
  async createClass(req: IncomingMessage, res: ServerResponse) {
    const data = await this.stuClassService.addClass(
      await reqdata<IStuClass>(req)
    );
    if (!data.success) {
      resdata(500, res, data);
    } else {
      resdata(200, res, {
        success: true,
        message: "新建班级成功",
      });
    }
  }
  // 删除班级
  async deleteClass(req: IncomingMessage, res: ServerResponse) {
    const { id } = await reqdata<{ id: number }>(req);
    const data = await this.stuClassService.removeClass(id);
    if (!data.success) {
      resdata(500, res, data);
    } else {
      resdata(200, res, {
        success: true,
        message: "删除成功",
      });
    }
  }
  // 修改班级
  async updateClass(req: IncomingMessage, res: ServerResponse) {
    const classes = await this.stuClassService.updateClass(
      await reqdata<IStuClass>(req)
    );
    if (!classes) {
      resdata(500, res, {
        success: false,
        message: classes,
      });
    } else {
      resdata(200, res, {
        success: true,
        message: "班级更新成功",
      });
    }
  }
  // 获取班级
  async getClasses(res: ServerResponse, class_id?: string) {
    let classes;
    if (class_id) {
      classes = await this.stuClassService.getClass(class_id);
    } else {
      classes = await this.stuClassService.getClasses();
    }
    if (!classes) {
      resdata(500, res, {
        success: false,
        message: "",
      });
    } else {
      resdata(200, res, {
        success: true,
        message: classes,
      });
    }
  }
}
