// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import SustainableItemForm from "./components/SustainableItemForm";
import ProductRequestForm from "./pages/ProductRequestForm.jsx";
import SearchTabs from "./pages/searchpage.jsx";
import RequestDetail from "./pages/RequestDetail.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import UserProfile from "./pages/UserProfile";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

// 🧩 Wrap each page in a motion.div for fade
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageWrapper><Home /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/logout" element={<PageWrapper><Logout /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterAndLogout /></PageWrapper>} />
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <PageWrapper><SustainableItemForm /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-product"
          element={
            <ProtectedRoute>
              <PageWrapper><ProductRequestForm /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <PageWrapper><SearchTabs /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/view/:id"
          element={
            <ProtectedRoute>
              <PageWrapper><RequestDetail /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/view/:id"
          element={
            <ProtectedRoute>
              <PageWrapper><ListingDetail /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><ProfilePage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="/user/:id" element={<PageWrapper><UserProfile /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>
          <AnimatedRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
