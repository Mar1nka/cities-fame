
const PLAYER_TYPE = {
    user: 1,
    computer: 2
};

const PLAYER_COLORS = {
    1: '#ff8739',
    2: '#eae80b'
};

class Game {
    constructor() {
        this.map = null;
        this.geocoder = null;
        this.cities = [];
        this.usedCities = [];
        this.unusedLetters = ['ь', 'ъ', 'ы', 'й', `'`];
        this.currentLetter = '';

        this.answersElement = document.querySelector('.playground__answers');

        this.inputHandler = this.inputHandler.bind(this);
        document.querySelector('.form__input').addEventListener('keydown', this.inputHandler);

        this.closeMessage = this.closeMessage.bind(this);
        document.querySelector('.message__button').addEventListener('click', this.closeMessage);

        this.loadCities().then((data) => {
            this.cities = data;
            this.initMap();
            this.startGame();
        }, (error) => {
            this.showMessage('Произошла ошибка при загрузке данных');
        });
    }

    /**
     * Запрашиваем список всех городов
     *
     */
     loadCities() {
        /*
        * Список городов заранее сформирован в файле cities.json.
        * Это позволяет не зависить от сторонних API для получения городов,
        * а так же упрощает логику для нахождения города со стороны компьютера.
        * Выбираем первый неназванный город на необходимую букву.
        * Объем файла со всеми городами незначителен, чтобы предпочесть запрос для каждого города индивидуально.
        **/

        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/cities.json', true);
            xhr.send();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const cities = JSON.parse(xhr.responseText);
                        resolve(cities);
                    } else {
                        reject();
                    }
                }
            }
        });
    }

    startGame() {
        this.handlerRightAnswer('Астана', PLAYER_TYPE.computer);
    }


    initMap() {
        this.map = new google.maps.Map(document.querySelector('.map'), {
            zoom: 2
        });

        this.geocoder = new google.maps.Geocoder();
    }

    showCityOnMap(city, playerType) {
        const map = this.map;

        this.geocoder.geocode({'address': city}, (results, status) => {
            if (status === 'OK') {

                map.setCenter(results[0].geometry.location);

                const marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: {
                        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                        strokeColor: "#000000",
                        fillColor: PLAYER_COLORS[playerType],
                        fillOpacity: 1,
                        scale: 1
                    },
                });

            } else {
                this.showMessage(`Город ${city} не найден на карте`);
            }
        });

    }

    inputHandler(event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let city = event.target.value.trim();
            city = city[0].toUpperCase() + city.slice(1);

            if (this.isCorrectFirstLetter(city)) {
                if (this.isUsedCities(city)) {
                    this.showMessage('Этот город уже был');
                } else if (this.isCorrectCity(city)) {
                    this.cleanInput();
                    this.handlerRightAnswer(city, PLAYER_TYPE.user);

                    city = this.getCityFromComputer();

                    if (city !== '') {
                        this.handlerRightAnswer(city, PLAYER_TYPE.computer);
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

    handlerRightAnswer(city, playerType) {
        this.showAnswer(city, playerType);
        this.currentLetter = this.getLastLetter(city);
        this.changeLetter(this.currentLetter);
        this.removeCity(city);
        this.addCityToUsed(city);
        this.showCityOnMap(city, playerType);
        this.answersElement.scrollTop = this.answersElement.scrollHeight;
    }

    isCorrectFirstLetter(city) {
        let result = false;

        if (city[0] === this.currentLetter) {
            result = true;
        }

        return result;
    }

    isUsedCities(city) {
        let result = false;

        for (let i = 0; i < this.usedCities.length; i++) {
            if (this.usedCities[i] === city) {
                result = true;
                break;
            }
        }

        return result;
    }

    isCorrectCity(city) {
        let result = false;

        for (let i = 0; i < this.cities.length; i++) {
            if (this.cities[i].toLowerCase() === city.toLowerCase()) {
                result = true;
                break;
            }
        }

        return result;
    }


    showMessage(text) {
        let messageTextElement = document.querySelector('.message__text');
        messageTextElement.textContent = text;

        let messageBackgroundElement = document.querySelector('.message-background');
        messageBackgroundElement.classList.toggle('message-background--hidden');
    }

    closeMessage() {
        let messageBackgroundElement = document.querySelector('.message-background');
        messageBackgroundElement.classList.toggle('message-background--hidden');
    }


    changeLetter(letter) {
        const element = document.querySelector('.form__label');
        element.textContent = letter;
    }

    cleanInput() {
        const element = document.querySelector('.form__input');
        element.value = '';
    }

    showAnswer(city, playerType) {
        let element = document.createElement('div');
        let playerAnswerClassNames = {
            1: 'user',
            2: 'computer'
        };

        element.classList.add('answer');
        element.classList.add(`answer--${playerAnswerClassNames[playerType]}`);
        element.textContent = city;

        let parentElement = document.querySelector('.playground__answers');
        parentElement.appendChild(element);

    }

    getLastLetter(city) {
        let letter = '';

        for (let i = city.length - 1; i >= 0; i--) {
            if (this.unusedLetters.indexOf(city[i]) === -1) {
                letter = city[i];
                break;
            }
        }

        return letter.toUpperCase();
    }

    removeCity(city) {

        for (let i = 0; i < this.cities.length; i++) {
            if (this.cities[i] === city) {
                this.cities.splice(i, 1);
                break;
            }
        }
    }

    addCityToUsed(city) {
        this.usedCities.push(city)
    }

    getCityFromComputer() {
        let city = '';

        for (let i = 0; i < this.cities.length; i++) {
            if (this.cities[i][0] === this.currentLetter) {
                city = this.cities[i];
                break;
            }
        }

        return city;
    }
}

let game = new Game();

window.game = game;


