import AbstractView from "../abstract.js";
import {getRating} from "../utils/common.js";

const createUserRankTemplate = (films) => {
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${getRating(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class SiteUserRank extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserRankTemplate(this._films);
  }
}
