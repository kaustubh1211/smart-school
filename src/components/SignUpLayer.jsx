// import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SignUpLayer = () => {
  const [toggle, setToggle] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

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
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 chars, must include at least 1 letter and 1 number
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

  // Password toggle function
  function togglePassword() {
    setToggle((toggle) => !toggle);
  }

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
            <div
              className={`w-full text-red-500 text-sm mt-2 opacity-0 transform translate-y-2 transition-opacity transition-transform duration-500 
          ${!isFullNameValid ? "opacity-100 translate-y-0" : ""}`}
            >
              {!isFullNameValid ? "*Full name is Invalid" : ""}
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
            {/* Password input */}
            <div className="mb-20">
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
              <span className="mt-12 text-sm text-secondary-light">
                Your password must have at least 8 characters
              </span>
            </div>
            <div className="">
              <div className="d-flex justify-content-between gap-2">
                <div className="form-check style-check d-flex align-items-start">
                  <input
                    className="form-check-input border border-neutral-300 mt-1"
                    type="checkbox"
                    defaultValue=""
                    id="condition"
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
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
            >
              {" "}
              Sign Up
            </button>
            <div className="mt-32 center-border-horizontal text-center">
              <span className="bg-base z-1 px-4">Or sign up with</span>
            </div>
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
