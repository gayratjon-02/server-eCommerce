import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectAccountPage = (state: AppRootState) => state.accountPage;

export const retrieveMember = createSelector(
  selectAccountPage,
  (AccountPage) => AccountPage.memberData
);
