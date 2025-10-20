import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http";

export class IncomeExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.firstUseFlag = false;
        // Значения фильтра по умолчанию
        this.dateFrom = this.dateFormat(null); // от 01.01.1970
        this.dateTo = this.dateFormat(); // до текущей даты

        // Проверяем наличие токена авторизации
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
            return;
        }

        // Определяем начальное состояние фильтра и делаем соответствующий запрос
        const radioButton = document
            .querySelectorAll('input[type="radio"][name="filter"]');
        if (!this.firstUseFlag) {
            radioButton.forEach(radio => {
                if (radio.checked) {
                    this.operationsFilter(radio.value);
                    this.firstUseFlag = true;
                }
            });
        }

        // Вызов функции при нажатии на кнопку фильтра
        document.querySelectorAll('input[type="radio"][name="filter"]')
            .forEach(radio => {
                radio.addEventListener('click', () => this.operationsFilter(radio.value));
                this.firstUseFlag = true;
            });
    }

    // Функция приведения строки даты к формату гггг-мм-дд
    dateFormat(dateStr) {
        let objDate;
        if (typeof dateStr === 'undefined' || dateStr === '') {
            objDate = new Date();
        } else {
            objDate = new Date(dateStr);
        }
        const strDate = objDate.toLocaleString('ru-RU', {year: 'numeric', month: 'numeric', day: 'numeric'});
        return strDate.split(".").reverse().join("-");
    }

    // Фильтр данных
    operationsFilter(numberFilter) {
        switch (numberFilter) {
            case '1': // Сегодня
                this.dateFrom = this.dateFormat((new Date()).setDate((new Date()).getDate() - 1));
                this.dateTo = this.dateFormat();
                break;
            case '2': // Неделя
                this.dateFrom = this.dateFormat((new Date()).setDate((new Date()).getDate() - 7));
                this.dateTo = this.dateFormat();
                break;
            case '3': // Месяц
                this.dateFrom = this.dateFormat((new Date()).setMonth((new Date()).getMonth() - 1));
                this.dateTo = this.dateFormat();
                break;
            case '4': // Год
                this.dateFrom = this.dateFormat((new Date()).setFullYear((new Date()).getFullYear() - 1));
                this.dateTo = this.dateFormat();
                break;
            case '5': // За всё время (с 01.01.1970 по сегодня)
                this.dateFrom = this.dateFormat(null);
                this.dateTo = this.dateFormat();
                break;
            case '6': // За указанный период
                this.dateFrom = this.dateFormat(document.getElementById('date-from').value);
                this.dateTo = this.dateFormat(document.getElementById('date-to').value);
                if ((((new Date(this.dateTo)) - (new Date(this.dateFrom))) / 1000 / 3600 / 24) < 0) {
                    this.dateTo = this.dateFrom;
                    document.getElementById('date-to').value
                        = document.getElementById('date-from').value;
                }
                break;
            default:
                console.log('Ошибка: Неправильный номер фильтра' + numberFilter);
        }
        // Запрос данных с бека
        this.getOperations().then();
    }

    // Запрос данных с бека
    async getOperations() {
        try {
            const url = '/operations?period=interval&dateFrom=' + this.dateFrom + '&dateTo=' + this.dateTo;
            const result = await CustomHttp.request(url);

            if (result) {
                if (result.error || !result.response) {
                    throw new Error(result.message);
                }
                this.showOperations(result);
            }
        } catch (error) {
            console.log('Ошибка:' + error.message);
        }
    }

    // Создание HTML таблицы
    showOperations(operations) {
        // Находим таблицу
        const operationsElement = document.getElementById('operations');
        operationsElement.replaceChildren(); // Удаляем старые данные.
        // Создаём и заполняем строки таблицы
        for (let i = 0; i < operations.response.length; i++) {
            const trElement = document.createElement('tr');
            let tdElement = trElement.insertCell()

            tdElement.innerText = i + 1;
            tdElement.classList.add("table__td_bold");
            let operationType = operations.response[i].type;
            let className = "";
            if (operations.response[i].type === "expense") {
                operationType = "расход";
                className = "table__td_red";
            } else {
                operationType = "доход";
                className = "table__td_green"
            }
            tdElement = trElement.insertCell()
            tdElement.innerText = operationType;
            tdElement.classList.add(className);

            trElement.insertCell().innerText = operations.response[i].category;

            trElement.insertCell().innerText = operations.response[i].amount.toLocaleString('ru-RU') + '$';
            trElement.insertCell().innerText = (new Date(operations.response[i].date))
                .toLocaleDateString('ru-RU');
            trElement.insertCell().innerText = operations.response[i].comment;
            const trash = document.getElementById('trash');
            trElement.insertCell().innerHTML = '<a href="/modalOperationDel?id=' + operations.response[i].id
                + '" class="table__link">' + trash.outerHTML + '</a>';
            const pen = document.getElementById('pen');
            trElement.insertCell().innerHTML = '<a href="/operationEdit?id=' + operations.response[i].id
                + '" class="table__link">' + pen.outerHTML + '</a>';

            trElement.classList.add("table__row")
            operationsElement.appendChild(trElement);
        }
    }
}