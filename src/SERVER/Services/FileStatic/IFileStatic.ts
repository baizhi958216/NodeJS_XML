export interface IFileStatic {
    StaticFilePath(filepath: string): void
    HandleStaticFiles(): Promise<Buffer | null>
}