import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";

// HomePage Imports
import HomePageOne from "./pages/HomePageOne";

// Signin & Signup Imports
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OtpPage from "./pages/OtpPage";

// Student Information Imports
import StudentDetailsPage from "./pages/StudentDetailsPage";
import UserUpdatePage from "./pages/UserUpdatePage";
import StudentAdmissionPage from "./pages/StudentAdmissionPage";

// Authentication/Access Token Page Imports
import UserAuth from "./pages/UserAuth";

// Income Imports
import AddIncomePage from "./pages/AddIncomePage";
import SearchIncomePage from "./pages/SearchIncomePage";
import AddIncomeHeadPage from "./pages/AddIncomeHeadPage";
import UpdateIncomePage from './pages/UpdateIncomePage'

// Expense Imports
import AddExpensePage from "./pages/AddExpensePage";
import SearchExpensePage from "./pages/SearchExpensePage";
import AddExpenseHeadPage from "./pages/AddExpenseHeadPage";

// Toast Imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// App css
import "../src/App.css";

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
          <Route
            exact
            path="/student/update/:id"
            element={
              <UserAuth>
                <UserUpdatePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/student/create"
            element={
              <UserAuth>
                <StudentAdmissionPage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/student/search"
            element={
              <UserAuth>
                <StudentDetailsPage />
              </UserAuth>
            }
          />

          {/* Sigin and Signup routes - start here */}
          <Route exact path="/signin" element={<SignInPage />} />
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route
            exact
            path="/forgot-password"
            element={
              <UserAuth>
                <ForgotPasswordPage />
              </UserAuth>
            }
          />
          <Route exact path="/verifyotp" element={<OtpPage />} />

          {/* Income Routes */}
          <Route
            exact
            path="/add/income"
            element={
              <UserAuth>
                <AddIncomePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/update/income/:id"
            element={
              <UserAuth>
                <UpdateIncomePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/search/income"
            element={
              <UserAuth>
                <SearchIncomePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/add/incomehead"
            element={
              <UserAuth>
                <AddIncomeHeadPage />
              </UserAuth>
            }
          />

          {/* Expense Routes */}
          <Route
            exact
            path="/add/expense"
            element={
              <UserAuth>
                <AddExpensePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/searchexpense"
            element={
              <UserAuth>
                <SearchExpensePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/add/expenseHead"
            element={
              <UserAuth>
                <AddExpenseHeadPage />
              </UserAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
