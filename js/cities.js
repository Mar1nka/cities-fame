class Cities {
    constructor() {

        this.cities = ['Минск', 'Кобрин', 'Новополоцк', 'Калиненград',
            'Драгичин', 'Несвиж', 'Жабинка', 'Алжир', 'Рогочев', 'Витебск'];
        this.remainingCities  = this.cities;
        this.usedCities = [];

        this.lastLetters = ['ь', 'ъ', 'ы', 'й'];

        this.city = 'Минск';
        this.currentLetter = this.getLastLetter(this.city);

        this.inputHandler = this.inputHandler.bind(this);

        document.querySelector('.form__input').addEventListener('keydown', this.inputHandler);

        this.showCompAnswer(this.city);
        this.changeLetter(this.currentLetter);
        this.deleteCity(this.city);
    }

    inputHandler(event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let city = event.target.value.trim();

            if(this.isCorrectFirstLetter(city)) {
                this.city = city[0].toUpperCase() + city.slice(1);

                if(this.isUsedCities(this.city)) {
                    this.showMessage('Этот город уже был');
                } else if(this.isCorrectCity(this.city)) {
                    this.cleanInput();
                    this.showUserAnswer(this.city);
                    this.currentLetter = this.getLastLetter(this.city);
                    this.changeLetter(this.currentLetter);
                    this.deleteCity(this.city);

                    this.city = this.getCityFromComp();

                    if(this.city !== '') {
                        this.showCompAnswer(this.city);
                        this.currentLetter = this.getLastLetter(this.city);
                        this.changeLetter(this.currentLetter);
                        this.deleteCity(this.city);
                    } else {
                        this.showMessage('Вы победили');
                    }
                } else {
                    this.showMessage('Такого города нет');
                }
            } else {
                this.showMessage(`Город должен начинаться с буквы "${this.currentLetter}"`);
            }


        }
    }

    isCorrectFirstLetter(city) {
        let result = false;

        if(city[0].toUpperCase() === this.currentLetter) {
            result = true;
        }

        return result;
    }

    isUsedCities(city) {
        let result = false;

        for (let i = 0; i < this.usedCities.length; i++) {
            if (this.usedCities[i] === city) {
                result = true;
            }
        }

        return result;
    }

    isCorrectCity(city) {
        let result = false;

        for (let i = 0; i < this.cities.length; i++) {
            if (this.cities[i] === city) {
                result = true;
            }
        }

        return result;
    }

    showMessage(text) {
        console.log(text);
    }


    changeLetter(letter) {
        const element = document.querySelector('.form__label');
        element.textContent = letter;
    }

    cleanInput() {
        const element = document.querySelector('.form__input');
        element.value = '';
    }

    showUserAnswer(city) {
        let element = document.createElement('div');
        element.classList.add('answer');
        element.classList.add('answer--user');
        element.textContent = city;

        let parentElement = document.querySelector('.playground__used-cities');
        parentElement.appendChild(element);

    }

    showCompAnswer(city) {
        let element = document.createElement('div');
        element.classList.add('answer');
        element.classList.add('answer--comp');
        element.textContent = city;

        let parentElement = document.querySelector('.playground__used-cities');
        parentElement.appendChild(element);
    }

    getLastLetter(city) {
        let letter = city[city.length - 1].toUpperCase();

        for(let i = 0; i < this.lastLetters.length; i++ ) {
            if(letter === this.lastLetters[i].toUpperCase()) {
                letter = city[city.length - 2].toUpperCase();
            }
        }

        return letter;
    }

    deleteCity(city) {

        for(let  i = 0; i < this.remainingCities.length; i++) {
            if(this.remainingCities[i] === city) {
                this.remainingCities.splice(i, 1);
                break;
            }
        }
    }

    getCityFromComp() {
        let city = '';

        for(let  i = 0; i < this.remainingCities.length; i++) {
            if(this.remainingCities[i][0] === this.currentLetter) {
                city = this.remainingCities[i];
                break;
            }
        }

        return city;
    }
}

let cities = new Cities();