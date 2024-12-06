import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./Reducer";


export const Store = configureStore({
    reducer: { "maindata": Reducer }
});