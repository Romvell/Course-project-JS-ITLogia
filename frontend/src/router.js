import {Lumincoin} from "./components/lumincoin.js";
import {Form} from "./components/form.js";
import {Logout} from "./components/logout.js";

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
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income&expense',
                title: 'Lumincoin Finance - Доходы и расходы',
                template: '/templates/income&expense.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/income',
                title: 'Lumincoin Finance - Доходы',
                template: '/templates/income.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/incomeAdd',
                title: 'Lumincoin Finance - Создание категории доходов',
                template: '/templates/income-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/incomeEdit',
                title: 'Lumincoin Finance - Редактирование категории доходов',
                template: '/templates/income-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/expense',
                title: 'Lumincoin Finance - Расходы',
                template: '/templates/expense.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/expenseAdd',
                title: 'Lumincoin Finance - Создание категории расходов',
                template: '/templates/expense-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //;
                },
            },
            {
                route: '/expenseEdit',
                title: 'Lumincoin Finance - Редактирование категории расходов',
                template: '/templates/expense-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/categoryAdd',
                title: 'Lumincoin Finance - Создание дохода/расхода',
                template: '/templates/category-add.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/categoryEdit',
                title: 'Lumincoin Finance - Редактирование дохода/расхода',
                template: '/templates/category-edit.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    //new Loogin('login');
                },
            },
            {
                route: '/modal',
                title: 'Выход из системы',
                template: '/templates/modalWindow.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Loogin('login');
                },
            },
            {
                route: '/modalIncomeDel',
                title: 'Lumincoin Finance - Удалить категорию',
                template: '/templates/modal-income-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Loogin('login');
                },
            },
            {
                route: '/modalExpenseDel',
                title: 'Lumincoin Finance - Удалить категорию',
                template: '/templates/modal-expense-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Loogin('login');
                },
            },
            {
                route: '/modalOperationDel',
                title: 'Lumincoin Finance - Удалить операцию',
                template: '/templates/modal-operation-del.html',
                useLayout: '/templates/layout.html',
                // styles: 'styles/form.css',
                load: () => {
                    // new Loogin('login');
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