import { createSlice } from '@reduxjs/toolkit';
 

const initialState = {
    accessToken: null,
    refreshToken: null,
    user: null,
    activeProductId:null
};

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
        },
        updateTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        getState:(state)=>{
            return state;
        },
        setActiveProductId:(state,action)=>{
            state.activeProductId=action.payload;
        }
    },
});

export const { login, logout, updateTokens ,getState,setActiveProductId} = AuthSlice.actions;
export default AuthSlice.reducer;
