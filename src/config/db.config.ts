import { Pool, createPool } from "mysql2";

export const pool: Pool = createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "nodedb",
});
