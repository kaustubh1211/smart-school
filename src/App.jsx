import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";

// Homepage screen imports
import HomePageScreen from "./pages/HomePageScreen";

// Home Dashboard Page Imports
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
import StudentListPage from "./pages/StudentListPage";

// Authentication/Access Token Page Imports
import UserAuth from "./pages/UserAuth";

// Income Imports
import AddIncomePage from "./pages/AddIncomePage";
import SearchIncomePage from "./pages/SearchIncomePage";
import AddIncomeHeadPage from "./pages/AddIncomeHeadPage";
import UpdateIncomePage from "./pages/UpdateIncomePage";
import UpdateIncomeHeadPage from "./pages/UpdateIncomeHeadPage";

// Expense Imports
import AddExpensePage from "./pages/AddExpensePage";
import SearchExpensePage from "./pages/SearchExpensePage";
import AddExpenseHeadPage from "./pages/AddExpenseHeadPage";
import UpdateExpensePage from "./pages/UpdateExpensePage";
import UpdateExpenseHeadPage from "./pages/UpdateExpenseHeadPage";

// Toast Imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// App css
import "../src/App.css";
import AddFeeTypePage from "./pages/AddFeeTypePage";
import UpdateFeesTypePage from "./pages/UpdateFeesTypePage";
import SearchFeesPaymentPage from "./pages/SearchFeesPaymentPage";
import AddFeeGroupPage from "./pages/AddFeeGroupPage";
import CollectFeePaymentPage from "./pages/CollectFeePaymentPage";
import PdfViewerLayer from "./components/PdfViewerLayer";
import StudentPrintForm from "./components/StudentPrintForm";
import FeeStructurePage from "./pages/FeeStructurePage";
import EditFeeStructurePage from "./pages/EditFeeStructurePage";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          {/* Home Page */}
          <Route exact path="/" element={<HomePageScreen />} />

          {/* Home Dashboard Route */}
          <Route
            exact
            path="/dashboard"
            element={
              <UserAuth>
                <HomePageOne />
              </UserAuth>
            }
          />

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
          <Route
            exact
            path="/student/list"
            element={
              <UserAuth>
                <StudentListPage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/student/search/:std/:div"
            element={
              <UserAuth>
                <StudentDetailsPage />
              </UserAuth>
            }
          />

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
            path="/update/incomehead/:id"
            element={
              <UserAuth>
                <UpdateIncomeHeadPage />
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
            path="/search/expense"
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
          <Route
            exact
            path="/update/expensehead/:id"
            element={
              <UserAuth>
                <UpdateExpenseHeadPage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/update/expense/:id"
            element={
              <UserAuth>
                <UpdateExpensePage />
              </UserAuth>
            }
          />

          {/* Fees Page */}
          <Route
            exact
            path="/add/feetype"
            element={
              <UserAuth>
                <AddFeeTypePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/search/fees/payment"
            element={
              <UserAuth>
                <SearchFeesPaymentPage />
              </UserAuth>
            }
          />
          {/* <Route
            exact
            path="/add/fee/group"
            element={
              <UserAuth>
                <AddFeeGroupPage />
              </UserAuth>
            }
          /> */}
          <Route
            exact
            path="/collect/fee/payment"
            element={
              <UserAuth>
                <CollectFeePaymentPage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/fee/structure"
            element={
              <UserAuth>
                <FeeStructurePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/edit/fee/structure/:getClass/:id"
            element={
              <UserAuth>
                <EditFeeStructurePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/update/feetype/:id"
            element={
              <UserAuth>
                <UpdateFeesTypePage />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/fee/viewRecipt"
            element={
              <UserAuth>
                <PdfViewerLayer />
              </UserAuth>
            }
          />
          <Route
            exact
            path="/student/form/print/:id"
            element={
              <UserAuth>
                <StudentPrintForm />
              </UserAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
