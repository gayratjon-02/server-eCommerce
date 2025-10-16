import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrieveFlashSales = createSelector(
  selectHomePage,
  (HomePage) => HomePage.flashSales
);

export const retrieveMixedProducts = createSelector(
  selectHomePage,
  (HomePage) => HomePage.mixedProducts
);

export const retrieveBestSellingProducts = createSelector(
  selectHomePage,
  (HomePage) => HomePage.bestSellingProducts
);

export const retrieveNewProducts = createSelector(
  selectHomePage,
  (HomePage) => HomePage.newProducts
);
