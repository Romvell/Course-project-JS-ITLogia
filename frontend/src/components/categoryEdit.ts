import {Auth} from "../services/auth";

export class CategoryEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }
    }
}