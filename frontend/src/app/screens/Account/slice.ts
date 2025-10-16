import { createSlice } from "@reduxjs/toolkit";
import { AccountPageState } from "../../../lib/types/screen";

const initialState: AccountPageState = {
  memberData: null,
};

const accountPageSlice = createSlice({
  name: "AccountPage",
  initialState,
  reducers: {
    setMember: (state, action) => {
      state.memberData = action.payload;
    },
  },
});

export const { setMember } = accountPageSlice.actions;

const AccountPageReducer = accountPageSlice.reducer;
export default AccountPageReducer;
