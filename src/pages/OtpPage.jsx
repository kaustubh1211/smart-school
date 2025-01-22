import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/ui/Toast";
import { Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";

import axios from "axios";

const SignUpLayer = () => {
  const navigate = useNavigate();
  const emailValue = useSelector((store) => store.email.emailValue);

  const dispatch = useDispatch();
  // toggle eye btn
  const [toggle, setToggle] = useState(true);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [isOtpValid, setIsOtpValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  // Phone validation
  const validateOtp = (otp) => {
    const otpPattern = /^\d{6}$/;
    return otpPattern.test(otp);
  };

  // Password validation
  const validatePassword = (password) => {
    // Minimum 8 chars, must include at least 1 letter and 1 number and 1 special character
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return passwordPattern.test(password);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "otp") {
      setOtp(value);
      setIsOtpValid(validateOtp(value));
    } else if (name === "password") {
      setPassword(value);
      setIsPasswordValid(validatePassword(value));
    }
  };

  // confirm password
  const handleConfirmPassword = (e) => {
    const { name, value } = e.target;
    setConfirmPassword(value); // Set the confirm password value

    // Check if both passwords match
    if (password === value) {
      setIsConfirmPasswordValid(true); // Update validity state to true if passwords match
    } else {
      setIsConfirmPasswordValid(false); // Set validity state to false if they don't match
    }
  };

  // Password toggle function
  function togglePassword() {
    setToggle((toggle) => !toggle);
  }

  // Form submit btn logic
  const isFormValid = isOtpValid && isPasswordValid && isConfirmPasswordValid;

  const handleButtonClick = async (e) => {
    e.preventDefault();
    // check if the form is valid
    if (isFormValid) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_LOCAL_API_URL}admin/reset-password`,
          {
            otp,
            email: emailValue,
            password,
          }
        );

        Toast.showSuccessToast(`${response.data.message}`);

        // send the user to dashboard page after 2sec
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } catch (error) {
        // console.error("Error submitting form:", error);
        if (error.response) {
          // Server responded with an error
          // console.log("Server error:", error.response.data.message);
          Toast.showWarningToast(`${error.response.data.message}`);
        } else if (error.request) {
          // No response received from the server
          // console.log("No response received:", error.request);
          Toast.showErrorToast("Sorry our server is down");
        } else {
          // Other errors (e.g., network error, etc.)
          // console.log("Sorry try after some time");
          Toast.showErrorToast("Sorry try after some time");
        }
      }
    }
  };

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="/assets/images/auth/auth-img.png" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link to="/" className="mb-40 max-w-290-px">
              <img src="/assets/images/DexEducation.png" alt="" />
            </Link>
            <h4 className="mb-12">Verify OTP</h4>
            {/* <p className="mb-32 text-secondary-light text-lg">
              Welcome back! please enter your detail
            </p> */}
          </div>
          <form action="#">
            {/* OTP No input */}
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <img src="/assets/Icons/key.svg" />
              </span>
              <input
                type="number"
                name="otp"
                onChange={handleInputChange}
                value={otp}
                className={`no-spinner form-control h-56-px bg-neutral-50 radius-12 ${
                  !isOtpValid ? "border-danger" : ""
                }`}
                placeholder="Enter 6 digit OTP"
              />
            </div>
            <div
              className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2  transition-transform duration-500 ${
                !isOtpValid ? "opacity-100 translate-y-0" : ""
              }`}
            >
              {!isOtpValid && "Enter 6 digit OTP"}
            </div>

            {/* Password input */}
            <div className="mb-12">
              <div className="position-relative">
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <img src="/assets/Icons/lock.svg" />
                  </span>
                  <input
                    type={toggle ? "text" : "password"}
                    name="password"
                    onChange={handleInputChange}
                    value={password}
                    className={`form-control h-56-px bg-neutral-50 radius-12 ${
                      !isPasswordValid ? "border-danger" : ""
                    }`}
                    placeholder="Password"
                  />
                </div>
                <span
                  className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${
                    !toggle ? "ri-eye-close-line" : "ri-eye-line"
                  }`}
                  onClick={togglePassword}
                />
              </div>
              {/* <span className=" mt-12 text-sm text-secondary-light">
                Your password must have at least 8 characters
              </span> */}
            </div>
            <div
              className={`w-100 text-danger mb-16 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                !isPasswordValid ? "opacity-100 translate-y-0" : ""
              }`}
            >
              {!isPasswordValid && " Password must have at least 8 characters"}
            </div>
            {/* confirm password */}
            <div className="position-relative mb-16">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <img src="/assets/Icons/lock-keyhole.svg" />
                </span>
                <input
                  type="password"
                  name="ConfirmPassword"
                  onChange={handleConfirmPassword}
                  value={ConfirmPassword}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !isConfirmPasswordValid ? "border-danger" : ""
                  }`}
                  placeholder="Confirm Password"
                />
              </div>
              <div
                className={`w-100 text-danger mb-16 small mt-2 opacity-0 transform translate-y-2  transition-transform duration-500 ${
                  !isConfirmPasswordValid ? "opacity-100 translate-y-0" : ""
                }`}
              >
                {!isConfirmPasswordValid && " Password does not match"}
              </div>
              {/* <span
                className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${
                  !toggle ? "ri-eye-close-line" : "ri-eye-line"
                }`}
                onClick={togglePassword}
              /> */}
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              disabled={!isFormValid}
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
            >
              {" "}
              Change Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;
