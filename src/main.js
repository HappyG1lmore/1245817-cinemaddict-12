import FooterStatsView from "./view/site-footer-statistics.js";
import FilmsPresenter from "./presenter/films-presenter.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import UserProfilePresenter from "./presenter/user-profile.js";
import {UpdateType} from "./constant";
import CommentsModel from "./model/comments.js";
import {render} from "./utils/render.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

const filmsPresenter = new FilmsPresenter(
    mainElement,
    filmsModel,
    filterModel,
    api,
    commentsModel
);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
const userProfilePresenter = new UserProfilePresenter(headerElement, filmsModel);

filterPresenter.init();
filmsPresenter.init();
userProfilePresenter.init();

api.getFilms().then((films) => {
  filmsModel.setFilms(UpdateType.INIT, films);
  return films;
})
.then((films) => {
  return Promise.all(films.map((item) => api.getComments(item.id)));
})
.then((comments) => {
  commentsModel.setComments(UpdateType.INIT, comments);
})
.catch(() => {
  filmsModel.setFilms(UpdateType.INIT, []);
})
.finally(() => {
  render(footerElement, new FooterStatsView(filmsModel.getFilms().length));
});
