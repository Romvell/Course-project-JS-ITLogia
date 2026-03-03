import {RequestManager} from "./request-manager";

export class CommonUtils {
    static async validateForm(typeCategory, inputElement) {
        let valid = false;
        const categoryName = inputElement.value;
        if (categoryName) {
            const categories = await RequestManager.getCategories(typeCategory);
            const doubleCategories = categories.find(category => category.title.toString().toLowerCase() === categoryName.toLowerCase());
            if (doubleCategories) {
                inputElement.style.borderColor = '#B00020';
                inputElement.style.borderWidth = '2px';
                inputElement.nextElementSibling.classList.remove('hide');
                inputElement.nextElementSibling.innerText = 'Такая категория уже существует';
                valid = false;
            } else {
                inputElement.removeAttribute('style');
                inputElement.nextElementSibling.classList.add('hide');
                inputElement.nextElementSibling.innerText = '';
                valid = true;
            }
        } else {
            inputElement.style.borderColor = '#B00020';
            inputElement.style.borderWidth = '2px';
            inputElement.nextElementSibling.classList.remove('hide');
            inputElement.nextElementSibling.innerText = 'Введите название категории';
            valid = false;
        }
        return valid;
    }

    // Функция приведения строки даты к формату гггг-мм-дд
    static dateFormat(dateStr) {
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
    static operationsFilter(numberFilter) {
        let dateFrom, dateTo;
        switch (numberFilter) {
            case '1': // Сегодня
                dateFrom = this.dateFormat((new Date()).setDate((new Date()).getDate() - 1));
                dateTo = this.dateFormat();
                return [dateFrom, dateTo];
            //break;
            case '2': // Неделя
                dateFrom = this.dateFormat((new Date()).setDate((new Date()).getDate() - 7));
                dateTo = this.dateFormat();
                return [dateFrom, dateTo];
            case '3': // Месяц
                dateFrom = this.dateFormat((new Date()).setMonth((new Date()).getMonth() - 1));
                dateTo = this.dateFormat();
                return [dateFrom, dateTo];
            case '4': // Год
                dateFrom = this.dateFormat((new Date()).setFullYear((new Date()).getFullYear() - 1));
                dateTo = this.dateFormat();
                return [dateFrom, dateTo];
            case '5': // За всё время (с 01.01.1970 по сегодня)
                dateFrom = this.dateFormat(null);
                dateTo = this.dateFormat();
                return [dateFrom, dateTo];
            case '6': // За указанный период
                dateFrom = this.dateFormat(document.getElementById('date-from').value);
                dateTo = this.dateFormat(document.getElementById('date-to').value);
                if ((((new Date(dateTo)) - (new Date(dateFrom))) / 1000 / 3600 / 24) < 0) {
                    dateTo = dateFrom;
                    document.getElementById('date-to').value
                        = document.getElementById('date-from').value;
                }
                return [dateFrom, dateTo];
            default:
                console.log('Ошибка: Неправильный номер фильтра' + numberFilter);
        }
    }
}