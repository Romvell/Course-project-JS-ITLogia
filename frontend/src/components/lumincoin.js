import {Auth} from "../services/auth.js";
import {RequestManager} from "../services/request-manager";
import {CommonUtils} from "../services/common-utils";
import {Chart} from "chart.js/auto";

export class Lumincoin {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.firstUseFlag = false;

        // Проверяем наличие токена авторизации
        const accessToken = Auth.getAuthInfo(Auth.accessTokenKey);
        if (!accessToken || typeof accessToken === undefined) {
            this.openNewRoute('/login');
        }

        this.createChart().then();
    }
    //Создание диаграммы
    async createChart() {
        const incomeChartElement = document.getElementById('income-pie').getContext('2d');
        const expenseChartElement = document.getElementById('expense-pie').getContext('2d');
        let incomeChart = null;
        let expenseChart = null;
        let incomeConfig = null;
        let expenseConfig = null;

        // Определяем начальное состояние фильтра и делаем соответствующий запрос
        const radioButton = document
            .querySelectorAll('input[type="radio"][name="filter"]');
        if (!this.firstUseFlag) {
            for (const radio of radioButton) {
                if (radio.checked) {
                    incomeConfig = await this.createConfig('income', radio.value);
                    expenseConfig = await this.createConfig('expense', radio.value);
                    this.createLegend('income', incomeConfig.data.datasets[0].backgroundColor, incomeConfig.data.labels)
                    this.createLegend('expense', expenseConfig.data.datasets[0].backgroundColor, expenseConfig.data.labels)

                    incomeChart = new Chart(incomeChartElement, incomeConfig);
                    expenseChart = new Chart(expenseChartElement, expenseConfig);
                    this.firstUseFlag = true;
                }
            }
        }

        // Вызов функции при нажатии на кнопку фильтра
        for (const radio of radioButton) {
            radio.addEventListener('click', async () => {
                incomeChart.destroy();
                expenseChart.destroy();
                incomeConfig = await this.createConfig('income', radio.value);
                expenseConfig = await this.createConfig('expense', radio.value);
                this.createLegend('income', incomeConfig.data.datasets[0].backgroundColor, incomeConfig.data.labels)
                this.createLegend('expense', expenseConfig.data.datasets[0].backgroundColor, expenseConfig.data.labels)
                incomeChart = new Chart(incomeChartElement, incomeConfig);
                expenseChart = new Chart(expenseChartElement, expenseConfig);
            });
        }
    };
    //Создание легенды
    createLegend(operationsType, colors, labels) {
        const legendElement = document.getElementById(operationsType + '-legend');
        legendElement.replaceChildren();
        colors.forEach((color, index) => {
            const itemElement = document.createElement('li');
            itemElement.classList.add('key');
            const colorElement = document.createElement('strong');
            colorElement.classList.add('key__percent');
            colorElement.style.backgroundColor = color;
            itemElement.appendChild(colorElement);
            const textElement = document.createElement('span');
            textElement.classList.add('key__choice');
            textElement.innerText = labels[index];
            itemElement.appendChild(textElement);
            legendElement.appendChild(itemElement);
        });
    }
    //Создание конфигурации диаграммы
    async createConfig(operationsType, radioValue) {
        const chartData = await this.preparedData(operationsType, radioValue);
        return  {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: chartData.color,
                    borderWidth: 1,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        }
    }
    //Подготовка данных для диаграммы
    async preparedData(operationsType, radioValue) {
        const MAX_CHART_SECTORS = 5;
        const COLOR = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'];

        let operations = [];
        try {
            // Запрос данных с бека
            operations = await RequestManager.getOperations(CommonUtils.operationsFilter(radioValue)[0],
                CommonUtils.operationsFilter(radioValue)[1]);
        } catch (error) {
            console.log('Ошибка :' + error.message);
        }
        //Фильтрация данных по типу операций Доход/Расход
        const filterType = operations.response.filter(operation => operation.type === operationsType);
        //Создание списка уникальных категорий
        const categoriesSet = new Set;
        filterType.forEach(operation => categoriesSet.add(operation.category));
        const categories = Array.from(categoriesSet);
        let categoryAmounts = categories.map(function (item) {
            return {
                category: item,
            }
        });
        //Подсчёт суммы операций в каждой категории
        categoryAmounts.forEach(category => {
            let item = 0;
            filterType.forEach(operation => {
                if (operation.category === category.category) {
                    item = item + operation.amount;
                }
            });
            category.sum = item;
        })
        //Сортировка категорий по уменьшению суммы операций
        categoryAmounts.sort((a, b) => b.sum - a.sum);

        if (categoryAmounts.length > MAX_CHART_SECTORS) {
            const top = categoryAmounts.slice(0, 4);
            const low = categoryAmounts.slice(4);
            let sum = 0;
            low.forEach(item => sum += item.sum);
            top.push({category: 'Прочие категории', sum: sum});
            categoryAmounts = top;
        }

        const chartData = categoryAmounts.map((category, index) => {
            return Object.assign(category, {color: COLOR[index]});
        }); //categoryAmounts изменяется и становится равным chartData - Почему?

        let labels = [], data = [], color = [];
        chartData.forEach(item => {
            labels.push(item.category);
            data.push(item.sum);
            color.push(item.color);
        })
        return {labels, data, color};
    }
}