import AbstractView from "../abstract.js";

const createFooterStatisticsTemplate = (array) => {
  return (
    `<section class="footer__statistics">
    <p>${array.length} movies inside</p>
  </section>`
  );
};

export default class Statistics extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}
