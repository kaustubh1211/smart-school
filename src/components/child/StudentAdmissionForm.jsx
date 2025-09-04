import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";



const StudentAdmissionForm = () => {
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const accessToken = localStorage.getItem("accessToken");

  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [allFieldsValid, setAllFieldsValid] = useState(true);
  const [fetchClass, setFetchClass] = useState([]);

  // Image preview state
  const [imagePreview, setImagePreview] = useState({});

    useEffect(() => {
    const fetchClassList = async () => {
      try {
        const response = await axios.get(
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
    classId: "",
    division: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    
    // Student Details
    category: "",
    religion: "",
    caste: "",
    subCaste: "",
    admissionDate: "",
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
    
    // Mother Details
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    motherPhoto: null,
    motherEmail: "",
    
    // Guardian Details
    guardianName: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianPhone: "",
    guardianRelation: "",
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
  const [validationState, setValidationState] = useState({
    grNo: true,
    rollNo: true,
    classId: true,
    division: true,
    firstName: true,
    middleName: true,
    lastName: true,
    gender: true,
    dob: true,
    category: true,
    religion: true,
    caste: true,
    subCaste: true,
    admissionDate: true,
    bloodGroup: true,
    house: true,
    height: true,
    weight: true,
    motherTounge: true,
    aadharNo: true,
    studentUid: true,
    studentEmail: true,
    studentMobile: true,
    currentAddress: true,
    previousSchoolName: true,
    previousStd: true,
    fatherName: true,
    fatherPhone: true,
    fatherOccupation: true,
    fatherPhoto: true,
    fatherEmail: true,
    motherName: true,
    motherPhone: true,
    motherOccupation: true,
    motherPhoto: true,
    motherEmail: true,
    address: true,
    city: true,
    state: true,
    postCode: true,
    studentAadharCard: true,
    studentPhotograph: true,
    guardianName: true,
    guardianEmail: true,
    guardianOccupation: true,
    guardianPhone: true,
    guardianRelation: true,
    guardianPhoto: true,
  });

  const validateField = (name, value) => {
    let isValid = false;

    switch (name) {
      case "fatherEmail":
      case "motherEmail":
      case "guardianEmail":
      case "studentEmail":
        if (!value.trim()) {
          isValid = true; // Optional fields
        } else {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = emailPattern.test(value);
        }
        break;

      case "firstName":
      case "lastName":
      case "fatherName":
      case "motherName":
      case "guardianName":
      case "guardianRelation":
      case "middleName":
        const namePattern = /^[A-Za-z\s]*$/;
        isValid = namePattern.test(value);
        break;

      case "motherPhone":
      case "fatherPhone":
      case "guardianPhone":
      case "studentMobile":
        if (!value.trim()) {
          isValid = true; // Optional for some
        } else {
          const phonePattern = /^[6-9][0-9]{9}$/;
          isValid = phonePattern.test(value);
        }
        break;

      case "religion":
      case "caste":
      case "subCaste":
      case "motherTounge":
        const religionCastePattern = /^[A-Za-z\s]*$/;
        isValid = religionCastePattern.test(value);
        break;

      case "fatherOccupation":
      case "motherOccupation":
      case "guardianOccupation":
        const occupationPattern = /^[A-Za-z\s]*$/;
        isValid = occupationPattern.test(value);
        break;

      case "grNo":
      case "rollNo":
      case "classId":
      case "division":
      case "height":
      case "weight":
      case "postCode":
      case "bloodGroup":
      case "dob":
      case "admissionDate":
      case "address":
      case "city":
      case "state":
        isValid = value.trim() !== "";
        break;

      case "aadharNo":
        if (!value.trim()) {
          isValid = true; // Optional
        } else {
          const aadharPattern = /^[0-9]{12}$/;
          isValid = aadharPattern.test(value);
        }
        break;

      default:
        isValid = true;
        break;
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

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file" && files.length > 0) {
      const selectedFile = files[0];

      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview((prevPreviews) => ({
          ...prevPreviews,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      const isInputValid = validateField(name, value);
      setValidationState((prevState) => ({
        ...prevState,
        [name]: isInputValid,
      }));
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
     // Build FormData (handles both text fields and files)
     const formDataToSend = new FormData();
     Object.entries(formData).forEach(([key, value]) => {
       if (value !== "" && value !== null && value !== undefined) {
         if (value instanceof File) {
           formDataToSend.append(key, value, value.name);
         } else {
           formDataToSend.append(key, value);
         }
       }
     });

     // POST to your backend
     const url = `${import.meta.env.VITE_SERVER_API_URL}admin/add-student?mediumName=${tenant}&academicYearName=${academicYear}`;
     await axios.post(url, formDataToSend, {
       headers: {
         "Content-Type": "multipart/form-data",
         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
       },
     });

     alert("Student created successfully!");
     // Optionally reset the form:
     // setFormData(initialFormState);
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
     <div className="inline-flex bg-gray-100 gap-3 rounded-full p-1 mb-6">
  <button
    type="button"
    onClick={() => setActiveTab("student")}
    className={`flex items-center gap-2 px-6 py-2 font-medium rounded-full transition-all duration-200 ${
      activeTab === "student"
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
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
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
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
        <div className="text-lg font-bold mt-6 mb-3">Basic Student Information</div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GR No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="grNo"
                value={formData.grNo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.grNo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter GR Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.rollNo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Roll Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="classId"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    !validationState.classId ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={handleInputChange}
                  value={formData.classId}
                >
                  <option value="" disabled>Select Class</option>
                  {Object.keys(groupedData).map((category) => (
                    <optgroup label={category} key={category}>
                      {groupedData[category].map((item) => (
                        <option value={item.id} key={item.className}>
                          {item.className}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="division"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    !validationState.division ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={handleInputChange}
                  value={formData.division}
                >
                  <option value="" disabled>Select Division</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter First Name"
              />
              {!validationState.firstName && (
                <p className="text-red-500 text-xs mt-1">*Name is Invalid</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.middleName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Middle Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Last Name"
              />
              {!validationState.lastName && (
                <p className="text-red-500 text-xs mt-1">*Name is Invalid</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="gender"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    !validationState.gender ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={handleInputChange}
                  value={formData.gender}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.dob ? "border-red-500" : "border-gray-300"
                }`}
                onChange={handleInputChange}
              />
            </div>

          </div>
        </div>

        {/* Student Details */}
        <div className="text-lg font-bold mt-6 mb-3">Student Details</div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  onChange={handleInputChange}
                  value={formData.category}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    !validationState.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="PWD">Physically Challenged</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Religion <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="religion"
                onChange={handleInputChange}
                value={formData.religion}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.religion ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Religion"
              />
              {!validationState.religion && (
                <p className="text-red-500 text-xs mt-1">*Invalid Religion</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caste <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="caste"
                onChange={handleInputChange}
                value={formData.caste}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.caste ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Caste"
              />
              {!validationState.caste && (
                <p className="text-red-500 text-xs mt-1">*Invalid Caste</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Caste
              </label>
              <input
                type="text"
                name="subCaste"
                onChange={handleInputChange}
                value={formData.subCaste}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.subCaste ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Sub Caste"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother Tongue
              </label>
              <input
                type="text"
                name="motherTounge"
                onChange={handleInputChange}
                value={formData.motherTounge}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.motherTounge ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Mother Tongue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admission Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="admissionDate"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.admissionDate ? "border-red-500" : "border-gray-300"
                }`}
                onChange={handleInputChange}
                value={formData.admissionDate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="bloodGroup"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    !validationState.bloodGroup ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="house"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                    !validationState.house ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={handleInputChange}
                  value={formData.house}
                >
                  <option value="" disabled>Select House</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Yellow">Yellow</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="height"
                onChange={handleInputChange}
                value={formData.height}
                onWheel={(e) => e.target.blur()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.height ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Height"
                min="1"
                max="300"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                onChange={handleInputChange}
                value={formData.weight}
                onWheel={(e) => e.target.blur()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.weight ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Weight"
                min="1"
                max="300"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhaar Number
              </label>
              <input
                type="text"
                name="aadharNo"
                onChange={handleInputChange}
                value={formData.aadharNo}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.aadharNo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter 12-digit Aadhaar Number"
                maxLength="12"
              />
              {!validationState.aadharNo && (
                <p className="text-red-500 text-xs mt-1">*Invalid Aadhaar Number</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student UID
              </label>
              <input
                type="text"
                name="studentUid"
                onChange={handleInputChange}
                value={formData.studentUid}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.studentUid ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Student UID"
              />
            </div>

          </div>
        </div>

        {/* Student Contact & Previous School */}
        <div className="text-lg font-bold mt-6 mb-3">Student Contact & Previous School</div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Email
              </label>
              <input
                type="email"
                name="studentEmail"
                onChange={handleInputChange}
                value={formData.studentEmail}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.studentEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Student Email"
              />
              {!validationState.studentEmail && (
                <p className="text-red-500 text-xs mt-1">*Invalid Email</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Mobile
              </label>
              <input
                type="text"
                name="studentMobile"
                onChange={handleInputChange}
                value={formData.studentMobile}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.studentMobile ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter 10-digit Mobile Number"
                maxLength="10"
              />
              {!validationState.studentMobile && (
                <p className="text-red-500 text-xs mt-1">*Invalid Mobile Number</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Address
              </label>
              <input
                type="text"
                name="currentAddress"
                onChange={handleInputChange}
                value={formData.currentAddress}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.currentAddress ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Current Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous School Name
              </label>
              <input
                type="text"
                name="previousSchoolName"
                onChange={handleInputChange}
                value={formData.previousSchoolName}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.previousSchoolName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Previous School Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Standard
              </label>
              <input
                type="text"
                name="previousStd"
                onChange={handleInputChange}
                value={formData.previousStd}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.previousStd ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Previous Standard"
              />
            </div>

          </div>
        </div>

  {/* Address Information */}
        <div className="text-lg font-bold mt-6 mb-3">Address Information</div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.address ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter Full Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.city ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                name="city"
                placeholder="Enter City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                id="state"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.state ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                id="postCode"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.postCode ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                name="postCode"
                onWheel={(e) => e.target.blur()}
                value={formData.postCode}
                onChange={handleInputChange}
                placeholder="Enter Postcode"
                maxLength="6"
              />
            </div>

          </div>
        </div>

        {/* Document Upload */}
        <div className="text-lg font-bold mt-6 mb-3">Upload Documents</div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Aadhaar Card
              </label>
              <div className="flex items-start gap-4">
                <input
                  id="studentAadharCard"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="file"
                  name="studentAadharCard"
                  onChange={handleInputChange}
                  accept="image/*"
                />
                {imagePreview.studentAadharCard && (
                  <div className="flex-shrink-0">
                    <img
                      src={imagePreview.studentAadharCard}
                      alt="Aadhaar Card Preview"
                      className="w-20 h-16 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Photograph
              </label>
              <div className="flex items-start gap-4">
                <input
                  id="studentPhotograph"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="file"
                  name="studentPhotograph"
                  onChange={handleInputChange}
                  accept="image/*"
                />
                {imagePreview.studentPhotograph && (
                  <div className="flex-shrink-0">
                    <img
                      src={imagePreview.studentPhotograph}
                      alt="Student Photo Preview"
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
         {/* Parent Info Tab */}
        {activeTab === "parent" && (
          <>
        {/* Father Details */}
        <div className="text-lg font-bold mt-6 mb-3">Father Details</div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fatherName"
                onChange={handleInputChange}
                value={formData.fatherName}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.fatherName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Father's Name"
              />
              {!validationState.fatherName && (
                <p className="text-red-500 text-xs mt-1">*Name is Invalid</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fatherPhone"
                onChange={handleInputChange}
                onWheel={(e) => e.target.blur()}
                value={formData.fatherPhone}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.fatherPhone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter 10-digit Phone Number"
                maxLength="10"
              />
              {!validationState.fatherPhone && (
                <p className="text-red-500 text-xs mt-1">*Phone number is Invalid</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fatherOccupation"
                onChange={handleInputChange}
                value={formData.fatherOccupation}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.fatherOccupation ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Father's Occupation"
              />
              {!validationState.fatherOccupation && (
                <p className="text-red-500 text-xs mt-1">*Invalid Occupation</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="fatherEmail"
                onChange={handleInputChange}
                value={formData.fatherEmail}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.fatherEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Father's Email"
              />
              {!validationState.fatherEmail && (
                <p className="text-red-500 text-xs mt-1">*Email is Invalid</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father Photo
              </label>
              <div className="flex items-start gap-4">
                <input
                  id="fatherPhoto"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleInputChange}
                  type="file"
                  name="fatherPhoto"
                  accept="image/*"
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="motherName"
                onChange={handleInputChange}
                value={formData.motherName}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.motherName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Mother's Name"
              />
              {!validationState.motherName && (
                <p className="text-red-500 text-xs mt-1">*Name is Invalid</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="motherPhone"
                onChange={handleInputChange}
                onWheel={(e) => e.target.blur()}
                value={formData.motherPhone}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.motherPhone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter 10-digit Phone Number"
                maxLength="10"
              />
              {!validationState.motherPhone && (
                <p className="text-red-500 text-xs mt-1">*Phone number is Invalid</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.motherOccupation ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Mother's Occupation"
              />
              {!validationState.motherOccupation && (
                <p className="text-red-500 text-xs mt-1">*Invalid Occupation</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="motherEmail"
                onChange={handleInputChange}
                value={formData.motherEmail}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validationState.motherEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Mother's Email"
              />
              {!validationState.motherEmail && (
                <p className="text-red-500 text-xs mt-1">*Email is Invalid</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother Photo
              </label>
              <div className="flex items-start gap-4">
                <input
                  id="motherPhoto"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleInputChange}
                  type="file"
                  name="motherPhoto"
                  accept="image/*"
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

        {/* Guardian Selection */}
        <div className="text-lg font-bold mt-6 mb-3">Guardian Information</div>
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          
          {/* Guardian Radio Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              If guardian is <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mother"
                  name="guardian"
                  value="mother"
                  onChange={handleRadioBtn}
                  checked={formData.guardianRelation === "mother"}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="mother" className="ml-2 text-sm text-gray-700">Mother</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="father"
                  name="guardian"
                  value="father"
                  onChange={handleRadioBtn}
                  checked={formData.guardianRelation === "father"}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="father" className="ml-2 text-sm text-gray-700">Father</label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="guardian"
                  name="guardian"
                  value="guardian"
                  onChange={handleRadioBtn}
                  checked={formData.guardianRelation === "guardian"}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="guardian" className="ml-2 text-sm text-gray-700">Guardian</label>
              </div>
            </div>
          </div>

          {/* Guardian Details - Only show if guardian is selected */}
          {isVisible && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  name="guardianName"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !validationState.guardianName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Guardian's Name"
                  onChange={handleInputChange}
                />
                {!validationState.guardianName && (
                  <p className="text-red-500 text-xs mt-1">*Name is Invalid</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Relation
                </label>
                <input
                  type="text"
                  value={formData.guardianRelation}
                  onChange={handleInputChange}
                  name="guardianRelation"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !validationState.guardianRelation ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Relation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardianPhone"
                  onChange={handleInputChange}
                  value={formData.guardianPhone}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !validationState.guardianPhone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter 10-digit Phone Number"
                  maxLength="10"
                />
                {!validationState.guardianPhone && (
                  <p className="text-red-500 text-xs mt-1">*Phone number is Invalid</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Occupation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardianOccupation"
                  value={formData.guardianOccupation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !validationState.guardianOccupation ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Guardian's Occupation"
                />
                {!validationState.guardianOccupation && (
                  <p className="text-red-500 text-xs mt-1">*Invalid Occupation</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Email
                </label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !validationState.guardianEmail ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Guardian's Email"
                />
                {!validationState.guardianEmail && (
                  <p className="text-red-500 text-xs mt-1">*Email is Invalid</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Photo
                </label>
                <div className="flex items-start gap-4">
                  <input
                    id="guardianPhoto"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="file"
                    name="guardianPhoto"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                  {imagePreview.guardianPhoto && (
                    <div className="flex-shrink-0">
                      <img
                        src={imagePreview.guardianPhoto}
                        alt="Guardian Photo Preview"
                        className="w-20 h-16 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
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

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Processing your application...</span>
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
    );
}

export default StudentAdmissionForm