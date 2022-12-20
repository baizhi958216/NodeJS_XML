export interface IFileReader {
    SetPath(path: string): void
    UTF8Parse(): string
    ReadBlob(): Promise<Buffer | null>
}