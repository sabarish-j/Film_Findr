import React, { useContext, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/global.css';

import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BrandLoader } from './components/ui/BrandLoader';

// Auth pages — keep eager (entry point on first paint)
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Lazy-loaded protected pages — each gets its own chunk
const Home          = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Search        = lazy(() => import('./pages/Search').then(m => ({ default: m.Search })));
const MovieDetails  = lazy(() => import('./pages/MovieDetails').then(m => ({ default: m.MovieDetails })));
const Watchlist     = lazy(() => import('./pages/Watchlist').then(m => ({ default: m.Watchlist })));
const Profile       = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Settings      = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

// AI chat is heavy and only needed when opened — lazy load
const ChatFab    = lazy(() => import('./components/ai/ChatFab').then(m => ({ default: m.ChatFab })));
const ChatDrawer = lazy(() => import('./components/ai/ChatDrawer').then(m => ({ default: m.ChatDrawer })));

import { AuthContext } from './context/AuthContext';

function HomeOnlyFab() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return <ChatFab />;
}

const RouteFallback = () => (
  <div
    style={{
      minHeight: 'calc(100vh - var(--navbar-height, 68px))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <BrandLoader size="lg" label="Loading page" />
  </div>
);

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
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>

      {token && (
        <Suspense fallback={null}>
          <HomeOnlyFab />
          <ChatDrawer />
        </Suspense>
      )}
    </Router>
  );
}

export default App;
