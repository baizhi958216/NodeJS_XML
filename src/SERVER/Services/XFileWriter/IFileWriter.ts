export interface IFileWriterService{
    SetPath(path: string): void
    Write(newFile:string): void
}