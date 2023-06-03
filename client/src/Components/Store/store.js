import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { expenseReducer } from "./expenseSlice";
import { themeReducer } from "./themeSlice";
const store=configureStore({
    reducer:{authenticate:authReducer,expenseList:expenseReducer,theme:themeReducer}
})
export default store;