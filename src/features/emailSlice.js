import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    emailValue: "",
  },
  reducers: {
    attachEmailValue: (state, action) => {
      state.emailValue = action.payload;
    },
  },
});
export const { attachEmailValue } = emailSlice.actions;
export default emailSlice.reducer;
