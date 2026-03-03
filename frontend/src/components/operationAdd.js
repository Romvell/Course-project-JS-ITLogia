import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import {UrlManager} from "../services/url-manager";

export class OperationAdd {
    constructor(page, openNewRoute) {
        this.openNewRoute = openNewRoute; // Функция для перехода по страницам
        this.page = page; // На какую страницу переходим (доход/расход)
        this.routeParams = {}; // Массив с параметрами из URLa
        this.typeElement = document.getElementById('selectOperationType'); // Поле тип операции
        this.categoriesElement = document.getElementById('selectCategories'); // Поле Категория
        this.sumElement = document.getElementById('sum'); // Поле Сумма
        this.dateElement = document.getElementById('date'); // Поле дата
        this.commentElement = document.getElementById('comment'); // Поле комментарий
        this.btnOkElement = document.getElementById('operation-ok-btn'); // Кнопка Ок
        this.categories = {}; // Категории операций
        this.operation = {}; // Редактируемая операция

        // Проверка прав доступа
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }

        // Корректировка HTML страницы
        const titleElement = document.getElementById('operation-title')
        if (this.page === 'income' || this.page === 'expense') {
            titleElement.innerText = 'Создание дохода/расхода';
            this.btnOkElement.innerText = 'Создать';

            // Заполняем поле тип операций
            this.setOperationTypeField(this.page);

            this.getCategories(this.page).then(); // Заполняем поле выбора категорий

            // Заполняем поле дата
            const objDate = new Date();
            const strDate = objDate.toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'});
            this.dateElement.value = strDate.split(".").reverse().join("-");

        } else {
            titleElement.innerText = 'Редактирование дохода/расхода';
            this.btnOkElement.innerText = 'Сохранить';

            // проверяем наличие необходимых параметров в url
            this.routeParams = UrlManager.getQueryParams(); // Массив с параметрами из URLa
            if (!this.routeParams || !('id' in this.routeParams)) {
                console.log('Отсутствует ID операции');
                this.openNewRoute('/income&expense');
                return;
            }

            // Заполняем поля формы данными с бека
            this.fillingFields().then();
        }

        // Проверка заполнения полей формы
        this.sumElement.addEventListener("change", this.validateForm.bind(this));
        this.dateElement.addEventListener("change", this.validateForm.bind(this));

        if (this.page === 'income' || this.page === 'expense') {
            // Обработчик кнопки создать
            this.btnOkElement.addEventListener('click', this.createOperation.bind(this));
        }

