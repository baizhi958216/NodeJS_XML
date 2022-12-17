import { IncomingMessage, ServerResponse } from 'node:http'

export function route(req: IncomingMessage, res: ServerResponse) {
  return new Promise((resolve, reject) => {
    switch (req.url) {
      case '/':
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/css;charset=utf8')
        res.end('欢迎访问Nahida Project Backend via NodeJS')
        break
      default:
        console.log(`用户访问${req.url}`)
        res.writeHead(404, { 'Content-Type': 'text/css;charset=utf8' })
        res.end(`你正在访问${req.url}, 但这个网页还没写..., 所以404 NOT FOUND😋`)
        break
    }
  })
}