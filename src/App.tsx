import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ArtistDetail from "./pages/artists/ArtistDetail";
import Artists from "./pages/artists/Artists";
import CatalogDetail from "./pages/catalogs/CatalogDetail";
import Catalogs from "./pages/catalogs/Catalogs";
import Distributors from "./pages/distributors/Distributors";
import CatalogProjectionDetail from "./pages/projections/CatalogProjectionDetail";
import CatalogProjections from "./pages/projections/CatalogProjections";
import ConcertProjectionDetail from "./pages/projections/ConcertProjectionDetail";
import ConcertProjections from "./pages/projections/ConcertProjections";
import ProjectProjectionDetail from "./pages/projections/ProjectProjectionDetail";
import ProjectProjections from "./pages/projections/ProjectProjections";
import RevenueProjections from "./pages/projections/RevenueProjections";
import ProjectDetail from "./pages/projects/ProjectDetail";
import Projects from "./pages/projects/Projects";
import SubProjectDetail from "./pages/projects/SubProjectDetail";
import PaymentRequestCreate from "./pages/requests/PaymentRequestCreate";
import PaymentRequestList from "./pages/requests/PaymentRequestList";
import Tracks from "./pages/tracks/Tracks";
import Users from "./pages/users/Users";

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
                <Route path="/subprojects/:id" element={<SubProjectDetail />} />
                <Route path="/catalogs" element={<Catalogs />} />
                <Route path="/catalogs/:id" element={<CatalogDetail />} />
                <Route
                  path="/catalog-projections"
                  element={<CatalogProjections />}
                />
                <Route
                  path="/catalog-projections/:id"
                  element={<CatalogProjectionDetail />}
                />
                <Route
                  path="/concert-projections"
                  element={<ConcertProjections />}
                />
                <Route
                  path="/concert-projections/:id"
                  element={<ConcertProjectionDetail />}
                />
                <Route
                  path="/project-projections"
                  element={<ProjectProjections />}
                />
                <Route
                  path="/project-projections/:id"
                  element={<ProjectProjectionDetail />}
                />
                <Route
                  path="/revenue-projections"
                  element={<RevenueProjections />}
                />
                <Route path="/distributors" element={<Distributors />} />
                <Route path="/users" element={<Users />} />
                {/* Payment Request Routes */}
                <Route path="/requests" element={<PaymentRequestList />} />
                <Route
                  path="/requests/payment"
                  element={<PaymentRequestCreate />}
                />
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
