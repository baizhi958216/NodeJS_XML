import { AuthModule } from "../auth/auth.module";
import { StuClassModule } from "../stuclass/stuclass.module";
import { UserModule } from "../user/user.module";

export const routes: {
  [key: string]: typeof UserModule | typeof StuClassModule | typeof AuthModule;
} = {
  "/api/user": UserModule,
  "/api/stuclass": StuClassModule,
  "/api/auth": AuthModule,
};
