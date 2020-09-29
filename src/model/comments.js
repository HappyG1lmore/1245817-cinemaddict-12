import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();
    // this._notify(updateType);
  }

  getComments(filmId) {
    return this._comments[filmId];
  }

  updateComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      update,
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update[0].id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }
    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType);
  }

}
