import { createSlice } from "@reduxjs/toolkit"


const initialState = { 
   // The settings mode is true when the settings popup is open
   settingsMode: false, 

}
 
 const reducers = {
  // Setters go here

   SetSettingsMode(state, action) {
      state.settingsMode = action.payload
    },

 }

const colorsSlice = createSlice({name: "colors", initialState, reducers})

export const { SetSettingsMode } = colorsSlice.actions


export default colorsSlice.reducer