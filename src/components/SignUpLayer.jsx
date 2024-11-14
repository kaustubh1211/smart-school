// import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SignUpLayer = () => {
  const [toggle, setToggle] = useState(true);

  const [fullName, setFullName] = useState("");
  const [isValid, setIsValid] = useState(true);

  // Function to validate full name
  const validateFullName = (name) => {
    const fullNamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;
    return fullNamePattern.test(name);
  };

  // Handle input change
  const handleChange = (e) => {
    const name = e.target.value;
    setFullName(name);

    // Update validity state based on regex match
    setIsValid(validateFullName(name));
  };

  // password eye toggle fn
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
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <img src="../../src/assets/Icons/user.svg" />
              </span>
              <input
                type="text"
                onChange={handleChange}
                className={`form-control h-56-px bg-neutral-50 radius-12 ${
                  isValid ? "" : "border-danger"
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
                className="form-control h-56-px bg-neutral-50 radius-12"
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
                className="form-control h-56-px bg-neutral-50 radius-12"
                placeholder="Email"
              />
            </div>
            {/* Password input */}
            <div className="mb-20">
              <div className="position-relative ">
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <img src="../../src/assets/Icons/lock.svg" />
                  </span>
                  <input
                    type={toggle ? "text" : "password"}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    id="your-password"
                    placeholder="Password"
                  />
                </div>
                <span
                  className={`toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${
                    !toggle ? "ri-eye-close-line" : "ri-eye-line"
                  }`}
                  data-toggle="#your-password"
                  onClick={togglePassword}
                />
                {/* <img
                    src={
                      toggle
                        ? "../../src/assets/Icons/eye.svg"
                        : "../../src/assets/Icons/eye-off.svg"
                    }
                  /> */}
              </div>
              <span className="mt-12 text-sm text-secondary-light">
                Your password must have at least 8 characters
              </span>
            </div>
            <div className="">
              <div className="d-flex justify-content-between gap-2">
                <div className="form-check style-check d-flex align-items-start">
                  <input
                    className="form-check-input border border-neutral-300 mt-4"
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
            <div className="mt-32 d-flex align-items-center gap-3">
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
            </div>
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
