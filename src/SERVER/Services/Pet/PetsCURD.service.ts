import { FileReaderService } from '../XFileReader/FileReader.service'
import { FileWriterService } from '../XFileWriter/FileWriter.service'
import * as xpath from 'xpath-ts';
import { DOMParser } from 'xmldom'
import { IncomingMessage } from 'http'
import { decode } from 'urlencode'
export class XPets {
    static instance: XPets
    private constructor() { }

    static getInstance(): XPets {
        if (!XPets.instance) {
            XPets.instance = new XPets()
        }
        return XPets.instance
    }

    GetAllPets() {
        const XMLFile = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).UTF8Parse()
        const RegEx = XMLFile.replace(/pet|pid|pname|ptype|pbirthday/g, (data) => {
            if (data === 'pet') {
                return 'tr'
            } else if (data === 'pid') {
                return 'th'
            } else {
                return 'td'
            }
        })
        return RegEx
    }

    async GetPetByID(req: IncomingMessage) {
        let data = ''
        await req.on('data', chunk => {
            data += chunk.toString()
        })
        const { pid } = JSON.parse(data)
        const XMLFile = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).UTF8Parse()
        const doc = new DOMParser().parseFromString(XMLFile)
        const result = xpath.evaluate("//pid", doc, null, xpath.XPathResult.ANY_TYPE, null)
        let node = result.iterateNext()
        while (node) {
            if (node.firstChild == pid) {
                const dom = node.parentNode?.childNodes
                return JSON.stringify({
                    pid: dom![1].textContent,
                    pname: dom![3].textContent,
                    ptype: dom![5].textContent,
                    pbirthday: dom![7].textContent
                })
            }
            node = result.iterateNext();
        }
    }

    async DeletePetByID(req: IncomingMessage) {
        let data = ''
        await req.on('data', chunk => {
            data += chunk.toString()
        })
        const { pid } = JSON.parse(data)
        const XMLFile = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).UTF8Parse()
        const doc = new DOMParser().parseFromString(XMLFile)
        const result = xpath.evaluate("//pid", doc, null, xpath.XPathResult.ANY_TYPE, null)
        let node = result.iterateNext()
        let newPetList = '<?xml version="1.0" encoding="utf-8"?>\r\n<pets style="display:flex;flex-direction:column;">'
        while (node) {
            if (node.firstChild != pid) {
                newPetList +=
                    `
    <pet>
        <pid>${node.parentNode?.childNodes[1].textContent}</pid>
        <pname>${node.parentNode?.childNodes[3].textContent}</pname>
        <ptype>${node.parentNode?.childNodes[5].textContent}</ptype>
        <pbirthday>${node.parentNode?.childNodes[7].textContent}</pbirthday>
    </pet>
`
                /**
                 * 
                 * 已注释
                 * 格式勿动
                 * 
                 */
                //                 newPetList+=
                // `
                //     <pet>
                //         <pid>${node.parentNode?.childNodes[1].textContent}</pid>
                //         <pname>${node.parentNode?.childNodes[3].textContent}</pname>
                //         <ptype>${node.parentNode?.childNodes[5].textContent}</ptype>
                //         <pbirthday>${node.parentNode?.childNodes[7].textContent}</pbirthday>
                //     </pet>
                // `
            }
            node = result.iterateNext();
        }
        newPetList += '</pets>'
        // 备份 以宠物ID命名
        FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets_del_bakup_pet${pid}.xml`).Write(XMLFile)
        // 写入文件
        FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).Write(newPetList)
        return JSON.stringify({
            stats: '删除成功, 同时生成备份',
            code: 200
        })
    }

    async ModifyPetByID(req: IncomingMessage) {
        let data = ''
        await req.on('data', chunk => {
            data += chunk.toString()
        })
        const { pid, pname, ptype, pbirthday } = JSON.parse(data)
        const XMLFile = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).UTF8Parse()
        const doc = new DOMParser().parseFromString(XMLFile)
        const result = xpath.evaluate("//pid", doc, null, xpath.XPathResult.ANY_TYPE, null)
        let node = result.iterateNext()
        let newPetList = '<?xml version="1.0" encoding="utf-8"?>\r\n<pets style="display:flex;flex-direction:column;">'
        while (node) {
            if (node.firstChild != pid) {
                newPetList +=
                    `
    <pet>
        <pid>${node.parentNode?.childNodes[1].textContent}</pid>
        <pname>${node.parentNode?.childNodes[3].textContent}</pname>
        <ptype>${node.parentNode?.childNodes[5].textContent}</ptype>
        <pbirthday>${node.parentNode?.childNodes[7].textContent}</pbirthday>
    </pet>
`
            } else {
                newPetList +=
                    `
    <pet>
        <pid>${pid}</pid>
        <pname>${pname}</pname>
        <ptype>${ptype}</ptype>
        <pbirthday>${pbirthday}</pbirthday>
    </pet>
`
            }
            node = result.iterateNext();
        }
        newPetList += '</pets>'
        // 备份 以宠物ID命名
        FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets_modify_bakup_pet${pid}.xml`).Write(XMLFile)
        // 写入文件
        FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).Write(newPetList)
        return 200
    }

    async AddPet(req: IncomingMessage) {
        let data = ''
        await req.on('data', chunk => {
            data += chunk.toString()
        })
        const { pid, pname, ptype, pbirthday } = JSON.parse(data)
        const XMLFile = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).UTF8Parse()
        const newPetFile = XMLFile.replace('</pets>', `
    <pet>
        <pid>${pid}</pid>
        <pname>${pname}</pname>
        <ptype>${ptype}</ptype>
        <pbirthday>${pbirthday}</pbirthday>
    </pet>
</pets>`)
        // 备份
        FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets_bakup.xml`).Write(XMLFile)
        // 写入文件
        FileWriterService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).Write(newPetFile)
    }

    XPathSearch(path: string) {
        const XMLFile = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).UTF8Parse()
            const doc = new DOMParser().parseFromString(XMLFile)
        if (path.split('?=')[1]) {
            const nodes = xpath.select(path.split('?=')[1], doc);
            return nodes.toLocaleString()
        } else {
            const nodes = xpath.select('//pid', doc);
            return nodes.toLocaleString()
        }
    }

    Fuzzy(path: string) {
        const dpath = decode(path.split('?=')[1], 'utf-8')
        const XMLFile = FileReaderService.getInstance().SetPath(`${process.cwd()}\\src\\DATA\\Pets.xml`).UTF8Parse()
        const doc = new DOMParser().parseFromString(XMLFile)
        const result = xpath.evaluate("//pname", doc, null, xpath.XPathResult.ANY_TYPE, null)
        let node = result.iterateNext()
        let rdoc = ''
        while (node) {
            if (node.firstChild?.textContent?.match(dpath)) {
                rdoc += `<pet>`
                const dom = node.parentNode?.childNodes
                rdoc += dom?.toString()
                rdoc += `</pet>`
            }
            node = result.iterateNext();
        }
        const RegEx = rdoc.replace(/pet|pid|pname|ptype|pbirthday/g, (data) => {
            if (data === 'pet') {
                return 'tr'
            } else if (data === 'pid') {
                return 'th'
            } else {
                return 'td'
            }
        })
        return RegEx
    }

}