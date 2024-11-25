import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "../../src/features/emailSlice";
import authSlice from "../../src/features/authSlice";

const store = configureStore({
  reducer: {
    email: emailSlice,
    auth: authSlice,
  },
});
export default store;
