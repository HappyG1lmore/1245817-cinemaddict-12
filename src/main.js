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

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {isEscPressed, render, RenderPosition} from "./utils.js";

const FILMS_СOUNT = 10;
const FILMS_СOUNT_PER_STEP = 5;
const FILMS_COUNT_MAX_TOP = 2;

const listFilms = new Array(FILMS_СOUNT).fill().map(generateFilm);

const headerElement = document.querySelector(`.header`);
render(headerElement, new SiteUserRankView().getElement(), RenderPosition.BEFOREEND);

const renderFilms = (films) => {
  const mainElement = document.querySelector(`.main`);

  render(mainElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);

  const filters = generateFilter(films);
  render(mainElement, new FilterView(filters).getElement(), RenderPosition.AFTERBEGIN);


  const filmsContainerComponent = new FilmsContainer();
  render(mainElement, filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

  const filmsListComponent = new FilmsList();
  render(filmsContainerComponent.getElement(), filmsListComponent.getElement(), RenderPosition.AFTERBEGIN);

  const filmsListContainerElement = filmsListComponent.getElement().querySelector(`.films-list__container`);

  const filmsElement = mainElement.querySelector(`.films`);

  const renderFilm = (filmListElement, film) => {
    const filmComponent = new FilmCardView(film);

    render(filmListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);
  };

  const renderFilmsListTop = () => {
    render(filmsElement, new ListContainerTop(`Top rated`).getElement(), RenderPosition.BEFOREEND);
    render(filmsElement, new ListContainerTop(`Most commented`).getElement(), RenderPosition.BEFOREEND);

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
    render(filmsListContainerElement, new NoFilms().getElement(), RenderPosition.BEFOREEND);
  } else {
    renderFilmsListTop();
  }

  films
  .slice(0, FILMS_СOUNT_PER_STEP)
  .forEach((film) => renderFilm(filmsListContainerElement, film));

  if (films.length > FILMS_СOUNT_PER_STEP) {

    let renderedFilmCards = FILMS_СOUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(filmsListComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
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

  const onFilmCardClick = (evt) => {
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

    for (let film of films) {
      if (film.id === idForPopup) {
        render(footerElement, new FilmPopupView(film).getElement(), RenderPosition.BEFOREEND);
        break;
      }
    }

    const filmDetails = document.querySelector(`.film-details`);
    const filmDetailsBtnClose = filmDetails.querySelector(`.film-details__close-btn`);

    filmDetailsBtnClose.addEventListener(`click`, () => filmDetails.remove());

    document.addEventListener(`keydown`, (evt) => {
      if (isEscPressed(evt)) {
        filmDetails.remove();
      }
    });
  };

  filmsElement.addEventListener(`click`, onFilmCardClick);
};

renderFilms(listFilms);

const footerElement = document.querySelector(`.footer`);
render(footerElement, new StatisticsView(listFilms).getElement(), RenderPosition.BEFOREEND);
