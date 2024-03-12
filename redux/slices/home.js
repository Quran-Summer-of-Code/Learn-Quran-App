import { createSlice } from "@reduxjs/toolkit"


const initialState = { 
   homeMode: false, 
}
 
 const reducers = {

   SetHomeMode(state, action) {
      state.homeMode = action.payload
    },

 }

const homeSlice = createSlice({name: "home", initialState, reducers})

export const { SetHomeMode } = homeSlice.actions


export default homeSlice.reducer