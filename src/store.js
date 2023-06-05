import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import userReducer from './reducers/userSlice';
import chatReducer from './reducers/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer
  },
});

export default store;