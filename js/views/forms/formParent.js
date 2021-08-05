import mainParent from "../mainParent.js";
import {check_positive_numbers, check_valid_numbers} from "../../helper.js";
import {REMOVE_SUCCESS_MESSAGE, ERROR_INVALID_INPUT, WEATHERS} from '../../config.js'

// import { v4 as uuidv4 } from 'uuid';


export class formParent extends mainParent {
    _parentEl = document.querySelector('.form');
    _containerWorkouts = document.querySelector('.workouts');
    _inputDistance = this._parentEl.querySelector('.form__input--distance');
    _inputDuration = this._parentEl.querySelector('.form__input--duration');
    _inputCadence = this._parentEl.querySelector('.form__input--cadence');
    _inputElevation = this._parentEl.querySelector('.form__input--elevation');
    _inputType = this._parentEl.querySelector('.form__input--type');
    _textarea = this._parentEl.querySelector('.form__input--description');
    _isSubmit = false;

    _successMessage = '';
    _errorMessage = '';
    //todo: fix date and unique id
    date = new Date();
    id = Date.now();

    _renderLocationDetails(location){
        let html='';
     if(location.adminArea3 !== '') html += location.adminArea3+', ';
     if(location.adminArea4 !== '')html += location.adminArea4+', ';
     if(location.adminArea5 !== '')html += location.adminArea5+', ';
     if(location.street !== '')html += location.street+ ' ';
     return html
    }
    _setDescription(location) {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${this._data.type[0].toUpperCase()}${this._data.type.slice(1)} ${(location)? 'in '+this._renderLocationDetails(location.results[0].locations[0])  : ''} on ${months[this.date.getMonth()]} ${+this.date.getDay() + 1}`
    }

    showForm(e, updateCheck = 'false') {

        this._parentEl.classList.remove('hidden');

        if (!updateCheck || updateCheck === 'false') {

            this._mapEvent = e;

            this._parentEl.dataset.editMode = 'false'
        }
        setTimeout(() => this._inputDistance.focus(), 500)
    }

    addEventFomSubmitHandler(handler) {
        this._parentEl.addEventListener('submit', handler);
    }

    addTextareaEventHandler(handler) {
        this._textarea.addEventListener('keydown', handler)
    }

    _formGetValues(updateCheck = 'false') {
        //get data from form
        const type = this._inputType.value;
        const distance = +this._inputDistance.value;
        const duration = +this._inputDuration.value;
        const marker_description = this._textarea.value;
        this._data = {
            distance: distance,
            duration: duration,
            type: type,
            date: this.date.toISOString(),
            marker_description: (marker_description) ? marker_description : 'workout'
        }
        if (this._mapEvent && this._mapEvent.latlng) {
            const {lat, lng} = this._mapEvent.latlng;
            console.log(this._mapEvent)
            this._data.coords = [lat, lng];
            this._data.id = new Date().getTime();
        }



        // this._data.id = uuidv4();

        //if is running create object
        if (type === 'running') {
            const cadence = +this._inputCadence.value;
            //check if is valid numbers
            if (
                !check_valid_numbers(distance, duration, cadence) ||
                !check_positive_numbers(distance, duration, cadence)
            ) {
                this._errorMessage = ERROR_INVALID_INPUT;
                this._isSubmit = false;
                 this._alertRender('error');
                 return false;
            }
            this._data.cadence = cadence;
        }
        //if is cycling create object
        if (type === 'cycling') {
            const elevation = +this._inputElevation.value;
            //check if is valid numbers
            if (
                !check_valid_numbers(distance, duration, elevation) ||
                !check_positive_numbers(distance, duration)
            ) {
                this._errorMessage = ERROR_INVALID_INPUT;
                this._isSubmit = false;
                this._alertRender('error');
                return false;

            }
            this._data.elevation = elevation;
        }


        if (updateCheck !== 'false') {
            this._data.id = +this._parentEl.dataset.editMode;
            return this._data; //return to update only workout data
        }

        return this._data;
    }

    _generateRunningWorkout(workout) {
        return `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
            `
    }

    _generateCyclingWorkout(workout) {
        return `
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">spm</span>
          </div>
            `
    }

    _generateWeather(){
        if(this._weatherId >= 200 && this._weatherId <= 232 ) return WEATHERS.thunder
        if (this._weatherId >= 300 && this._weatherId <= 321) return WEATHERS.drizzle
        if (this._weatherId >= 500 && this._weatherId <= 531) return WEATHERS.rainy
        if (this._weatherId >= 600 && this._weatherId <= 622) return WEATHERS.snowy
        if (this._weatherId >= 701 && this._weatherId <= 781) return WEATHERS.atmosphere
        if (this._weatherId === 800) return WEATHERS.clear
        if (this._weatherId >= 801 && this._weatherId <= 900) return WEATHERS.cloud
        else return ''
    }

    _generateFormList(workout, updateCheck = false) {

        let html = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
           <i class="far fa-map-marker-times workout__remove workout__icons"></i>
            <i class="far fa-map-marker-edit workout__edit workout__icons"></i>`

        if (this._weatherId) html += `<span class="workout__weather">${this._generateWeather()}</span>`;

        html += `<h2 class="workout__title" ${this._weatherId? 'style=margin-left:.8rem' :''}>${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃' : '‍♂'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

        if (workout.type === 'running') {
            html += this._generateRunningWorkout(workout);
        }

        if (workout.type === 'cycling') {
            html += this._generateCyclingWorkout(workout);
        }

        if (updateCheck) return html;
        this._parentEl.insertAdjacentHTML('afterend', html);
    }

    _hideForm() {
        this._inputDistance.value = this._inputCadence.value = this._inputDuration.value = this._inputElevation.value = '';//empty inputs
        this._parentEl.classList.add('hidden');
    }

    addChangeInputHandler(handler) {
        this._inputType.addEventListener('change', handler);//change cadence and distance input on change select option
    }

    addClickWorkoutListHandler(handler) {

        this._containerWorkouts.addEventListener('click', handler)
    }

    addRemoveEventHandler(handler) {
        this._containerWorkouts.addEventListener('click', handler)
    }

    addEditEventHandler(handler) {
        this._containerWorkouts.addEventListener('click', handler)
    }

    getWorkout(id) {
        const workout = this._containerWorkouts.querySelectorAll('.workout')

        for (let i = 0; i < workout.length; i++) {
            if (+workout[i].dataset.id === +id) return workout[i]
        }

    }

    _formEmptyInputs() {
        this._inputDistance.value = '';
        this._inputDuration.value = '';
        this._inputCadence.value = '';
        this._inputElevation.value = '';
        this._textarea.value = '';
    }

    _emptyWorkouts() {
        const allFormChildren = Array.from(this._containerWorkouts.children);
        allFormChildren.forEach(w => {
            if (w.classList.contains('form')) return;
            w.remove();
        })
    }
}

export default new formParent