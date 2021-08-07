// import * as core from 'core-js/stable' ;
import * as model from './model.js'
import map from './views/map/map.js'
import {
    MAP_TYPE,
    ZOOM_LEVEL_MAP,
    DESCRIPTION_LENGTH_VALID,
} from "./config.js";
import form from "./views/forms/formParent.js";
import language from "./views/language.js";
import formParent from "./views/forms/formParent.js";
import running from "./views/forms/running.js";
import cycling from "./views/forms/cycling.js";
import sort from './views/sort.js'
import {get_line,__,showHideLoading,getLanguageFromUrl} from './helper.js'

/**
 *
 * @return {string} for init and introduce map api
 * @author behnam rahimpour
 *
 */
function ControlMapInitData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(controlMap, map._renderError.bind(map))//navigator api and map functions
    }

}

/**
 *
 * @param {Object} position get position from init ControlMapInitData and control render map and settings main map
 * @author behnam_rahimpour
 */
function controlMap(position) {
    const coords = model.getPoseFromApi(position);

    const _mapEl = map.mapInit(coords);

    map._showOrRemoveGlobe()

    L.tileLayer(MAP_TYPE, { //select map type
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(_mapEl);


    //add main marker
    for (const work of model.state.workouts) {
        map.renderWorkoutMarker(work);
    }

    //add finish marker and line
    for (const work of model.state.workouts) {
        if (work.finishCoords) {
            map._finishMarkerCheck = true
            map.renderWorkoutMarker(work);
            const line = get_line([work.coords, work.finishCoords]);
            line.addTo(map._map);
            map._finishMarkerCheck = false
        }
    }

    map.addClickMapHandler(map._finishMarkerCheck ? controlAddFinishMarker : form.showForm.bind(form));
    //hide reload layer
    map._checkMapLoaded = true;
    if (language._checkInitLangLoaded) showHideLoading();
}


/**
 * control workout list init and settings
 */
async function controlWorkoutInit() {
    model.getLocalStorage();
    for (const work of model.state.workouts) {
        if (work.weather_id) form._weatherId = work.weather_id;//check for weather data
        formParent._generateFormList(work);
        form._weatherId = false;
    }

}


/**
 * @return submit form controller
 * @param {Object} e
 */
async function controlFormSubmit(e) {
    e.preventDefault();
    if (form._isSubmit) return;
    form._isSubmit = true;

    const workout = form._formGetValues((this.dataset.editMode === 'false' ? 'false' : 'true'));
    if (!workout) return


    if (workout.type === 'running') workout.pace = running._calcPace.call(form);
    else workout.speed = cycling._calcSpeed.call(form)

    if (!this.dataset.editMode || this.dataset.editMode === 'false') {//add workout submit mode
        //set workout description
        const dataLocation = await model.getLocationReverseData(workout);
        form._data.description = form._setDescription(dataLocation);//set description
        workout.description = form._data.description;

        //get weather workout and save
        const weatherId = await model.getWeatherData(workout);
        if(weatherId){
            form._weatherId = weatherId;
            workout.weather_id = weatherId;
        }
        else form._weatherId =false;

        // add new object to workout array
        model.state.workouts.push(workout);

        // save to local storage
        model.setLocalStorage();

        // render workout on the map and list
        map.renderWorkoutMarker(workout);
        form._generateFormList(workout);
        //show message
        form._successMessage = __('msg_success');

        map._question = 'are you willing to set finish workout marker';
        map._alertRender('question');

        //read set finish function controller
        map.addClickFinishMarkerEvent(controlSetFinishMarker)
        form._hideForm();

    } else { //update submit mode

        //get new workout description
        workout.description = model.getWorkoutData(workout.id).description;

        //create new workout Div
        form._weatherId = model.getWorkoutData(workout.id).weather_id;
        const newHtml = form._generateFormList(workout, true);

        //get old element
        const oldWorkout = form.getWorkout(workout.id);

        //update element function
        form.updateDom(oldWorkout, newHtml)

        //get workout coords
        workout.coords = model.getWorkoutData(workout.id).coords;
        //update marker description
        map._getAllMarkerDataAndEdit(workout);

        //update localstorage
        model.updateWorkoutData(workout)

        //show message
        form._successMessage = __('msg_update');

        //hide form
        form._hideForm();
    }

    form._data = workout;

    //choose finish marker dialog
    form._formEmptyInputs();
    form._isSubmit = false;
}


function controlSetFinishMarker(e) {
    //select btn type
    const btn = e.target.closest('.btn');
    if (!btn) return;

    //hide dialog
    map._hideAndShowElem(map._errorElem, 'hide');

    //cancel finish marker
    if (btn.getAttribute('id') === 'cancel') return;

    //add cancel set finish marker
    map._hideAndShowElem(map._cancelFinishMarkerBtn, 'show');

    //set global variable to true
    map._finishMarkerCheck = true;

    //add finish icon
    map.addClickMapHandler(map._finishMarkerCheck ? controlAddFinishMarker : form.showForm.bind(form))


}

/**
 * @return add finish marker and draw line between two marker
 * @param e {Object} event of click handle of click on map
 */
function controlAddFinishMarker(e) {
    if (!map._finishMarkerCheck) return;
    map._mapEvent = e;
    const {lat, lng} = this._mapEvent.latlng;

    form._data.finishCoords = [lat, lng];

    //render finish icon on map
    map.renderWorkoutMarker(form._data)

    //get two lines
    const points = [form._data.coords, form._data.finishCoords];

    //add lines between two marker
    const line = get_line(points);
    line.addTo(map._map);

    //set finish coords to localstorage
    model.updateWorkoutData(form._data);

    //set global check variable to default
    map._finishMarkerCheck = false;
    map.addClickMapHandler(map._finishMarkerCheck ? controlAddFinishMarker : form.showForm.bind(form))

    //remove cancel finish marker button
    map._hideAndShowElem(map._cancelFinishMarkerBtn, 'hide');
}


/**
 * @return toggle between input of cycle and run
 */
function controlChangeInputHandler() {
    form._inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    form._inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
}

/**
 * @return control click handle on every workout list to move map on specific workout marker
 * @param {Object} e
 */
function controlClickWorkoutHandler(e) {
    const workoutEl = e.target.closest('.workout');
    const icons = e.target.closest('.workout__icons')
    if (!workoutEl || icons) return;
    const workout = model.state.workouts.find((work) => work.id === +workoutEl.dataset.id);
    map._map.setView(workout.coords, ZOOM_LEVEL_MAP, {
        animate: true,
        pan: {
            duration: 1
        }
    })
}

/**
 *  @return remove workout from list and map and localstorage
 * @param {Object} e object of event to stop propagation
 */
function ControlRemoveWorkout(e) {
    const btn = e.target.closest('.workout__remove');
    if (!btn) return;
    e.stopPropagation();
    const workout = btn.parentElement
    const workout_id = +workout.dataset.id
    workout.remove();//remove from dom
    map._getAllMarkerDataAndRemove(model.getWorkoutData(workout_id))//remove from map
    model.removeWorkoutData(workout_id)//remove from localstorage

    //show message
    form._successMessage = __('msg_remove');
    form._alertRender('success')

    form._hideForm();

}

function controlEditWorkoutHandler(e) {
    const btn = e.target.closest('.workout__edit');
    if (!btn) return;
    e.stopPropagation();
    const workout = btn.parentElement;
    const workout_id = +workout.dataset.id;
    form.showForm('_', true);
    form._parentEl.dataset.editMode = '' + workout_id;
}


/**
 * @return remove all data from localstorage and restart the app
 */
function reset_all_data() {
    localStorage.removeItem('workout');
    location.reload();
}

/**
 * @return avoid press enter key and length check
 * @param {Object} e data of event of keydown on description form
 */
function controlTextareaDescription(e) {
    if (e.key === 'Enter') {
        e.returnValue = false;
        form._inputDistance.focus()
    }
    if (e.target.value.length >= DESCRIPTION_LENGTH_VALID) {
        e.returnValue = false;
        form._inputDistance.focus()

        this.removeEventListener('keydown', controlTextareaDescription);
    }
}

/**
 * @return sort the workouts on click sort btn
 */
function controlSortClickHandler(e) {
    const btn = e.target.closest('.sort__btn');
    if (!btn) return;
    //set chosen style to btn
    sort.setSelectedSortItem(btn)

    //get sort type
    const sortType = btn.dataset.sort;

    //sort and get new Data
    const sortedData = model.sortWorkouts(sortType);

    //empty the workouts parent
    form._emptyWorkouts();

    //generate new sorted workouts
    for (const work of sortedData){
        if (work.weather_id) form._weatherId = work.weather_id;//check for weather data
        form._generateFormList(work);
        form._weatherId = false;
    }
}

/**
 * @return zoom map to show all marker
 */
function controlClickShowAllWorkoutsMarker() {
    //get all coords marker
    const coords = model.getAllWorkoutCoords()

    //modify map zoom

    map.zoomToShowAllMarker(coords)
}

/**
 * @return hide and cancel the set finish marker
 * @param e {Object} event handler of click
 */
function controlAddClickCancelFinishMarkerWorkoutHandler(e) {
    map._hideAndShowElem(e.target, 'hide');
    map._finishMarkerCheck = false;
    map.addClickMapHandler(map._finishMarkerCheck ? controlAddFinishMarker : form.showForm.bind(form))
}

/**
 *
 * @param e {Object} event of click on language container
 * @return get language and reload the page to new language
 */
function controlAddClickLanguageHandle(e){
    const btn = e.target.closest('.language__item');
    if (!btn) return;

    //get lang type
    const lang = btn.dataset.lang;

    //reload page to lang
    location.assign(window.location.href.split('?')[0] + '?lang=' + lang);
}


function controlInitLanguageLoadApp(){


    //get language type
    let language_type =  getLanguageFromUrl();
    if (language_type === null ) language_type ='en';
    //set lang data type
    language._lang = language_type;
    model.state.language.type = language_type;

    //change language btn
    language._languageBtnSelectedChange()

    //direction change
    language._addRtl();

    //get all translatable elements
    const translatableElements = language.getTranslatableEl();

    //change all element text
    model.__a(translatableElements,language_type);


    //hide reload layer
    language._checkInitLangLoaded = true;
    if (map._checkMapLoaded) showHideLoading();
}


/**
 * @return control and introduce init functions
 */
function init() {

    ControlMapInitData();
    controlWorkoutInit();
    language._addInitLanguageEvent(controlInitLanguageLoadApp);
    form.addChangeInputHandler(controlChangeInputHandler);
    form.addClickWorkoutListHandler(controlClickWorkoutHandler);
    form.addEventFomSubmitHandler(controlFormSubmit);
    form.addRemoveEventHandler(ControlRemoveWorkout);
    form.addTextareaEventHandler(controlTextareaDescription);
    form.addEditEventHandler(controlEditWorkoutHandler);
    sort.addClickEventHandler(controlSortClickHandler);
    map.addClickShowAllWorkoutsMarkerHandler(controlClickShowAllWorkoutsMarker);
    map.addClickCancelFinishMarkerWorkoutEvent(controlAddClickCancelFinishMarkerWorkoutHandler);
    language._addClickLangEvent(controlAddClickLanguageHandle);
}

init();