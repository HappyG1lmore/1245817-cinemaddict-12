export const ESC_KEYCODE = 27;
export const ENTER_KEYCODE = 13;
export const MOUSE_LBUTTON_KEYCODE = 0;

export const FILMS_COUNT_PER_STEP = 5;
export const FILMS_COUNT_MAX_TOP = 2;

export const Mode = {
  DEFAULT: `DEFAULT`,
  DETAILS: `DETAILS`
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  UPDATE_FILM_MODEL: `UPDATE_FILM_MODEL`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  COMMENT: `COMMENT`,
  STATS: `STATS`,
  INIT: `INIT`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATS: `stats`
};

export const DeleteButtonText = {
  DELETE: `Delete`,
  DELETING: `Deleting...`
};
