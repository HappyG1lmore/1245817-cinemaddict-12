import SiteUserRankView from "./view/site-user-rank.js";
import StatisticsView from "./view/site-footer-statistics.js";
import FilmsPresenter from "./presenter/films-presenter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";

import {generateFilm} from "./mock/film.js";

import {render, RenderPosition} from "./utils/render.js";

const FILMS_СOUNT = 18;

const listFilms = new Array(FILMS_СOUNT).fill().map(generateFilm);

const headerElement = document.querySelector(`.header`);
render(headerElement, new SiteUserRankView().getElement(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(listFilms);

const countWatched = listFilms.filter((film) => film.isWatched === true).length;
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, filterModel);

const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
filterPresenter.init()
filmsPresenter.init();

const footerElement = document.querySelector(`.footer`);
render(footerElement, new StatisticsView(listFilms).getElement(), RenderPosition.BEFOREEND);
