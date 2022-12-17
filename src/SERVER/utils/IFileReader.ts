export interface IFileReader {
    SetPath(path: string): void
    UTF8Parse(): string
}