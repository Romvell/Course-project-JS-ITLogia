import {Auth} from "../services/auth.js";
import {UrlManager} from "../services/url-manager";
import {CustomHttp} from "../services/custom-http";
import {CommonUtils} from "../services/common-utils";

export class CategoryEdit {
    constructor(typeCategory, openNewRoute) {
        this.openNewRoute = openNewRoute; // Функция для перехода по страницам
        this.typeCategory = typeCategory; // Тип категории Доходы/Расходы
        this.inputElement = document.getElementById('category-edit-input'); // Поле ввода
        this.okBtnElement = document.getElementById('category-edit-ok'); // Кнопка Ок
        this.cancelBtnElement = document.getElementById('category-edit-cancel'); // Кнопка Отмена

        // Проверка прав доступа
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }

        // проверяем наличие необходимых параметров в url
        this.routeParams = UrlManager.getQueryParams(); // Массив с параметрами из URLa
        if (!this.routeParams || !('id' in this.routeParams)) {
            console.log('Отсутствует ID категории');
            this.openNewRoute('/' + this.typeCategory);
            return;
        }

        // Корректировка HTML страницы
        if (typeCategory === 'income') {
            document.getElementById('category-edit-title')
                .innerText = 'Редактирование категории доходов';
        } else {
            document.getElementById('category-edit-title')
                .innerText = 'Редактирование категории расходов';
        }

        this.fillingInput().then();

        this.cancelBtnElement.setAttribute('href', '/' + this.typeCategory);

        this.okBtnElement.addEventListener('click', this.editCategory.bind(this));
    }

    // Получаем с бека данные редактируемой категории
    async getCategory(id) {
        try {
            const url = '/categories/' + this.typeCategory + '/' + id;
            const result = await CustomHttp.request(url, "GET", true);

            if (result) {
                if (result.error || !result.response || result.response.error) {
                    this.openNewRoute('/' + this.typeCategory);
                    throw new Error(result.response.message);
                } else {
                    return result.response;
                }
            }
        } catch (error) {
            console.log('Ошибка:' + error.message);
        }
    }

    // Заполнение поля Категория
    async fillingInput() {
        let category = await this.getCategory(this.routeParams.id);
        this.inputElement.value = category.title;
        this.inputElement.addEventListener("change", CommonUtils.validateForm.bind(this, this.typeCategory, this.inputElement));
    }

    // Редактируем операцию
    async editCategory() {

        if (await CommonUtils.validateForm(this.typeCategory, this.inputElement)) {
            try {
                const result = await CustomHttp.request('/categories/' + this.typeCategory
                    + '/' + this.routeParams.id, 'PUT', true, {
                    title: this.inputElement.value,
                });

                if (result) {
                    if (result.error || !result.response) {
                        throw new Error(result.response.message);
                    }
                    console.log('Категория успешно изменена. ID ' + result.response.id);
                    this.openNewRoute('/' + this.typeCategory);
                }
            } catch (error) {
                return console.log(error);
            }
        } else {
            console.log('invalid');
        }
    }
}