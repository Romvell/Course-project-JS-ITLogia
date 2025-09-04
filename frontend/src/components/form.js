import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";

export class Form {
    constructor(page, openNewRoute) {
        this.rememberMeElement = null;
        this.processElement = null;
        this.page = page;
        this.openNewRoute = openNewRoute;
        this.serverAlert = document.getElementById('server-alert');

        this.serverAlert.innerText = '';
        this.serverAlert.classList.add('hide');

        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (accessToken && typeof accessToken !== undefined) {
            this.openNewRoute('/');
            return;
        }

        this.fields = [
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: "password",
                id: "password",
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                    name: "name",
                    id: "name",
                    element: null,
                    regex: /^[А-Я][а-яё]+\s*$/,
                    valid: false,
                },
                {
                    name: "lastName",
                    id: "last-name",
                    element: null,
                    regex: /^[А-Я][а-яё]+\s*$/,
                    valid: false,
                },
                {
                    name: "passwordRepeat",
                    id: "password-repeat",
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z]{8,}$/,
                    valid: false,
                });
        }

        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('remember-me');
            this.rememberMeElement.onchange = function () {
                that.validateForm();
            }
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm().then();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = '#B00020';
            element.parentNode.nextElementSibling.classList.remove('hide');
            field.valid = false;
        } else {
            element.removeAttribute('style');
            element.parentNode.nextElementSibling.classList.add('hide');
            field.valid = true;
        }
    };

    validateForm() {
        let validForm = this.fields.every(item => item.valid);
        if (!validForm) {
            this.fields.forEach(item => {
                if (!item.valid) {
                    item.element.style.borderColor = '#B00020';
                    item.element.parentNode.nextElementSibling.classList.remove('hide');
                }
            })
        }
        // Проверка на совпадение паролей
        const passwordElement = document.getElementById('password');
        const passwordRepeatElement = document.getElementById('password-repeat');
        if (this.page === 'signup') {
            if (passwordElement.value !== passwordRepeatElement.value) {
                validForm = false;
                passwordElement.style.borderColor = '#B00020';
                passwordRepeatElement.style.borderColor = '#B00020';
                this.serverAlert.innerText = 'Пароли не совпадают.';
                this.serverAlert.classList.remove('hide');
            }
        }
        return validForm;
    };

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.id === 'email').element.value;
            const password = this.fields.find(item => item.id === 'password').element.value;
            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request('/signup', 'POST', false, {
                        name: this.fields.find(item => item.id === 'name').element.value,
                        lastName: this.fields.find(item => item.id === 'last-name').element.value,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.id === 'password-repeat').element.value,
                    });

                    if (result) {
                        if (result.error || !result.response.user) {
                            throw new Error(result.response.message);
                        }
                    }
                } catch (error) {
                    this.serverAlert.innerText = 'Server ' + error;
                    this.serverAlert.classList.remove('hide');
                    return console.log(error);
                }
            }
            try {
                let rememberMeChecked = false;
                if (this.page === 'login') {
                    rememberMeChecked = this.rememberMeElement.checked;
                }
                const result = await CustomHttp.request('/login', 'POST', false, {
                    email: email,
                    password: password,
                    rememberMe: rememberMeChecked,
                });

                if (result) {
                    if (result.error || !result.response || (result.response && (!result.response.tokens.accessToken
                        || !result.response.tokens.refreshToken || !result.response.user.name || !result.response.user.lastName
                        || !result.response.user.id))) {
                        throw new Error(result.response.message);
                    }

                    Auth.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                        name: result.response.user.name,
                        lastName: result.response.user.lastName,
                        userId: result.response.user.id
                    })

                    this.openNewRoute('/');
                }
            } catch (error) {
                console.log('Ошибка:' + error.message);
                this.serverAlert.innerText = 'Server error: ' + error.message;
                this.serverAlert.classList.remove('hide');
            }
        }
    }
}