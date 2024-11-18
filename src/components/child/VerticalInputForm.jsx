import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "../Breadcrumb";

const VerticalInputForm = () => {
  // Parents Guradian Select Radio btn
  const [isVisible, setIsVisible] = useState(true);


  

  const handleRadioBtn = (e) => {
    const { name, value } = e.target;
    console.log(value);

    if (value === "guardian") {
      setIsVisible(true); // Set true when "Guardian" is selected
    } else if (value === "mother") {
      setIsVisible(false); // Set false for "Mother" or "Father"
    } else {
      setIsVisible(false);
    }
  };

  return (
    // Student Detail
    <div className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
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
                name="#0"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Roll No */}
            <div className="col-12">
              <label className="form-label">Roll Number</label>
              <input
                type="number"
                name="#0"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* className */}
            <div className="col-12">
              <label className="form-label">
                className <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <div
                className="form-control-wrapper"
                style={{ position: "relative" }}
              >
                <select
                  name="className"
                  className="form-control"
                  defaultValue=""
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
                <select name="section" className="form-control" defaultValue="">
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
                name="#0"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Last Name */}
            <div className="col-12">
              <label className="form-label">
                Last Name <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="#0"
                className="form-control"
                placeholder=""
              />
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
                <select name="gender" className="form-control" defaultValue="">
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
                  name="dob"
                  className="form-control date-picker"
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
                  className="form-control"
                  defaultValue=""
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
                name="#0"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Caste */}
            <div className="col-12">
              <label className="form-label">Caste</label>
              <input
                type="text"
                name="#0"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Mobile Number */}
            <div className="col-12">
              <label className="form-label">Mobile Number</label>
              <input
                type="number"
                name="#0"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Email */}
            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="#0"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Admission Date*/}
            <div className="col-12">
              <label className="form-label">Admission Date</label>
              <div className="date-picker-wrapper">
                <input
                  type="date"
                  name="admissionDate"
                  className="form-control date-picker"
                  placeholder=""
                  required
                />
              </div>
            </div>
            {/* Student Photo upload */}
            <div className="col-12">
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
            </div>
            {/* Blood Group */}
            <div className="col-12">
              <label className="form-label">Blood Group</label>
              <div
                className="form-control-wrapper"
                style={{ position: "relative" }}
              >
                <select
                  name="blood-group"
                  className="form-control"
                  defaultValue=""
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
                <select name="house" className="form-control" defaultValue="">
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
                  name="height"
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
      <div className="text-lg font-bold mt-3 mb-3">Parent Guardian Detail</div>

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
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Father Mobile Number */}
            <div className="col-12">
              <label className="form-label">Father Phone</label>
              <input
                type="number"
                name="fatherPhoneNumber"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Father Occupation */}
            <div className="col-12">
              <label htmlFor="fatherOccupation" className="form-label">
                Father Occupation <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="fatherOccupation"
                className="form-control"
                placeholder=""
              />
            </div>

            {/* Father Photo upload */}
            <div className="col-12">
              <label htmlFor="fatherImageUpload" className="form-label">
                Father Photo{" "}
              </label>
              <input
                id="fatherImageUpload"
                className="form-control"
                type="file"
                name="fatherImageUpload"
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
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Mother Mobile Number */}
            <div className="col-12">
              <label htmlFor="motherPhoneNumber" className="form-label">
                Mother Phone
              </label>
              <input
                type="number"
                name="motherPhoneNumber"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Mother Occupation */}
            <div className="col-12">
              <label htmlFor="motherOccupation" className="form-label">
                Mother Occupation <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="motherOccupation"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Mother Photo upload */}
            <div className="col-12">
              <label htmlFor="motherImageUpload" className="form-label">
                Mother Photo{" "}
              </label>
              <input
                id="motherImageUpload"
                className="form-control"
                type="file"
                name="motherImageUpload"
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
                name="guardianName"
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Guardian Relation */}
            <div className="col-12">
              <label className="form-label">Guardian Relation</label>
              <input
                type="text"
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
                className="form-control"
                placeholder=""
              />
            </div>
            {/* Guardian Occupation */}
            <div className="col-12">
              <label htmlFor="guardianOccupation" className="form-label">
                Guardian Occupation <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                id="guardianOccupation"
                type="text"
                name="guardianOccupation"
                className="form-control"
                placeholder=""
              />
            </div>

            {/* Guardian Photo upload */}
            <div className="col-12">
              <label htmlFor="guardianImageUpload" className="form-label">
                Guardian Photo{" "}
              </label>
              <input
                id="guardianImageUpload"
                className="form-control"
                type="file"
                name="guardianImageUpload"
                accept="image/*"
              />
            </div>
            {/* Guardian Email */}
            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="guardianEmail"
                className="form-control"
                placeholder=""
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
      <div className="text-lg font-bold mt-3 mb-3">Parent Guardian Address</div>

      <div className="card">
        <div className="card-body">
          <div className="row grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Street Address */}
            <div className="col-12">
              <label htmlFor="streetAddress" className="form-label">
                Street address
              </label>
              <input
                id="streetAddress"
                className="form-control"
                type="text"
                name="streetAddress"
                placeholder=""
              />
            </div>

            <div className="col-12">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                id="city"
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
                placeholder=""
              />
            </div>
            <div className="col-12">
              <label htmlFor="postcode" className="form-label">
                Postcode
              </label>
              <input
                id="postcode"
                className="form-control"
                type="number"
                name="postcode"
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
              <label htmlFor="aadharCard" className="form-label">
                Student Aadhaar Card
              </label>
              <input
                id="aadharCard"
                className="form-control"
                type="file"
                name="aadharCard"
                accept="image/*"
              />
            </div>

            <div className="col-12">
              <label htmlFor="photo" className="form-label">
                Student Photograph
              </label>
              <input
                id="photo"
                className="form-control"
                type="file"
                name="photo"
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-lg btn-sm text-white hover:bg-blue-700 px-14 py-12 rounded-md "
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default VerticalInputForm;
