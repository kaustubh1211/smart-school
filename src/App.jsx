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

// Examination imports
import ExamMasterPage from "./pages/ExamMasterPage";
import UpdateExamMaster from "./components/child/UpdateExamMaster";

// Toast Imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// App css
import "../src/App.css";
import AddFeeTypePage from "./pages/AddFeeTypePage";
import UpdateFeesTypePage from "./pages/UpdateFeesTypePage";
import SearchFeesPaymentPage from "./pages/SearchFeesPaymentPage";
import CollectFeePaymentPage from "./pages/CollectFeePaymentPage";
import StudentPrintForm from "./components/StudentPrintForm";
import FeeStructurePage from "./pages/FeeStructurePage";
import EditFeeStructurePage from "./pages/EditFeeStructurePage";
import FeesRecordPage from "./pages/FeesRecordPage";
import PdfGenerator from "./components/child/PdfGenerator";

import GuestOnly from "./pages/GuestOnly";
import SuperAdminRoute from "./pages/SuperAdminRoute";
import AccountsPage from "./pages/AccountsPage";
import PayrollPage from "./pages/PayrollPage";
import LeavingCertificatePage from "./pages/LeavingCertificatePage";
import AcademicsPage from "./pages/TimetablePage";
import TimetableLayer from "./components/TimetableLayer";
import TimetablePage from "./pages/TimetablePage";
import StudentBulkAddPage from "./pages/StudentBulkAddPage";
import StudentBulkUpdate from "./pages/StudentBulkUpdate";
import UpdateExamMasterPage from "./pages/UpdateExamMasterPage";
import FeeReportPage from "./pages/FeeReportPage";
import FeeDashboardPage from "./pages/FeeDashboardPage";
import AffidavitListPage from "./components/AffidavitLayer";
import AffidavitLayer from "./components/AffidavitLayer";
import { AffidavitDocument } from "./components/child/AffidavitDocument";
import AffidavitPrintPage from "./pages/AffidavitPrintPage";
import AffidavitGeneratePage from "./pages/AffidavitGeneratePage";
import MonthlyFeesTraxPage from "./pages/MonthlyFeesTraxPage";
import GenerateLeavingCertificatePage from "./pages/GenerateLeavingCertificatePage";
import LeavingCertificatePrintPage from "./pages/LeavingCertificatePrintPage";
import BulkGenerateLCPage from "./pages/BulkGenerateLCPage";

// Bonafied Imports
import BonafideCertificatePage from "./pages/BonafiedCertificatePage";
import AddNewBonafidePage from "./pages/AddNewBonafidePage";
import UpdateBonafidePage from "./pages/UpdateBonafidePage";
import { BonafideCertificate } from "./components/BonafideCertificate";

// Enquiry Imports
import EnquiryDeskPage from "./pages/EnquiryDeskPage";
import NewEnquiryPage from "./pages/NewEnquiryPage";
import EnquiryForm from "./components/EnquiryForm";
import EnquiryFollowUpPage from "./pages/EnquiryFollowUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import OutSTandingReportPage from "./pages/OutStandingReportpage";

