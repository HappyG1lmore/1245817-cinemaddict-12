import AbstractView from "../abstract.js";

const createHeaderTemplate = () => {
  return `<section class="header container"></section>`;
};

export default class Header extends AbstractView {
  getTemplate() {
    return createHeaderTemplate();
  }
}
