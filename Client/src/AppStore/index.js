import { configureStore } from "@reduxjs/toolkit";

import AuthSlice from "./authSlice";
import AppSlice from "./appSlice";

import { loadState,saveState } from "../localStorage/localStorage";


const persistedState = loadState();
export const store = configureStore({
    reducer:{
        AuthSlice,
        AppSlice
    },
    preloadedState: persistedState,
})


store.subscribe(() => {
    saveState(store.getState());
  });