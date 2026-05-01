import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/global.css';

import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChatFab } from './components/ai/ChatFab';
import { ChatDrawer } from './components/ai/ChatDrawer';

function HomeOnlyFab() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return <ChatFab />;
}

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { MovieDetails } from './pages/MovieDetails';
import { Watchlist } from './pages/Watchlist';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

import { AuthContext } from './context/AuthContext';

function App() {
  const { getCurrentUser, token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
  }, [token]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {token && (
        <>
          <HomeOnlyFab />
          <ChatDrawer />
        </>
      )}
    </Router>
  );
}

export default App;
