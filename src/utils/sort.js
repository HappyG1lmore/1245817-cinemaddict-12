export const sortFilmsRating = (films) => {
  const filmsSortRatingArray = films.slice();
  filmsSortRatingArray.sort(function (a, b) {
    return b.rating - a.rating;
  });

  return filmsSortRatingArray;
};

export const sortFilmsDate = (films) => {
  const filmsSortDateArray = films.slice();
  filmsSortDateArray.sort(function (a, b) {
    return b.date - a.date;
  });

  return filmsSortDateArray;
};
