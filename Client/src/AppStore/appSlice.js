import { createSlice } from '@reduxjs/toolkit';
 

const initialState = {
   activeProductID:null,
   toggle:false
   
};

const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
         setActiveProductID: (state,action)=>{
             state.activeProductID = action.payload;
         },
         setToggle: (state,action)=>{
             state.toggle = action.payload;
         }
    }
});

export const {setActiveProductID,setToggle } = AppSlice.actions;
export default AppSlice.reducer;
