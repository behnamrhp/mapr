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
    const defaultArray = state.workouts.slice();

    //sort by type and create new array
    if (type === 'distance'){
        defaultArray.sort( (a , b)=> b.distance - a.distance)
    }
    if (type === 'duration'){
        defaultArray.sort( (a , b)=> b.duration - a.duration)
    }

    if (type === 'date'){
        defaultArray.forEach((curr,i,arr)=>{
            if (i-1 < 0) return
            const beforeDateArr = arr[i-1].date.split('-');
            const currDateArr = curr.date.split('-');

            const currYear = +currDateArr[0];
            const currMonth = +currDateArr[1];
            const currDay = +currDateArr[2].split('T')[0];
            const currHour = +currDateArr[2].split('T')[1].split(':')[0];
            const currMin = +currDateArr[2].split('T')[1].split(':')[1];

            const beforeYear = +beforeDateArr[0];
            const beforeMonth = +beforeDateArr[1];
            const beforeDay = +beforeDateArr[2].split('T')[0];
            const beforeHour = +beforeDateArr[2].split('T')[1].split(':')[0];
            const beforeMin = +beforeDateArr[2].split('T')[1].split(':')[1];

            //check year

            //check month

            //check day

            //check hour

            //check minutes
        })
    }

    //return new Array

}