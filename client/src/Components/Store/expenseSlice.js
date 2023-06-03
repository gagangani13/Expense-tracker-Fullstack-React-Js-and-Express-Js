import { createSlice } from "@reduxjs/toolkit";
const initialExpense={expenses:[],editing:null,premium:false,activatePremium:false}
const expenseSlice=createSlice({
    name:'Expenses',
    initialState:initialExpense,
    reducers:{
        loadExpenses(state,action){
            state.expenses.unshift(action.payload)
        },
        reloadExpense(state,action){
            state.expenses=action.payload
        },
        editExpense(state,action){
            state.editing=action.payload
        },
        setPremium(state,action){
            state.premium=action.payload
        },
        setActivatePremium(state,action){
            state.activatePremium=action.payload
        }
    }
})
export const expenseAction=expenseSlice.actions
export const expenseReducer=expenseSlice.reducer
export default expenseSlice