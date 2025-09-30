import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: JSON.parse(localStorage.getItem("userData")) || null,
    city: null,
    state: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    totalAmount: JSON.parse(localStorage.getItem("cartItems"))
      ? JSON.parse(localStorage.getItem("cartItems")).reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      : 0,
    myOrders: [],
    searchItems:[],
    searchQuery:"",
    socket:null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    clearUserData: (state) => {
      state.userData = null;
      localStorage.removeItem("userData");
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === cartItem.id
      );
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    setClearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      localStorage.removeItem("cartItems");
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((order) => order._id === orderId);
      if (order) {
        if (order.shopOrders && order.shopOrders.shop._id === shopId) {
          order.shopOrders.status = status;
        }
      }
    },
    updateRealtimeOrderStatus:(state,action)=>{
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find(order => order._id === orderId);
      if (order) {
        const shopOrder = order.shopOrders.find(so=>so.shop._id === shopId)
        if(shopOrder){
          shopOrder.status = status;
        }
      }
    },
    setSerachItems:(state,action)=>{
      state.searchItems = action.payload;
    },
    setSearchQuery:(state,action)=>{
      state.searchQuery = action.payload;
    },
    setSocket:(state,action)=>{
      state.socket = action.payload;
    }
  },
});
export const {
  setUserData,
  clearUserData,
  setCity,
  setState,
  setCurrentAddress,
  setShopInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeFromCart,
  setMyOrders,
  addMyOrder,
  setClearCart,
  updateOrderStatus,
  setSerachItems,
  setSearchQuery,
  setSocket,
  updateRealtimeOrderStatus
} = userSlice.actions;
export default userSlice.reducer;
