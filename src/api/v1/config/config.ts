import * as dotenv from 'dotenv';
dotenv.config();

type Config = {
    TOKEN_SECRET: string
    DATABASE_URL: string
    PORT: string
}

export const AppConfig = {
    TOKEN_SECRET: <string>process.env.TOKEN_SECRET,
    DATABASE_URL: <string>process.env.DATABASE_URL,
    PORT: <string>process.env.PORT
} as const satisfies Config 