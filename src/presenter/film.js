
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

  }

  init(film) {
    const prevFilmComponent = this._filmCardComponent;


    this._film = film;
    this._filmCardComponent = new FilmCardView(film);
    this._filmCardComponent.setClickPopupHandler(this._filmCardClickHandler);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);

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
    const activePopup = document.querySelector(`.film-details`);
    if (activePopup) {
      activePopup.remove();
    }

    this._popupComponent = new FilmPopupView(this._film);
    render(this._mainContainer, this._popupComponent, RenderPosition.BEFOREEND);

    const filmDetails = document.querySelector(`.film-details`);

    this._popupComponent.setClickBtnClose(() => {
      filmDetails.remove();
    });

    document.addEventListener(`keydown`, (evt) => {
      if (isEscPressed(evt)) {
        filmDetails.remove();
      }
    });
  }
}
