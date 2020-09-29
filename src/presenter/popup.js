import FilmPopupView from "../view/site-film-popup.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {UpdateType, UserAction} from "../constant";

export default class PopupPresenter {
  constructor(mainContainer, changeData, resetPopups, api) {
    this._mainContainer = mainContainer;
    this._changeData = changeData;
    this._resetPopups = resetPopups;

    this._popupComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);

    this._api = api;
  }

  init(film, commentsModel) {
    this._film = film;
    this._commentsModel = commentsModel;

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new FilmPopupView(this._film, this._api, this._commentsModel.getComments(this._film.id));

    this._popupComponent.setWatchlistCardClickHandler(this._handleWatchlistClick);
    this._popupComponent.setFavoriteCardClickHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchedCardClickHandler(this._handleWatchedClick);
    this._popupComponent.setClickBtnClose(this._onCloseBtnClick);
    this._popupComponent.setEscBtnClose(this._onEscKeyDown);
    this._popupComponent.setAddCommentHandler(this._handleAddComment);
    this._popupComponent.setDeleteCommentHandler(this._handleDeleteComment);

    if (prevPopupComponent === null) {
      render(this._mainContainer, this._popupComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (prevPopupComponent) {

      replace(this._popupComponent, prevPopupComponent);

      return;
    }

    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._popupComponent);
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleAddComment(comment) {
    this._commentsModel.addComment(UpdateType.MINOR, comment);
  }

  _handleDeleteComment(comment) {
    this._commentsModel.deleteComment(UpdateType.MINOR, comment);
  }

  _onEscKeyDown(film) {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, film);
    this.destroy();
  }

  _onCloseBtnClick(film) {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, film);
    this.destroy();
  }
}

