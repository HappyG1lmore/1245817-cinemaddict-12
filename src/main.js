import FilterView from "./view/site-menu.js";
import SiteUserRankView from "./view/site-user-rank.js";
import StatisticsView from "./view/site-footer-statistics.js";
import FilmsPresenter from "./presenter/films-presenter.js";
import FilmsModel from "./model/films.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

import {render, RenderPosition} from "./utils/render.js";

const FILMS_СOUNT = 18;

const listFilms = new Array(FILMS_СOUNT).fill().map(generateFilm);

const headerElement = document.querySelector(`.header`);
render(headerElement, new SiteUserRankView().getElement(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);

const filters = generateFilter(listFilms);
render(mainElement, new FilterView(filters), RenderPosition.AFTERBEGIN);

const filmsModel = new FilmsModel();
filmsModel.setFilms(listFilms);

const filmsPresenter = new FilmsPresenter(mainElement, filmsModel);
filmsPresenter.init();

const footerElement = document.querySelector(`.footer`);
render(footerElement, new StatisticsView(listFilms).getElement(), RenderPosition.BEFOREEND);
