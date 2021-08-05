export const state = {
    workouts:[]
}

export function setLocalStorage(){
    localStorage.setItem('workout', JSON.stringify(state.workouts))
}

export function getLocalStorage(){
    const data = JSON.parse(localStorage.getItem('workout'));
    if (!data) return;
    this.state.workouts = data;
}

export function getWorkoutData(id){
    return state.workouts.find(w => w.id === id);
}

export function updateWorkoutData(workout){
     const oldWorkout = this.getWorkoutData(workout.id);
     oldWorkout.distance = workout.distance;
     oldWorkout.duration = workout.duration;
     oldWorkout.type = workout.type;
     oldWorkout.marker_description = workout.marker_description;
     oldWorkout.description = workout.description;
     oldWorkout.date = workout.date;
     if (workout.type === 'running') oldWorkout.cadence = workout.cadence;
     if (workout.type === 'cycling') oldWorkout.speed = workout.speed;
    this.setLocalStorage();
}


export function getPoseFromApi(position){
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        state.initCoord = [latitude, longitude];
    return [latitude, longitude]
}

export function removeWorkoutData(id){
    state.workouts.splice(state.workouts.findIndex(w => w.id === id),1);
    setLocalStorage();
}

export function sortWorkouts(type){
    //copy workouts array
    const sortedArr = state.workouts.slice();

    //sort by type and create new array
    if (type === 'distance'){
        sortedArr.sort( (a , b)=> a.distance - b.distance)
    }
    if (type === 'duration'){
        sortedArr.sort( (a , b)=> a.duration - b.duration)
    }

    if (type === 'date'){
        sortedArr.sort( (a , b)=>{
            const currDateArr = a.date.split('-');
            const nextDateArr = b.date.split('-');

            const currYear = +currDateArr[0];
            const currMonth = +currDateArr[1];
            const currDay = +currDateArr[2].split('T')[0];
            const currHour = +currDateArr[2].split('T')[1].split(':')[0];
            const currMin = +currDateArr[2].split('T')[1].split(':')[1];

            const nextYear = +nextDateArr[0];
            const nextMonth = +nextDateArr[1];
            const nextDay = +nextDateArr[2].split('T')[0];
            const nextHour = +nextDateArr[2].split('T')[1].split(':')[0];
            const nextMin = +nextDateArr[2].split('T')[1].split(':')[1];

            //check year
            if (currYear !== nextYear) return currYear - nextYear;

            //check month
            if (currMonth !== nextMonth) return currMonth - nextMonth;

            //check day
            if(currDay !== nextDay) return currDay - nextDay;

            //check hour
            if (currHour !== nextHour) return currHour - nextHour;

            //check minutes
            if (currMin !== nextMin)return currMin - nextMin;

        })
    }

    //return new Array
    return sortedArr;
}

export function getAllWorkoutCoords(){
    const coords =[]
    state.workouts.forEach(elem =>{
        coords.push(elem.coords)
        if (elem.finishCoords) coords.push(elem.finishCoords);
    })
    return coords;
}