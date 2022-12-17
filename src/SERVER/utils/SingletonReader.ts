import { readFileSync } from 'fs'
import { IFileReader } from './IFileReader'

export class SingletonReader implements IFileReader {

    static instance: SingletonReader
    static filePath: string
    private constructor() { }

    static getInstance(): SingletonReader {
        if (!SingletonReader.instance) {
            SingletonReader.instance = new SingletonReader()
        }
        return SingletonReader.instance
    }

    SetPath(fpath: string) {
        SingletonReader.filePath = fpath
        return SingletonReader.instance
    }

    UTF8Parse(): string {
        return readFileSync(SingletonReader.filePath, 'utf-8')
    }
}