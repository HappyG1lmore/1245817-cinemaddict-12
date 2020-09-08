import SortView from "../view/site-sorting.js";
import LoadMoreButtonView from "../view/site-show-more-button.js";
import NoFilms from "../view/site-no-films.js";
import ListContainerTop from "../view/site-additional-section.js";
import FilmsContainer from "../view/site-films-container.js";
import FilmsList from "../view/site-films-list.js";
import FilmPopupView from "../view/site-film-popup.js";
import FilmPresenter from "./film.js";
import {render, RenderPosition, replace} from "../utils/render.js";
import {sortFilmsDate, sortFilmsRating} from "../utils/sort.js";
import {SortType} from "../view/site-sorting.js";


const FILMS_СOUNT_PER_STEP = 5;
const FILMS_COUNT_MAX_TOP = 2;


export default class FilmsPresenter {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;

    this._renderedFilmsCount = FILMS_СOUNT_PER_STEP;
    this._renderedMaxTopCount = FILMS_COUNT_MAX_TOP;

    this._filmsContainerComponent = new FilmsContainer();

    this._filmsListComponent = new FilmsList();

    this._listContainerTopCommentComponent = new ListContainerTop(`Most commented`);
    this._listContainerTopRatedComponent = new ListContainerTop(`Top rated`);

    this._noFilmsComponent = new NoFilms();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._popupComponent = new FilmPopupView();

    this._sortComponent = new SortView();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._currentSortType = SortType.DEFAULT;


    this._filmsListContainerElement = null;
    this._filmListElement = null;
    this._filmsElement = null;

    this._filmPresenter = {};
  }

  init(films) {
    this._films = films.slice();
    render(this._mainContainer, this._filmsContainerComponent, RenderPosition.AFTERBEGIN);

    this._sourcedFilms = films.slice();
    this._renderFilms();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films = sortFilmsDate(this._films);
        break;
      case SortType.RATING:
        this._films = sortFilmsRating(this._films);
        break;
      default:
        this._films = this._sourcedFilms;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderCards();
  }

  _clearFilmList() {
    this._filmsListContainerElement.innerHTML = ``;
    this._renderedFilmsCount = FILMS_СOUNT_PER_STEP;
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
    const filmsListTopRatedContainer = filmsListTop[0].querySelector(`.films-list__container`);
    const filmsListTopCommentedContainer = filmsListTop[1].querySelector(`.films-list__container`);

    const preparesTopRated = () => {
      const tempSortArray = this._films.slice();
      tempSortArray.sort(function (a, b) {
        return b.rating - a.rating;
      });
      return tempSortArray.slice(0, this._renderedMaxTopCount);
    };

    const preparesTopCommented = () => {
      const tempSortArray = this._films.slice();
      tempSortArray.sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
      return tempSortArray.slice(0, this._renderedMaxTopCount);
    };

    const topCommentedFilms = preparesTopCommented();
    const topRatedFilms = preparesTopRated();

    for (let i = 0; i < topRatedFilms.length; i++) {
      let filmCardTopRated = new FilmPresenter(filmsListTopRatedContainer);
      filmCardTopRated.init(topRatedFilms[i]);
    }

    for (let i = 0; i < topCommentedFilms.length; i++) {
      let filmCardTopComment = new FilmPresenter(filmsListTopCommentedContainer);
      filmCardTopComment.init(topCommentedFilms[i]);
    }
  }

  _renderNoFilm() {
    render(this._filmsListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderCards() {
    this._films
    .slice(0, this._renderedFilmsCount)
    .forEach((film) => new FilmPresenter(this._filmsListContainerElement).init(film));

    if (this._films.length > this._renderedFilmsCount) {
      let renderedFilmCards = this._renderedFilmsCount;
      render(this._filmsListComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        this._films
          .slice(renderedFilmCards, (renderedFilmCards + this._renderedFilmsCount))
          .forEach((film) => new FilmPresenter(this._filmsListContainerElement).init(film));

        renderedFilmCards += this._renderedFilmsCount;

        if (renderedFilmCards >= this._films.length) {
          this._loadMoreButtonComponent.getElement().remove();
          this._loadMoreButtonComponent.removeElement();
        }
      });
    }
  }

  _filmCardClickHandler(evt) {
    const id = evt.target(`[data-id]`).dataset.id;
    this._renderPopup(id);
  }

  _renderFilms() {

    this._renderSort();
    this._renderFilmsContainerComponent();
    this._renderFilmsListComponent();

    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    this._filmsElement = this._mainContainer.querySelector(`.films`);

    this._renderCards();

    if (this._films.length === 0) {
      this._renderNoFilm();
    } else {
      this._renderFilmsListTop();
    }
  }
}
