import {Auth} from "../services/auth.js";
import {UrlManager} from "../services/url-manager";
import {CustomHttp} from "../services/custom-http";

export class ModalWindow {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute; // Функция для перехода по страницам
        this.routeParams = UrlManager.getQueryParams(); // Массив с параметрами из URLa
        this.operationDelElement = document.getElementById('operationDel'); // Кнопка Удалить

        // Проверяем наличие токена авторизации
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }

        // Обработчик кнопки удалить
        this.operationDelElement
            .addEventListener("click", this.operationDel.bind(this, this.routeParams.id))
    }

    // Удаление операции
    async operationDel(id){
        try {
            const url = '/operations/' + id;
            const result = await CustomHttp.request(url, "DELETE", true);

            if (result) {
                if (result.error || !result.response || result.response.error) {
                    throw new Error(result.message);
                }
                console.log(result.response.message());
                this.openNewRoute('/income&expense');
            }
        } catch (error) {
            console.log('Ошибка:' + error.message);
        }
    }
}