import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "../../src/features/emailSlice";

const store = configureStore({
  reducer: {
    email: emailSlice,
  },
});
export default store;
