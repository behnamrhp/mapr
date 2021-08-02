'use strict';
//variables
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
//end variables
//////////////////
//app main class
let map, mapEvent;


class Workout {
    //todo: fix date and unique id
    date = new Date();
    id = Date.now();
    constructor(coords, distance, duration) {
        this.coords = coords; //[lat, lan]
        this.distance = distance;//km
        this.duration = duration;//min
    }
    _setDescription(){
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDay()}`
    }
}

class Running extends Workout{
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace
    }


}

class Cycling extends Workout{
    type = 'cycling';
    constructor(coords, distance, duration, elevetainGain) {
        super(coords, distance, duration);
        this.elevetainGain = elevetainGain;
        this.calcSpeed();
        this._setDescription();

    }

    calcSpeed(){
        this.speed = this.duration / this.distance;
        return this.speed
    }
}



///////////////////////////////////
// application structure
class App {
    #map;
    #mapEvent;
    #workout = []
    #zoomLevel = 13;
    constructor() {
        this._getPosition();

        //get data from local storage
        this._getLocalStorage();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);//change cadence and distance input on change select option
        containerWorkouts.addEventListener('click',this._moveToPopup.bind(this))
    }

    _getPosition() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), this._onErrorLoadMap)//navigator api and map functions
        }
    }

    _loadMap(position) {
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        const coords = [latitude, longitude];
        this._leafletInit(coords);//leaflet
    }

    _leafletInit(coordinate) {
        this.#map = L.map('map').setView(coordinate, this.#zoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', { //select map type
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.off('click').on('click', this._showForm.bind(this));
        for(const work of this.#workout){
            this.renderWorkoutMarker(work);
        }
    }



    _onErrorLoadMap() {//error function for navigator api
        alert('couldn\'t access to your location');
    }

    _showForm(e) {
        form.classList.remove('hidden');
        inputDistance.focus();
        this.#mapEvent = e;
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    renderWorkoutMarker(workout){
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                maxHeight: 100,
                autoClose: false,
                className: `${workout.type}-popup`,
                closeOnEscapeKey: false,
                closeOnClick: false
            }))
            .setPopupContent('workout')
            .openPopup();
    }

    _newWorkout(e) {
        e.preventDefault();

        const inputValid = (...inputs) => inputs.every((input) => Number.isFinite(input));
        const positiveNumber = (...inputs) => inputs.every(inp => inp > 0);

        //get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat , lng} = this.#mapEvent.latlng;
        let workout;
        //if is running create object
        if (type === 'running'){
            const cadence = +inputCadence.value;

            //check if is valid numbers
            if (
                !inputValid(distance,duration,cadence) ||
                !positiveNumber(distance, duration, cadence)
            ){
                return alert('inputs have to be  positive number');
            }
            workout = new Running( [lat,lng],distance, duration, cadence)
        }
        //if is cycling create object
        if (type === 'cycling'){
            const elevation = +inputElevation.value;
            //check if is valid numbers
            if (
                !inputValid(distance,duration,elevation) ||
                !positiveNumber(distance, duration)
            ){
                return alert('inputs have to be  positive number');
            }
            workout = new Cycling( [lat,lng],distance, duration, elevation)
        }

        //add new object to workout array
        this.#workout.push(workout);

        //save to local storage
        this._setLocalStorage();

        //render workout on the map and list
        this.renderWorkoutMarker(workout);
        this._renderWorkout(workout);
        this._hideForm();
    }

    _hideForm(){
        inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';//empty inputs
        form.classList.add('hidden');
    }

    _renderWorkout(workout){
        let html = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type ==='running'?'🏃':'‍♂'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

        if (workout.type === 'running'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
            `
        }

        if (workout.type === 'cycling'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">spm</span>
          </div>
            `
        }
        form.insertAdjacentHTML('afterend',html);
    }

    _moveToPopup(e){
        const workoutEl = e.target.closest('.workout');

        if (!workoutEl) return;
        const workout = this.#workout.find((work)=> work.id === +workoutEl.dataset.id);
        this.#map.setView(workout.coords, this.#zoomLevel,{
            animate:true,
            pan:{
                duration: 1
            }
        })
    }

    _setLocalStorage(){
        localStorage.setItem('workout', JSON.stringify(this.#workout))
    }

    _getLocalStorage(){
        const data = JSON.parse(localStorage.getItem('workout'));

        if (!data) return;

        this.#workout = data;

        for(const work of this.#workout){
            this._renderWorkout(work);
        }

    }

    reset(){
        localStorage.removeItem('workout');
        location.reload();
    }
}

const app = new App();
