import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "../Breadcrumb";
import Toast from "../../../src/components/ui/Toast";

import axios from "axios";

const VerticalInputForm = () => {
  // Parents Guradian Select Radio btn
  const [isVisible, setIsVisible] = useState(true);

  // is form valid
  const [isFormValid, setIsFormValid] = useState(true);

  const validateForm = () => {
    const allFieldsValid = Object.values(validationState).every(
      (isValid) => isValid
    );
    setIsFormValid(allFieldsValid);
  };

  // all state variabe ofr input fields
  const [formData, setFormData] = React.useState({
    admissionNo: "",
    rollNo: "",
    class: "",
    section: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    category: "",
    religion: "",
    caste: "",
    admissionDate: "",
    bloodGroup: "",
    house: "",
    height: "",
    weight: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    fatherPhoto: null,
    fatherEmail: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    motherPhoto: null,
    motherEmail: "",
    streetAddress: "",
    city: "",
    state: "",
    postCode: "",
    studentAadharCard: null,
    studentPhotograph: null,
    guardianName: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianPhone: "",
    guardianRelation: "",
    guardianPhoto: "",
  });

  // input validation
  const [validationState, setValidationState] = useState({
    fatherEmail: true,
    motherEmail: true,
    firstName: true,
    lastName: true,
    religion: true,
    caste: true,
    fatherName: true,
    motherName: true,
    fatherPhone: true,
    motherPhone: true,
    fatherOccupation: true,
    motherOccupation: true,
    guardianName: true,
    guardianRelation: true,
    guardianPhone: true,
    guardianOccupation: true,
    guardianEmail: true,
  });

  const validateField = (name, value) => {
    let isValid = true;

    switch (name) {
      case "fatherEmail":
      case "motherEmail":
      case "guardianEmail":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailPattern.test(value);
        break;

      case "firstName":
      case "lastName":
      case "fatherName":
      case "motherName":
      case "guardianName":
      case "guardianRelation":
        const fullNamePattern = /^[A-Za-z\s]+$/;
        isValid = fullNamePattern.test(value);
        break;

      case "motherPhone":
      case "fatherPhone":
      case "guardianPhone":
        const phonePattern = /^[6-9][0-9]{9}$/;
        isValid = phonePattern.test(value);
        break;

      case "religion":
      case "caste":
        const ReligionCastePattern = /^[A-Za-z\s]+$/;
        isValid = ReligionCastePattern.test(value);
        break;

      case "fatherOccupation":
      case "motherOccupation":
      case "guardianOccupation":
        const occupationPattern = /^[A-Za-z\s]+$/;
        isValid = occupationPattern.test(value);
        break;

      default:
        break;
    }

    return isValid;
  };

  // Email validation
  // const validateEmail = (email) => {
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailPattern.test(email);
  // };

  // onclick handleInputChange button
  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));

    // Validate field
    const isValid = validateField(name, value);

    // Update validation state
    setValidationState((prevState) => ({
      ...prevState,
      [name]: isValid,
    }));

    validateForm();
  };

  const handleRadioBtn = (e) => {
    const { name, value, type, files } = e.target;
    // console.log(value);

    if (value === "guardian") {
      setIsVisible(true); // Set true when "Guardian" is selected
    } else if (value === "mother") {
      setIsVisible(false); // Set false for "Mother" or "Father"
    } else {
      setIsVisible(false);
    }
  };

  const handleButtonClick = async (event) => {
    event.preventDefault();

    if (isFormValid) {
      try {
        // Create a copy of formData, cleaning up empty fields
        const payload = Object.entries(formData).reduce((acc, [key, value]) => {
          // Include only fields that are not empty strings, null, or undefined
          if (value !== "" && value !== null && value !== undefined) {
            acc[key] = value;
          } else {
            acc[key] = null; // Optional: Replace empty values with `null` if needed
          }
          return acc;
        }, {});

        const response = await axios.post("", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Toast.showSuccessToast("Registration done successfully!");
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
    // Student Detail
    <div className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
      <form action="#">
        <div className="text-lg font-bold mt-3 mb-3">Student Detail</div>

        <div className="card ">
          {/* <div className="card-header">
            <h5 className="card-title mb-0">Vertical Input Form</h5>
          </div> */}

          <div className="card-body ">
            <div className="row  grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Admission */}
              <div className="col-12">
                <label className="form-label">
                  Admission No <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="number"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* Roll No */}
              <div className="col-12">
                <label className="form-label">Roll Number</label>
                <input
                  type="number"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* class */}
              <div className="col-12">
                <label className="form-label">
                  Class <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="class"
                    className="form-control"
                    onChange={handleInputChange}
                    value={formData.class}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {Array.from({ length: 10 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        className {index + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="dropdown-icon"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px", // Adjust this value for proper spacing
                      top: "50%",
                      transform: "translateY(-50%)", // Vertically center the icon
                      pointerEvents: "none", // Ensures the icon doesn't block interaction with the select
                    }}
                  />
                </div>
              </div>
              {/* Section */}
              <div className="col-12">
                <label className="form-label">
                  Section <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  {/* Section Dropdown */}
                  <select
                    name="section"
                    className="form-control"
                    onChange={handleInputChange}
                    value={formData.section}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>

                  {/* ChevronDown Icon */}
                  <ChevronDown
                    className="dropdown-icon"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px", // Adjust this value for proper spacing
                      top: "50%",
                      transform: "translateY(-50%)", // Vertically center the icon
                      pointerEvents: "none", // Ensures the icon doesn't block interaction with the select
                    }}
                  />
                </div>
              </div>
              {/* First Name */}
              <div className="col-12">
                <label className="form-label">
                  First Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.firstName ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.firstName
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.firstName && "*Full name is Invalid"}
                </div>
              </div>
              {/* Last Name */}
              <div className="col-12">
                <label className="form-label">
                  Last Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.lastName ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.lastName ? "opacity-100 translate-y-0" : ""
                  }`}
                >
                  {!validationState.lastName && "*Full name is Invalid"}
                </div>
              </div>
              {/* Gender */}
              <div className="col-12">
                <label className="form-label">
                  Gender <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="gender"
                    className="form-control"
                    onChange={handleInputChange}
                    value={formData.gender}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown
                    className="dropdown-icon"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px", // Adjust this value for proper spacing
                      top: "50%",
                      transform: "translateY(-50%)", // Vertically center the icon
                      pointerEvents: "none", // Ensures the icon doesn't block interaction
                    }}
                  />
                </div>
              </div>
              {/* Date of Birth */}
              <div className="col-12">
                <label className="form-label">
                  Date of Birth <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div className="date-picker-wrapper">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    className="form-control date-picker"
                    onChange={handleInputChange}
                    placeholder=""
                    required
                  />
                </div>
              </div>
              {/* Category */}
              <div className="col-12">
                <label className="form-label">
                  Category <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="category"
                    onChange={handleInputChange}
                    value={formData.category}
                    className="form-control"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="Special">Special</option>
                    <option value="PWD">Physically Challenge</option>
                  </select>
                  <ChevronDown
                    className="dropdown-icon"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px", // Adjust this value for proper spacing
                      top: "50%",
                      transform: "translateY(-50%)", // Vertically center the icon
                      pointerEvents: "none", // Ensures the icon doesn't block interaction
                    }}
                  />
                </div>
              </div>
              {/* Religion */}
              <div className="col-12">
                <label className="form-label">Religion</label>
                <input
                  type="text"
                  name="religion"
                  onChange={handleInputChange}
                  value={formData.religion}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.religion ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.religion ? "opacity-100 translate-y-0" : ""
                  }`}
                >
                  {!validationState.religion && "*Invalid Religion"}
                </div>
              </div>
              {/* Caste */}
              <div className="col-12">
                <label className="form-label">Caste</label>
                <input
                  type="text"
                  name="caste"
                  onChange={handleInputChange}
                  value={formData.caste}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.caste ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.caste ? "opacity-100 translate-y-0" : ""
                  }`}
                >
                  {!validationState.caste && "*Invalid Caste"}
                </div>
              </div>
              {/* Mobile Number */}
              {/* <div className="col-12">
                <label className="form-label">Mobile Number</label>
                <input
                  type="number"
                  name="#0"
                  className="form-control"
                  placeholder=""
                />
              </div> */}

              {/* Admission Date*/}
              <div className="col-12">
                <label className="form-label">Admission Date</label>
                <div className="date-picker-wrapper">
                  <input
                    type="date"
                    name="admissionDate"
                    className="form-control date-picker"
                    onChange={handleInputChange}
                    value={formData.admissionDate}
                    placeholder=""
                    required
                  />
                </div>
              </div>
              {/* Student Photo upload */}
              {/* <div className="col-12">
                <label htmlFor="imageUpload" className="form-label">
                  Medium Size File Input{" "}
                </label>
                <input
                  id="imageUpload"
                  className="form-control"
                  type="file"
                  name="imageUpload"
                  accept="image/*"
                />
              </div> */}
              {/* Blood Group */}
              <div className="col-12">
                <label className="form-label">Blood Group</label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="bloodGroup"
                    className="form-control"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <ChevronDown
                    className="dropdown-icon"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px" /* Adjust this value for proper spacing */,
                      top: "50%",
                      transform:
                        "translateY(-50%)" /* Vertically center the icon */,
                      pointerEvents:
                        "none" /* Ensures the icon doesn't block interaction */,
                    }}
                  />
                </div>
              </div>
              {/* House */}
              <div className="col-12">
                <label className="form-label">House</label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="house"
                    className="form-control"
                    onChange={handleInputChange}
                    value={formData.house}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                  </select>
                  <ChevronDown
                    className="dropdown-icon"
                    size={20}
                    style={{
                      position: "absolute",
                      right: "10px" /* Adjust this value for proper spacing */,
                      top: "50%",
                      transform:
                        "translateY(-50%)" /* Vertically center the icon */,
                      pointerEvents:
                        "none" /* Ensures the icon doesn't block interaction */,
                    }}
                  />
                </div>
              </div>

              {/* Height */}
              <div className="col-12">
                <label className="form-label">Height [cm]</label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <input
                    type="number"
                    name="height"
                    onChange={handleInputChange}
                    value={formData.height}
                    className="form-control"
                    placeholder=""
                    min="1"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              {/* Weight */}
              <div className="col-12">
                <label className="form-label">Weight [kg]</label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <input
                    type="number"
                    name="weight"
                    onChange={handleInputChange}
                    value={formData.weight}
                    className="form-control"
                    placeholder=""
                    min="1"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Detail */}
        <div className="text-lg font-bold mt-3 mb-3">
          Parent Guardian Detail
        </div>

        <div className="card">
          {/* Parents all Detail */}
          <div className="card-body">
            <div className="row grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Father Name */}
              <div className="col-12">
                <label className="form-label">
                  Father Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  onChange={handleInputChange}
                  value={formData.fatherName}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.fatherName ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.fatherName
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.fatherName && "*Name is Invalid"}
                </div>
              </div>
              {/* Father Mobile Number */}
              <div className="col-12">
                <label htmlFor="fatherPhone" className="form-label">
                  Father Phone
                </label>
                <input
                  type="number"
                  name="fatherPhone"
                  onChange={handleInputChange}
                  value={formData.fatherPhone}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.fatherPhone ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.fatherPhone
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.fatherPhone && "*Phone no is Invalid"}
                </div>
              </div>
              {/* Father Occupation */}
              <div className="col-12">
                <label htmlFor="fatherOccupation" className="form-label">
                  Father Occupation <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="fatherOccupation"
                  onChange={handleInputChange}
                  value={formData.fatherOccupation}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.fatherOccupation ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.fatherOccupation
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.fatherOccupation && "*Invalid Occupation"}
                </div>
              </div>
              {/* Father Email */}
              <div className="col-12">
                <label htmlFor="fatherEmail" className="form-label">
                  Father Email
                </label>
                <input
                  type="email"
                  name="fatherEmail"
                  onChange={handleInputChange}
                  value={formData.fatherEmail}
                  className={`form-control ${
                    !validationState.fatherEmail ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.fatherEmail
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.fatherEmail && "*Email is Invalid"}
                </div>
              </div>

              {/* Father Photo upload */}
              <div className="col-12">
                <label htmlFor="fatherPhoto" className="form-label">
                  Father Photo{" "}
                </label>
                <input
                  id="fatherPhoto"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.fatherPhoto}
                  type="file"
                  name="fatherPhoto"
                  accept="image/*"
                />
              </div>
              {/* Mother Name */}
              <div className="col-12">
                <label htmlFor="motherName" className="form-label">
                  Mother Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  onChange={handleInputChange}
                  value={formData.motherName}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.motherName ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.motherName
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.motherName && "*Full name is Invalid"}
                </div>
              </div>
              {/* Mother Mobile Number */}
              <div className="col-12">
                <label htmlFor="motherPhone" className="form-label">
                  Mother Phone
                </label>
                <input
                  type="number"
                  name="motherPhone"
                  onChange={handleInputChange}
                  value={formData.motherPhone}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.motherPhone ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.motherPhone
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.motherPhone && "*Phone no is Invalid"}
                </div>
              </div>
              {/* Mother Occupation */}
              <div className="col-12">
                <label htmlFor="motherOccupation" className="form-label">
                  Mother Occupation <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  className={`form-control h-56-px bg-neutral-50 radius-12 ${
                    !validationState.motherOccupation ? "border-danger" : ""
                  }`}
                  placeholder=""
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.motherOccupation
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.motherOccupation && "*Full name is Invalid"}
                </div>
              </div>
              {/* Mother Email */}
              <div className="col-12">
                <label htmlFor="motherEmail" className="form-label">
                  Mother Email
                </label>
                <input
                  type="email"
                  name="motherEmail"
                  onChange={handleInputChange}
                  value={formData.motherEmail}
                  className={`form-control ${
                    !validationState.motherEmail ? "border-danger" : ""
                  }`}
                  placeholder=""
                  required
                />
                <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.motherEmail
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.motherEmail && "*Email is Invalid"}
                </div>
              </div>
              {/* Mother Photo upload */}
              <div className="col-12">
                <label htmlFor="motherPhoto" className="form-label">
                  Mother Photo{" "}
                </label>
                <input
                  id="motherPhoto"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.motherPhoto}
                  type="file"
                  name="motherPhoto"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
          {/* Guardian all Detail */}
          <div className="flex items-center space-x-4 ml-6 mt-3">
            <label className="mr-2 mb-2  font-medium text-gray-600 ">
              If guardian is <span style={{ color: "#ff0000" }}>*</span>
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="mother"
                name="guardian"
                value="mother"
                onChange={handleRadioBtn}
                className="form-radio custom-radio"
              />
              <label htmlFor="mother">Mother</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="father"
                name="guardian"
                value="father"
                onChange={handleRadioBtn}
                className="form-radio custom-radio"
              />
              <label htmlFor="father">Father</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="guardian"
                name="guardian"
                value="guardian"
                onChange={handleRadioBtn}
                className="form-radio custom-radio"
              />
              <label htmlFor="guardian">Guardian</label>
            </div>
          </div>

          <div
            className={`${
              isVisible ? "card-body opacity-100" : "hidden opacity-0"
            } transition-opacity duration-300 ease-in-out`}
          >
            <div className="row grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Guardian first Name */}
              <div className="col-12">
                <label className="form-label">
                  Guardian Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  name="guardianName"
                  className="form-control"
                  placeholder=""
                  onChange={handleInputChange}
                />
              </div>
              {/* Guardian Relation */}
              <div className="col-12">
                <label className="form-label">Guardian Relation</label>
                <input
                  type="text"
                  value={formData.guardianRelation}
                  onChange={handleInputChange}
                  name="guardianRelation"
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* Guardian Mobile Number */}
              <div className="col-12">
                <label className="form-label">
                  Guardian Phone <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="number"
                  name="guardianPhone"
                  onChange={handleInputChange}
                  value={formData.guardianPhone}
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* Guardian Occupation */}
              <div className="col-12">
                <label htmlFor="guardianOccupation" className="form-label">
                  Guardian Occupation{" "}
                  <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  id="guardianOccupation"
                  type="text"
                  name="guardianOccupation"
                  value={formData.guardianOccupation}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder=""
                />
              </div>

              {/* Guardian Photo upload */}
              <div className="col-12">
                <label htmlFor="guardianPhoto" className="form-label">
                  Guardian Photo{" "}
                </label>
                <input
                  id="guardianPhoto"
                  className="form-control"
                  type="file"
                  name="guardianPhoto"
                  accept="image/*"
                />
              </div>
              {/* Guardian Email */}
              <div className="col-12">
                <label className="form-label">Guardian Email</label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder=""
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center space-x-4 ml-6 mt-3">
          <label className="mr-2 mb-2  font-medium text-gray-600 ">
            Parents/Guardian Address <span style={{ color: "#ff0000" }}>*</span>
          </label>
        </div> */}
        {/* Parents/Guardian Address */}
        <div className="text-lg font-bold mt-3 mb-3">
          Parent Guardian Address
        </div>

        <div className="card">
          <div className="card-body">
            <div className="row grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Street Address */}
              <div className="col-12">
                <label htmlFor="streetAddress" className="form-label">
                  Address
                </label>
                <input
                  id="streetAddress"
                  className="form-control"
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder=""
                />
              </div>

              <div className="col-12">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-control"
                  type="text"
                  name="city"
                  placeholder=""
                />
              </div>
              <div className="col-12">
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <input
                  id="state"
                  className="form-control"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder=""
                />
              </div>
              <div className="col-12">
                <label htmlFor="axioscode" className="form-label">
                  Postcode
                </label>
                <input
                  id="postcode"
                  className="form-control"
                  type="number"
                  name="postcode"
                  value={formData.postCode}
                  onChange={handleInputChange}
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* Student Document*/}
        <div className="text-lg font-bold mt-3 mb-3">Upload Document</div>

        <div className="card">
          <div className="card-body">
            <div className="row grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="col-12">
                <label htmlFor="studentAadharCard" className="form-label">
                  Student Aadhaar Card
                </label>
                <input
                  id="studentAadharCard"
                  className="form-control"
                  type="file"
                  name="studentAadharCard"
                  value={formData.studentAadharCard}
                  onClick={handleInputChange}
                  accept="image/*"
                />
              </div>

              <div className="col-12">
                <label htmlFor="studentPhotograph" className="form-label">
                  Student Photograph
                </label>
                <input
                  id="studentPhotograph"
                  className="form-control"
                  type="file"
                  name="studentPhotograph"
                  value={formData.studentPhotograph}
                  onClick={handleInputChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-4 flex justify-end">
          <button
            type="submit"
            onClick={handleButtonClick}
            disabled={!isFormValid}
            className="bg-blue-600 text-lg btn-sm text-white hover:bg-blue-700 px-14 py-12 rounded-md "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerticalInputForm;
