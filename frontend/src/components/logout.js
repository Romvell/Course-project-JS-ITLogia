import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";

export class Logout {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!Auth.getAuthInfo(Auth.accessTokenKey) || !Auth.getAuthInfo(Auth.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout() {
        await CustomHttp.request('/logout', 'POST', false,{
            refreshToken: Auth.getAuthInfo(Auth.refreshTokenKey),
        });

        Auth.removeAuthInfo();

        this.openNewRoute('/login');
    }


}