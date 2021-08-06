import {state} from "./model.js";

export const check_positive_numbers = (...inputs) => inputs.every(inp => inp > 0);
export const check_valid_numbers =(...inputs) => inputs.every((input) => Number.isFinite(input));
export const hide_after_seconds = async (sec, elem)=>{await setTimeout(() =>{ elem.classList.add('hidden') },sec * 1000)}
export const get_line = function(points){
   return  new L.Polyline(points, {
        color: '#2c83cb',
        weight: 4,
        opacity: 0.5,
        smoothFactor: 1
    });
}
export const get_popup = function(type){
   return  L.popup({
       maxWidth: 250,
       maxHeight: 100,
       autoClose: false,
       className: `${type}-popup`,
       closeOnEscapeKey: false,
       closeOnClick: false
   })
}

export function getLanguageFromUrl() {
    return new URL(window.location.href).searchParams.get('lang')
}

export function __(key) {
    let translate
    let lang_type = new URL(window.location.href).searchParams.get('lang');
    if (lang_type === null) lang_type = 'en';

    if (state.language.translate.find(trans => trans.key === key.trim().toLowerCase())) translate = state.language.translate.find(trans => trans.key === key.trim().toLowerCase())[lang_type];

    if (!translate) return key;

    return translate
}