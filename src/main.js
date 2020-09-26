import SiteUserRankView from "./view/site-user-rank.js";
import FooterStatsView from "./view/site-footer-statistics.js";
import FilmsPresenter from "./presenter/films-presenter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import {FILMS_СOUNT} from "./constant";

import {generateFilm} from "./mock/film.js";
import {render, RenderPosition} from "./utils/render.js";

const listFilms = new Array(FILMS_СOUNT).fill().map(generateFilm);

const filmsWatched = listFilms.filter((film) => film.isWatched === true).length;
const headerElement = document.querySelector(`.header`);
render(headerElement, new SiteUserRankView(filmsWatched).getElement(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);

const filmsModel = new FilmsModel();
filmsModel.setFilms(listFilms);


const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, filterModel);

const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
filterPresenter.init();
filmsPresenter.init();

const footerElement = document.querySelector(`.footer`);
render(footerElement, new FooterStatsView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);
