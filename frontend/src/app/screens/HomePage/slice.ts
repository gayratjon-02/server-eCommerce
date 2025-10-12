import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";

const initialState: HomePageState = {
  flashSales: [],
  bestSellingProducts: [],
  newProducts: [],
  mixedProducts: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setFlashSales: (state, action) => {
      state.flashSales = action.payload;
    },

    setMixedProducts: (state, action) => {
      state.mixedProducts = action.payload;
    },

    setBestSellingProducts: (state, action) => {
      state.bestSellingProducts = action.payload;
    },

    setNewProducts: (state, action) => {
      state.newProducts = action.payload;
    },
  },
});

export const {
  setBestSellingProducts,
  setFlashSales,
  setNewProducts,
  setMixedProducts,
} = homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;
