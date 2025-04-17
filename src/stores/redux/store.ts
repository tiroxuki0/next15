import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer

    // Thêm các reducers khác nếu có
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false // Tùy chọn: tắt kiểm tra non-serializable nếu cần
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

/* EXAMPLE */

/* 

"use client";

import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/stores/redux/slices/authSlice';
import type { RootState } from '@/stores/redux/store';

function LoginComponent() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  
  const handleLogin = async () => {
    dispatch(login({ username: 'user', password: 'pass' }));
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <div>
      {loading && <p>Đang xử lý...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {isAuthenticated ? (
        <button onClick={handleLogout}>Đăng xuất</button>
      ) : (
        <button onClick={handleLogin}>Đăng nhập</button>
      )}
    </div>
  );
}

*/
