const GOOGLE_MAPS_API_KEY = '';

class Game {
    constructor() {

        this.map = null;
        this.geocoder = null;

        this.cities = ['Минск', 'Кобрин', 'Новополоцк', 'Калининград',
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


    initMap() {
        // Create a map object and specify the DOM element for display.
        this.map = new google.maps.Map(document.querySelector('.map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 1
        });

        this.geocoder = new google.maps.Geocoder();
    }

    showCityOnMap(address) {
        const map = this.map;

        this.geocoder.geocode({'address': address}, function (results, status) {
            if (status === 'OK') {

                map.setCenter(results[0].geometry.location);

                const marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });

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
                    this.showCityOnMap(this.city);


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

let game = new Game();

window.game = game;


