import {Auth} from "../services/auth.js";

export class Expense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }
    }
}