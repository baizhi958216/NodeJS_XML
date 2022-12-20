import { IncomingMessage } from "http";
import { IRegisterService } from "./IRegisterService";
import { XMLParser } from 'fast-xml-parser';
import { FileReaderService } from "../XFileReader/FileReader.service";
import { FileWriterService } from '../XFileWriter/FileWriter.service'

export class UserRegisterService implements IRegisterService {
    static instance: UserRegisterService
    private constructor() { }
    static getInstance(): UserRegisterService {
        if (!this.instance) {
            this.instance = new UserRegisterService()
        }
        return this.instance
    }
    async AddUser(req: IncomingMessage) {
        let data = ''
        await req.on('data', chunk => {
            data += chunk.toString(); // convert Buffer to string
        })
        const {
            uname,
            upassword,
            ugender,
            ulocation,
            ubirthday
        } = JSON.parse(data)
        // 判断用户是否已存在
        const UsersXML = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Users.xml`).UTF8Parse()
        const UsersList = new XMLParser().parse(UsersXML)
        if (UsersList.Users.user.find((user: { uname: any; }) => user.uname == uname)) {
            return JSON.stringify({
                stats: '用户已存在',
                code: 401
            })
        } else {
          const newUsers = UsersXML.replace('</Users>', `    <user>
        <uid>${UsersList.Users.user.length + 1}</uid>
        <uname>${uname}</uname>
        <upassword>${upassword}</upassword>
        <ugender>${ugender}</ugender>
        <ulocation>${ulocation}</ulocation>
        <ubirthday>${ubirthday}</ubirthday>
    </user>
</Users>`)
            /**
             * 代码格式化备份!!!!!
             * 切勿修改样式!!!!!
             * 否则影响XML美观性!!!!!
             */
            //             let newUsers = UsersXML.replace('</Users>', `    <user>
            //         <uid>${UsersList.Users.user.length + 1}</uid>
            //         <uname>${uname}</uname>
            //         <upassword>${upassword}</upassword>
            //         <ugender>${ugender}</ugender>
            //         <ulocation>${ulocation}</ulocation>
            //         <ubirthday>${ubirthday}</ubirthday>
            //     </user>
            // </Users>`)
            FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Users.xml`).Write(newUsers)
            return JSON.stringify({
                stats: '注册成功',
                code: 200
            })
        }
        // 新增用户
    }
}