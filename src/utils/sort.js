export const sortFilmsDate = (filmA, filmB) => {
  return new Date(filmB.date) - new Date(filmA.date);
};

export const sortFilmsRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};
