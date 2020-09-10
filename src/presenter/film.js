
import FilmCardView from "../view/site-film-card.js";
import FilmPopupView from "../view/site-film-popup.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {isEscPressed} from "../utils/common.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  DETAILS: `DETAILS`
};

export default class Film {
  constructor(filmContainer, changeData, resetPopups) {

    this._mainContainer = document.querySelector(`.main`);
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._resetPopups = resetPopups;

    this._filmCardComponent = null;
    this._PopupComponent = null;

    this._mode = Mode.DEFAULT;

    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    const prevFilmComponent = this._filmCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._film = film;
    this._filmCardComponent = new FilmCardView(film);
    this._filmCardComponent.setClickPopupHandler(this._filmCardClickHandler);
    this._filmCardComponent.setClickWatchlistHandler(this._handleWatchlistClick);
    this._filmCardComponent.setClickWatchedHandler(this._handleWatchedClick);
    this._filmCardComponent.setClickFavoriteHandler(this._handleFavoriteClick);

    this._popupComponent = new FilmPopupView(this._film);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmComponent);
    }

    if (this._mainContainer.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  _filmCardClickHandler(evt) {
    const target = evt.target;
    if (target.classList.contains(`film-card__poster`) ||
      target.classList.contains(`film-card__title`) ||
      target.classList.contains(`film-card__comments`)) {
      this._renderPopup();
    }
  }

  _renderPopup() {
    //в учебном коммите 6.5 пропустил _handleForSubmit.
    //это похоже на наш попап. Туда должны передавать обновленный фильм?
     //Уточнить/узнать у наставника когда упрусь в обновление данных в попапе
    const activePopup = document.querySelector(`.film-details`);
    if (activePopup) {
      activePopup.remove();
    }

    render(this._mainContainer, this._popupComponent, RenderPosition.BEFOREEND);

    this._popupComponent.setClickBtnClose(() => {
      remove(this._popupComponent);
    });

    document.addEventListener(`keydown`, (evt) => {
      if (isEscPressed(evt)) {
        remove(this._popupComponent);
      }
    });
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
  }

  _handleWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatchlist: !this._film.isWatchlist
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }
}
