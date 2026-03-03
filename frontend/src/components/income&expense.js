import {Auth} from "../services/auth.js";
import {CommonUtils} from "../services/common-utils";
import {RequestManager} from "../services/request-manager";

export class IncomeExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.firstUseFlag = false;

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
                    this.showOperations(radio.value).then();
                    this.firstUseFlag = true;
                }
            });
        }

        // Вызов функции при нажатии на кнопку фильтра
        radioButton.forEach(radio => {
            radio.addEventListener('click', () => {
                this.showOperations(radio.value).then();
            });
            this.firstUseFlag = true;
        });
    }

    // Создание HTML таблицы
    async showOperations(radioValue) {
        // Запрос данных с бека
        const operations = await RequestManager.getOperations(CommonUtils.operationsFilter(radioValue)[0],
                        CommonUtils.operationsFilter(radioValue)[1]);
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
                + '" class="table__link" title="Удалить операцию">' + trash.outerHTML + '</a>';
            const pen = document.getElementById('pen');
            trElement.insertCell().innerHTML = '<a href="/operationEdit?id=' + operations.response[i].id
                + '" class="table__link" title="Редактировать операцию">' + pen.outerHTML + '</a>';

            trElement.classList.add("table__row")
            operationsElement.appendChild(trElement);
        }
    }
}