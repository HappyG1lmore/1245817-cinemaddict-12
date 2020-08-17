import {createMenuTemplate} from "./view/site-menu.js";
import {createUserRankTemplate} from "./view/site-user-rank.js";
import {createSortingTemplate} from "./view/site-sorting.js";
import {createShowMoreButtonTemplate} from "./view/site-show-more-button.js";
import {createFilmCardTemplate} from "./view/site-film-card.js";
import {createTopTemplate} from "./view/site-additional-section.js";
import {createFilmsContainer} from "./view/site-films-container.js";
import {createFooterStatisticsTemplate} from "./view/site-footer-statistics.js";
import {createPopupTemplate} from "./view/site-film-popup.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {ESC_KEYCODE} from "./utils.js";

const FILMS_СOUNT = 22;
const FILMS_СOUNT_PER_STEP = 5;
const FILMS_COUNT_MAX_TOP = 2;

const films = new Array(FILMS_СOUNT).fill().map(generateFilm);
const filters = generateFilter(films);
console.log(`films`, films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
render(headerElement, createUserRankTemplate(), `beforeend`);

const mainElement = document.querySelector(`.main`);
render(mainElement, createFilmsContainer(), `afterbegin`);
render(mainElement, createSortingTemplate(), `afterbegin`);
render(mainElement, createMenuTemplate(filters), `afterbegin`);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, createTopTemplate(`Top rated`), `beforeend`);
render(filmsElement, createTopTemplate(`Most commented`), `beforeend`);

const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);

if (films.length > FILMS_СOUNT_PER_STEP) {

  for (let i = 0; i < FILMS_СOUNT_PER_STEP; i++) {
    render(filmsListContainerElement, createFilmCardTemplate(films[i]), `afterbegin`);
  }

  let renderedFilmCards = FILMS_СOUNT_PER_STEP;

  render(filmsListContainerElement, createShowMoreButtonTemplate(), `afterend`);
  const showMoreButtonElement = filmsElement.querySelector(`.films-list__show-more`);

  showMoreButtonElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    for (let i = renderedFilmCards; i < (renderedFilmCards + FILMS_СOUNT_PER_STEP); i++) {
      render(filmsListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
    }
    renderedFilmCards += FILMS_СOUNT_PER_STEP;
    if (renderedFilmCards >= films.length) {
      showMoreButtonElement.remove();
    }
  });
} else {
  films.forEach(function (film) {
    render(filmsListContainerElement, createFilmCardTemplate(film), `afterbegin`);
  });
}

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
  render(filmsListTopRatedContainer, createFilmCardTemplate(topRatedFilms[i]), `beforeend`);
}

for (let i = 0; i < topCommentedFilms.length; i++) {
  render(filmsListTopCommentedContainer, createFilmCardTemplate(topCommentedFilms[i]), `beforeend`);
}

const onFilmCardClick = (evt) => {
  const target = evt.target;
  if (target.classList.contains(`film-card__poster`) ||
      target.classList.contains(`film-card__title`) ||
      target.classList.contains(`film-card__comments`)) {
    openPopup();
  }
};

const openPopup = () => {
  render(footerElement, createPopupTemplate(films[0]), `beforeend`);

  const filmDetails = document.querySelector(`.film-details`);
  const filmDetailsBtnClose = filmDetails.querySelector(`.film-details__close-btn`);

  filmDetailsBtnClose.addEventListener(`click`, () => filmDetails.remove());
  document.addEventListener(`keydown`, (evt) => evt.keyCode === ESC_KEYCODE ? filmDetails.remove() : ``);
};

filmsElement.addEventListener(`click`, onFilmCardClick);

const footerElement = document.querySelector(`.footer`);
render(footerElement, createFooterStatisticsTemplate(films), `beforeend`);
