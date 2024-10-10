import { Router } from 'express';



abstract class Route {
    public router: Router;


    constructor(useAuth = false) {
        this.router = Router();
        if (useAuth) {
            console.log("hello world")
        }
    }

    abstract initRoutes(): void;
}

export default Route;