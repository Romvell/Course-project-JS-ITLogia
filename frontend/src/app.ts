import "./styles/common.scss"
import {Router} from "./router.js";

class App {
    private router: Router;

    constructor() {
        this.router = new Router();
    }
}

(new App());