import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "../../src/features/emailSlice";
import authSlice from "../../src/features/authSlice";
import reciptSlice from "../../src/features/reciptSlice";

const store = configureStore({
  reducer: {
    email: emailSlice,
    auth: authSlice,
    recipt: reciptSlice,
  },
});
export default store;
