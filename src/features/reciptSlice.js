import { createSlice } from "@reduxjs/toolkit";

const reciptSlice = createSlice({
  name: "recipt",
  initialState: {
    reciptDetails: {},
  },

  // reducer function
  reducers: {
    addReciptDetails: (state, action) => {
      state.reciptDetails = action.payload;
    },
    clearReciptDetails: (state, action) => {
      state.reciptDetails = {};
    },
  },
});

export const { addReciptDetails, clearReciptDetails } = reciptSlice.actions;
export default reciptSlice.reducer;
