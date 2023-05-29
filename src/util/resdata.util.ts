import { ServerResponse } from "http";

export const resdata = (
  statusCode: number,
  res: ServerResponse,
  message?: any
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(message ? JSON.stringify(message) : null);
};
