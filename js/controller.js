// import * as core from 'core-js/stable' ;
import * as model from './model.js'
import map from './views/map/map.js'
import {
    MAP_TYPE,
    ZOOM_LEVEL_MAP,
    DESCRIPTION_LENGTH_VALID,
    UPDATE_SUCCESS_MESSAGE,
    REMOVE_SUCCESS_MESSAGE,
    CREATE_SUCCESS_MESSAGE
} from "./config.js";
import form from "./views/forms/formParent.js"
import formParent from "./views/forms/formParent.js";
import running from "./views/forms/running.js";
import cycling from "./views/forms/cycling.js";
import {updateWorkoutData} from "./model.js";
import sort from './views/sort.js'

/**
 *
 * @return {string} for init and introduce map api
 * @author behnam rahimpour
 *
 */
function ControlMapInitData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(controlMap, map._renderError)//navigator api and map functions
    }
}

/**
 *
 * @param {Object} position get position from init ControlMapInitData and control render map and settings main map
 * @author behnam_rahimpour
 */
function controlMap(position){
    const coords = model.getPoseFromApi(position);

    const _mapEl = map.mapInit(coords);

    map._showOrRemoveGlobe()

    L.tileLayer(MAP_TYPE, { //select map type
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(_mapEl);

    map.addClickMapHandler(form.showForm.bind(form))

    for(const work of model.state.workouts){
        map.renderWorkoutMarker(work);
    }

    console.log(model.state.workouts)
}



/**
 * control workout list init and settings
 */
function controlWorkoutInit(){
   model.getLocalStorage();
    for(const work of model.state.workouts) {
        formParent._generateFormList(work);
    }
}


/**
 * @return submit form controller
 * @param {Object} e
 */
function controlFormSubmit(e){
    e.preventDefault();
    const workout = form._formGetValues((this.dataset.editMode === 'false'? 'false':'true'));
    if (workout.type === 'running') workout.pace = running._calcPace.call(form);
    else workout.speed = cycling._calcSpeed.call(form)

    if (!this.dataset.editMode || this.dataset.editMode === 'false'){//add workout submit mode
        // add new object to workout array
        model.state.workouts.push(workout);

        // save to local storage
        // model.setLocalStorage();

        // render workout on the map and list
        map.renderWorkoutMarker(workout);
        form._generateFormList(workout);
        //show message
        form._successMessage = CREATE_SUCCESS_MESSAGE;

        form._hideForm();

    }else{ //update submit mode

        //create new workout Div

        const newHtml =form._generateFormList(workout,true);

        //get old element
        const oldWorkout = form.getWorkout(workout.id);

        //update element function
         form.updateDom(oldWorkout,newHtml)

        //get workout coords
        workout.coords =model.getWorkoutData(workout.id).coords;
        //update marker description
         map._getAllMarkerDataAndEdit(workout);

        //update localstorage
        // model.updateWorkoutData(workout)

        //show message
        form._successMessage = UPDATE_SUCCESS_MESSAGE;

        //hide form
        form._hideForm();
    }

    //choose finish marker dialog
    form._formEmptyInputs();
    map._question = 'are you willing to set finish workout marker';
    map._alertRender('question');

    //read set finish function controller
    map.addClickFinishMarkerEvent(controlSetFinishMarker)
}

function controlSetFinishMarker(e){
    console.log(e);
    //select btn type
    const btn = e.target.closest('.btn');
    if (!btn) return;

    //hide dialog
    map._hideAndShowElem(map._errorElem,'hide');

    //cancel finish marker
    if(btn.getAttribute('id') === 'cancel') return;

    //add cancel set finish marker
    map._hideAndShowElem(map._cancelFinishMarkerBtn,'show');

    //set global variable to true
    map._finishMarkerCheck = true;

    //add finish icon

    //set finish coords to localstorage

    //add lines between two marker

}

function drawLineBetweenMarkers(coo1, coo2){

}

/**
 * @return toggle between input of cycle and run
 */
function controlChangeInputHandler(){
    form._inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    form._inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
}

/**
 * @return control click handle on every workout list to move map on specific workout marker
 * @param {Object} e
 */
function controlClickWorkoutHandler(e){
    const workoutEl = e.target.closest('.workout');
    const icons = e.target.closest('.workout__icons')
    if (!workoutEl || icons) return;
    const workout = model.state.workouts.find((work)=> work.id === +workoutEl.dataset.id);
    map._map.setView(workout.coords, ZOOM_LEVEL_MAP,{
        animate:true,
        pan:{
            duration: 1
        }
    })
}

/**
 *  @return remove workout from list and map and localstorage
 * @param {Object} e object of event to stop propagation
 */
function ControlRemoveWorkout(e){
    const btn = e.target.closest('.workout__remove');
    if (!btn) return;
    e.stopPropagation();
    const workout =btn.parentElement
    const workout_id = +workout.dataset.id
    workout.remove();//remove from dom
    map._getAllMarkerDataAndRemove(model.getWorkoutData(workout_id))//remove from map
    model.removeWorkoutData(workout_id)//remove from localstorage

    //show message
    form._successMessage = REMOVE_SUCCESS_MESSAGE;
    form._alertRender('success')

    form._hideForm();

}

function controlEditWorkoutHandler(e){
    const btn = e.target.closest('.workout__edit');
    if (!btn) return;
    e.stopPropagation();
    const workout =btn.parentElement;
    const workout_id = +workout.dataset.id;
    form.showForm('_',true);
    form._parentEl.dataset.editMode = ''+workout_id;
}


/**
 * @return remove all data from localstorage and restart the app
 */
function reset_all_data(){
    localStorage.removeItem('workout');
    location.reload();
}

/**
 * @return avoid press enter key and length check
 * @param {Object} e data of event of keydown on description form
 */
function controlTextareaDescription(e){
    if (e.key ==='Enter'){
        e.returnValue=false;
        form._inputDistance.focus()
    }
    if (e.target.value.length >= DESCRIPTION_LENGTH_VALID){
        e.returnValue= false;
        form._inputDistance.focus()

        this.removeEventListener('keydown',controlTextareaDescription);
    }
}

/**
 * @return sort the workouts on click sort btn
 */
function controlSortClickHandler(e){
    const btn = e.target.closest('.sort__btn');
    if (!btn) return;
    //get sort type
    const sortType = btn.dataset.sort;

    //sort and get new Data
    const sortedData = model.sortWorkouts(sortType);

    //empty the workouts parent
    form._emptyWorkouts();

    //generate new sorted workouts
    for (const work of sortedData) form._generateFormList(work);
}

/**
 * @return zoom map to show all marker
 */
function controlClickShowAllWorkoutsMarker(){
    //get all coords marker
    const coords =model.getAllWorkoutCoords()

    //modify map zoom

        map.zoomToShowAllMarker(coords)
}

/**
 * @return hide and cancel the set finish marker
 * @param e {Object} event handler of click
 */
function controlAddClickCancelFinishMarkerWorkoutHandler(e){
    map._hideAndShowElem(e.target,'hide');
    map._finishMarkerCheck = false;
}

/**
 * control and introduce init functions
 */
function init() {
    ControlMapInitData();
    controlWorkoutInit();
    form.addChangeInputHandler(controlChangeInputHandler)
    form.addClickWorkoutListHandler(controlClickWorkoutHandler)
    form.addEventFomSubmitHandler(controlFormSubmit);
    form.addRemoveEventHandler(ControlRemoveWorkout);
    form.addTextareaEventHandler(controlTextareaDescription);
    form.addEditEventHandler(controlEditWorkoutHandler);
    sort.addClickEventHandler(controlSortClickHandler);
    map.addClickShowAllWorkoutsMarkerHandler(controlClickShowAllWorkoutsMarker);
    map.addClickCancelFinishMarkerWorkoutEvent(controlAddClickCancelFinishMarkerWorkoutHandler)
}
init();