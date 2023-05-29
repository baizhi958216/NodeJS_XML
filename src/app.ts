import { log } from "console";
import { createServer } from "http";
import { routes } from "./router";
import { getRegExp } from "./util/regexp.util";

createServer((req, res) => {
  const { url } = req;
  const match = Object.keys(routes).find((route) =>
    getRegExp(route).test(url!)
  );
  if (match) {
    const moduleClass = routes[match];
    const instance = new moduleClass(req, res);
    instance.listen();
  } else {
    res.statusCode = 404;
    res.end();
  }
}).listen(3000, () => {
  log(
    "\x1b[34m%s\x1b[0m",
    `
  😀 NodeJS服务启动...
  🚀 http://localhost:3000
  `
  );
});
