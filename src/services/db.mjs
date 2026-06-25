import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { configDotenv } from "dotenv";
import { Pool } from "pg";
configDotenv();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL 
});
