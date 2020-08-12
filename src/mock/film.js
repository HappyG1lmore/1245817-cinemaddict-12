import {getRandomIntFromRange, getRandomArrayItem, getRandomLengthArray, getRandomBoolean, getRandomTime, getRandomDate} from "../utils.js";

const MAX_PHRASE = 5;
const MAX_NAMES = 5;
const MAX_GENRES = 3;
const MAX_COMMENTS = 30;
const MIN_RATING = 0.1;
const MAX_RATING = 10;
const FILMS_COUNT = 20;

const FILM_TITLES = [
  `Leon`,
  `Pirates of the Caribbean`,
  `Matrix`,
  `Forrest Gump`,
  `The Holiday`,
  `Tangled`,
  `Forrest Gump`
];

const POSTERS = [
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`
];

const PHRASE = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const NAMES = [
  `Dan Duryea`,
  `Anthony Mann`,
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`
];

const GENRES = [
  `Drama`,
  `Horror`,
  `Triller`,
  `Trash`,
  `Road movie`,
  `Film-Noir`,
  `Mystery`
];

const COUNTRIES = [
  `Cambodia`,
  `Thailand`,
  `Malaysia`,
  `Mexico`,
  `Peru`,
  `Argentina`,
  `Vietnam`,
  `Nepal`,
  `Pakistan1`
];

const createDiscription = function () {
  const phrases = getRandomLengthArray(PHRASE, MAX_PHRASE);
  return phrases.join();
};

const createGenres = function () {
  const genres = getRandomLengthArray(GENRES, MAX_GENRES);
  return genres.join();
};

const createComment = function (amount) {
  if (!amount) {
    return null;
  }

  const comments = [];
  for (let i = 0; i < amount; i++) {
    const phrases = getRandomLengthArray(PHRASE, MAX_PHRASE);
    comments.push({
      text: phrases.join(),
      emotion: getRandomArrayItem(EMOTIONS),
      autor: getRandomArrayItem(NAMES),
      date: getRandomDate(),
    });
  }

  return comments;
};

export const generateFilm = () => {
  return {
    title: getRandomArrayItem(FILM_TITLES),
    poster: getRandomArrayItem(POSTERS),
    description: createDiscription(),
    rating: getRandomIntFromRange(MIN_RATING, MAX_RATING),
    genres: createGenres(),
    country: getRandomArrayItem(COUNTRIES),
    actors: new Set(getRandomLengthArray(NAMES, MAX_NAMES)),
    writers: new Set(getRandomLengthArray(NAMES, MAX_NAMES)),
    director: getRandomArrayItem(NAMES),
    date: getRandomDate(),
    runtime: getRandomTime(),
    comments: createComment(getRandomIntFromRange(0, MAX_COMMENTS)),
    isWatchlist: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
  };
};

export const generateListFilms = () => {
  const listFilms = [];
  for (let i = 0; i < FILMS_COUNT; i++) {
    listFilms.push(generateFilm());
  }
  return listFilms;
};

// добавить в рейтинг десятые после запятой
// Object.freeze втф
// export const films = new Array(IterationCount.CARD).fill().map(createFilmInfo)