function App() {

// Your existing imports remain the same

return (
  <>
    <ToastContainer />
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        {/* Home Page */}
        <Route
          exact
          path="/"
          element={
            <GuestOnly>
              <HomePageScreen />
            </GuestOnly>
          }
        />

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

        {/* ============= STUDENT ROUTES ============= */}
        
        <Route
          exact
          path="/student/update/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="students" action="edit">
                <UserUpdatePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/student/create"
          element={
            <UserAuth>
              <ProtectedRoute module="students" action="add">
                <StudentAdmissionPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/student/search"
          element={
            <UserAuth>
              <ProtectedRoute module="students" action="view">
                <StudentDetailsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/student/list"
          element={
            <UserAuth>
              <ProtectedRoute module="students" action="view">
                <StudentListPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/student/search/:std/:div"
          element={
            <UserAuth>
              <ProtectedRoute module="students" action="view">
                <StudentDetailsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        <Route
          exact
          path="/student-bulk-add"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <StudentBulkAddPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/student-bulk-update"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <StudentBulkUpdate />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        <Route
          exact
          path="/student/form/print/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="students" action="view">
                <StudentPrintForm />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* Sign In */}
        <Route
          exact
          path="/sign-in"
          element={
            <GuestOnly>
              <SignInPage />
            </GuestOnly>
          }
        />

        {/* ============= INCOME ROUTES ============= */}
        
        <Route
          exact
          path="/add/income"
          element={
            <UserAuth>
              <ProtectedRoute module="income" action="add">
                <AddIncomePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/update/income/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="income" action="edit">
                <UpdateIncomePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/search/income"
          element={
            <UserAuth>
              <ProtectedRoute module="income" action="view">
                <SearchIncomePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/update/incomehead/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="income" action="edit">
                <UpdateIncomeHeadPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/add/incomehead"
          element={
            <UserAuth>
              <ProtectedRoute module="income" action="add">
                <AddIncomeHeadPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= EXPENSE ROUTES ============= */}
        
        <Route
          exact
          path="/add/expense"
          element={
            <UserAuth>
              <ProtectedRoute module="expense" action="add">
                <AddExpensePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/search/expense"
          element={
            <UserAuth>
              <ProtectedRoute module="expense" action="view">
                <SearchExpensePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/add/expenseHead"
          element={
            <UserAuth>
              <ProtectedRoute module="expense" action="add">
                <AddExpenseHeadPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/update/expensehead/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="expense" action="edit">
                <UpdateExpenseHeadPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/update/expense/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="expense" action="edit">
                <UpdateExpensePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= FEES ROUTES ============= */}
        
        <Route
          exact
          path="/add/feetype"
          element={
            <UserAuth>
              <ProtectedRoute module="feeStructure" action="add">
                <AddFeeTypePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/search/fees/payment"
          element={
            <UserAuth>
              <ProtectedRoute module="fees" action="view">
                <SearchFeesPaymentPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        <Route
          exact
          path="/collect/fee/payment"
          element={
            <UserAuth>
              <ProtectedRoute module="fees" action="collect">
                <CollectFeePaymentPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/student/fees/record"
          element={
            <UserAuth>
              <ProtectedRoute module="fees" action="view">
                <FeesRecordPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/fee/structure"
          element={
            <UserAuth>
              <ProtectedRoute module="feeStructure" action="view">
                <FeeStructurePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/edit/fee/structure/:getClass/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="feeStructure" action="view">
                <EditFeeStructurePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/update/feetype/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="feeStructure" action="edit">
                <UpdateFeesTypePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/fees/view/recipt/:id"
          element={<PdfGenerator />}
        />
        
        <Route
          exact
          path="/search/fees/transaction"
          element={
            <UserAuth>
              <ProtectedRoute module="reports" action="view">
                <FeeReportPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/fees/dashboard"
          element={
            <UserAuth>
              <ProtectedRoute module="fees" action="view">
                <FeeDashboardPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/search/monthly-fees/transaction"
          element={
            <UserAuth>
              <ProtectedRoute module="reports" action="view">
                <MonthlyFeesTraxPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

         <Route
          exact
          path="/search/outstanding/report"
          element={
            <UserAuth>
              <ProtectedRoute module="reports" action="view">
                <OutSTandingReportPage/>
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= CERTIFICATE ROUTES ============= */}
        
        <Route
          exact
          path="/affidavits"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="view">
                <AffidavitLayer />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/affidavit"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="add">
                <AffidavitGeneratePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/affidavits/download/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="view">
                <AffidavitPrintPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        <Route
          exact
          path="/bonafide-certificates"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="view">
                <BonafideCertificatePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/bonafide-certificate/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="view">
                <BonafideCertificate />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/new-bonafide"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="add">
                <AddNewBonafidePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/update-bonafide/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="add">
                <UpdateBonafidePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        <Route
          exact
          path="/leaving-certificate/download"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="view">
                <LeavingCertificatePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/leaving-certificate"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="add">
                <GenerateLeavingCertificatePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/download/lc/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="certificates" action="view">
                <LeavingCertificatePrintPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/bulkLC"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <BulkGenerateLCPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= ENQUIRY ROUTES ============= */}
        
        <Route
          exact
          path="/enquiry-dashboard"
          element={
            <UserAuth>
              <ProtectedRoute module="enquiry" action="view">
                <EnquiryDeskPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/enquiry"
          element={
            <UserAuth>
              <ProtectedRoute module="enquiry" action="add">
                <NewEnquiryPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/enquiry/followUp/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="enquiry" action="edit">
                <EnquiryFollowUpPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/enquiry/form/:id"
          element={
            <UserAuth>
              <ProtectedRoute module="enquiry" action="view">
                <EnquiryForm />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= PAYROLL ROUTES ============= */}
        
        <Route
          exact
          path="/payroll"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <PayrollPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= ACCOUNTS ROUTES ============= */}
        
        <Route
          exact
          path="/accounts"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN']}>
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= ACADEMICS ROUTES ============= */}
        
        <Route
          exact
          path="/academics"
          element={
            <UserAuth>
              <ProtectedRoute module="classes" action="view">
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/timetable"
          element={
            <UserAuth>
              <ProtectedRoute module="classes" action="view">
                <TimetablePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/notes"
          element={
            <UserAuth>
              <ProtectedRoute module="classes" action="view">
                <TimetablePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/homework"
          element={
            <UserAuth>
              <ProtectedRoute module="classes" action="view">
                <TimetablePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/mark-attendance"
          element={
            <UserAuth>
              <ProtectedRoute roles={['TEACHER', 'ADMIN', 'SUPER_ADMIN']}>
                <TimetablePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/report"
          element={
            <UserAuth>
              <ProtectedRoute module="reports" action="view">
                <TimetablePage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= EXAMINATION ROUTES ============= */}
        
        <Route
          exact
          path="/master"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/exam-masters"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <ExamMasterPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/exam-masters/update/:id"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <UpdateExamMasterPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/exam-marks-entry"
          element={
            <UserAuth>
              <ProtectedRoute roles={['TEACHER', 'ADMIN', 'SUPER_ADMIN']}>
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/exam-result"
          element={
            <UserAuth>
              <ProtectedRoute module="reports" action="view">
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= EMPLOYEE ROUTES ============= */}
        
        <Route
          exact
          path="/employee-master"
          element={
            <UserAuth>
              <ProtectedRoute module="teachers" action="view">
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/mark-attendancey"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= ONLINE EXAM ROUTES ============= */}
        
        <Route
          exact
          path="/exam-summary"
          element={
            <UserAuth>
              <ProtectedRoute module="reports" action="view">
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/exam-masterr"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/question-bank"
          element={
            <UserAuth>
              <ProtectedRoute roles={['TEACHER', 'ADMIN', 'SUPER_ADMIN']}>
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/online-exam-result"
          element={
            <UserAuth>
              <ProtectedRoute module="reports" action="view">
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/subject-teacher"
          element={
            <UserAuth>
              <ProtectedRoute module="teachers" action="view">
                <AccountsPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />

        {/* ============= EXAM MASTER ROUTES ============= */}
        
        <Route
          exact
          path="/exam-master"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <ExamMasterPage />
              </ProtectedRoute>
            </UserAuth>
          }
        />
        
        <Route
          exact
          path="/exam-master/update/:id"
          element={
            <UserAuth>
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <UpdateExamMaster />
              </ProtectedRoute>
            </UserAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </>
);
}

export default App;
