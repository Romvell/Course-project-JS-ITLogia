import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";

export class Lumincoin {
    constructor(openNewRoute) {
        //console.log('Lumincoin Finance');
        this.openNewRoute = openNewRoute;
        this.getCategories().then();
    }

    async getCategories(){
        const result = await CustomHttp.request('/categories/income');
        //console.log(result);
        if (result.redirect) {
            if (result.error) {
                console.log('Ошибка:' + result.response.message)
            }
            return this.openNewRoute(result.redirect);
        }
    }
}