export class UrlManager {

    // Преобразование параметров GET запроса в массив данных
    static getQueryParams() {
        let searchParams = window.location.search.slice(1).split('&');
        let queryParams = {};

        for (let param of searchParams) {
            let [key, value] = param.split('=');
            queryParams[key] = decodeURIComponent(value || "");
        }

        return queryParams;
    }
}