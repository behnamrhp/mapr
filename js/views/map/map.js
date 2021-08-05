import {ZOOM_LEVEL_MAP, FINISH_ICON_MARKER} from "../../config.js";
import formParent from "../forms/formParent.js";
import MainParent from "../mainParent.js";
import {get_popup} from "../../helper.js";

class Map extends MainParent {
    _globe = document.querySelector('.globe');
    _finishMarkerCheck = false;
    _cancelFinishMarkerBtn = document.querySelector('.cancel__finishMarker');
    constructor() {
        super();
        this.initFunctions();
    }

    mapInit(coordinate) {
        this._map = L.map('map').setView(coordinate, ZOOM_LEVEL_MAP);
        return this._map
    }

    _renderError() {
        this._errorMessage = 'we couldn\'t find your location please try again later :(';
        this._alertRender('error');
    }

    addClickMapHandler(handler) {
        this._map.off('click').on('click', handler.bind(this));
    }

    renderWorkoutMarker(workout) {

        L.marker(this._finishMarkerCheck? workout.finishCoords : workout.coords, {
            alt: workout.id,
        ...(this._finishMarkerCheck && {icon: FINISH_ICON_MARKER})
        }).addTo(this._map)
            .bindPopup(get_popup(workout.type))
            .setPopupContent(workout.marker_description)
            .openPopup();

    }

    _getAllMarkerDataAndRemove(workout) {
        this._map.eachLayer(function (layer) {

            if (!layer._latlng) return
            const {lat, lng} = layer._latlng
            const coordsLayer = Object.entries({...{lat, lng}}).map(arr => arr.splice(-1,1)).flat()//get coords layer

                workout.coords.every((c, i) => {

                const cooLayer = coordsLayer[i];
               if( cooLayer === c) layer.remove();
            })
        })
    }


    _getAllMarkerDataAndEdit(workout){
        this._map.eachLayer(function (layer) {

            if (!layer._latlng) return
            const {lat, lng} = layer._latlng
            const coordsLayer = Object.entries({...{lat, lng}}).map(arr => arr.splice(-1,1)).flat()//get coords layer

            workout.coords.every((c, i) => {

                const cooLayer = coordsLayer[i];

                if( cooLayer === c && layer._icon){
                    layer._popup._contentNode.textContent = workout.marker_description;

                    layer._popup._contentNode.style.width ='auto';
                    const mainParent = layer._popup._contentNode.closest('.leaflet-popup');

                    if (workout.type === 'running' && mainParent.classList.contains('cycling-popup')){
                        mainParent.classList.remove('cycling-popup');
                        mainParent.classList.add('running-popup')
                    }
                    if (workout.type === 'cycling' && mainParent.classList.contains('running-popup')){
                        mainParent.classList.remove('running-popup');
                        mainParent.classList.add('cycling-popup')
                    }
                    //fix position of popup
                    const popUp_offset = (mainParent.offsetWidth/2) + layer._icon.offsetLeft + 13
                    mainParent.style.left = '-' + popUp_offset + 'px'

                }
            })
        })
    }

    initFunctions(){
        document.addEventListener('DOMContentLoaded',function (){
            document.querySelector('.globe').addEventListener('mouseenter',function(){
                document.querySelector('.globe_help').classList.remove('hidden');
            })

            document.querySelector('.globe').addEventListener('mouseleave',function(){
                document.querySelector('.globe_help').classList.add('hidden');
            })
        })
    }

    _showOrRemoveGlobe(type='show'){
        if (type ==='show') this._globe.classList.remove('hidden');
        else this._globe.classList.add('hidden');
    }

    addClickShowAllWorkoutsMarkerHandler(handler){
        this._globe.addEventListener('click', handler)
    }

    zoomToShowAllMarker(coords){
        this._map.fitBounds(coords);
    }

    addClickFinishMarkerEvent(handler){
        this._errorElem.addEventListener('click',handler)
    }

    addClickCancelFinishMarkerWorkoutEvent(handler){
        this._cancelFinishMarkerBtn.addEventListener('click', handler)
    }
}

export default new Map;