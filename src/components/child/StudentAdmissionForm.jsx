import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import Toast from "../ui/Toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentAdmissionForm = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [allFieldsValid, setAllFieldsValid] = useState(true);

  const [fetchClass, setFetchClass] = useState([]);

  // image preview
  const [imagePreview, setImagePreview] = useState({});

  const initialFormState = {
    grNo: "",
    rollNo: "",
    class: "",
    division: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
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
    address: "",
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
  };

  // all state variabe ofr input fields
  const [formData, setFormData] = useState(initialFormState);

  // Initialize validation state with `false` for all fields
  const [validationState, setValidationState] = useState({
    grNo: true, // Admission number (could just check if non-empty)
    rollNo: true, // Roll number (could just check if non-empty)
    class: true, // Class (could be a non-empty string)
    division: true, // division (could be a non-empty string)
    firstName: true, // Validates first name (string, only alphabets)
    lastName: true, // Validates last name (string, only alphabets)
    gender: true, // Gender (could just check if selected)
    dob: true, // Date of birth (could check if valid date)
    category: true, // Category (could just check if non-empty)
    religion: true, // Religion (string, only alphabets)
    caste: true, // Caste (string, only alphabets)
    admissionDate: true, // Admission date (valid date)
    bloodGroup: true, // Blood group (valid group e.g., A+, O-)
    house: true, // House (could check if non-empty)
    height: true, // Height (could be numeric)
    weight: true, // Weight (could be numeric)
    fatherName: true, // Father’s name (string, only alphabets)
    fatherPhone: true, // Father’s phone (valid phone number)
    fatherOccupation: true, // Father’s occupation (string, only alphabets)
    fatherPhoto: true, // Father’s photo (check if file is selected)
    fatherEmail: true, // Father’s email (valid email)
    motherName: true, // Mother’s name (string, only alphabets)
    motherPhone: true, // Mother’s phone (valid phone number)
    motherOccupation: true, // Mother’s occupation (string, only alphabets)
    motherPhoto: true, // Mother’s photo (check if file is selected)
    motherEmail: true, // Mother’s email (valid email)
    address: true, // Street address (could check if non-empty)
    city: true, // City (could check if non-empty)
    state: true, // State (could check if non-empty)
    postCode: true, // Postcode (valid postal code)
    studentAadharCard: true, // Aadhar card (could check if valid or not)
    studentPhotograph: true, // Student photograph (check if file is selected)
    guardianName: true, // Guardian’s name (string, only alphabets)
    guardianEmail: true, // Guardian’s email (valid email)
    guardianOccupation: true, // Guardian’s occupation (string, only alphabets)
    guardianPhone: true, // Guardian’s phone (valid phone number)
    guardianRelation: true, // Guardian’s relation (string, only alphabets)
    guardianPhoto: true, // Guardian’s photo (check if file is selected)
  });

  const validateField = (name, value) => {
    let isValid = false;

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

      // Fields that should just be checked for non-empty value

      case "grNo":
      case "rollNo":
      case "class":
      case "division":
      case "height":
      case "weight":
      case "postCode":
      case "bloodGroup":
      case "dob":
      case "admissionDate":
        isValid = value.trim() !== ""; // Check if value is not empty (ignores spaces)
        break;

      // Photo fields (check if image is present or not)
      // case "fatherPhoto":
      // case "motherPhoto":
      // case "studentPhotograph":
      // case "studentAadharCard":
      // case "guardianPhoto":
      //   // Check if the file field has a file object (not null or empty)
      //   isValid = value !== null && value !== "";
      //   break;

      default:
        isValid = true; // Default case for fields without specific validation
        break;
    }

    return isValid;
  };

  // onchange
  // const handleInputChange = (event) => {
  //   const { name, value, type, files } = event.target;

  //   // Handle file input separately
  //   if (type === "file" && files.length > 0) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: files[files.length - 1], // Get only the latest file
  //     }));
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value, // For other input types
  //     }));
  //   }

  //   // Validate the individual field after change
  //   const isInputValid = validateField(name, value);

  //   // Update validation state for the field
  //   setValidationState((prevState) => ({
  //     ...prevState,
  //     [name]: isInputValid,
  //   }));
  // };
  useEffect(() => {
    try {
      const fetchClassList = async () => {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }class/list?medium=${tenant}&year=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.data) {
          // const classList = response.data.data;
          setFetchClass(response.data.data);
        }
      };
      fetchClassList();
    } catch (error) {}
  }, [tenant, academicYear]);

  // Group data by category
  const groupedData = fetchClass.reduce((acc, curr) => {
    const { category, class: className } = curr;
    if (!acc[category]) acc[category] = [];
    acc[category].push(className);
    return acc;
  }, {});

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file" && files.length > 0) {
      const selectedFile = files[0]; // Get the selected file

      // Store the file in state
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
      }));

      // Generate file preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview((prevPreviews) => ({
          ...prevPreviews,
          [name]: reader.result, // Map the preview to the specific input name
        }));
      };
      reader.readAsDataURL(selectedFile); // Convert file to Base64 URL
    } else {
      // Handle other input types
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      // Validate the field after change
      const isInputValid = validateField(name, value);
      setValidationState((prevState) => ({
        ...prevState,
        [name]: isInputValid,
      }));
    }
  };

  // guardian, mother, father toggle
  const handleRadioBtn = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      guardianRelation: value,
    }));

    if (value === "guardian") {
      setIsVisible(true);
    } else if (value === "mother") {
      setIsVisible(false);
    } else {
      setIsVisible(false);
    }
  };

  // const allFieldsValid = Object.values(validationState).every(
  //   (allValid) => allValid
  // );
  // console.log(allFieldsValid);

  useEffect(() => {
    // Calculate allFieldsValid whenever validationState changes
    const isValid = Object.values(validationState).every((valid) => valid);
    setAllFieldsValid(isValid); // Set the result to the state
    // console.log("Validation State: ", validationState);
    // console.log("All Fields Valid: ", isValid);
  }, [validationState]); // Only run when validationState changes

  // onsubmit button
  // const handleButtonClick = async (event) => {
  //   event.preventDefault();

  //   if (allFieldsValid) {
  //     try {
  //       // Create a copy of formData, cleaning up empty fields
  //       const payload = Object.entries(formData).reduce((acc, [key, value]) => {
  //         // Include only fields that are not empty strings, null, or undefined
  //         if (value !== "" && value !== null && value !== undefined) {
  //           acc[key] = value;
  //         } else {
  //           acc[key] = null; // Optional: Replace empty values with `null` if needed
  //         }
  //         return acc;
  //       }, {});

  //       const response = await axios.post(
  //         "${import.meta.env.VITE_LOCAL_API_URL}admin/add-student",
  //         payload
  //       );
  //       Toast.showSuccessToast("Registration done successfully!");
  //     } catch (error) {
  //       // console.error("Error submitting form:", error);
  //       if (error.response) {
  //         // Server responded with an error
  //         // console.log("Server error:", error.response.data.message);
  //         Toast.showWarningToast(`${error.response.data.message}`);
  //       } else if (error.request) {
  //         // No response received from the server
  //         // console.log("No response received:", error.request);
  //         Toast.showErrorToast("Sorry our server is down");
  //       } else {
  //         // Other errors (e.g., network error, etc.)
  //         // console.log("Sorry try after some time");
  //         Toast.showErrorToast("Sorry try after some time");
  //       }
  //     }
  //   }
  // };

  // const handleButtonClick = async (event) => {
  //   event.preventDefault();

  //   // Validate fields before submission
  //   if (allFieldsValid) {
  //     setIsLoading(true);
  //     try {
  //       // Create a new FormData object for file and text data
  //       const formDataToSend = new FormData();

  //       // Loop through all form data and append them to FormData object
  //       Object.entries(formData).forEach(([key, value]) => {
  //         if (value !== "" && value !== null && value !== undefined) {
  //           // Check if the value is a file (for file inputs like images)
  //           if (value instanceof File) {
  //             formDataToSend.append(key, value, value.name); // Append file with its name
  //           } else {
  //             formDataToSend.append(key, value); // Append other fields as text
  //           }
  //         }
  //       });

  //       const response = await axios.post(
  //         `${
  //           import.meta.env.VITE_LOCAL_API_URL
  //         }admin/add-student?medium=${tenant}&year=${academicYear}`,
  //         formDataToSend,

  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data", // Important for file uploads
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         }
  //       );
  //       Toast.showSuccessToast("Student created successfully!");
  //       const id = response.data.data.id;

  //       // setTimeout(() => {
  //       //   navigate(`/student/form/print/${id}`);
  //       // }, 1000);

  //       // console.log(response.data.data);
  //       // console.log(response.data.message);

  //       // Reset the form after submission if needed
  //       // setFormData(initialFormState);
  //     } catch (error) {
  //       // Handle errors
  //       if (error.response) {
  //         Toast.showWarningToast(`${error.response.data.message}`);
  //         console.error(error.response.data.message);
  //       } else if (error.request) {
  //         Toast.showErrorToast("Sorry, our server is down.");
  //       } else {
  //         Toast.showErrorToast("Sorry, please try again later.");
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     Toast.showWarningToast("Please fill in all required fields.");
  //   }
  // };

  const handleButtonClick = async (event) => {
    event.preventDefault();

    // Validate fields before submission
    if (allFieldsValid) {
      setIsLoading(true);
      try {
        // Create a new FormData object for file and text data
        const formDataToSend = new FormData();

        // Loop through all form data and append them to FormData object
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            // Check if the value is a file (for file inputs like images)
            if (value instanceof File) {
              formDataToSend.append(key, value, value.name); // Append file with its name
            } else {
              formDataToSend.append(key, value); // Append other fields as text
            }
          }
        });

        // Make the request without manually including the Authorization header
        const response = await axios.post(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }admin/add-student?medium=${tenant}&year=${academicYear}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          }
        );

        Toast.showSuccessToast("Student created successfully!");
        const id = response.data.data.id;

        // Example: Navigate to another page after success
        // setTimeout(() => {
        //   navigate(`/student/form/print/${id}`);
        // }, 1000);
      } catch (error) {
        // Handle errors
        if (error.response) {
          Toast.showWarningToast(`${error.response.data.message}`);
          console.error(error.response.data.message);
        } else if (error.request) {
          Toast.showErrorToast("Sorry, our server is down.");
        } else {
          Toast.showErrorToast("Sorry, please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      Toast.showWarningToast("Please fill in all required fields.");
    }
  };

  // console.log(validationState);
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
              {/* grNo */}
              <div className="col-12">
                <label className="form-label">
                  Gr No. <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="number"
                  name="grNo"
                  value={formData.grNo}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
                  className="form-control"
                  placeholder=""
                />
              </div>
              {/* Roll No */}
              <div className="col-12">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  onWheel={(e) => e.target.blur()}
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
                    {Object.keys(groupedData).map((category) => (
                      <optgroup label={category} key={category}>
                        {groupedData[category].map((className) => (
                          <option value={className} key={className}>
                            {className}
                          </option>
                        ))}
                      </optgroup>
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
              {/* division */}
              <div className="col-12">
                <label className="form-label">
                  Division <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  {/* division Dropdown */}
                  <select
                    name="division"
                    className="form-control"
                    onChange={handleInputChange}
                    value={formData.division}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
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
                  className={`form-control  radius-12 ${
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
                  className={`form-control  radius-12 ${
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
                    name="dob"
                    value={formData.dob}
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
                  className={`form-control radius-12 ${
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
                  className={`form-control radius-12 ${
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
                    onWheel={(e) => e.target.blur()}
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
                    onWheel={(e) => e.target.blur()}
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

        <div className="card pb-12">
          {/* Parents all Detail */}
          <div className="card-body">
            {/* <div className="text-md text-slate-900 font-bold">
              Father Details
            </div> */}
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
                  className={`form-control  radius-12 ${
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
                  onWheel={(e) => e.target.blur()}
                  value={formData.fatherPhone}
                  className={`form-control  radius-12 ${
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
                  className={`form-control radius-12 ${
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
                <div className="flex justify-between">
                  <input
                    id="fatherPhoto"
                    className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                    onChange={handleInputChange}
                    // value={formData.fatherPhoto}
                    type="file"
                    name="fatherPhoto"
                    accept="image/*"
                  />
                  {/* Image Preview */}
                  {imagePreview.fatherPhoto && (
                    <div className="pl-2">
                      <img
                        src={imagePreview.fatherPhoto}
                        alt="Preview"
                        className="w-20 h-16 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* mother detail */}
          <div className="card-body mt-4">
            {/* <div>Father Details</div> */}
            <div className="row grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  className={`form-control  radius-12 ${
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
                  onWheel={(e) => e.target.blur()}
                  value={formData.motherPhone}
                  className={`form-control radius-12 ${
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
                  className={`form-control radius-12 ${
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
                <div className="flex justify-between">
                  <input
                    id="motherPhoto"
                    className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                    onChange={handleInputChange}
                    // value={formData.motherPhoto}
                    type="file"
                    name="motherPhoto"
                    accept="image/*"
                  />
                  {/* Image Preview */}
                  {imagePreview.motherPhoto && (
                    <div className="pl-2">
                      <img
                        src={imagePreview.motherPhoto}
                        alt="Preview"
                        className="w-20 h-16 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Guardian all Detail */}
          <div className="flex items-center gap-4 ml-6 mt-4 mb-12 flex-wrap">
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
                checked={formData.guardianRelation === "mother"}
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
                checked={formData.guardianRelation === "father"}
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
                checked={formData.guardianRelation === "guardian"}
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
                <div className="flex justify-between">
                  <input
                    id="guardianPhoto"
                    className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                    type="file"
                    name="guardianPhoto"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  {/* Image Preview */}
                  {imagePreview.guardianPhoto && (
                    <div className="pl-2">
                      <img
                        src={imagePreview.guardianPhoto}
                        alt="Preview"
                        className="w-20 h-16 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
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
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  id="address"
                  className="form-control"
                  type="text"
                  name="address"
                  value={formData.address}
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
                <label htmlFor="postCode" className="form-label">
                  Postcode
                </label>
                <input
                  id="postCode"
                  className="form-control"
                  type="number"
                  name="postCode"
                  onWheel={(e) => e.target.blur()}
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
                  Student Aadhaar
                </label>
                <div className="flex justify-between">
                  <input
                    id="studentAadharCard"
                    className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                    type="file"
                    name="studentAadharCard"
                    // value={formData.studentAadharCard}
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  {/* Image Preview */}
                  {imagePreview.studentAadharCard && (
                    <div className="pl-2">
                      <img
                        src={imagePreview.studentAadharCard}
                        alt="Preview"
                        className="w-20 h-16 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
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
                    // value={formData.studentPhotograph}
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  {/* Image Preview */}
                  {imagePreview.studentPhotograph && (
                    <div className="pl-2">
                      <img
                        src={imagePreview.studentPhotograph}
                        alt="Preview"
                        className="w-20 h-16 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-4 flex justify-end">
          <button
            type="submit"
            onClick={handleButtonClick}
            disabled={!allFieldsValid}
            className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 "
          >
            Submit
          </button>
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
              <div className="loader"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentAdmissionForm;
