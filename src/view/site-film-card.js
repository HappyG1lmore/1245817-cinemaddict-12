import {generateListFilms, generateFilm} from "../mock/film.js";


export const createFilmCardTemplate = () => {
  const film = generateFilm();
  const {poster, title, rating, runtime, genres, comments, description} = film;
  const {hours, minutes} = runtime;
  const commentsCount = comments === null ? 0 : comments.length;

  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">$1655</span>
      <span class="film-card__duration">${hours}h ${minutes}m</span>
      <span class="film-card__genre">${genres}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${commentsCount} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched  film-card__controls-item--active">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
  </article>`
  );
};

// как в html написать условие? (например по кол-ву комментов)
// Год заменить (как достать из объекта даты?)
