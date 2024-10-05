import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    products:[],
    loading:false
}

const productSlice = createSlice({
    name:"product slice",
    initialState,
    reducers:{
        getProducts:(state,action)=>{
            state.products = action.payload

        }
    }
});

export const {getProducts} = productSlice.actions;
export default productSlice.reducer;