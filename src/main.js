import {createMenuTemplate} from "./view/site-menu.js";
import {createUserRankTemplate} from "./view/site-user-rank.js";
import {createSortingTemplate} from "./view/site-sorting.js";
import {createShowMoreButtonTemplate} from "./view/site-show-more-button.js";
import {createFilmCardTemplate} from "./view/site-film-card.js";
import {createTopTemplate} from "./view/site-additional-section.js";
import {createFilmsContainer} from "./view/site-films-container.js";
import {createFooterStatisticsTemplate} from "./view/site-footer-statistics.js";
import {generateListFilms, generateFilm} from "./mock/film.js";
console.log(generateListFilms());
console.log(generateFilm());

const FILMS_AMOUNT = 17;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
render(headerElement, createUserRankTemplate(), `beforeend`);

const mainElement = document.querySelector(`.main`);
render(mainElement, createFilmsContainer(), `afterbegin`);
render(mainElement, createSortingTemplate(), `afterbegin`);
render(mainElement, createMenuTemplate(), `afterbegin`);

const filmsElement = mainElement.querySelector(`.films`);
render(filmsElement, createTopTemplate(), `beforeend`);
render(filmsElement, createTopTemplate(), `beforeend`);

const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);


for (let i = 0; i < FILMS_AMOUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(), `afterbegin`);
}

render(filmsListContainerElement, createShowMoreButtonTemplate(), `beforeend`);

const filmsListExtra = filmsElement.querySelectorAll(`.films-list--extra`);
const filmsListExtraContainer1 = filmsListExtra[0].querySelector(`.films-list__container`);
const filmsListExtraContainer2 = filmsListExtra[1].querySelector(`.films-list__container`);

render(filmsListExtraContainer1, createFilmCardTemplate(), `afterbegin`);
render(filmsListExtraContainer1, createFilmCardTemplate(), `afterbegin`);

render(filmsListExtraContainer2, createFilmCardTemplate(), `afterbegin`);
render(filmsListExtraContainer2, createFilmCardTemplate(), `afterbegin`);

const footerElement = document.querySelector(`.footer`);
render(footerElement, createFooterStatisticsTemplate(), `beforeend`);

