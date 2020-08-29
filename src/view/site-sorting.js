import AbstractView from "../abstract.js";

const createSortingTemplate = () => {
  const

    SortType = {
      DEFAULT: `default`,
      DATE: `date`,
      RATING: `rating`
    };

  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type='${SortType.DEFAULT}'>Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type='${SortType.DATE_UP}'>Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type='${SortType.DATE_DOWN}'>Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
