import {Lumincoin} from "./components/lumincoin";
import {Signup} from "./components/signup";
import {Login} from "./components/login";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
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
                    new Lumincoin();
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: '/templates/signup.html',
                useLayout: false,
                // styles: 'styles/form.css',
                load: () => {
                    new Signup('signup');
                },
            },
            {
                route: '/login',
                title: 'Вход в систему',
                template: '/templates/login.html',
                useLayout: false,
                // styles: 'styles/form.css',
                load: () => {
                    new Login('login');
                },
            },
            {
                route: '/income&expense',
                title: 'Lumincoin Finance - Доходы и расходы',
                template: '/templates/income&expense.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/income',
                title: 'Lumincoin Finance - Доходы',
                template: '/templates/income.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/incomeAdd',
                title: 'Lumincoin Finance - Создание категории доходов',
                template: '/templates/income-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/incomeEdit',
                title: 'Lumincoin Finance - Редактирование категории доходов',
                template: '/templates/income-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/expense',
                title: 'Lumincoin Finance - Расходы',
                template: '/templates/expense.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/expenseAdd',
                title: 'Lumincoin Finance - Создание категории расходов',
                template: '/templates/expense-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/expenseEdit',
                title: 'Lumincoin Finance - Редактирование категории расходов',
                template: '/templates/expense-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/categoryAdd',
                title: 'Lumincoin Finance - Создание дохода/расхода',
                template: '/templates/category-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/categoryEdit',
                title: 'Lumincoin Finance - Редактирование дохода/расхода',
                template: '/templates/category-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Login('login');
                },
            },
            {
                route: '/modal',
                title: 'Выход из системы',
                template: '/templates/modalWindow.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Login('login');
                },
            },
            {
                route: '/modalIncomeDel',
                title: 'Lumincoin Finance - Удалить категорию',
                template: '/templates/modal-income-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Login('login');
                },
            },
            {
                route: '/modalExpenseDel',
                title: 'Lumincoin Finance - Удалить категорию',
                template: '/templates/modal-expense-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Login('login');
                },
            },
            {
                route: '/modalOperationDel',
                title: 'Lumincoin Finance - Удалить операцию',
                template: '/templates/modal-operation-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Login('login');
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.openNewRoute.bind(this));
    }

    async openNewRoute(e) {
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

            history.pushState({}, '', url);
            await this.activateRoute();
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        console.log(urlRoute + ', ' + newRoute.route);
        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }
            if (newRoute.template) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML =
                        await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML =
                    await fetch(newRoute.template).then(response => response.text());

            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('Страница не найдена');
            history.pushState({}, '', '/');
            await this.activateRoute();
        }
    }
}