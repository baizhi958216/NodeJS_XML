import http from 'node:http'
import { route } from './SERVER/Router/Router.service'
import { SingletonReader } from './SERVER/utils/SingletonReader'
import { XMLParser } from 'fast-xml-parser';

let env: string

// 区分开发环境和生产环境
if (process.argv[2] && process.argv[2].includes('production')) {
    env = SingletonReader.getInstance().SetPath(`${process.cwd()}\\env.production.xml`).UTF8Parse()
} else {
    env = SingletonReader.getInstance().SetPath(`${process.cwd()}\\env.development.xml`).UTF8Parse()
}

const parseENV = new XMLParser().parse(env)

const { host, port } = parseENV.environment

const corsMiddleware = require('cors')({
    // 处理VSCode跨域资源请求
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,POST',
    maxAge: 1728000,
    credentials: true,
})

const server = http.createServer((req, res) => {
    // 路由
    const next = () => route(req, res)
    // 实例化跨域中间件
    corsMiddleware(req, res, next)
})

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})