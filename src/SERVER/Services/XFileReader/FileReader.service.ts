import { readFile, readFileSync } from 'fs'
import { DOMParser } from 'xmldom'
import { IFileReader } from './IFileReader'

export class FileReaderService implements IFileReader {
    static instance: FileReaderService
    static filePath: string
    private constructor() { }

    static getInstance(): FileReaderService {
        if (!FileReaderService.instance) {
            FileReaderService.instance = new FileReaderService()
        }
        return FileReaderService.instance
    }

    SetPath(fpath: string) {
        FileReaderService.filePath = fpath
        return FileReaderService.instance
    }

    UTF8Parse(): string {
        return readFileSync(FileReaderService.filePath, 'utf-8')
    }

    ReadBlob() {
        return new Promise<Buffer | null>(resolve => {
            readFile(FileReaderService.filePath, (err, data) => {
                if (err) {
                    resolve(null)
                } else {
                    resolve(data)
                }
            })
        })
    }

    XRead() {
        const XMLFile = this.UTF8Parse()
        const RegEx = XMLFile.replace(/pet|pid|pname|ptype|pbirthday/g, (data) => {
            if (data === 'pet') {
                return 'tr'
            } else if (data === 'pid') {
                return 'th'
            } else {
                return 'td'
            }
        })
        return new DOMParser().parseFromString(RegEx)
    }
}