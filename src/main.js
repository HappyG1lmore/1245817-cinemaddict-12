import FilterView from "./view/site-menu.js";
import SiteUserRankView from "./view/site-user-rank.js";
import SortView from "./view/site-sorting.js";
import LoadMoreButtonView from "./view/site-show-more-button.js";
import FilmCardView from "./view/site-film-card.js";
import NoFilms from "./view/site-no-films.js";
import ListContainerTop from "./view/site-additional-section.js";
import FilmsContainer from "./view/site-films-container.js";
import FilmsList from "./view/site-films-list.js";
import StatisticsView from "./view/site-footer-statistics.js";
import FilmPopupView from "./view/site-film-popup.js";
import FilmsPresenter from "./presenter/films-presenter.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {isEscPressed} from "./utils/common.js";
import {render, RenderPosition} from "./utils/render.js";

const FILMS_СOUNT = 8;
const FILMS_СOUNT_PER_STEP = 5;
const FILMS_COUNT_MAX_TOP = 2;

const listFilms = new Array(FILMS_СOUNT).fill().map(generateFilm);

const headerElement = document.querySelector(`.header`);
render(headerElement, new SiteUserRankView().getElement(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);

const filters = generateFilter(listFilms);
render(mainElement, new FilterView(filters), RenderPosition.AFTERBEGIN);


const filmsPresenter = new FilmsPresenter(mainElement);

// filmsPresenter.init(listFilms);

const renderFilms = (films) => {

  render(mainElement, new SortView(), RenderPosition.AFTERBEGIN);

  const filmsContainerComponent = new FilmsContainer();
  render(mainElement, filmsContainerComponent, RenderPosition.BEFOREEND);

  const filmsListComponent = new FilmsList();
  render(filmsContainerComponent, filmsListComponent, RenderPosition.AFTERBEGIN);

  const filmsListContainerElement = filmsListComponent.getElement().querySelector(`.films-list__container`);

  const filmsElement = mainElement.querySelector(`.films`);

  const renderFilm = (filmListElement, film) => {
    const filmComponent = new FilmCardView(film);

    render(filmListElement, filmComponent, RenderPosition.BEFOREEND);
  };

  const renderFilmsListTop = () => {
    render(filmsElement, new ListContainerTop(`Top rated`), RenderPosition.BEFOREEND);
    render(filmsElement, new ListContainerTop(`Most commented`), RenderPosition.BEFOREEND);

    const filmsListTop = filmsElement.querySelectorAll(`.films-list--extra`);
    const filmsListTopRatedContainer = filmsListTop[0].querySelector(`.films-list__container`);
    const filmsListTopCommentedContainer = filmsListTop[1].querySelector(`.films-list__container`);

    const preparesTopRated = () => {
      const tempSortArray = films.slice();
      tempSortArray.sort(function (a, b) {
        return b.rating - a.rating;
      });
      return tempSortArray.slice(0, FILMS_COUNT_MAX_TOP);
    };

    const preparesTopCommented = () => {
      const tempSortArray = films.slice();
      tempSortArray.sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
      return tempSortArray.slice(0, FILMS_COUNT_MAX_TOP);
    };

    const topCommentedFilms = preparesTopCommented();
    const topRatedFilms = preparesTopRated();

    for (let i = 0; i < topRatedFilms.length; i++) {
      renderFilm(filmsListTopRatedContainer, topRatedFilms[i]);
    }

    for (let i = 0; i < topCommentedFilms.length; i++) {
      renderFilm(filmsListTopCommentedContainer, topCommentedFilms[i]);
    }
  };

  if (films.length === 0) {
    render(filmsListContainerElement, new NoFilms(), RenderPosition.BEFOREEND);
  } else {
    renderFilmsListTop();
  }


  films
  .slice(0, FILMS_СOUNT_PER_STEP)
  .forEach((film) => renderFilm(filmsListContainerElement, film));

  if (films.length > FILMS_СOUNT_PER_STEP) {

    let renderedFilmCards = FILMS_СOUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(filmsListComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      films
    .slice(renderedFilmCards, (renderedFilmCards + FILMS_СOUNT_PER_STEP))
    .forEach((film) => renderFilm(filmsListContainerElement, film));

      renderedFilmCards += FILMS_СOUNT_PER_STEP;

      if (renderedFilmCards >= films.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }

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
        render(footerElement, filmPopup, RenderPosition.BEFOREEND);
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

  filmsContainerComponent.setClickPopupHandler(filmCardClickHandler);
};

renderFilms(listFilms);

const footerElement = document.querySelector(`.footer`);
render(footerElement, new StatisticsView(listFilms).getElement(), RenderPosition.BEFOREEND);
