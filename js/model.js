import {MAP_QUEST_API_KEY, OPEN_WEATHER_API_KEY} from './config.js'

export const state = {
    workouts: [],
    language: {
        translate: [
            {
                key: 'title',
                en: 'maptr // Map your workouts',
                fa: 'مپ آر. مدیریت ورزش ها'
            },
            {
                key: 'cancel btn',
                en: 'cancel',
                fa: 'انصراف'
            },
            {
                key: 'error',
                en: 'Error',
                fa: 'خطا'
            },
            {
                key: 'sort_item_duration',
                en: 'duration',
                fa: 'مدت زمان'
            },
            {
                key: 'sort_item_distance',
                en: 'distance',
                fa: 'مسافت'
            },
            {
                key: 'sort_item_date',
                en: 'date',
                fa: 'تاریخ'
            },
            {
                key: 'form_item_type',
                en: 'Type',
                fa: 'نوع'
            },
            {
                key: 'form_item_running',
                en: 'Running',
                fa: 'دویدن'
            },
            {
                key: 'form_item_cycling',
                en: 'Cycling',
                fa: 'دوچرخه سواری'
            },
            {
                key: 'form_item_distance',
                en: 'Distance',
                fa: 'مسافت'
            },
            {
                key: 'form_item_duration',
                en: 'Duration',
                fa: 'مدت زمان'
            },
            {
                key: 'form_item_cadence',
                en: 'Cadence',
                fa: 'سرعت'
            },
            {
                key: 'form_item_elev',
                en: 'Elev Gain',
                fa: 'افزایش ارتفاع'
            },
            {
                key: 'form_item_desc',
                en: 'put your descriptions (max characters is 20)',
                fa: 'توضیحات تمرین خود را وارد کنید. (حداکثر کاراکتر مجاز بیست حرف است)'
            },
            {
                key: 'copy_right',
                en: '',
                fa: ''
            },
            {
                key: 'copy_right_name',
                en: 'behnam rahimpour',
                fa: ' بهنام رحیم پور'
            },
            {
                key: 'globe_help',
                en: 'zoom to all workouts',
                fa: 'بزرگنمایی به همه تمرینات'
            },
            {
                key: 'running',
                en: 'Running',
                fa: 'دویدن'
            },
            {
                key: 'isfahan',
                en: 'Isfahan',
                fa: 'اصفهان'
            },
            {
                key: 'shahin shahr',
                en: 'shahin shahr',
                fa: 'شاهین شهر'
            },
            {
                key: 'tehran',
                en: 'Tehran',
                fa: 'تهران'
            },
            {
                key: 'mashhad',
                en: 'Mashhad',
                fa: 'مشهد'
            },
            {
                key: 'najaf abad',
                en: 'najaf abad',
                fa: 'نجف آباد'
            },
            {
                key: 'khomeini shahr',
                en: 'khomeini shahr',
                fa: 'خمینی شهر'
            },
            {
                key: 'shiraz',
                en: 'Shiraz',
                fa: 'شیراز'
            },
            {
                key: 'gorgab',
                en: 'Gorgab',
                fa: 'گرگاب'
            },
            {
                key: 'msg_update',
                en: 'your workout updated successfully',
                fa: 'بروز رسانی تمرین شما با موفقیت انجام شد (:'
            },
            {
                key: 'msg_remove',
                en: ' your workout removed successfully',
                fa: 'تمرین شما با موفقیت حذف شد (:'
            },
            {
                key: 'msg_error',
                en: ' inputs have to be  positive number',
                fa: 'ورودی های فرم فقط باید اعداد مثبت باشند (:'
            },
            {
                key: 'msg_success',
                en: 'your workout added successfully',
                fa: 'تمرین شما با موفقیت ذخیره شد (:'
            },
            {
                key: 'msg_map_error',
                en: 'we couldn\'t find your location please check your browser access or try again later :(',
                fa: 'متاسفانه نتوانستیم موقعیت شمارا پیدا کنیم لطفا دسترسی های مرورگر را چک کنید و یا یکبار دیگر امتحان کنید'
            },
            {
                key: 'workout',
                en: 'Workout',
                fa: 'تمرین'
            },


        ]

    }
}

export function setLocalStorage() {
    localStorage.setItem('workout', JSON.stringify(state.workouts))
}

export function getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workout'));
    if (!data) return;
    this.state.workouts = data;
}

export function getWorkoutData(id) {
    return state.workouts.find(w => w.id === id);
}

export function updateWorkoutData(workout) {
    const oldWorkout = this.getWorkoutData(workout.id);
    oldWorkout.distance = workout.distance;
    oldWorkout.duration = workout.duration;
    oldWorkout.type = workout.type;
    oldWorkout.marker_description = workout.marker_description;
    oldWorkout.date = workout.date;
    if (workout.type === 'running') oldWorkout.cadence = workout.cadence;
    if (workout.type === 'cycling') oldWorkout.speed = workout.speed;
    this.setLocalStorage();
}


export function getPoseFromApi(position) {
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    state.initCoord = [latitude, longitude];
    return [latitude, longitude]
}

export function removeWorkoutData(id) {
    state.workouts.splice(state.workouts.findIndex(w => w.id === id), 1);
    setLocalStorage();
}

export function sortWorkouts(type) {
    //copy workouts array
    const sortedArr = state.workouts.slice();

    //sort by type and create new array
    if (type === 'distance') {
        sortedArr.sort((a, b) => a.distance - b.distance)
    }
    if (type === 'duration') {
        sortedArr.sort((a, b) => a.duration - b.duration)
    }

    if (type === 'date') {
        sortedArr.sort((a, b) => {
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
            if (currDay !== nextDay) return currDay - nextDay;

            //check hour
            if (currHour !== nextHour) return currHour - nextHour;

            //check minutes
            if (currMin !== nextMin) return currMin - nextMin;

        })
    }

    //return new Array
    return sortedArr;
}

export function getAllWorkoutCoords() {
    const coords = []
    state.workouts.forEach(elem => {
        coords.push(elem.coords)
        if (elem.finishCoords) coords.push(elem.finishCoords);
    })
    return coords;
}

export async function getWeatherData(workout) {
    try {
        const all_data = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${workout.coords[0]}&lon=${workout.coords[1]}&exclude=current&appid=${OPEN_WEATHER_API_KEY}`);
        if (!all_data.ok) throw new Error('we couldn\'t get your location weather ');
        const data = await all_data.json();
        return data.hourly[data.hourly.length - 1].weather[0].id
    } catch (err) {
        console.log(err);
        return false
    }

}

export async function getLocationReverseData(workout) {
    try {
        const response = await fetch(`http://open.mapquestapi.com/geocoding/v1/reverse?key=${MAP_QUEST_API_KEY}&location=${workout.coords[0]},${workout.coords[1]}`);
        if (!response.ok) throw new Error('we couldn\'t find your location')
        const data = await response.json();
        return data
    } catch (err) {
        console.log(err)
        return false
    }

}

export function __a(arr, lang_type) {
    arr.forEach((elem) => {
        const translate_id = +elem.dataset.t
        const translateObject = this.state.language.translate[translate_id]
        if (elem.getAttribute('placeholder')) elem.placeholder = translateObject[lang_type]
        else elem.firstChild.nodeValue = translateObject[lang_type]
    })
}

