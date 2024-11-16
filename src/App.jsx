import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import FormValidationPage from "./pages/FormValidationPage";
import FormLayoutPage from "./pages/FormLayoutPage";

import RouteScrollToTop from "./helper/RouteScrollToTop";
import React, { useEffect } from "react";
import Toast from "../src/components/ui/Toast";
import "../src/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpPage from "./pages/OtpPage";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          {/* Home Route */}
          <Route exact path="/" element={<HomePageOne />} />

          {/* Student Admission form validation - Start here */}

          {/* <Route
            exact
            path="/form-validation"
            element={<FormValidationPage />}
          /> */}
          <Route exact path="/form-layout" element={<FormLayoutPage />} />

          {/* Student Admission form validation - End here */}

          {/* Sigin and Signup routes - start here */}
          <Route exact path="/sign-in" element={<SignInPage />} />
          <Route exact path="/sign-up" element={<SignUpPage />} />
          <Route
            exact
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route exact path="/verify-otp" element={<OtpPage />} />
          {/* Sigin and Signup routes - end here */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
