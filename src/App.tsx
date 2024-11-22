import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Artists from './pages/artists/Artists';
import ArtistDetail from './pages/artists/ArtistDetail';
import Catalogs from './pages/catalogs/Catalogs';
import CatalogDetail from './pages/catalogs/CatalogDetail';
import Users from './pages/users/Users';
import Projects from './pages/projects/Projects';
import ProjectDetail from './pages/projects/ProjectDetail';
import Distributors from './pages/distributors/Distributors';
import ProtectedRoute from './components/ProtectedRoute';
import Tracks from './pages/tracks/Tracks';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:id" element={<ArtistDetail />} />
                <Route path="/tracks" element={<Tracks />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/catalogs" element={<Catalogs />} />
                <Route path="/catalogs/:id" element={<CatalogDetail />} />
                <Route path="/distributors" element={<Distributors />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
