import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Toast from "../../src/components/ui/Toast";

import axios from "axios";

const SignUpLayer = () => {
  const [toggle, setToggle] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [termsAndCondition, setTermsAndCondition] = useState(true);

  // Full name validation
  const validateFullName = (name) => {
    const fullNamePattern = /^[A-Za-z\s]+$/;
    return fullNamePattern.test(name);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Phone validation
  const validatePhone = (phone) => {
    const phonePattern = /^[6-9][0-9]{9}$/;
    return phonePattern.test(phone);
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

    if (name === "fullName") {
      setFullName(value);
      setIsFullNameValid(validateFullName(value));
    } else if (name === "email") {
      setEmail(value);
      setIsEmailValid(validateEmail(value));
    } else if (name === "phone") {
      setPhone(value);
      setIsPhoneValid(validatePhone(value));
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

  // terms and condition checked btn fn
  const handleChecked = () => {
    setTermsAndCondition(!termsAndCondition);
  };

  // Form submit btn logic
  const isFormValid =
    isFullNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    termsAndCondition;

  const handleButtonClick = async (e) => {
    // e.preventDefault();
    // check if the form is valid
    if (isFormValid) {
      try {
        const response = await axios.post(
          "http://88.198.61.79:8080/api/admin/sign-up",
          {
            fullName,
            email,
            mobile: phone,
            password,
          }
        );
        const { accessToken } = response.data.data;
        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);

        Toast.showSuccessToast("Registration done successfully!");

        // send the user to dashboard page after 2sec
        setTimeout(() => {
          window.location.href = "/dashboard";
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
          <img src="assets/images/auth/auth-img.png" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link to="/" className="mb-40 max-w-290-px">
              <img src="assets/images/logo.png" alt="" />
            </Link>
            <h4 className="mb-12">Sign Up to your Account</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Welcome back! please enter your detail
            </p>
          </div>
          <form action="#">
            {/* full Name input */}
            <div className="icon-field mb-13">
              <span className="icon top-50 translate-middle-y">
                <img src="../../src/assets/Icons/user.svg" />
              </span>
              <input
                type="text"
                name="fullName"
                onChange={handleInputChange}
                value={fullName}
                className={`form-control h-56-px bg-neutral-50 radius-12 ${
                  !isFullNameValid ? "border-danger" : ""
                }`}
                placeholder="Full name"
              />
            </div>
            
            {/* Phone No input */}
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <img src="../../src/assets/Icons/phone.svg" />
              </span>
              <input
                type="tel"
                name="phone"
                onChange={handleInputChange}
                value={phone}
                className={`form-control h-56-px bg-neutral-50 radius-12 ${
                  !isPhoneValid ? "border-danger" : ""
                }`}
                placeholder="Mobile number"
              />
            </div>
            <div
              className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2  transition-transform duration-500 ${
                !isPhoneValid ? "opacity-100 translate-y-0" : ""
              }`}
            >
              {!isPhoneValid && "*Mobile number is Invalid"}
            </div>

            {/* Email input */}
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <img src="../../src/assets/Icons/mail.svg" />
              </span>
              <input
                type="email"
                name="email"
                onChange={handleInputChange}
                value={email}
                className={`form-control h-56-px bg-neutral-50 radius-12 ${
                  !isEmailValid ? "border-danger" : ""
                }`}
                placeholder="Email"
              />
            </div>
            <div
              className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                !isEmailValid ? "opacity-100 translate-y-0" : ""
              }`}
            >
              {!isEmailValid && "*Email is Invalid"}
            </div>
            {/* Password input */}
            <div className="mb-12">
              <div className="position-relative">
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <img src="../../src/assets/Icons/lock.svg" />
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
                  <img src="../../src/assets/Icons/lock-keyhole.svg" />
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
            <div className="">
              <div className="d-flex justify-content-between gap-2">
                <div className="form-check style-check d-flex align-items-start">
                  <input
                    className="form-check-input border border-neutral-300 mt-1"
                    type="checkbox"
                    defaultValue=""
                    id="condition"
                    defaultChecked
                    onClick={handleChecked}
                  />
                  <label
                    className="form-check-label text-sm"
                    htmlFor="condition"
                  >
                    By creating an account means you agree to the
                    <Link to="#" className="text-primary-600 fw-semibold">
                      Terms &amp; Conditions
                    </Link>{" "}
                    and our{" "}
                    <Link to="#" className="text-primary-600  fw-semibold">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={!isFormValid}
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
            >
              {" "}
              Sign Up
            </button>

            {/* <div className="mt-32 center-border-horizontal text-center">
              <span className="bg-base z-1 px-4">Or sign up with</span>
            </div> */}
            {/* <div className="mt-32 d-flex align-items-center gap-3">
              <button
                type="button"
                className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
              >
                <img
                  src="../../src/assets/Icons/icons8-facebook.svg"
                  style={{ width: "20px" }}
                  className="text-primary-600 text-xl line-height-1 "
                />
                Facebook
              </button>
              <button
                type="button"
                className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
              >
                <img
                  src="../../src/assets/Icons/icons8-google.svg"
                  style={{ width: "20px" }}
                  className="text-primary-600 text-xl line-height-1"
                />
                Google
              </button>
            </div> */}
            <div className="mt-32 text-center text-sm">
              <p className="mb-0">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-primary-600 fw-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;
