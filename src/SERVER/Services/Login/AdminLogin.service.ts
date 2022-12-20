import { IncomingMessage } from "http"
import { XMLParser } from 'fast-xml-parser';
import { ILoginService } from './ILoginService'
import { FileReaderService } from "../XFileReader/FileReader.service"

export class AdminLoginService implements ILoginService {
    constructor() { }
    async LoginCheck(req: IncomingMessage): Promise<Object> {
        let data = ''
        const Admins = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Admins.xml`).UTF8Parse()
        const dom = new XMLParser().parse(Admins)
        await req.on('data', chunk => {
            data += chunk.toString(); // convert Buffer to string
        })
        const { account, password } = JSON.parse(data)
        // 查找用户
        const CurrentAdmin = dom.Admins.admin.find((obj: { aname: any; }) => {
            return obj.aname == account
        })
        if (CurrentAdmin) {
            // 存在则开始验证密码
            if (CurrentAdmin.apassword === password) {
                return JSON.stringify({
                    stats: '密码正确',
                    url:'Server.html',
                    code: 200
                })
            } else {
                return JSON.stringify({
                    stats: '密码错误',
                    code: 401
                })
            }
        } else {
            return JSON.stringify({
                stats: '管理员不存在',
                code: 400
            })
        }


    }
}