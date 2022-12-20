import { IncomingMessage, ServerResponse } from 'node:http'
import { FileStaticService } from '../FileStatic/FileStatic.service'
import { UserLoginService } from '../Login/UserLogin.service'
import { AdminLoginService } from '../Login/AdminLogin.service'
import { UserRegisterService } from '../Register/UserRegister.service'
import { AdminRegisterService } from '../Register/AdminRegister.service'
import { XPets } from '../Pet/PetsCURD.service'
export class Router {
    static instance: Router
    static filePath: string
    private constructor() { }

    static getInstance(): Router {
        if (!Router.instance) {
            Router.instance = new Router()
        }
        return Router.instance
    }

    route(req: IncomingMessage, res: ServerResponse) {
        const route = req.url?.split('/')!
        switch (route[1]) {
            case '':
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/css;charset=utf8')
                res.end('欢迎访问Nahida Project Backend via NodeJS')
                break
            // 静态文件服务
            case 'public':
                FileStaticService
                    .getInstance()
                    .StaticFilePath(req.url?.match('public')?.input!)
                    .HandleStaticFiles()
                    .then(buffer => {
                        if (buffer) {
                            res.statusCode = 200
                            res.end(buffer)
                        } else {
                            res.setHeader('Content-Type', 'text/css;charset=utf8')
                            res.statusCode = 400
                            res.end('目标资源不存在!!!')
                        }
                    })
                break
            // 用户登录
            case 'userlogin':
                const userlogin = new UserLoginService().LoginCheck(req)
                userlogin.then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-type', 'application/json;charset=utf-8')
                    res.end(data)
                })
                break
            // 管理员登录
            case 'adminlogin':
                const adminlogin = new AdminLoginService().LoginCheck(req)
                adminlogin.then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-type', 'application/json;charset=utf-8')
                    res.end(data)
                })
                break
            // 管理员注册
            case 'adminregister':
                AdminRegisterService.getInstance().AddAdmin(req).then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-type', 'application/json;charset=utf-8')
                    res.end(data)
                })
                break
            // 用户注册
            case 'userregister':
                UserRegisterService.getInstance().AddUser(req).then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-type', 'application/json;charset=utf-8')
                    res.end(data)
                })
                break
            // 获取所有宠物
            case 'GetAllPets':
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/xml')
                res.end(XPets.getInstance().GetAllPets())
                break
            // 通过ID获取宠物
            case 'GetPetByID':
                XPets.getInstance().GetPetByID(req).then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json;charset=utf-8')
                    res.end(data)
                })
                break
            case 'AddPet':
                XPets.getInstance().AddPet(req).then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json;charset=utf-8')
                    res.end(JSON.stringify({
                        stats: '新增宠物成功',
                        code: 200
                    }))
                })
                break
            // 删除宠物
            case 'DeletePet':
                XPets.getInstance().DeletePetByID(req).then(data => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json;charset=utf-8')
                    res.end(data)
                })
                break
            // 修改宠物
            case 'ModifyPet':
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json;charset=utf-8')
                XPets.getInstance().ModifyPetByID(req).then(data => {
                    if (data == 200) {
                        res.end(JSON.stringify({
                            stats: '修改成功, 已生成备份',
                            code: 200
                        }))
                    } else {
                        res.end(JSON.stringify({
                            stats: '修改失败, 未知错误',
                            code: 401
                        }))
                    }
                })
                break
            // XPath
            case 'XPath':
                const XSearch = XPets.getInstance().XPathSearch(req.url?.match('XPath')?.input!)
                if (XSearch) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
                    res.end(XSearch)
                } else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
                    res.end("Failed")
                }
                break
            // Fuzzy
            case 'Fuzzy':
                const Fuzzy = XPets.getInstance().Fuzzy(req.url?.match('Fuzzy')?.input!)
                if (Fuzzy) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
                    res.end(Fuzzy)
                } else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
                    res.end("Failed")
                }
                break
            default:
                console.log(`用户访问${req.url}`)
                res.writeHead(404, { 'Content-Type': 'text/css;charset=utf8' })
                res.end(`你正在访问${req.url}, 但这个网页还没写..., 所以404 NOT FOUND😋`)
                break
        }
    }
}