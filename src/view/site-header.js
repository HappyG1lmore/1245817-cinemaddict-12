import {createElement} from "../utils.js";

const createHeaderTemplate = () => {
  return `<section class="header container"></section>`;
};

export default class Header {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createHeaderTemplate();
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
