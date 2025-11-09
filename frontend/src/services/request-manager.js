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

    // Запрос баланса с бека
    static async getBalance() {
        try {
            const url = '/balance';
            const result = await CustomHttp.request(url);
            if (result) {
                if (result.error || !result.response) {
                    console.log(result);
                    throw new Error(result.error.message);
                }
                return result.response;
            }
        } catch (error) {
            console.log('Ошибка :' + error.message);
        }
    }
}