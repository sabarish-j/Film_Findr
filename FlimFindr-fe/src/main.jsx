import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import { ToastProvider } from './context/ToastContext';
import { Toast } from './components/ui/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <MovieProvider>
          <App />
          <Toast />
        </MovieProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
