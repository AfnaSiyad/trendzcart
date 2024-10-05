import {createSlice} from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialState = {
    loading:false,
    isAuthenticated:false,
    user:null,
}

const userAuth = createSlice({
    name:"auth slice",
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{

            state.isAuthenticated = true;
            state.user = action.payload;
        },

        logout:(state)=>{

            state.user = null;
            state.isAuthenticated = false;
            Cookies.remove('token', { path: '/' });
      }
     
    }
});

export const {loginSuccess, logout} = userAuth.actions;
export default userAuth.reducer;