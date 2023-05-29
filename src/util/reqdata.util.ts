import { IncomingMessage } from "http";

export const reqdata = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", async () => {
      resolve(JSON.parse(data));
    });
  });
};
