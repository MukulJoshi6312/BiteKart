import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
   themeMode:localStorage.getItem("themeMode") || "light",
  },
  reducers: {
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", state.themeMode);
    },
  },
});

export const { toggleThemeMode } = themeSlice.actions;
export default themeSlice.reducer;