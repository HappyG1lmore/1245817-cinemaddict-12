import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();
  }

  getComments(filmId) {
    return this._comments[filmId];
  }

  addComment(updateType, update) {
    const index = Number(update.movie.id);
    this._comments = [
      ...this._comments.slice(0, index),
      update.comments,
      ...this._comments.slice(index + 1)
    ];
    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const filmId = Number(update.film.id);
    const filmComments = this.getComments(filmId);
    const commentIndex = filmComments.findIndex(
        (comment) => comment.id === update.commentId
    );

    if (commentIndex === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    const updatedFilmComments = [
      ...filmComments.slice(0, commentIndex),
      ...filmComments.slice(commentIndex + 1)
    ];

    this._comments = [
      ...this._comments.slice(0, filmId),
      updatedFilmComments,
      ...this._comments.slice(filmId + 1)
    ];

    this._notify(updateType);
  }

}
