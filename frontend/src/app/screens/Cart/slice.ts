import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrdersPageState } from "../../../lib/types/screen";
import { Order } from "../../../lib/types/order";

const initialState: OrdersPageState = {
  pausedOrders: [],
  processOrders: [],
  finishedOrders: [],
  soldOrders: [], // ✅ ikkinchi jadval
};

const ordersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    setPausedOrders: (state, action: PayloadAction<Order[]>) => {
      state.pausedOrders = action.payload;
    },
    setProcessOrders: (state, action: PayloadAction<Order[]>) => {
      state.processOrders = action.payload;
    },
    setFinishedOrders: (state, action: PayloadAction<Order[]>) => {
      state.finishedOrders = action.payload;
    },

    // ✅ soldOrders ni tashqi manbadan (localStorage/backend) to'liq o'rnatish
    setSoldOrders: (state, action: PayloadAction<Order[]>) => {
      state.soldOrders = action.payload || [];
    },

    // ❌ Birinchi jadvaldan bitta itemni o‘chirish
    removeItemFromPausedOrders: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.pausedOrders = state.pausedOrders
        .map((order) => ({
          ...order,
          orderItems: (order.orderItems || []).filter(
            (it) => it._id !== itemId
          ),
        }))
        .filter((order) => (order.orderItems || []).length > 0);
    },

    // 🧹 PAUSED → SOLD
    movePausedToSold: (state) => {
      if (state.pausedOrders.length > 0) {
        state.soldOrders = [...state.pausedOrders, ...state.soldOrders]; // yangi yuqoriga
      }
      state.pausedOrders = [];
    },

    clearSoldOrders: (state) => {
      state.soldOrders = [];
    },
  },
});

export const {
  setPausedOrders,
  setProcessOrders,
  setFinishedOrders,
  setSoldOrders,
  removeItemFromPausedOrders,
  movePausedToSold,
  clearSoldOrders,
} = ordersPageSlice.actions;

export default ordersPageSlice.reducer;
