import SortView from "../view/site-sorting.js";
import LoadMoreButtonView from "../view/site-show-more-button.js";
import FilmCardView from "../view/site-film-card.js";
import NoFilms from "../view/site-no-films.js";
import ListContainerTop from "../view/site-additional-section.js";
import FilmsContainer from "../view/site-films-container.js";
import FilmsList from "../view/site-films-list.js";
import FilmPopupView from "../view/site-film-popup.js";
import {render, RenderPosition} from "../utils/render.js";
import {isEscPressed} from "../utils/common.js";

const FILMS_СOUNT_PER_STEP = 5;
const FILMS_COUNT_MAX_TOP = 2;


export default class FilmsPresenter {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;

    this._renderedFilmsCount = FILMS_СOUNT_PER_STEP;
    this._renderedMaxTopCount = FILMS_COUNT_MAX_TOP;

    this._sortComponent = new SortView();
    this._filmsContainerComponent = new FilmsContainer();
    this._filmsListComponent = new FilmsList();

    this._listContainerTopCommentComponent = new ListContainerTop(`Most commented`);
    this._listContainerTopRatedComponent = new ListContainerTop(`Top rated`);

    this._noFilmsComponent = new NoFilms();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._popupComponent = new FilmPopupView();

    this._filmsListContainerElement = ``;
    this._filmListElement = ``;
    this._filmsElement = ``;
  }

  init(films) {
    this._films = films.slice();
    render(this._mainContainer, this._filmsContainerComponent, RenderPosition.AFTERBEGIN);
    this._renderFilms(this._films);
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilmsContainerComponent() {
    render(this._mainContainer, this._filmsContainerComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListComponent() {
    render(this._filmsContainerComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilm(filmListElement, film) {
    this._filmCardComponent = new FilmCardView(film);
    render(filmListElement, this._filmCardComponent, RenderPosition.BEFOREEND);
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
      this._renderFilm(filmsListTopRatedContainer, topRatedFilms[i]);
    }

    for (let i = 0; i < topCommentedFilms.length; i++) {
      this._renderFilm(filmsListTopCommentedContainer, topCommentedFilms[i]);
    }
  }

  _renderNoFilm() {
    render(this._filmsListContainerElement, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderCards(films) {
    films
    .slice(0, this._renderedFilmsCount)
    .forEach((film) => this._renderFilm(this._filmsListContainerElement, film));

    if (films.length > this._renderedFilmsCount) {
      let renderedFilmCards = this._renderedFilmsCount;
      render(this._filmsListComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        films
    .slice(renderedFilmCards, (renderedFilmCards + this._renderedFilmsCount))
    .forEach((film) => this._renderFilm(this._filmsListContainerElement, film));

        renderedFilmCards += this._renderedFilmsCount;

        if (renderedFilmCards >= films.length) {
          this._loadMoreButtonComponent.getElement().remove();
          this._loadMoreButtonComponent.removeElement();
        }
      });
    }
  }

  _renderPopup(films) {
    const filmCardClickHandler = (evt) => {
      const target = evt.target;
      if (target.classList.contains(`film-card__poster`) ||
        target.classList.contains(`film-card__title`) ||
        target.classList.contains(`film-card__comments`)) {
        const id = evt.target.closest(`[data-id]`).dataset.id;
        openPopup(id);
      }
    };

    const openPopup = (idForPopup) => {
      const activePopup = document.querySelector(`.film-details`);
      if (activePopup) {
        activePopup.remove();
      }

      let filmPopup;

      for (let film of films) {
        if (film.id === idForPopup) {
          filmPopup = new FilmPopupView(film);
          render(this._mainContainer, filmPopup, RenderPosition.BEFOREEND);
          break;
        }
      }

      const filmDetails = document.querySelector(`.film-details`);

      filmPopup.setClickBtnClose(() => {
        filmDetails.remove();
      });

      document.addEventListener(`keydown`, (evt) => {
        if (isEscPressed(evt)) {
          filmDetails.remove();
        }
      });
    };

    this._filmsContainerComponent.setClickPopupHandler(filmCardClickHandler);
  }

  _renderFilms(films) {
    this._renderSort();
    this._renderFilmsContainerComponent();
    this._renderFilmsListComponent();

    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    this._filmsElement = this._mainContainer.querySelector(`.films`);

    this._renderCards(films);

    if (films.length === 0) {
      this._renderNoFilm();
    } else {
      this._renderFilmsListTop();
    }

    this._renderPopup(films);

  }
}
