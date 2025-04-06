// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import SustainableItemForm from "./components/SustainableItemForm";
import ProductRequestForm from "./pages/ProductRequestForm.jsx";
import SearchTabs from "./pages/searchpage.jsx"; // Assuming this is the correct path
import RequestDetail from "./pages/RequestDetail.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import ProfilePage from "./components/ProfilePage.jsx"; // Import ProfilePage
import UserProfile from "./pages/UserProfile";




function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route
              path="/add-item"
              element={
                <ProtectedRoute>
                  <SustainableItemForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request-product"
              element={
                <ProtectedRoute>
                  <ProductRequestForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchTabs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests/view/:id"
              element={
                <ProtectedRoute>
                  <RequestDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/view/:id"
              element={
                <ProtectedRoute>
                  <ListingDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;