import {render, remove, replace} from "../utils/render.js";
import {getRating} from "../utils/common.js";
import UserProfileView from "../view/user-profile.js";

export default class UserProfile {
  constructor(headerContainer, filmsModel) {
    this._headerContainer = headerContainer;
    this._filmsModel = filmsModel;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const userRank = this._getUserRank();
    const prevUserComponent = this._userProfileComponent;
    this._userProfileComponent = new UserProfileView(userRank);

    if (prevUserComponent === null) {
      render(this._headerContainer, this._userProfileComponent);
      return;
    }

    if (prevUserComponent) {
      replace(this._userProfileComponent, prevUserComponent);
      return;
    }

    remove(prevUserComponent);
  }

  destroy() {
    remove(this._userProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getUserRank() {
    const watchedFilms = this._filmsModel.getFilms().filter((item) => item.isWatched).length;
    return getRating(watchedFilms);
  }
}
