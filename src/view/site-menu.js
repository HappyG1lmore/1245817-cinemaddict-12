import AbstractView from "../abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  const filterCount = name === `All movies` ? `` : ` <span class="main-navigation__item-count">${count}</span>`;
  const filterActiveClassName = type === currentFilterType ? `main-navigation__item--active` : ``;

  return (
    `<a href="#${name}" class="main-navigation__item ${filterActiveClassName}" data-type="${type}">${name}${filterCount}</a>`
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentFilterType === `stats` ? `main-navigation__item--active` : ``}" data-type="stats"">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }

    const filterItems = document.querySelectorAll(`.main-navigation__item`);

    filterItems.forEach((item) => item.classList.remove(`main-navigation__item--active`));

    evt.target.classList.add(`main-navigation__item--active`);
    this._callback.filterTypeChange(evt.target.dataset.type);
  }

  setfilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
