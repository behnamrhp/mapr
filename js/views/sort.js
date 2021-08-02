import mainParent from "./mainParent.js";

class sort extends mainParent{
    _parentEl = document.querySelector('.sort');

    addClickEventHandler(handler){
        this._parentEl.addEventListener('click',handler)
    }
}

export default new sort();
