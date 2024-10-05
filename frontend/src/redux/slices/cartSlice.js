import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    cartItems:[],
    loading:false,
    subtotal:0,
    shippingCharges:0,
    tax:0,
    total:0,
    shippingInfo:{
      address:null,
      city:null,
      state:null,
      country:null,
      pincode:null,
      phone:null
    }
}

const cartSlice = createSlice({
    name:"cart slice",
    initialState,
    reducers:{
        addToCart:(state,action)=>{

          const existingItemIndex = state.cartItems.findIndex((item)=> item._id === action.payload._id );
          if(existingItemIndex !== -1){

            const updatedCart = [...state.cartItems]
            updatedCart[existingItemIndex].quantity++;
            state.cartItems = updatedCart;

          }else{
            const newItem = {...action.payload, quantity:1};
            const updatedCart = [...state.cartItems,newItem]
            state.cartItems = updatedCart;

          }
          state.subtotal = state.cartItems.reduce((total,item)=> total + (item.price * item.quantity),0);
          state.shippingCharges = state.subtotal > 1000 ? 0 : 20;
          const taxAmt = (state.subtotal * 0.18).toFixed(2);
          const taxRounded = parseFloat(taxAmt);
          state.tax = taxRounded;
          state.total =  parseFloat((state.subtotal + state.shippingCharges + state.tax).toFixed(2)); 

        },
        cartItemQuantityReduce:(state,action)=>{

        const existingItemIndex = state.cartItems.findIndex((item)=> item._id === action.payload._id );
        
        const updatedCart = [...state.cartItems]
        if(updatedCart[existingItemIndex].quantity === 0){
          updatedCart[existingItemIndex].quantity = 0;

        }else{
          updatedCart[existingItemIndex].quantity--;

        }
        state.cartItems = updatedCart;
        state.subtotal = state.cartItems.reduce((total,item)=> total + (item.price * item.quantity),0);
        state.shippingCharges = state.subtotal > 1000 ? 0 : 20;
        state.tax = state.subtotal * 0.18;
        state.total = state.subtotal + state.shippingCharges + state.tax;



      },
      saveShippingInfo:(state,action)=>{

       state.shippingInfo = action.payload;

      },
    }
});

export const {addToCart, cartItemQuantityReduce, saveShippingInfo} = cartSlice.actions;
export default cartSlice.reducer;