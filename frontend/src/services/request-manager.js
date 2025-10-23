import {CustomHttp} from "./custom-http";

export class RequestManager {
    // Запрос категорий с бека
    static async getCategories(typeOperations) {
        if (typeOperations === 'income' || typeOperations === 'expense') {
            try {
                const url = '/categories/' + typeOperations;

                const result = await CustomHttp.request(url);
                if (result) {
                    if (result.error || !result.response) {
                        throw new Error(result.error.message);
                    }
                    return result.response;
                }
            } catch (error) {
                console.log('Ошибка :' + error.message);
            }
        } else {
            console.log('Неправильный тип операции');
        }
    }
}