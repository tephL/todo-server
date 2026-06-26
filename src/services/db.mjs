import { configDotenv } from "dotenv";
import { Pool } from "pg";
configDotenv();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL 
});

export const query = (text, values) => {
    return pool.query(text, values);
}
