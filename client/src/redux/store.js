import { configureStore } from "@reduxjs/toolkit";
import  userReducer from "./userSlice.js";
import  ownerReducer from "./ownerSlice.js";
import  mapReducer from "./mapSlice.js";
import  themeReducer from "./themeSlice.js";
  

export const store = configureStore({
  reducer: {
    user: userReducer,
    owner: ownerReducer,
    map: mapReducer,
    theme: themeReducer,
  },
});