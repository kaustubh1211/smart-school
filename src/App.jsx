import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import React, { useEffect } from "react";
import Toast from "../src/components/ui/Toast";
import "../src/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          {/* Home Route */}
          {/* <Route exact path="/" element={<HomePageOne />} /> */}

          {/* SiginPage routes */}
          <Route exact path="/sign-in" element={<SignInPage />} />
          {/* SigUpPage routes */}
          <Route exact path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
