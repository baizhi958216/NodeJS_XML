import { IFileStatic } from "./IFileStatic"
import { FileReaderService } from '../XFileReader/FileReader.service'

export class FileStaticService implements IFileStatic {
    static instance: FileStaticService
    static filePath: string
    static buffer: Buffer | null

    constructor() { }

    static getInstance(): FileStaticService {
        if (!FileStaticService.instance) {
            FileStaticService.instance = new FileStaticService()
        }
        return FileStaticService.instance
    }

    StaticFilePath(filepath: string) {
        FileStaticService.filePath = filepath
        return FileStaticService.instance
    }

    async HandleStaticFiles(): Promise<Buffer | null> {
        await FileReaderService
            .getInstance()
            .SetPath(`${process.cwd()}\\src\\SERVER\\Resources${FileStaticService.filePath}`)
            .ReadBlob()
            .then(data => {
                if (data) {
                    FileStaticService.buffer = data
                } else {
                    FileStaticService.buffer = null
                }
            })
        return FileStaticService.buffer
    }
}