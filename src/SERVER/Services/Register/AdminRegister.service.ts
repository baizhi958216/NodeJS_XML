import { XMLParser } from "fast-xml-parser";
import { IncomingMessage } from "http";
import { FileReaderService } from "../XFileReader/FileReader.service";
import { FileWriterService } from "../XFileWriter/FileWriter.service";
import { IRegisterService } from "./IRegisterService";

export class AdminRegisterService implements IRegisterService {
    static instance: AdminRegisterService
    private constructor() { }
    static getInstance(): AdminRegisterService {
        if (!this.instance) {
            this.instance = new AdminRegisterService()
        }
        return this.instance
    }
    async AddAdmin(req: IncomingMessage) {
        let data = ''
        await req.on('data', chunk => {
            data += chunk.toString(); // convert Buffer to string
        })
        const {
            uname,
            upassword,
        } = JSON.parse(data)
        // 判断用户是否已存在
        const AdminXML = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Admins.xml`).UTF8Parse()
        const AdminList = new XMLParser().parse(AdminXML)
        if (AdminList.Admins.admin.find((admin: { aname: any; }) => admin.aname == uname)) {
            return JSON.stringify({
                stats: '管理员已存在',
                code: 401
            })
        } else {
            const newAdmins = AdminXML.replace('</Admins>', `    <admin>
        <aid>${AdminList.Admins.admin.length + 1}</aid>
        <aname>${uname}</aname>
        <apassword>${upassword}</apassword>
    </admin>
</Admins>`)
            /**
         * 代码格式化备份!!!!!
         * 切勿修改样式!!!!!
         * 否则影响XML美观性!!!!!
         */
            //     const newUser = AdminXML.replace('</Admins>',`    <admin>
            //     <aid>${AdminList.Admins.admin.length+1}</aid>
            //     <aname>${uname}</aname>
            //     <apassword>${upassword}</apassword>
            // </admin>
            // </Admins>`)
            FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Admins.xml`).Write(newAdmins)
            return JSON.stringify({
                stats: '注册成功',
                code: 200
            })
        }
        // 新增用户
    }
}