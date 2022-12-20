import { IncomingMessage } from "http";

export interface ILoginService{
    LoginCheck(req: IncomingMessage):Promise<any>;
}