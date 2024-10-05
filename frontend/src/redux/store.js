import {configureStore} from "@reduxjs/toolkit";
import productSlice from "./slices/productSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
    reducer:{
        products:productSlice,
        cartItems:cartSlice,
        userAuth:userSlice,
    }
});


export default store
