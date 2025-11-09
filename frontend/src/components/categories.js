import {Auth} from "../services/auth.js";
import {RequestManager} from "../services/request-manager";

export class Categories {
    constructor(operationType, openNewRoute) {
        this.openNewRoute = openNewRoute; // Функция для перехода по страницам
        this.operationType = operationType; //Тип операций
        this.categoriesElement = document.getElementById('categories-element');

        // Проверка прав доступа
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }

        if (operationType === 'income') {
            document.getElementById('categories-title').innerText = 'Доходы';
        } else if (operationType === 'expense') {
            document.getElementById('categories-title').innerText = 'Расходы';
        }
        this.createCategoriesPage(this.operationType).then();
    }

    // Получение категорий с бека
    async getCategories(operationType) {
        return await RequestManager.getCategories(operationType);
    }

    // Генерация страницы со списком категорий
    async createCategoriesPage(operationType) {
        this.categoriesElement.replaceChildren(); // Удаляем старые данные.
        let categories = await this.getCategories(operationType)
        if (categories) {
            categories.forEach(category => {
            const categoryElement = document.createElement('div');
            const categoryTitle = document.createElement('div');
            categoryTitle.classList.add('category-item__title', 'title');
            categoryTitle.innerText = category.title;
            categoryElement.appendChild(categoryTitle);
            const categoryBtns = document.createElement('div');
            const okBtn = document.createElement('a');
            const cancelBtn = document.createElement('a');
            okBtn.setAttribute('href', "/" + operationType + "CategoryEdit?id=" + category.id);
            cancelBtn.setAttribute('href', "/modal" + operationType.charAt(0).toUpperCase()
                + operationType.slice(1) + "Del?id=" + category.id);
            okBtn.classList.add('category-btn', 'category-btn_blue');
            cancelBtn.classList.add('category-btn', 'category-btn_red');
            okBtn.textContent = 'Редактировать';
            cancelBtn.textContent = 'Удалить';
            categoryBtns.appendChild(okBtn);
            categoryBtns.appendChild(cancelBtn);
            categoryBtns.classList.add('block-btn');
            categoryElement.appendChild(categoryBtns);
            categoryElement.classList.add('category-item');
            this.categoriesElement.appendChild(categoryElement);
        })
        const categoryElement = document.createElement('div');
        const plusBtn = document.createElement('a');
        plusBtn.setAttribute('href', "/" + operationType + "CategoryAdd");
        plusBtn.textContent = '+';
        plusBtn.classList.add('category-item_add');
        categoryElement.appendChild(plusBtn);
        categoryElement.classList.add('category-item');
        this.categoriesElement.appendChild(categoryElement);
        } else {
            this.openNewRoute('/');
        }

    }
}