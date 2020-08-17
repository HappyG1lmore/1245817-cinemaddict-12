
const taskToFilterMap = {
  watchList: (films) => films
  .filter((film) => film.isWatchlist).length,
  watched: (films) => films
  .filter((film) => film.isWatched).length,
  isFavorite: (films) => films
  .filter((film) => film.isFavorite).length,
};

export const generateFilter = (films) => {
  return Object.entries(taskToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};

