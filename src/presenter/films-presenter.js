import SortView from "../view/site-sorting.js";
import LoadMoreButtonView from "../view/site-show-more-button.js";
import NoFilms from "../view/site-no-films.js";
import ListContainerTop from "../view/site-additional-section.js";
import FilmsContainer from "../view/site-films-container.js";
import FilmsList from "../view/site-films-list.js";
import {filter} from "../utils/filter.js";
import FilmPresenter from "./film.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {sortFilmsDate, sortFilmsRating} from "../utils/sort.js";
import {SortType} from "../view/site-sorting.js";
import {FILMS_СOUNT_PER_STEP, FILMS_COUNT_MAX_TOP, UpdateType, UserAction} from "../constant";

export default class FilmsPresenter {
  constructor(mainContainer, filmsModel, filterModel) {
    this._mainContainer = mainContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._renderedFilmsCount = FILMS_СOUNT_PER_STEP;
    this._renderedMaxTopCount = FILMS_COUNT_MAX_TOP;

    this._filmsContainerComponent = new FilmsContainer();

    this._filmsListComponent = new FilmsList();

    this._listContainerTopCommentComponent = new ListContainerTop(`Most commented`);
    this._listContainerTopRatedComponent = new ListContainerTop(`Top rated`);

    this._noFilmsComponent = new NoFilms();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._currentSortType = SortType.DEFAULT;
    this._handleResetPopups = this._handleResetPopups.bind(this);

    this._filmsListContainerElement = null;
    this._filmListElement = null;
    this._filmsElement = null;
    this._filmsListTopRatedContainer = null;
    this._filmsListTopCommentedContainer = null;
    this._loadMoreButtonComponent = null;
    this._sortComponent = null;

    this._filmPresenter = {};
    this._filmTopRatedPresenter = {};
    this._filmTopCommentedPresenter = {};

    this._handleShowMoreButton = this._handleShowMoreButton.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleResetPopups = this._handleResetPopups.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._mainContainer, this._filmsContainerComponent, RenderPosition.AFTERBEGIN);
    this._renderFilms();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmsRating);
    }

    return filtredFilms;
  }

  _handleResetPopups() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._filmTopRatedPresenter)
      .forEach((presenter) => presenter.resetView());
    Object
      .values(this._filmTopCommentedPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmList({resetRenderedFilmCount: true});
    this._renderFilms();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._moviesModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, item) {
    switch (updateType) {
      case UpdateType.PATCH:

        if (this._filmPresenter[item.id]) {
          this._filmPresenter[item.id].init(item);
        }
        if (this._filmTopRatedPresenter[item.id]) {
          this._filmTopRatedPresenter[item.id].init(item);
        }
        if (this._filmTopCommentedPresenter[item.id]) {
          this._filmTopCommentedPresenter[item.id].init(item);
        }
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilms();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilms();
        break;
    }
  }

  _clearFilmList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._loadMoreButtonComponent);
    remove(this._sortComponent);
    remove(this._noFilmsComponent);

    Object
      .values(this._filmTopRatedPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmTopRatedPresenter = {};

    Object
      .values(this._filmTopCommentedPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmTopCommentedPresenter = {};

    remove(this._listContainerTopRatedComponent);
    remove(this._listContainerTopCommentComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_СOUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsContainerComponent() {
    render(this._mainContainer, this._filmsContainerComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListComponent() {
    render(this._filmsContainerComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilmsListTop() {
    render(this._filmsElement, this._listContainerTopRatedComponent, RenderPosition.BEFOREEND);
    render(this._filmsElement, this._listContainerTopCommentComponent, RenderPosition.BEFOREEND);

    const filmsListTop = this._filmsElement.querySelectorAll(`.films-list--extra`);
    this._filmsListTopRatedContainer = filmsListTop[0].querySelector(`.films-list__container`);
    this._filmsListTopCommentedContainer = filmsListTop[1].querySelector(`.films-list__container`);
    const filmCards = this._getFilms();

    const preparesTopRated = () => {
      const tempSortArray = filmCards.slice();
      tempSortArray.sort(function (a, b) {
        return b.rating - a.rating;
      });
      return tempSortArray.slice(0, this._renderedMaxTopCount);
    };

    const preparesTopCommented = () => {
      const tempSortArray = filmCards.slice();
      tempSortArray.sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
      return tempSortArray.slice(0, this._renderedMaxTopCount);
    };

    const topCommentedFilms = preparesTopCommented();
    const topRatedFilms = preparesTopRated();

    for (let i = 0; i < topRatedFilms.length; i++) {
      this._renderFilm(this._filmsListTopRatedContainer, topRatedFilms[i], this._filmTopRatedPresenter);
    }

    for (let i = 0; i < topCommentedFilms.length; i++) {
      this._renderFilm(this._filmsListTopCommentedContainer, topCommentedFilms[i], this._filmTopCommentedPresenter);
    }
  }

  _renderNoFilm() {
    render(this._filmsListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilm(container, filmInfo, savePresenter) {
    let filmCard = new FilmPresenter(container, this._handleViewAction, this._handleResetPopups, this._mainContainer);
    filmCard.init(filmInfo);
    savePresenter[filmInfo.id] = filmCard;
  }

  _handleShowMoreButton() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_СOUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderMovies(films);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._loadMoreButtonComponent.setClickHandler(this._handleShowMoreButton);
    render(this._filmsListComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderMovies(films) {
    films.forEach((film) => this._renderFilm(this._filmsListContainerElement, film, this._filmPresenter));
  }

  _renderFilms() {
    const filmCards = this._getFilms();
    const filmsCount = filmCards.length;

    if (filmsCount === 0) {
      this._renderNoFilm();
      return;
    }
    this._renderSort();
    this._renderFilmsContainerComponent();
    this._renderFilmsListComponent();

    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._filmsElement = this._mainContainer.querySelector(`.films`);

    this._renderMovies(filmCards.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }

    this._renderFilmsListTop();
  }
}


