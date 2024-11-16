import React from "react";
import { ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VerticalInputForm = () => {
  return (
    <div className="col-md-6">
      <div className="card">
        {/* <div className="card-header">
          <h5 className="card-title mb-0">Vertical Input Form</h5>
        </div> */}
        <div className="card-body">
          <div className="row gy-3">
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
            {/* Class */}
            <div className="col-12">
              <label className="form-label">
                Class <span style={{ color: "#ff0000" }}>*</span>
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
                      Class {index + 1}
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
                placeholder="Enter Email"
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
            <div class="col-12">
              <label class="form-label">Height [cm]</label>
              <div
                class="form-control-wrapper"
                style={{ position: "relative" }}
              >
                <input
                  type="number"
                  name="height"
                  class="form-control"
                  placeholder=""
                  min="1"
                  max="300"
                  step="0.1"
                  required
                />
              </div>
            </div>
            {/* Weight */}
            <div class="col-12">
              <label class="form-label">Weight [kg]</label>
              <div
                class="form-control-wrapper"
                style={{ position: "relative" }}
              >
                <input
                  type="number"
                  name="height"
                  class="form-control"
                  placeholder=""
                  min="1"
                  max="300"
                  step="0.1"
                  required
                />
              </div>
            </div>

            {/* <div className="col-12">
              <label className="form-label">Phone</label>
              <div className="form-mobile-field">
                <select className="form-select" defaultValue="US">
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                  <option value="BD">BD</option>
                  <option value="EU">EU</option>
                </select>
                <input
                  type="text"
                  name="#0"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalInputForm;

{
  /* <div className="col-12">
  <button type="submit" className="btn btn-primary-600">
    Submit
  </button>
</div>; */
}
