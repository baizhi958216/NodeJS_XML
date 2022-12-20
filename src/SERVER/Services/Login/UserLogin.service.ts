import { IncomingMessage } from "http"
import { XMLParser } from 'fast-xml-parser';
import { ILoginService } from './ILoginService'
import { FileReaderService } from "../XFileReader/FileReader.service"

export class UserLoginService implements ILoginService {
    constructor() { }
    async LoginCheck(req: IncomingMessage): Promise<Object> {
        let data = ''
        const Users = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Users.xml`).UTF8Parse()
        const dom = new XMLParser().parse(Users)
        await req.on('data', chunk => {
            data += chunk.toString(); // convert Buffer to string
        })
        const { account, password } = JSON.parse(data)
        // 查找用户
        const CurrentUser = dom.Users.user.find((obj: { uname: any; }) => {
            return obj.uname == account
        })
        if (CurrentUser) {
            // 存在则开始验证密码
            if (CurrentUser.upassword === password) {
                return JSON.stringify({
                    stats: '密码正确',
                    url:'Client.html',
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
                stats: '用户不存在',
                code: 400
            })
        }


    }
}