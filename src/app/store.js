import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import emailSlice from "../../src/features/emailSlice";
import authSlice from "../../src/features/authSlice";
import reciptSlice from "../../src/features/reciptSlice";
import branchSlice from "../../src/features/branchSlice";

const rootReducer = combineReducers({
  email: emailSlice,
  auth: authSlice,
  recipt: reciptSlice,
  branch: branchSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
