import AbstractView from "../abstract.js";

const createFilmsContainer = () => {
  return (
    `<section class="films">

    </section>`
  );
};

export default class FilmsContainer extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmsContainer();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickPopupHandler(callback) {

    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
