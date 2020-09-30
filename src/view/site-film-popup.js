import {createElement, render, RenderPosition} from "../utils/render.js";
import CommentView from "../view/comment.js";
import SmartView from "./smart.js";
import {isEscPressed, isEnterPressed, getHoursFromMinutes, getDateInMS} from "../utils/common.js";
import {SHAKE_ANIMATION_CLASSNAME} from "../constant";

const createPopupTemplate = (film) => {
  const {
    poster,
    title,
    alternativeTitle,
    rating,
    actors,
    writers,
    director,
    runtime,
    genres,
    comments,
    country,
    description,
    date,
    isWatchlist,
    isWatched,
    isFavorite,
    ageRating
  } = film;

  const commentsCount = comments.length;
  const {hours, minutes} = getHoursFromMinutes(runtime);

  const getGenreElements = (array) => {

    return array.reduce((acc, genre) => acc + `<span class="film-details__genre">${genre}</span>`, ``);
  };

  const getNamesList = (array) => {
    return array.join(`, `);
  };

  const isChecked = (boolean) => boolean ? `checked` : ``;

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${getNamesList(writers)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${getNamesList(actors)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getDateInMS(date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${hours}h ${minutes}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                ${getGenreElements(genres)}

                  </td>
              </tr>
            </table>

            <p class="film-details__film-description">
            ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isChecked(isWatchlist)}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isChecked(isWatched)}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isChecked(isFavorite)}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
          <ul class="film-details__comments-list">
          </ul>
          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>
`
  );
};

export default class FilmPopup extends SmartView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;

    this._clickHandler = this._clickHandler.bind(this);
    this._keyDownHandler = this._keyDownHandler.bind(this);

    this._isWatchListToggleHandler = this._isWatchListToggleHandler.bind(this);
    this._isWatchedToggleHandler = this._isWatchedToggleHandler.bind(this);
    this._isFavoriteToggleHandler = this._isFavoriteToggleHandler.bind(this);
    this._selectEmojiHandler = this._selectEmojiHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate().trim());
      this._renderComments(this._comments);
    }
    return this._element;
  }

  _renderComments(comments) {
    const commentsContainer = this.getElement().querySelector(`.film-details__comments-list`);
    comments.map((comment) => {
      return render(commentsContainer, new CommentView(comment), RenderPosition.AFTERBEGIN);
    });
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._film);
  }

  _keyDownHandler(evt) {
    if (isEscPressed(evt)) {
      this._callback.keydown(this._film);
    }
  }

  setClickBtnClose(callback) {
    this._callback.click = callback;
    const filmDetailsBtnClose = this.getElement().querySelector(`.film-details__close-btn`);
    filmDetailsBtnClose.addEventListener(`click`, this._clickHandler);
  }

  setEscBtnClose(callback) {
    this._callback.keydown = callback;
    document.addEventListener(`keydown`, this._keyDownHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClickBtnClose(this._callback.click);
    this.setWatchlistCardClickHandler(this._callback.watchlistClick);
    this.setFavoriteCardClickHandler(this._callback.favoriteClick);
    this.setWatchedCardClickHandler(this._callback.watchedClick);
    this.setDeleteCommentHandler(this._callback.deleteClick);
    this.setAddCommentHandler(this._callback.addComment, this._film);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._selectEmojiHandler);
  }

  _isWatchListToggleHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _isWatchedToggleHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _isFavoriteToggleHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteCardClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._isFavoriteToggleHandler);
  }

  setWatchedCardClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._isWatchedToggleHandler);
  }

  setWatchlistCardClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._isWatchListToggleHandler);
  }

  _selectEmojiHandler(evt) {
    if (evt.target.tagName === `INPUT`) {
      const emoji = evt.target.value;
      const emojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);

      emojiContainer.innerHTML = `<img class="film-details__add-emoji-img" src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji" data-emoji="${emoji}">`;

    }
  }

  _addCommentHandler(evt) {
    if (isEnterPressed(evt) && (evt.ctrlKey || evt.metaKey)) {
      const messageInput = this.getElement().querySelector(`.film-details__comment-input`);
      const messageValue = messageInput.value.trim();
      const emojiList = this.getElement().querySelector(`.film-details__emoji-list`);
      const selectedEmoji = this.getElement().querySelector(`.film-details__add-emoji-img`);

      messageInput.classList.remove(SHAKE_ANIMATION_CLASSNAME);
      emojiList.classList.remove(SHAKE_ANIMATION_CLASSNAME);

      if (!messageValue) {
        setTimeout(() => messageInput.classList.add(SHAKE_ANIMATION_CLASSNAME), 0);
        return;
      }

      if (!selectedEmoji) {
        setTimeout(() => emojiList.classList.add(SHAKE_ANIMATION_CLASSNAME), 0);
        return;
      }

      const newComment = {
        text: messageValue,
        emotion: selectedEmoji.dataset.emoji,
        date: new Date(),
      };

      this._callback.addComment(this._film, newComment);
    }
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getElement().addEventListener(`keydown`, this._addCommentHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteClick = callback;
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtons.forEach((button) => button.addEventListener(`click`, this._deleteClickHandler));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    const currentCommentId = evt.target.closest(`.film-details__comment`).dataset.id;
    this._callback.deleteClick(this._film, currentCommentId);
  }
}

