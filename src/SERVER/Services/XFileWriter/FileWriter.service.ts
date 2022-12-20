import { writeFile } from "fs";
import { IFileWriterService } from "./IFileWriter";

export class FileWriterService implements IFileWriterService {
    static instance: FileWriterService
    static filePath: string
    private constructor() { }
    static getInstance(): FileWriterService {
        if (!FileWriterService.instance) {
            FileWriterService.instance = new FileWriterService()
        }
        return FileWriterService.instance
    }

    SetPath(fpath: string) {
        FileWriterService.filePath = fpath
        return FileWriterService.instance
    }

    Write(newFile: string) {
        writeFile(FileWriterService.filePath, newFile, 'utf-8', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${FileWriterService.filePath}被修改`)
            }
        })
    }
}