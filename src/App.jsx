import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import StudentDetailsPage from "../src/pages/StudentDetailsPage";
// import UserUpdate from "./pages/UserUpdate";
// import FormValidationPage from "./pages/FormValidationPage";
import StudentAdmissionPage from "./pages/StudentAdmissionPage";
import UserAuth from "./pages/UserAuth";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import OtpPage from "./pages/OtpPage";
import React from "react";
// import Toast from "../src/components/ui/Toast";
import "../src/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserUpdate from "./pages/UserUpdate";

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

          {/* for editing details of specific student */}
          <Route
            exact
            path="/student/update/:id"
            element={
              <UserAuth>
                <UserUpdate />
              </UserAuth>
            }
          />

          {/* for creating new form  */}
          <Route
            exact
            path="/student/create"
            element={
              <UserAuth>
                <StudentAdmissionPage />
              </UserAuth>
            }
          />

          {/* Student Admission form validation - End here */}

          {/* Student Detail search start here */}
          <Route
            exact
            path="/student/search"
            element={
              <UserAuth>
                <StudentDetailsPage />
              </UserAuth>
            }
          />

          {/* Student Detail search end here */}

          {/* Sigin and Signup routes - start here */}
          <Route exact path="/sign-in" element={<SignInPage />} />
          <Route exact path="/sign-up" element={<SignUpPage />} />
          <Route
            exact
            path="/forgot-password"
            element={
              <UserAuth>
                <ForgotPasswordPage />
              </UserAuth>
            }
          />
          <Route exact path="/verify-otp" element={<OtpPage />} />
          {/* Sigin and Signup routes - end here */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
