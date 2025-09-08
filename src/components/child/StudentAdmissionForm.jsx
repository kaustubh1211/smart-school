import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FormInput ,FormSelect } from "./InputComponent";



const StudentAdmissionForm = () => {
  const tenant = useSelector((state) => state.branch.tenant);
const academicYear = useSelector((state) => state.branch.academicYear);
const accessToken = localStorage.getItem("accessToken");

const [isLoading, setIsLoading] = useState(false);
const [isVisible, setIsVisible] = useState(true);
const [allFieldsValid, setAllFieldsValid] = useState(false); // ⬅️ default false
const [fetchClass, setFetchClass] = useState([]);

// Image preview state
const [imagePreview, setImagePreview] = useState({});

useEffect(() => {
  const fetchClassList = async () => {
    try {
      const response = await axios.get(
        // `${import.meta.env.VITE_SERVER_API_URL}class/list?medium=SCHOOL-ENG&year=2024-2025`,
        `${import.meta.env.VITE_SERVER_API_URL}class/list?medium=${tenant}&year=${academicYear}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.data) {
        setFetchClass(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching class data", error);
    }
  };
  fetchClassList();
}, [tenant, academicYear, accessToken]);

const initialFormState = {
  // Basic Student Info
  grNo: "",
  rollNo: "",
  classId: "", // required
  division: "",
  firstName: "", // required
  middleName: "",
  lastName: "",
  gender: "",
  dob: "", // required
  admissionDate: "", // required
  
  // mediumName:"test",
  
  // Student Details
  category: "",
  religion: "",
  caste: "",
  subCaste: "",
  bloodGroup: "",
  house: "",
  height: "",
  weight: "",
  motherTounge: "",
  aadharNo: "",
  studentUid: "",
  
  // Student Contact & Previous School
  studentEmail: "",
  studentMobile: "",
  currentAddress: "",
  previousSchoolName: "",
  previousStd: "",
  
  // Father Details
  fatherName: "",
  fatherPhone: "",
  fatherOccupation: "",
  fatherPhoto: null,
  fatherEmail: "",
  fatherAnnualincome: "",
  fatherCompany: "",
  fatherQualification: "",
  
  // Mother Details
  motherName: "",
  motherPhone: "",
  motherOccupation: "",
  motherPhoto: null,
  motherEmail: "",
  motherAnnualincome: "",
  motherCompany: "",
  motherQualification: "",
  
  // Guardian Details
  guardianName: "",
  guardianEmail: "",
  guardianOccupation: "",
  guardianPhone: "",
  guardianRelation: "",
  guardianQualification:"",
  guardianCompany:"",
  guardianAnnualIncome:"",
  guardianPhoto: null,
  
  // Address
  address: "",
  city: "",
  state: "",
  postCode: "",
  
  // Documents
  studentAadharCard: null,
  studentPhotograph: null,
};

const [formData, setFormData] = useState(initialFormState); 
const [activeTab, setActiveTab] = useState("student");
const [ touchedFields , setTouchedFields]=useState("");
// ✅ validationState now only tracks required fields
const [validationState, setValidationState] = useState({
  classId: false,
  firstName: false,
  dob: false,
  admissionDate: false,
});

const validateField = (name, value) => {
  let isValid = true;

  switch (name) {
    case "firstName":
      isValid = value.trim() !== "";
      break;
    case "classId":
      isValid = value.trim() !== "";
      break;
    case "dob":
    case "admissionDate":
      isValid = value.trim() !== "";
      break;
    case "studentEmail":
    case "fatherEmail":
    case "motherEmail":
    case "guardianEmail":
      if (!value.trim()) {
        isValid = true; // optional
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailPattern.test(value);
      }
      break;
    case "studentMobile":
    case "fatherPhone":
    case "motherPhone":
    case "guardianPhone":
      if (!value.trim()) {
        isValid = true; // optional
      } else {
        const phonePattern = /^[6-9][0-9]{9}$/;
        isValid = phonePattern.test(value);
      }
      break;
    default:
      isValid = true;
  }
  return isValid;
};

// Group data by category for class dropdown
const groupedData = fetchClass.reduce((acc, curr) => {
  const { category, class: className, id } = curr;
  if (!acc[category]) acc[category] = [];
  const obj = {
    id: id,
    className: className,
  };
  acc[category].push(obj);
  return acc;
}, {});

const handleBlur = (e) => {
  const { name, value } = e.target;

  setTouchedFields((prev) => ({ ...prev, [name]: true }));

  // Email validation
  if (
    ["studentEmail", "fatherEmail", "motherEmail", "guardianEmail"].includes(name)
  ) {
    setValidationState((prev) => ({
      ...prev,
      [name]: !value.trim() ? true : /\S+@\S+\.\S+/.test(value), // optional but must match regex if entered
    }));
  } 
  // Phone validation
  else if (
    ["studentMobile", "fatherPhone", "motherPhone", "guardianPhone"].includes(name)
  ) {
    setValidationState((prev) => ({
      ...prev,
      [name]: !value.trim() ? true : /^[6-9][0-9]{9}$/.test(value), // optional but must be valid if entered
    }));
  } 
  // Default required fields
  else {
    setValidationState((prev) => ({
      ...prev,
      [name]: requiredFields.includes(name) ? value.trim() !== "" : true,
    }));
  }
};


const handleInputChange = (event) => {
  const { name, value, type, files } = event.target;

  // Mark this field as touched
  setTouchedFields((prev) => ({ ...prev, [name]: true }));

  if (type === "file" && files.length > 0) {
    const selectedFile = files[0];
    setFormData((prevData) => ({ ...prevData, [name]: selectedFile }));

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview((prevPreviews) => ({
        ...prevPreviews,
        [name]: reader.result,
      }));
    };
    reader.readAsDataURL(selectedFile);
  } else {
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (validationState.hasOwnProperty(name)) {
      const isInputValid = validateField(name, value);
      setValidationState((prevState) => ({
        ...prevState,
        [name]: isInputValid,
      }));
    }
  }
};


const handleRadioBtn = (e) => {
  const { value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    guardianRelation: value,
  }));

  if (value === "guardian") {
    setIsVisible(true);
  } else {
    setIsVisible(false);
  }
};

useEffect(() => {
  const isValid = Object.values(validationState).every((valid) => valid);
  setAllFieldsValid(isValid);
}, [validationState]);

const handleButtonClick = async (event) => {
  event.preventDefault();
  if (!allFieldsValid) {
    alert("Please fill in all required fields correctly.");
    return;
  }

  setIsLoading(true);
  try {
    const formDataToSend = new FormData();

    // Append student form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (value instanceof File) {
          formDataToSend.append(key, value, value.name);
        } else {
          formDataToSend.append(key, value);
        }
      }
    });

    // ✅ Backend requires these names, not "medium"/"academicYear"
    // formDataToSend.append("mediumName", tenant);
    // formDataToSend.append("academicYearName", academicYear);

    const url = `${import.meta.env.VITE_SERVER_API_URL}admin/add-student?mediumName=${tenant}&academicYearName=${academicYear}`;

    await axios.post(url, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    alert("Student created successfully!");

    // Reset form
    setFormData(initialFormState);
    setValidationState({
      classId: false,
      firstName: false,
      dob: false,
      admissionDate: false,
    });
  } catch (error) {
    if (error?.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Sorry, something went wrong. Please try again.");
    }
    console.error("Submit error:", error);
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
 <div className="inline-flex bg-blue-500 gap-3 rounded-full p-1 mb-6">
  <button
    type="button"
    onClick={() => setActiveTab("student")}
    className={`flex items-center gap-2 px-6 py-2 font-medium rounded-full transition-all duration-200 ${
      activeTab === "student"
        ? "bg-white text-blue-600 shadow-md"
        : "text-white hover:text-blue-100 hover:bg-blue-600"
    }`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
    Student Info
  </button>
  
  <button
    type="button"
    onClick={() => setActiveTab("parent")}
    className={`flex items-center gap-2 px-6 py-2 font-medium rounded-full transition-all duration-200 ${
      activeTab === "parent"
        ? "bg-white text-blue-600 shadow-md"
        : "text-white hover:text-blue-100 hover:bg-blue-600"
    }`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    Parent Info
  </button>
</div>
      <form onSubmit={handleButtonClick}>
  {activeTab === "student" && (
    <>
      {/* Basic Student Information */}
      <div className="text-lg font-bold mt-6 mb-3">
        Basic Student Information
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter First Name"
            required
          />

          <FormInput
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Middle Name"
          />

          <FormInput
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Last Name"
            required
          />

          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            required
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />

          <FormSelect
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            required
            options={[
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
            ]}
          />

          <FormInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            required
          />

          <FormInput
            label="Student Email"
            name="studentEmail"
            type="email"
            value={formData.studentEmail}
            onChange={handleInputChange}
             onBlur={handleBlur}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Student Email"
          />

          <FormInput
            label="Student Mobile"
            name="studentMobile"
            type="number"
            value={formData.studentMobile}
            onChange={handleInputChange}
            validationState={validationState}
             onBlur={handleBlur}
            touchedFields={touchedFields}
            placeholder="Enter 10-digit Mobile Number"
            maxLength="10"
          />

          <FormInput
            label="Current Address"
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Current Address"
          />

          <FormInput
            label="Aadhaar Number"
            name="aadharNo"
            value={formData.aadharNo}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter 12-digit Aadhaar Number"
            maxLength="12"
          />
        </div>
      </div>

      {/* Student Details */}
      <div className="text-lg font-bold mt-6 mb-3">Student Details</div>
  
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput
            label="Admission Date"
            name="admissionDate"
            type="date"
            value={formData.admissionDate}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            required
          />

          <FormInput
            label="GR No."
            name="grNo"
            type="number"
            value={formData.grNo}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter GR Number"
        
          />

          <FormInput
            label="Roll Number"
            name="rollNo"
            type="number"
            value={formData.rollNo}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Roll Number"
           
          />

          <FormSelect
            label="Class"
            name="classId"
            value={formData.classId}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            required
            options={Object.keys(groupedData).flatMap((category) => [
              { value: "", label: `-- ${category} --`, disabled: true },
              ...groupedData[category].map((item) => ({
                value: item.id,
                label: item.className,
              })),
            ])}
          />

          <FormSelect
            label="Division"
            name="division"
            value={formData.division}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
           
            options={[
              { value: "A", label: "A" },
              { value: "B", label: "B" },
              { value: "C", label: "C" },
            ]}
          />

          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
        
            options={[
              { value: "General", label: "General" },
              { value: "OBC", label: "OBC" },
              { value: "SC", label: "SC" },
              { value: "ST", label: "ST" },
              { value: "PWD", label: "Physically Challenged" },
            ]}
          />

          <FormInput
            label="Previous School Name"
            name="previousSchoolName"
            value={formData.previousSchoolName}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Previous School Name"
          />

          <FormInput
            label="Previous Standard"
            name="previousStd"
            value={formData.previousStd}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Previous Standard"
          />

          <FormSelect
            label="House"
            name="house"
            value={formData.house}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
          
            options={[
              { value: "Red", label: "Red" },
              { value: "Blue", label: "Blue" },
              { value: "Green", label: "Green" },
              { value: "Yellow", label: "Yellow" },
            ]}
          />

          <FormInput
            label="Student UID"
            name="studentUid"
            value={formData.studentUid}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
            placeholder="Enter Student UID"
          />
        </div>
      </div>
         
     <div className="text-lg font-bold mt-6 mb-3">Student Details</div>
     <div className="bg-white rounded-lg shadow-sm border p-6 mb-6"> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput
            label="Religion"
            name="religion"
            type="text"
            value={formData.religion}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
             placeholder="Enter Religion"
          />
          <FormInput
            label="caste"
            name="caste"
            type="text"
            value={formData.caste}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
             placeholder="Enter cast"
          />
          <FormInput
            label="Sub caste"
            name="subCaste"
            type="text"
            value={formData.subCaste}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
             placeholder="Enter subcast"
          />
          <FormInput
            label="State"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
             placeholder="Enter State"
          />
          <FormInput
            label="City"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
             placeholder="Enter City"
          />
          <FormInput
            label="Address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            validationState={validationState}
            touchedFields={touchedFields}
             placeholder="Enter Address"
          />

     </div>
     {/* Document Upload */}
<div className="text-lg font-bold mt-6 mb-3">Upload Documents</div>
<div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* Student Aadhaar */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Student Aadhaar Card
      </label>
      <div className="flex items-start gap-4">
        <input
          id="studentAadhaar"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="file"
          name="studentAadhaar"
          onChange={handleInputChange}
          accept="image/*"
        />
        {imagePreview.studentAadhaar && (
          <div className="flex-shrink-0">
            <img
              src={imagePreview.studentAadhaar}
              alt="Aadhaar Preview"
              className="w-20 h-16 object-cover rounded-md border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>

    {/* Student Photo */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Student Photograph
      </label>
      <div className="flex items-start gap-4">
        <input
          id="studentPhoto"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="file"
          name="studentPhoto"
          onChange={handleInputChange}
          accept="image/*"
        />
        {imagePreview.studentPhoto && (
          <div className="flex-shrink-0">
            <img
              src={imagePreview.studentPhoto}
              alt="Student Photo Preview"
              className="w-20 h-16 object-cover rounded-md border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  </div>
</div>

     </div>
          
    </>
  )}
  {activeTab === "parent" && (
  <>
    {/* Father Details */}
    <div className="text-lg font-bold mt-6 mb-3">Father Details</div>
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          label="Father Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Father's Name"
          
        />

        <FormInput
          label="Father Phone"
          name="fatherPhone"
          type="number"
          value={formData.fatherPhone}
          onChange={handleInputChange}
          validationState={validationState}
          onBlur={handleBlur}
          touchedFields={touchedFields}
          placeholder="Enter 10-digit Phone Number"
          maxLength="10"
          
        />

        <FormInput
          label="Father Occupation"
          name="fatherOccupation"
          value={formData.fatherOccupation}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Father's Occupation"
          
        />

        <FormInput
          label="Father Qualification"
          name="fatherQualification"
          value={formData.fatherQualification}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Father's Qualification"
        />

        <FormInput
          label="Father Company"
          name="fatherCompany"
          value={formData.fatherCompany}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Father's Company"
        />

        <FormInput
          label="Father Annual Income"
          name="fatherAnnualIncome"
          value={formData.fatherAnnualincome}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Father's Annual Income"
        />

        <FormInput
          label="Father Email"
          name="fatherEmail"
          type="email"
          value={formData.fatherEmail}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Father's Email"
          
        />

        {/* Father Photo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Father Photo
          </label>
          <div className="flex items-start gap-4">
            <input
              id="fatherPhoto"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              name="fatherPhoto"
              accept="image/*"
              onChange={handleInputChange}
            />
            {imagePreview.fatherPhoto && (
              <div className="flex-shrink-0">
                <img
                  src={imagePreview.fatherPhoto}
                  alt="Father Photo Preview"
                  className="w-20 h-16 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Mother Details */}
    <div className="text-lg font-bold mt-6 mb-3">Mother Details</div>
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          label="Mother Name"
          name="motherName"
          value={formData.motherName}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Mother's Name"
      
        />

        <FormInput
          label="Mother Phone"
          name="motherPhone"
          value={formData.motherPhone}
          onChange={handleInputChange}
          onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter 10-digit Phone Number"
          maxLength={10}
 
        />

        <FormInput
          label="Mother Occupation"
          name="motherOccupation"
          value={formData.motherOccupation}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Mother's Occupation"
      
        />

        <FormInput
          label="Mother Qualification"
          name="motherQualification"
          value={formData.motherQualification}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Mother's Qualification"
        />

        <FormInput
          label="Mother Company"
          name="motherCompany"
          value={formData.motherCompany}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Mother's Company"
        />

        <FormInput
          label="Mother Annual Income"
          name="motherAnnualIncome"
          value={formData.motherAnnualincome}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Mother's Annual Income"
        />

        <FormInput
          label="Mother Email"
          name="motherEmail"
          type="email"
          value={formData.motherEmail}
          onChange={handleInputChange}
          onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter Mother's Email"
  
        />

        {/* Mother Photo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mother Photo
          </label>
          <div className="flex items-start gap-4">
            <input
              id="motherPhoto"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              name="motherPhoto"
              accept="image/*"
              onChange={handleInputChange}
            />
            {imagePreview.motherPhoto && (
              <div className="flex-shrink-0">
                <img
                  src={imagePreview.motherPhoto}
                  alt="Mother Photo Preview"
                  className="w-20 h-16 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* guardient Details */}
    <div className="text-lg font-bold mt-6 mb-3">Guardian Details</div>
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          label="guardian Name"
          name="guardianName"
          value={formData.guardianName}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter guardian Name"
      
        />

        <FormInput
          label="guardian Phone"
          name="guardianPhone"
          value={formData.guardianPhone}
          onChange={handleInputChange}
          onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter 10-digit Phone Number"
          maxLength={10}
 
        />

        <FormInput
          label="guardian Occupation"
          name="guardianOccupation"
          value={formData.guardianOccupation}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter guardian Occupation"
      
        />

        <FormInput
          label="Motheguardian Qualification"
          name="guardianQualification"
          value={formData.guardianQualification}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter guardian Qualification"
        />

        <FormInput
          label="guardian Company"
          name="guardianCompany"
          value={formData.guardianCompany}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter guardian Company"
        />

        <FormInput
          label="guardian Annual Income"
          name="guardianAnnualIncome"
          value={formData.guardianAnnualIncome}
          onChange={handleInputChange}
          // onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter guardian Annual Income"
        />

        <FormInput
          label="guardian Email"
          name="guardianEmail"
          type="email"
          value={formData.guardianEmail}
          onChange={handleInputChange}
          onBlur={handleBlur}
          validationState={validationState}
          touchedFields={touchedFields}
          placeholder="Enter guardian Email"
  
        />

        {/* Mother Photo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            guardian Photo
          </label>
          <div className="flex items-start gap-4">
            <input
              id="guardianPhoto"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              name="guardianPhoto"
              accept="image/*"
              onChange={handleInputChange}
            />
            {imagePreview.guardianPhoto && (
              <div className="flex-shrink-0">
                <img
                  src={imagePreview.guardianPhoto}
                  alt="guardian Photo Preview"
                  className="w-20 h-16 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
)}


  {/* Submit Button */}
  <div className="flex justify-end mt-8 mb-6">
    <button
      type="submit"
      disabled={!allFieldsValid || isLoading}
      className={`px-8 py-3 rounded-md text-white font-medium transition-colors ${
        allFieldsValid && !isLoading
          ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {isLoading ? "Submitting..." : "Submit Application"}
    </button>
  </div>
</form>
    </div>
    );
}

export default StudentAdmissionForm