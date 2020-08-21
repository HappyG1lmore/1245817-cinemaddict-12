import {getRandomArrayItem, createElement} from "../utils.js";

const MAX_COMMENT_LENGTH = 140;

const FILM_INFO = {
  poster: ``,
  title: ``,
  rating: ``,
  runtime: {
    hours: ``,
    minutes: ``},
  genres: ``,
  comments: ``,
  description: ``,
  date: ``,
  isWatchlist: false,
  isWatched: false,
  isFavorite: false
};

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

export default class FilmCard {
  constructor(film) {
    this._film = film || FILM_INFO;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

