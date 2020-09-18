
import FilmCardView from "../view/site-film-card.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {mainElement} from "../main.js";
import PopupPresenter from "../presenter/popup.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  DETAILS: `DETAILS`
};

export default class Film {
  constructor(filmContainer, changeData, resetPopups) {
    this._mainContainer = mainElement;
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._resetPopups = resetPopups;

    this._filmCardComponent = null;

    this._mode = Mode.DEFAULT;

    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    const prevFilmComponent = this._filmCardComponent;

    this._film = film;

    this._filmCardComponent = new FilmCardView(this._film);

    this._filmCardComponent.setClickPopupHandler(this._filmCardClickHandler);
    this._filmCardComponent.setClickWatchlistHandler(this._handleWatchlistClick);
    this._filmCardComponent.setClickWatchedHandler(this._handleWatchedClick);
    this._filmCardComponent.setClickFavoriteHandler(this._handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmCardComponent, prevFilmComponent);

    remove(prevFilmComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._popupPresenter.destroy();
      this._mode = Mode.DEFAULT;
    }
  }

  _renderPopup() {
    this._popupPresenter = new PopupPresenter(this._changeData, this._resetPopups);
    this._popupPresenter.init(this._film);
  }

  _filmCardClickHandler(evt) {

    const target = evt.target;
    if (target.classList.contains(`film-card__poster`) ||
      target.classList.contains(`film-card__title`) ||
      target.classList.contains(`film-card__comments`)) {
      this._resetPopups();
      this._mode = Mode.DETAILS;
      this._renderPopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
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
