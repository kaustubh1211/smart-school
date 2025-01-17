import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Toast from "../components/ui/Toast";
import axios from "axios";
import { attachEmailValue } from "@/features/emailSlice";
import { Provider, useDispatch, useSelector } from "react-redux";

function ForgotPasswordPage() {
  // const emailValue = useSelector((store) => store.email.emailValue);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false); // Track if the user started typing

  // Email validation
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isFormValid = isEmailValid;
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}auth/send-otp`,
        {
          email,
        }
      );

      // update the emailValue in the Store
      dispatch(attachEmailValue(email));

      Toast.showSuccessToast("OTP sent successfully");
      setTimeout(() => {
        navigate("/verify-otp");
      }, 2000);
    } catch (error) {
      if (error.response) {
        Toast.showWarningToast(`${error.response.data.message}`);
      } else if (error.request) {
        Toast.showErrorToast("Sorry our server is down");
      } else {
        Toast.showErrorToast("Sorry try after some time");
      }
    }
  };

  return (
    <section className="auth bg-base d-flex justify-content-center">
      {/* <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="assets/images/auth/auth-img.png" alt="" />
        </div>
      </div> */}
      <div className="auth-right px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link to="/" className="mb-40 max-w-290-px">
              <img src="/assets/images/logo.png" alt="" />
            </Link>
            <h4 className="mb-12">Forgot Password</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Enter your account's email to reset your password.
            </p>
          </div>
          <form action="#">
            {/* Email input */}
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <img src="/assets/Icons/mail.svg" />
              </span>
              <input
                type="email"
                name="email"
                onChange={handleInputChange}
                value={email}
                className={`form-control h-56-px bg-neutral-50 radius-12 ${
                  !isEmailValid && isTouched ? "border-danger" : ""
                }`}
                placeholder="Email"
              />
            </div>
            <div
              className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                !isEmailValid && isTouched ? "opacity-100 translate-y-0" : ""
              }`}
            >
              {!isEmailValid && isTouched
                ? "*Must be a valid email address"
                : ""}
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              disabled={!isEmailValid}
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
            >
              {" "}
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
