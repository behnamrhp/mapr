import mainParent from "./mainParent.js";

class language extends mainParent {
    _parentEl = document.querySelector('.language');

    _addClickLangEvent(handler) {
        this._parentEl.addEventListener('click', handler)
    }

    _languageBtnSelectedChange() {
        this._parentEl.querySelector('.language__selected').classList.remove('language__selected');
        Array.from(this._parentEl.children).find(lang => {
            console.log(this._lang)

            return lang.firstChild.nodeValue === this._lang
        }).classList.add('language__selected')
    }

    _addInitLanguageEvent(handler) {
        window.addEventListener('load', handler)
    }

    _addRtl() {
        if (this._lang === 'en') return;
        document.body.classList.add('rtl');
        this._parentEl.classList.add('rtl_absolute')
    }

    getTranslatableEl() {
        const translatableElements = [];
        Array.from(document.documentElement.querySelectorAll('*')).forEach(dom => {
            if (dom.dataset.t) translatableElements.push(dom)
        });
        return translatableElements
    }
}

export default new language();