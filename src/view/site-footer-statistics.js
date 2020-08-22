import {createElement} from "../utils.js";

const createFooterStatisticsTemplate = (array) => {
  return (
    `<section class="footer__statistics">
    <p>${array.length} movies inside</p>
  </section>`
  );
};

export default class Statistics {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
