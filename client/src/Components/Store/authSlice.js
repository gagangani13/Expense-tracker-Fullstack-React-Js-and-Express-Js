import { createSlice } from "@reduxjs/toolkit";
const initialAuthState={login:false,idToken:'',userId:''}
const authSlice=createSlice({
    name:'authentication',
    initialState:initialAuthState,
    reducers:{
        loginHandler(state){
            state.login=true    
        },
        logoutHandler(state){
            state.login=false
        },
        setToken(state,action){
            state.idToken=action.payload
        },
        setUserId(state,action){
            state.userId=action.payload
        }
    }
})
export const authAction=authSlice.actions
export const authReducer=authSlice.reducer
export default authSlice;