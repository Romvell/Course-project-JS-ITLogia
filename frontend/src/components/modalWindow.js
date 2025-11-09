import {Auth} from "../services/auth.js";
import {UrlManager} from "../services/url-manager";
import {CustomHttp} from "../services/custom-http";

export class ModalWindow {
    constructor(page, openNewRoute) {
        this.openNewRoute = openNewRoute; // Функция для перехода по страницам
        this.routeParams = UrlManager.getQueryParams(); // Массив с параметрами из URLa
        this.operationDelElement = document.getElementById('operationDel'); // Кнопка Удалить
        this.page = page //Указатель на страницу, с которой пришли
        this.cancelBtnElement = document.getElementById('cancel-btn');

        // Проверяем наличие токена авторизации
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }

        switch (this.page) {
            case 'operation' : // Модальное окно удаления операции
                document.getElementById('modal-title').innerText = 'Вы действительно хотите удалить операцию?';
                document.getElementById('operationDel').innerText = 'Да, удалить';
                this.cancelBtnElement.innerText = 'Не удалять';
                this.cancelBtnElement.setAttribute('href', '/income&expense');
                // Обработчик кнопки удалить
                this.operationDelElement
                    .addEventListener("click", this.operationDel.bind(this, this.routeParams.id));
                return;
            case 'income':
                document.getElementById('modal-title').innerText = 'Вы действительно хотите удалить категорию? Связанные доходы останутся без категории.';
                document.getElementById('operationDel').innerText = 'Да, удалить';
                this.cancelBtnElement.innerText = 'Не удалять';
                this.cancelBtnElement.setAttribute('href', '/income');
                // Обработчик кнопки удалить
                this.operationDelElement
                    .addEventListener("click", this.incomeDel.bind(this, this.routeParams.id));
                return;
            case 'expense':
                document.getElementById('modal-title').innerText = 'Вы действительно хотите удалить категорию?';
                document.getElementById('operationDel').innerText = 'Да, удалить';
                this.cancelBtnElement.innerText = 'Не удалять';
                this.cancelBtnElement.setAttribute('href', '/expense');
                // Обработчик кнопки удалить
                this.operationDelElement
                    .addEventListener("click", this.expenseDel.bind(this, this.routeParams.id));
                return;
            case 'logout':
                document.getElementById('modal-title').innerText = 'Действительно хотите выйти?';
                document.getElementById('operationDel').innerText = 'Да, выйти';
                this.cancelBtnElement.innerText = 'Отмена';
                this.cancelBtnElement.setAttribute('href', 'javascript:void(0)');
                this.cancelBtnElement.addEventListener('click', function () {
                    history.back();
                });
                // Обработчик кнопки отмена
                this.operationDelElement
                    .addEventListener("click", this.openNewRoute.bind(this, '/logout'));
                return;
        }
    }

    // Удаление операции
    async operationDel(id) {
        try {
            const url = '/operations/' + id;
            const result = await CustomHttp.request(url, "DELETE", true);

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                console.log(result.message);
                this.openNewRoute('/income&expense');
            }
        } catch (error) {
            console.log('Ошибка:' + error.message);
        }
    }

    // Удаление категории дохода
    async incomeDel(id) {
        try {
            const url = '/categories/income/' + id;
            const result = await CustomHttp.request(url, "DELETE", true);

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                console.log(result.message);
                this.openNewRoute('/income');
            }
        } catch (error) {
            console.log('Ошибка:' + error.message);
        }
    }

    // Удаление категории расхода
    async expenseDel(id) {
        try {
            const url = '/categories/expense/' + id;
            const result = await CustomHttp.request(url, "DELETE", true);

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                console.log(result.message);
                this.openNewRoute('/expense');
            }
        } catch (error) {
            console.log('Ошибка:' + error.message);
        }
    }
}