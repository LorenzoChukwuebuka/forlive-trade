import "reflect-metadata"
import express, { Application } from "express";
import cors from 'cors';
import morgan from "morgan";
import Container from "typedi";
import { AppConfig } from "./config/config";
import Route from "./routes/base.route";
import { AuthRoute } from "./routes/auth.route";


class App {
    private app: Application;
    private apiVersion = '/api/v1';

    private routes: Record<string, Route> = {
        "": Container.get(AuthRoute)
    }

    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.initRoutes();
    }


    private configureMiddleware(): void {
        this.app.use(express.json());
        this.app.use(cors({ origin: true, credentials: true }));
        this.app.use(morgan('short'));
    }

    private initRoutes(): void {
        Object.entries(this.routes).forEach(([url, route]) => {
            this.app.use(`${this.apiVersion}/${url}`, route.router);
        });

        this.app.get('/', (req, res) => {
            res.status(200).json({ message: 'WELCOME' });
        });
    }


    public async start(): Promise<void> {
        try {

            const PORT = process.env.PORT || AppConfig.PORT;
            this.app.listen(PORT, (): void => {
                console.log(`Server Running here 👉 http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error("Failed to start the application:", error);
            process.exit(1);
        }
    }
}

export default App