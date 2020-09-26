import moment from "moment";
import {ESC_KEYCODE, ENTER_KEYCODE, MOUSE_LBUTTON_KEYCODE} from "../constant";

export const isEnterPressed = function (evt) {
  return evt.keyCode === ENTER_KEYCODE;
};

export const isEscPressed = function (evt) {
  return evt.keyCode === ESC_KEYCODE;
};

export const isMouseLeftPressed = function (evt) {
  return evt.button === MOUSE_LBUTTON_KEYCODE;
};

export const getRandomIntFromRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const getRandomArrayItem = function (array) {
  return array[getRandomIntFromRange(0, array.length - 1)];
};

export const getRandomLengthArray = function (array, max) {
  let tempArray = [];
  for (let i = 0; i < getRandomIntFromRange(1, max); i++) {
    tempArray.push(array[getRandomIntFromRange(0, array.length - 1)]);
  }
  return tempArray;
};

export const getRandomBoolean = () => (
  Boolean(getRandomIntFromRange(0, 1))
);

export const getRandomTime = () => {
  const hours = getRandomIntFromRange(0, 24);
  const minutes = getRandomIntFromRange(0, 60);

  return {hours, minutes};
};

export const getRandomDate = () => {
  const currentDate = new Date();
  const randomDate = new Date(getRandomIntFromRange(0, currentDate.getTime()));
  return Date.parse(randomDate);
};

export const getDateInMS = (msec) => {
  const maxDate = new Date(msec);
  return moment(maxDate).format(`DD MMMM YYYY`);
};

export const getDateInComment = (msec) => {
  const maxDate = new Date(msec);
  return moment(maxDate).fromNow();
  // return moment(maxDate).format(`YYYY/MM/DD HH:mm`)
};

export const getRating = (films) => {
  let rating = null;
  if (films > 0 && films <= 10) {
    rating = `novice`;
  } else if (films >= 11 && films <= 20) {
    rating = `fan`;
  } else if (films >= 21) {
    films = `movie buff`;
  }
  return rating;
};
