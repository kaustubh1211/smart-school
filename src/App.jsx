import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import "../src/App.css";

function App() {
  return (
    <>
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
