import { createSlice } from "@reduxjs/toolkit";
const initialTheme={light:true}
const themeSlice=createSlice({
    name:'theme',
    initialState:initialTheme,
    reducers:{
        setLight(state){
            state.light=!state.light
        }
    }
})
export const themeAction=themeSlice.actions
export const themeReducer=themeSlice.reducer
export default themeSlice