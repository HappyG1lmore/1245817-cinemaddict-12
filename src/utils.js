import moment from "moment";

const ESC_KEYCODE = 27;

export const ENTER_KEYCODE = 13;
export const MOUSE_LBUTTON_KEYCODE = 0;


export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
