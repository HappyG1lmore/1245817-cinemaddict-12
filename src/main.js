import FilterView from "./view/site-menu.js";
import SiteUserRankView from "./view/site-user-rank.js";
import StatisticsView from "./view/site-footer-statistics.js";
import FilmsPresenter from "./presenter/films-presenter.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

import {render, RenderPosition} from "./utils/render.js";

const FILMS_СOUNT = 8;

const listFilms = new Array(FILMS_СOUNT).fill().map(generateFilm);
console.log(listFilms);

const headerElement = document.querySelector(`.header`);
render(headerElement, new SiteUserRankView().getElement(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);

const filters = generateFilter(listFilms);
render(mainElement, new FilterView(filters), RenderPosition.AFTERBEGIN);

const filmsPresenter = new FilmsPresenter(mainElement);
filmsPresenter.init(listFilms);


const footerElement = document.querySelector(`.footer`);
render(footerElement, new StatisticsView(listFilms).getElement(), RenderPosition.BEFOREEND);
