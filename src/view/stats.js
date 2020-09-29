import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {sortGenres, getTopGenre} from "../utils/stats.js";
import {getRating, getHoursFromMinutes} from "../utils/common.js";
import {FilterType} from "../constant.js";
import SmartView from "./smart.js";
import moment from "moment";

const BAR_HEIGHT = 50;

const Filters = {
  ALL: `all`,
  TODAY: `today`,
  MONTH: `month`,
  WEEK: `week`,
  YEAR: `year`
};

const createTotalDurationTemplate = (films) => {
  const totalMinutes = films.reduce((acc, film) => {
    return acc + film.runtime;
  }, 0);

  const {hours, minutes} = getHoursFromMinutes(totalMinutes);

  return (
    `<p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>`
  );
};

const createFilterTemplate = (currentFilter) => {
  return (
    `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentFilter === Filters.ALL ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentFilter === Filters.TODAY ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentFilter === Filters.WEEK ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentFilter === Filters.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentFilter === Filters.YEAR ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>`
  );
};

const renderChart = (statisticCtx, films) => {
  const watched = films.filter((film) => film.isWatched);
  const watchedGenresNumber = sortGenres(watched);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(watchedGenresNumber),
      datasets: [{
        data: Object.values(watchedGenresNumber),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (films = {}, currentFilter) => {

  const watched = films.filter((film) => film.isWatched);
  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRating(watched.length)}</span>
    </p>
    ${createFilterTemplate(currentFilter)}
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watched.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${createTotalDurationTemplate(watched)}
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(watched)}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`
  );
};

export default class Stats extends SmartView {
  constructor(films, currentFilter) {
    super();
    this._films = films;
    this._currentFilter = currentFilter;
    this._setCharts();

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatisticsTemplate(this._films, this._currentFilter);
  }
  _setCharts() {
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    statisticCtx.height = BAR_HEIGHT * 5;
    const films = this._getFilmsByFilter(this._films, this._currentFilter);
    this._chart = renderChart(statisticCtx, films);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _getFilmsByFilter(films, filter) {
    switch (filter) {
      case FilterType.ALL:
        return films;
      case FilterType.TODAY:
        return films.filter((film) => moment(film.whenWatched).isSame(moment(), `day`));
      case FilterType.WEEK:
        return films.filter((film) => moment(film.whenWatched).isAfter(moment().subtract(7, `days`)));
      case FilterType.MONTH:
        return films.filter((film) => moment(film.whenWatched).isAfter(moment().subtract(1, `months`)));
      case FilterType.YEAR:
        return films.filter((film) => moment(film.whenWatched).isAfter(moment().subtract(1, `years`)));
    }
    return films;
  }
}
