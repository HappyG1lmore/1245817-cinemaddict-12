import {remove, render, RenderPosition} from "../utils/render.js";
import StatsView from "../view/stats.js";
import FilterModel from "../model/filter.js";
import {UpdateType} from "../constant.js";

export default class Stats {
  constructor(mainElement, films) {
    this._films = films;
    this._mainElement = mainElement;
    this._filterModel = new FilterModel();
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filterModel.addObserver(this._handleModelEvent);
  }
  init() {
    this._currentFilter = this._filterModel.getFilter();

    this._statsComponent = new StatsView(this._films, this._currentFilter);

    this._statsComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    render(this._mainElement, this._statsComponent, RenderPosition.BEFOREEND);
  }
  destroy() {
    remove(this._statsComponent);
  }
  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.destroy();
        this.init();
        break;
    }
  }
  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
