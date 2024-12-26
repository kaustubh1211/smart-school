// branchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const branchSlice = createSlice({
  name: "branch",
  initialState: {
    tenant: "SCHOOL-ENG",
    academicYear: "2024-2025",
  },
  reducers: {
    setTenant: (state, action) => {
      state.tenant = action.payload; // Update tenant in state
    },
    setAcademicYear: (state, action) => {
      state.academicYear = action.payload; // Update academicYear in state
    },
    removeTenant: (state) => {
      state.tenant = null; // Reset tenant to null
    },
    removeAcademicYear: (state) => {
      state.academicYear = null; // Reset academicYear to null
    },
  },
});

export const { setTenant, setAcademicYear, removeTenant, removeAcademicYear } =
  branchSlice.actions;
export default branchSlice.reducer;