        if (this.page === 'operationEdit') {
            // Обработчик кнопки сохранить
            this.btnOkElement.addEventListener('click', this.editOperation.bind(this));
        }
    }

    // Заполняем поле тип операций
    setOperationTypeField(operationType) {
        if (operationType === 'income') {
            this.typeElement.value = 'доход';
        } else if (operationType === 'expense') {
            this.typeElement.value = 'расход';
        }
    }

    // Создание дохода/расхода
    async createOperation() {
        if (this.validateForm()) {
            const comment = document.getElementById('comment').value;
            const category_id = this.categories.find(item => item.title === this.categoriesElement.value).id;

            try {
                const result = await CustomHttp.request('/operations', 'POST', true, {
                    type: this.page,
                    amount: +this.sumElement.value,
                    date: this.dateElement.value,
                    comment: comment,
                    category_id: category_id,
                });

                if (result) {
                    if (result.error || !result.response || (result.response && (!result.response.id
                        || !result.response.type || !result.response.amount || !result.response.date
                        || !result.response.comment || !result.response.category))) {
                        throw new Error(result.response.message);
                    }
                    console.log('Операция успешно добавлена. ID ' + result.response.id);
                    this.openNewRoute('/income&expense');
                }
            } catch (error) {
                return console.log(error);
            }
        } else {
            console.log('Заполните обязательные поля');
        }
    }

    // Редактирование дохода/расхода
    async editOperation(e) {
        e.preventDefault() // Отменяем действие по умолчанию при нажатии кнопки

        if (this.validateForm()) {
            const changedData = {};
            changedData.type = this.typeElement.value;
            changedData.category = this.categoriesElement.value;
            changedData.amount = +this.sumElement.value;
            changedData.date = this.dateElement.value;
            changedData.comment = this.commentElement.value;

            try {
                const result = await CustomHttp.request('/operations/' + this.routeParams.id, 'PUT', true, changedData);

                if (result) {
                    if (result.error || !result.response) {
                        throw new Error(result.response.message);
                    }
                    console.log('Операция успешно изменена. ID ' + result.response.id);
                    this.openNewRoute('/income&expense');
                }
            } catch (error) {
                return console.log(error);
            }
        }
    }

    // Получаем с бека данные редактируемой операции
    async getOperation(id) {
        try {
            const url = '/operations/' + id;
            const result = await CustomHttp.request(url, "GET", true);

            if (result) {
                if (result.error || !result.response || result.response.error) {
                    this.openNewRoute('/income&expense');
                    throw new Error(result.response.message);
                } else {
                    return result.response;
                }
            }
        } catch (error) {
            console.log('Ошибка:' + error.message);
        }
    }

    // Заполняем поля формы
    async fillingFields() {
        this.operation = await this.getOperation(this.routeParams.id);
        // Заполняем поле тип операций
        this.setOperationTypeField(this.operation.type);
        // Заполняем селект категорий
        await this.getCategories(this.operation.type);
        // Категория текущей операции
        this.categoriesElement.value = this.operation.category;
        // Заполняем поле сумма
        this.sumElement.value = this.operation.amount;
        // Заполняем поле дата
        this.dateElement.value = this.operation.date;
        // Заполняем поле комментарий
        this.commentElement.value = this.operation.comment;
    }

    // Валидация формы
    validateForm() {
        let sumValid = false;
        let dateValid = false;
        let categoryValid = false;
        if (!(this.sumElement.value.match(/^\d*(\,\d{1,2})?$/)) || this.sumElement.value === '') {
            this.sumElement.style.borderColor = '#B00020';
            this.sumElement.style.borderWidth = '2px';
            this.sumElement.nextElementSibling.classList.remove('hide');
            sumValid = false
        } else {
            this.sumElement.removeAttribute('style');
            this.sumElement.nextElementSibling.classList.add('hide');
            sumValid = true
        }
        if (!this.dateElement.value) {
            this.dateElement.style.borderColor = '#B00020';
            this.dateElement.style.borderWidth = '2px';
            this.dateElement.nextElementSibling.classList.remove('hide');
            dateValid = false
        } else {
            this.dateElement.removeAttribute('style');
            this.dateElement.nextElementSibling.classList.add('hide');
            dateValid = true
        }
        if (!this.categoriesElement.value) {
            this.categoriesElement.style.borderColor = '#B00020';
            this.categoriesElement.style.borderWidth = '2px';
            this.categoriesElement.nextElementSibling.classList.remove('hide');
            categoryValid = false
        } else {
            this.categoriesElement.removeAttribute('style');
            this.categoriesElement.nextElementSibling.classList.add('hide');
            categoryValid = true
        }

        return (sumValid && dateValid && categoryValid);
    }

    // Создание списка категорий в форме
    createSelectCategories(categories) {

        if (categories && categories.length > 0) {
            this.categoriesElement.replaceChildren();
            for (let i = 0; i < categories.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.classList.add("select__option");
                optionElement.value = categories[i].title;
                optionElement.text = categories[i].title.toLowerCase();
                this.categoriesElement.appendChild(optionElement);
            }
        }
    }

    // Запрос категорий с бека
    async getCategories(typeOperations) {
        if (typeOperations === 'income' || typeOperations === 'expense') {
            try {
                const url = '/categories/' + typeOperations;

                const result = await CustomHttp.request(url);
                if (result) {
                    if (result.error || !result.response) {
                        throw new Error(result.error.message);
                    }
                    this.categories = result.response;
                    this.createSelectCategories(result.response);
                }
            } catch (error) {
                console.log('Ошибка :' + error.message);
            }
        } else {
            console.log('Неправильный тип операции');
            this.openNewRoute('/income&expense');
        }
    }
}