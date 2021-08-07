import {hide_after_seconds} from '../helper.js'
import {HIDE_MESSAGES_TIMEOUT} from '../config.js'
import  {__,showHideLoading} from '../helper.js'

export default class MainParent {
    _map;
    _mapEvent;
    _data = {};
    _errorMessage = '';
    _successMessage = '';
    _errorElem = document.querySelector('.messages');
    _question ='';
    _weatherId;
    _lang='en'



    updateDom(oldElem, newElemString) {
        const newDom = document.createRange().createContextualFragment(newElemString);
        const newDomArr = Array.from(newDom.querySelectorAll('*')).slice(1);
        const currDomArr = Array.from(oldElem.querySelectorAll('*'));

        newDomArr.forEach((newElem, i) => {
            const currElem = currDomArr[i];

            if (!newElem.isEqualNode(currElem) && newElem.firstChild?.nodeValue.trim() !== '') {
                currElem.textContent = newElem.textContent
            }

            if (!newElem.isEqualNode(currElem)) {
                Array.from(newElem.attributes).forEach(attr => {
                    currElem.setAttribute(attr.name, attr.value)
                })
            }
        })
        oldElem.className = '';

        Array.from(newDom.querySelector('.workout').classList).forEach(cl => {
            oldElem.classList.add(cl)
        })
    }

   async _alertRender(type = 'error') {
        let html;
        if (type === 'error'){
            this._errorElem.className = 'messages messages__border-error';
             html = this._generateErrorAlert()
            this._errorElem.innerHTML = html

        }
        else if(type === 'success') {
            this._errorElem.className = 'messages messages__border-success';
             html = this._generateSuccessAlert()
            this._errorElem.innerHTML = html
        }
        else if(type === 'question'){
            this._errorElem.className = 'messages messages__border-msg';
            html = this._generateQuestionAlert();
            this._errorElem.innerHTML = html;
        }

     if(type !== 'question'){
         await hide_after_seconds(HIDE_MESSAGES_TIMEOUT,this._errorElem);
     }

    }

    _generateErrorAlert() {
        return `
        <i class="fal fa-times messages__icon messages__error"></i>
    <div class="messages__type messages__error">${__('Error')}</div>
    <div class="messages__description">${this._errorMessage}</div>
        `
    }

    _generateSuccessAlert() {
        return `
    <i class="fas fa-check messages__icon messages__success"></i>
    <div class="messages__type messages__success">Susccess</div>
    <div class="messages__description">${this._successMessage}</div>
        `
    }

    _generateQuestionAlert(){
        return `
        <i class="fas fa-check messages__icon messages__msg"></i>
    <div class="messages__type messages__msg">message</div>
    <div class="messages__description">${this._question}</div>
    <div class="btn__container">
        <a href="javascript:void(0)" class="btn btn--agree" id="agree">yes</a>
    <a href="javascript:void(0)" class="btn btn--cancel" id="cancel">no</a>
</div>
        `
    }

    _hideAndShowElem(elem,type){
        if (type === 'hide'){
            elem.classList.add('hidden')
        }else{
            elem.classList.remove('hidden')
        }
    }
}

