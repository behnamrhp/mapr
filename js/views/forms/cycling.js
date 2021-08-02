import {formParent} from './formParent.js';

class  cycling extends formParent{
    type = 'cycling';

    _calcSpeed(){
        this._data.speed = this._data.duration / this._data.distance;
        return this._data.speed
    }
}
export default new cycling()