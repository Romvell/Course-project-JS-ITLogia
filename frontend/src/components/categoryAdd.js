import {Auth} from "../services/auth.js";
import {RequestManager} from "../services/request-manager";
import {CustomHttp} from "../services/custom-http";
import {CommonUtils} from "../services/common-utils";

export class CategoryAdd {
    constructor(typeCategory, openNewRoute) {
        this.openNewRoute = openNewRoute; // Функция для перехода по страницам
        this.typeCategory = typeCategory; // Тип категории Доходы/Расходы
        this.inputElement = document.getElementById('category-input-element'); // Поле ввода
        this.okBtnElement = document.getElementById('create-category-ok'); // Кнопка Ок
        this.cancelBtnElement = document.getElementById('create-category-cancel'); // Кнопка Отмена

        // Проверка прав доступа
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }

        if (typeCategory === 'income') {
            document.getElementById('category-add-title').innerText = 'Создание категории доходов';
        } else {
            document.getElementById('category-add-title').innerText = 'Создание категории расходов';
        }
        this.cancelBtnElement.setAttribute('href', '/' + this.typeCategory);

        this.okBtnElement.addEventListener('click', this.categoryCreate.bind(this));
    }

    async categoryCreate() {
        //if (await this.validateForm()) {
        if (await CommonUtils.validateForm(this.typeCategory, this.inputElement)) {
            const url = '/categories/' + this.typeCategory;

            try {
                const result = await CustomHttp.request(url, 'POST', true, {
                    title: this.inputElement.value,
                });

                if (result) {
                    if (result.error || !result.response || (result.response && (!result.response.id
                        || !result.response.title))) {
                        throw new Error(result.response.message);
                    }
                    console.log('Категория ' + result.response.title + ' успешно создана. ID ' + result.response.id);
                    this.openNewRoute('/' + this.typeCategory);
                }
            } catch (error) {
                return console.log(error);
            }
        }
    }

    async validateForm() {
        let valid = false;
        const categoryName = this.inputElement.value;
        if (categoryName) {
            const categories = await RequestManager.getCategories(this.typeCategory);
            const doubleCategories = categories.find(category => category.title.toString().toLowerCase() === categoryName.toLowerCase());
            if (doubleCategories) {
                this.inputElement.style.borderColor = '#B00020';
                this.inputElement.style.borderWidth = '2px';
                this.inputElement.nextElementSibling.classList.remove('hide');
                this.inputElement.nextElementSibling.innerText = 'Такая категория уже существует';
                valid = false;
            } else {
                this.inputElement.removeAttribute('style');
                this.inputElement.nextElementSibling.classList.add('hide');
                this.inputElement.nextElementSibling.innerText = '';
                valid = true;
            }
        } else {
            this.inputElement.style.borderColor = '#B00020';
            this.inputElement.style.borderWidth = '2px';
            this.inputElement.nextElementSibling.classList.remove('hide');
            this.inputElement.nextElementSibling.innerText = 'Введите название категории';
            valid = false;
        }
        return valid;
    }
}