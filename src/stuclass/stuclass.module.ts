import { IncomingMessage, ServerResponse } from "http";
import { StuClassRepository } from "./stuclass.repository";
import { StuClassService } from "./stuclass.service";
import { StuClassController } from "./stuclass.controller";

export class StuClassModule {
  stuClassRepository = new StuClassRepository();
  stuClassService = new StuClassService(this.stuClassRepository);
  stuClassController = new StuClassController(this.stuClassService);

  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {}
  listen() {
    switch (this.req.method) {
      case "POST":
        this.stuClassController.createClass(this.req, this.res);
        break;
      case "DELETE":
        this.stuClassController.deleteClass(this.req, this.res);
        break;
      case "PUT":
        this.stuClassController.updateClass(this.req, this.res);
        break;
      case "GET":
        this.stuClassController.getClasses(
          this.res,
          this.req.url?.split("/stuclass/")[1]
        );
        break;
      default:
        this.res.statusCode = 404;
        this.res.end();
        break;
    }
  }
}
