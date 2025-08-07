import React from "react";
import Unauthorized from "./pages/auth/Unauthorized"; // Add this at the top
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ParallaxProvider } from 'react-scroll-parallax';
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PasswordResetRequest from "./pages/auth/PasswordResetRequest";
import PasswordResetConfirm from "./pages/auth/PasswordResetConfirm";
import Profile from "./pages/common/Profile";
import HomeAdmin from "./pages/admin/homeadmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomeKid from "./pages/kids/homekids";
import HomeTeen from "./pages/teen/hometeen";
import HomeYoung from "./pages/young/homeyoung";
import HomeAdult from "./pages/adult/homeadult";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/utils/ErrorBoundary";
import AboutIntro from "./pages/common/AboutIntro";
import GetInvolvedPage from "./pages/common/GetInvolvedPage";
import ContactUsPage from "./pages/common/ContactUsPage";
import GlobalIslamicNews from "./pages/common/GlobalIslamicNews"
import PillarsOfIslam from "./screens/explore/PillarsOfIslam"




function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ParallaxProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/aboutus" element={<AboutIntro />} />
              <Route path="/get-involved" element={<GetInvolvedPage />} />
              <Route path="/contactus" element={<ContactUsPage />} />
              <Route path="/content/GlobalIslamicNews" element={<GlobalIslamicNews />} />
              <Route path="/content/Pillars" element={<PillarsOfIslam />} />


              <Route element={<ProtectedRoute allowedRoles={["GROUP_0_5"]} />}>
                <Route path="/kids/homekids" element={<HomeKid />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["GROUP_6_15"]} />}>
                <Route path="/teen/hometeen" element={<HomeTeen />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["GROUP_16_25"]} />}>
                <Route path="/young/homeyoung" element={<HomeYoung />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["GROUP_26_PLUS"]} />}>
                <Route path="/adult/homeadult" element={<HomeAdult />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin/homeadmin" element={<HomeAdmin />} />
                <Route path="/admin" element={<AdminDashboard />} /> 
              </Route>

              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/password-reset-request" element={<PasswordResetRequest />} />
              <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/admin" element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } /> */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Router>
          </ParallaxProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
