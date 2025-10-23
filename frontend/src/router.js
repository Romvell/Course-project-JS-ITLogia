import {Lumincoin} from "./components/lumincoin.js";
import {Form} from "./components/form.js";
import {Logout} from "./components/logout.js";
import {IncomeExpense} from "./components/income&expense";
import {Categories} from "./components/categories.js";
import {ModalWindow} from "./components/modalWindow.js";
import {OperationAdd} from "./components/operationAdd";
import {IncomeAdd} from "./components/incomeAdd";
import {IncomeEdit} from "./components/incomeEdit";
import {ExpenseAdd} from "./components/expenseAdd";
import {ExpenseEdit} from "./components/expenseEdit";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.stylesElement = document.getElementById('common-styles');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Lumincoin Finance',
                template: '/templates/index.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/index.css',
                load: () => {
                    new Lumincoin(this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/signup',
                title: 'Регистрация',
                template: '/templates/signup.html',
                useLayout: false,
                styles: ['form.css'],
                load: () => {
                    new Form('signup', this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/login',
                title: 'Вход в систему',
                template: '/templates/login.html',
                useLayout: false,
                styles: ['form.css'],
                load: () => {
                    //document.body.classList.add('login-page') //добавление классов к body
                    new Form('login', this.openNewRoute.bind(this));
                },
                unload: () => {
                    //document.body.classList.remove('login-page') //удаление классов из body
                }
            },
            {
                // Готово
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                // Готово
                route: '/income&expense',
                title: 'Lumincoin Finance - Доходы и расходы',
                template: '/templates/income&expense.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new IncomeExpense(this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/income',
                title: 'Lumincoin Finance - Доходы',
                template: '/templates/categories.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new Categories('income', this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomeCategoryAdd',
                title: 'Lumincoin Finance - Создание категории доходов',
                template: '/templates/income-category-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new IncomeAdd(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomeCategoryEdit',
                title: 'Lumincoin Finance - Редактирование категории доходов',
                template: '/templates/income-category-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/expense',
                title: 'Lumincoin Finance - Расходы',
                template: '/templates/categories.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new Categories('expense', this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenseCategoryAdd',
                title: 'Lumincoin Finance - Создание категории расходов',
                template: '/templates/expense-category-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new ExpenseAdd(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenseCategoryEdit',
                title: 'Lumincoin Finance - Редактирование категории расходов',
                template: '/templates/expense-category-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/incomeAdd',
                title: 'Lumincoin Finance - Создание дохода',
                template: '/templates/operation-page.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new OperationAdd('income', this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/expenseAdd',
                title: 'Lumincoin Finance - Создание /расхода',
                template: '/templates/operation-page.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new OperationAdd('expense', this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/operationEdit',
                title: 'Lumincoin Finance - Редактирование дохода/расхода',
                template: '/templates/operation-page.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new OperationAdd('operationEdit', this.openNewRoute.bind(this));
                },
            },
            {
                route: '/modal',
                title: 'Выход из системы',
                template: '/templates/modalWindow.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new ModalWindow(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/modalIncomeDel',
                title: 'Lumincoin Finance - Удалить категорию',
                template: '/templates/modal-income-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new ModalWindow(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/modalExpenseDel',
                title: 'Lumincoin Finance - Удалить категорию',
                template: '/templates/modal-expense-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new ModalWindow(this.openNewRoute.bind(this));
                },
            },
            {
                // Готово
                route: '/modalOperationDel',
                title: 'Lumincoin Finance - Удалить операцию',
                template: '/templates/modal-operation-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    new ModalWindow('operation', this.openNewRoute.bind(this));
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode
        }

        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute && currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/styles/${style}']`).remove();
                })
            }

            if (currentRoute && currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/styles/' + style;
                    this.stylesElement.after(link);
                });
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }
            if (newRoute.template) {

                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML =
                        await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    //Добавляем и удаляем классы из body по необходимости
                    //     document.body.classList.add('sidebar-mini');
                    //     document.body.classList.add('layout-fixed');
                    // } else {
                    //     document.body.classList.remove('sidebar-mini');
                    //     document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML =
                    await fetch(newRoute.template).then(response => response.text());

            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('Страница не найдена');
            history.pushState({}, '', '/'); //url:'/404'
            await this.activateRoute(e); //e-проверить
        }
    }
}