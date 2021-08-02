import {formParent} from './formParent.js';

 class  running extends formParent{
  type = 'running';
 constructor() {
  super();
 }
  _calcPace(){

   this._data.pace = this._data.duration / this._data.distance;
   return this._data.pace
  }

}

export default new running

