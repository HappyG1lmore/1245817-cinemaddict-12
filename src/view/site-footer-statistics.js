

export const createFooterStatisticsTemplate = (array) => {
  return (
    `<section class="footer__statistics">
    <p>${array.length} movies inside</p>
  </section>`
  );
};
