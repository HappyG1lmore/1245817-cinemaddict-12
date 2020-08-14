export const createMenuTemplate = (films) => {

  const findWatchlistFilm = (array) => {
    const tempArray = array.filter((film)=> film.isWatchlist);
    return tempArray.length;
  };

  const findWatchedFilm = (array) => {
    const tempArray = array.filter((film) => film.isWatched);
    return tempArray.length;
  };

  const findFavoriteFilm = (array) => {
    const tempArray = array.filter((film) => film.isFavorite);
    return tempArray.length;
  };

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${findWatchlistFilm(films)}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${findWatchedFilm(films)}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${findFavoriteFilm(films)}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
`
  );
};

