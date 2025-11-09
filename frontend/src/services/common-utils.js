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
}