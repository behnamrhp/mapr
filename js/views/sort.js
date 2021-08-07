import mainParent from "./mainParent.js";

class sort extends mainParent{
    _parentEl = document.querySelector('.sort');

    addClickEventHandler(handler){
        this._parentEl.addEventListener('click',handler)
    }

    setSelectedSortItem(elem){
        this._parentEl.querySelectorAll('.sort__selected').forEach(sort =>{
          if (sort.classList.contains('sort__selected')) sort.classList.remove('sort__selected')
        })
        elem.classList.add('sort__selected');
    }
}

export default new sort();
