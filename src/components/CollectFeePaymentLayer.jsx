import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

import Toast from "../../src/components/ui/Toast";

import axios from "axios";

const CollectFeePaymentLayer = () => {
  const [formData, setFormData] = useState({});
  const [validationState, setValidationState] = useState({});
  const [imagepreview, setimagepreview] = useState([]);

  const handleInputChange = () => {};
  return (
    <div className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
      <form action="#">
        <div className="text-lg font-bold mt-3 mb-3">Student Detail</div>

        <div className="card ">
          <div className="card-body ">
            <div className="row  grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Admission */}
            
              {/* Roll No */}
              <div className="col-12">
                <label className="form-label">Roll Number</label>
                <input type="number" name="rollNo" className="form-control" />
              </div>
              {/* Class */}
              <div className="col-12">
                <label className="form-label">
                  Section <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                  value=""
                >
                  {/* Section Dropdown */}
                  <select name="section" className="form-control">
                    <option value="select" disabled>
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
              {/* Section */}
              <div className="col-12">
                <label className="form-label">
                  Section <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                  value=""
                >
                  {/* Section Dropdown */}
                  <select name="section" className="form-control">
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
                <input type="text" name="firstName" className="form-control" />
                {/* <div
                  className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                    !validationState.firstName
                      ? "opacity-100 translate-y-0"
                      : ""
                  }`}
                >
                  {!validationState.firstName && "*Full name is Invalid"}
                </div> */}
              </div>
              <div className="col-12">
                <label htmlFor="studentPhotograph" className="form-label">
                  Student Photograph
                </label>
                <div className="flex justify-between">
                  <input
                    id="studentPhotograph"
                    className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                    type="file"
                    name="studentPhotograph"
                    accept="image/*"
                  />
                </div>
              </div>
              {/* Last Name */}
              <div className="col-12">
                <label className="form-label">
                  Last Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input type="text" name="lastName" className="form-control" />
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CollectFeePaymentLayer;
