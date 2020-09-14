import {getRandomArrayItem} from "../utils/common.js";
import AbstractView from "../abstract.js";

const MAX_COMMENT_LENGTH = 140;

const createFilmCardTemplate = (film) => {
  const {
    poster,
    title,
    rating,
    runtime: {hours, minutes},
    genres,
    comments,
    description,
    date,
    id,
    isWatchlist,
    isWatched,
    isFavorite
  } = film;

  const commentsCount = comments.length;

  const getYearInMS = (msec) => {
    const maxDate = new Date(msec);
    const isoDate = maxDate.getFullYear();
    return isoDate;
  };

  return (
    `<article class="film-card" data-id="${id}";>
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getYearInMS(date)}</span>
      <span class="film-card__duration">${hours}h ${minutes}m</span>
      <span class="film-card__genre">${getRandomArrayItem(genres)}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${
    description.length < MAX_COMMENT_LENGTH
      ? description
      : (description.slice(0, (MAX_COMMENT_LENGTH)) + ` ...`)
    }</p>
    <a class="film-card__comments">${commentsCount} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${
    isWatchlist
      ? `film-card__controls-item--active`
      : ``
    }">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched  ${
    isWatched
      ? `film-card__controls-item--active`
      : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite
      ${
    isFavorite
      ? `film-card__controls-item--active`
      : ``}">Mark as favorite</button>
    </form>
  </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  _clickWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _clickWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setClickPopupHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  setClickWatchlistHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._clickWatchlistHandler);
  }

  setClickWatchedHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._clickWatchedHandler);
  }

  setClickFavoriteHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._clickFavoriteHandler);
  }
}
