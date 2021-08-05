export const ZOOM_LEVEL_MAP = 13;
export const MAP_TYPE = `https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`;
export const DESCRIPTION_LENGTH_VALID = 20;
export const HIDE_MESSAGES_TIMEOUT = 3;
export const UPDATE_SUCCESS_MESSAGE = 'your workout updated successfully'
export const REMOVE_SUCCESS_MESSAGE = 'your workout removed successfully'
export const ERROR_INVALID_INPUT = 'inputs have to be  positive number'
export const CREATE_SUCCESS_MESSAGE = 'your workout added successfully'
export const FINISH_ICON_MARKER = L.icon({
    iconUrl: 'images/finish_marker.png',
    iconSize: [35, 35],
    iconAnchor: [3,33],
    popupAnchor: false,
});
export const OPEN_WEATHER_API_KEY = 'b99a964cf929bea3070e455ff1f7541a'
export const MAP_QUEST_API_KEY = 'TZ7zQRq2G7z9YYgkhhCLJb7Q8YSkjq9E'
export const WEATHERS = {
    thunder:`<i class="fad fa-thunderstorm"></i>`,
    drizzle: `<i class="fas fa-cloud-drizzle"></i>`,
    rainy:`<i class="fad fa-cloud-showers-heavy"></i>`,
    snowy:`<i class="fal fa-snowflakes"></i>`,
    atmosphere: `<i class="fad fa-smog"></i>`,
    clear: `<i class="fad fa-sun"></i>`,
    cloud: `<i class="fad fa-cloud-sun"></i>`
}