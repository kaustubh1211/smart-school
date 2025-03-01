import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarIcon,
  ChevronDown,
  PenSquare,
  SeparatorHorizontal,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import Toast from "../ui/Toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import e from "cors";

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
  const [image, setImage] = useState("../assets/images/profile.png");
  const [fatherImage, setFatherImage] = useState(
    "../assets/images/profile.png"
  );
  const [motherImage, setMotherImage] = useState(
    "../assets/images/profile.png"
  );
  const [guardianImage, setGuardianImage] = useState(
    "../assets/images/profile.png"
  );

  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const [activeTab, setActiveTab] = useState("student");

  const initialFormState = {
    grNo: "",
    UID: "",
    swipeCardNo: "",
    selectedYear: "",
    rollNo: "",
    aadharNo: "",
    studentEmail1: "",
    studentEmail2: "",
    mobile1: "",
    mobile2: "",
    classId: "",
    division: "",
    classAdmitted: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    previousSchool: "",
    previousSTD: "",
    motherTongue: "",
    nationality: "",
    category: "",
    religion: "",
    caste: "",
    village_city: "",
    taluka: "",
    district: "",
    state: "",
    nation: "",
    admissionDate: new Date().toISOString().split("T")[0],
    bloodGroup: "",
    class: "",
    house: "",
    height: "",
    weight: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    fatherQualification: "",
    fatherCompany: "",
    fatherIncome: "",
    fatherPhoto: null,
    fatherEmail: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    motherQualification: "",
    motherCompany: "",
    motherIncome: "",
    motherPhoto: null,
    motherEmail: "",
    address: "",
    city: "",
    postCode: "",
    studentAadharCard: null,
    studentPhotograph: null,
    guardianName: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianQualification: "",
    guardianCompany: "",
    guardianIncome: "",
    guardianPhone: "",
    guardianRelation: "",
    guardianPhoto: "",
  };

  // all state variabe ofr input fields
  const [formData, setFormData] = useState(initialFormState);

  // Initialize validation state with `false` for all fields
  const [validationState, setValidationState] = useState({
    grNo: true, // Admission number (could just check if non-empty)
    UID: true,
    swipeCardNo: true,
    rollNo: true, // Roll number (could just check if non-empty)
    selectedYear: true,
    aadharNo: true,
    classId: true, // Class (could be a non-empty string)
    studentEmail1: true,
    studentEmail2: true,
    division: true, // division (could be a non-empty string)
    classAdmitted: true,
    firstName: true, // Validates first name (string, only alphabets)
    middleName: true, // Validates middle name (string, only alphabets)
    lastName: true, // Validates last name (string, only alphabets)
    gender: true, // Gender (could just check if selected)
    dob: true, // Date of birth (could check if valid date)
    previousSchool: true,
    previousSTD: true,
    mobile1: true,
    mobile2: true,
    motherTongue: true,
    nationality: true,
    category: true, // Category (could just check if non-empty)
    religion: true, // Religion (string, only alphabets)
    caste: true, // Caste (string, only alphabets)
    village_city: true,
    taluka: true,
    district: true,
    state: true,
    nation: true,
    admissionDate: true, // Admission date (valid date)
    bloodGroup: true, // Blood group (valid group e.g., A+, O-)
    class: true,
    house: true, // House (could check if non-empty)
    height: true, // Height (could be numeric)
    weight: true, // Weight (could be numeric)
    fatherName: true, // Father’s name (string, only alphabets)
    fatherPhone: true, // Father’s phone (valid phone number)
    fatherOccupation: true, // Father’s occupation (string, only alphabets)
    fatherQualification: true,
    fatherCompany: true,
    fatherIncome: true,
    fatherPhoto: true, // Father’s photo (check if file is selected)
    fatherEmail: true, // Father’s email (valid email)
    motherName: true, // Mother’s name (string, only alphabets)
    motherPhone: true, // Mother’s phone (valid phone number)
    motherOccupation: true, // Mother’s occupation (string, only alphabets)
    motherCompany: true,
    motherIncome: true,
    motherQualification: true,
    motherPhoto: true, // Mother’s photo (check if file is selected)
    motherEmail: true, // Mother’s email (valid email)
    address: true, // Street address (could check if non-empty)
    city: true, // City (could check if non-empty)
    postCode: true, // Postcode (valid postal code)
    studentAadharCard: true, // Aadhar card (could check if valid or not)
    studentPhotograph: true, // Student photograph (check if file is selected)
    guardianName: true, // Guardian’s name (string, only alphabets)
    guardianEmail: true, // Guardian’s email (valid email)
    guardianOccupation: true, // Guardian’s occupation (string, only alphabets)
    guardianQualification: true,
    guardianIncome: true,
    guardianCompany: true,
    guardianPhone: true, // Guardian’s phone (valid phone number)
    guardianRelation: true, // Guardian’s relation (string, only alphabets)
    guardianPhoto: true, // Guardian’s photo (check if file is selected)
  });

  const validateField = (name, value) => {
    let isValid = false;

    switch (name) {
      case "studentEmail1":
      case "studentEmail2":
      case "fatherEmail":
      case "motherEmail":
      case "guardianEmail":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailPattern.test(value);
        break;

      case "firstName":
      case "middleName":
      case "lastName":
      case "fatherName":
      case "motherName":
      case "guardianName":
      case "guardianRelation":
        const fullNamePattern = /^[A-Za-z\s]+$/;
        isValid = fullNamePattern.test(value);
        break;

      case "mobile1":
      case "mobile2":
      case "motherPhone":
      case "fatherPhone":
      case "guardianPhone":
        const phonePattern = /^[6-9][0-9]{9}$/;
        isValid = phonePattern.test(value);
        break;

      case "nationality":
      case "religion":
      case "caste":
      case "motherTongue":
      case "village_city":
      case "taluka":
      case "district":
      case "state":
      case "nation":
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
      case "UID":
      case "swipeCardNo":
      case "previousSTD":
      case "selectedYear":
      case "rollNo":
      case "aadharNo":
      case "classId":
      case "division":
      case "house":
      case "height":
      case "weight":
      case "postCode":
      case "bloodGroup":
      case "dob":
      case "admissionDate":
      case "fatherQualification":
      case "fatherCompany":
      case "fatherIncome":
      case "motherQualification":
      case "motherCompany":
      case "motherIncome":
      case "guardianQualification":
      case "guardianCompany":
      case "guardianIncome":
        isValid = value.trim() !== ""; // Check if value is not empty (ignores spaces)
        break;

      default:
        isValid = true; // Default case for fields without specific validation
        break;
    }

    return isValid;
  };

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

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 7;
    const years = [];

    for (let i = currentYear; i >= startYear; i--) {
      years.push(`${i - 1}-${i}`);
    }

    setAcademicYears(years);
    setSelectedYear(`${currentYear}-${currentYear + 1}`);
  }, []);

  // Group data by category
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

  console.log("groupedData" + JSON.stringify(groupedData));

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    console.log("value" + value);

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

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFatherProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFatherImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleMotherProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMotherImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleGuardianProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGuardianImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    // Student Detail
    <div className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="student"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="flex items-center justify-between w-full">
              <div className="flex gap-4">
                <TabsTrigger
                  value="student"
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "student"
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                >
                  <h1 className="text-xl font-semibold">Student Master</h1>
                </TabsTrigger>
                <TabsTrigger
                  value="parents"
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "parents"
                      ? "bg-blue-500 text-white"
                      : "text-blue-500"
                  }`}
                >
                  <h1 className="text-xl font-semibold">Parents Details</h1>
                </TabsTrigger>
              </div>
              <div className="flex items-end gap-1">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button variant="outline" className="text-red-500">
                  Mark Left
                </Button>
                <Button variant="outline" className="text-blue-500">
                  List Student
                </Button>
              </div>
            </TabsList>
            <TabsContent value="student">
              <Card className="m-3">
                <CardContent className="">
                  <form action="#">
                    <div className="text-lg font-bold mt-3 mb-3"></div>
                    <div className="card m-3">
                      <div className="card-body ">
                        <div className="row grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            {/* First Name */}
                            <div className="col-12">
                              <label className="form-label ">
                                First Name{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`form-control radius-12 ${
                                  !validationState.firstName
                                    ? "border-danger"
                                    : ""
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
                                {!validationState.firstName &&
                                  "*Full name is Invalid"}
                              </div>
                            </div>
                            {/* Middle Name */}
                            <div className="col-12">
                              <label className="form-label">Middle Name</label>
                              <input
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleInputChange}
                                className={`form-control radius-12`}
                                placeholder=""
                              />
                              <div
                                className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                                  !validationState.middleName
                                    ? "opacity-100 translate-y-0"
                                    : ""
                                }`}
                              >
                                {!validationState.middleName &&
                                  "*Full name is Invalid"}
                              </div>
                            </div>
                            {/* Last Name */}
                            <div className="col-12">
                              <label className="form-label">
                                Last Name{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`form-control  radius-12 ${
                                  !validationState.lastName
                                    ? "border-danger"
                                    : ""
                                }`}
                                placeholder=""
                              />
                              <div
                                className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                                  !validationState.lastName
                                    ? "opacity-100 translate-y-0"
                                    : ""
                                }`}
                              >
                                {!validationState.lastName &&
                                  "*Full name is Invalid"}
                              </div>
                            </div>
                            {/* Gender */}
                            {/* <div className="col-12">
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
              </div> */}
                            {/* Gender */}
                            <div className="flex space-x-4 p-2">
                              <Label>
                                Gender <span className="text-red-500">*</span>
                              </Label>
                              <RadioGroup
                                defaultValue="female"
                                className="flex gap-4"
                              >
                                <div className="flex space-x-2">
                                  <RadioGroupItem value="male" id="male" />
                                  <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex space-x-2">
                                  <RadioGroupItem value="female" id="female" />
                                  <Label htmlFor="female">Female</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Date of Birth */}
                            <div className="col-12">
                              <label className="form-label">
                                Date of Birth{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
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
                            {/*Student Mobile Number 1*/}
                            <div className="col-12">
                              <label className="form-label">
                                Mobile No{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
                              </label>
                              <input
                                type="number"
                                name="mobile1"
                                onChange={handleInputChange}
                                value={formData.mobile1}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                            {/*Student Mobile Number 2*/}
                            <div className="col-12">
                              <label className="form-label">
                                Mobile No (Alternative)
                              </label>
                              <input
                                type="number"
                                name="mobile2"
                                onChange={handleInputChange}
                                value={formData.mobile2}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="mb-4">
                              <Label>Photo</Label>
                              <div className="mt-2 flex items-start gap-4">
                                <div className="h-32 w-32 overflow-hidden rounded border bg-gray-100">
                                  <img
                                    src={image}
                                    alt="Profile photo"
                                    className="h-full w-full object-cover"
                                  />
                                  <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfileImage}
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  className="h-10"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    document
                                      .getElementById("fileInput")
                                      .click();
                                  }}
                                >
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
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
                                    --BloodGroup--
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
                                    right:
                                      "10px" /* Adjust this value for proper spacing */,
                                    top: "50%",
                                    transform:
                                      "translateY(-50%)" /* Vertically center the icon */,
                                    pointerEvents:
                                      "none" /* Ensures the icon doesn't block interaction */,
                                  }}
                                />
                              </div>
                            </div>
                            {/* Aadhar No. */}
                            <div className="col-12">
                              <label className="form-label">Aadhar No</label>
                              <input
                                type="number"
                                name="aadharNo"
                                value={formData.addharNo}
                                onChange={handleInputChange}
                                onWheel={(e) => e.target.blur()}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                            {/*Student Email Id 1*/}
                            <div className="col-12">
                              <label
                                htmlFor="studentEmail1"
                                className="form-label"
                              >
                                Email Id 1
                              </label>
                              <input
                                type="email"
                                name="studentEmail1"
                                onChange={handleInputChange}
                                value={formData.studentEmail1}
                                className={`form-control ${
                                  !validationState.studentEmail1
                                    ? "border-danger"
                                    : ""
                                }`}
                                placeholder=""
                              />
                              <div
                                className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                                  !validationState.studentEmail1
                                    ? "opacity-100 translate-y-0"
                                    : ""
                                }`}
                              >
                                {!validationState.studentEmail1 &&
                                  "*Email is Invalid"}
                              </div>
                            </div>
                            {/*Student Email Id 2*/}
                            <div className="col-12">
                              <label
                                htmlFor="studentEmail1"
                                className="form-label"
                              >
                                Email Id 2
                              </label>
                              <input
                                type="email"
                                name="studentEmail2"
                                onChange={handleInputChange}
                                value={formData.studentEmail2}
                                className={`form-control ${
                                  !validationState.studentEmail2
                                    ? "border-danger"
                                    : ""
                                }`}
                                placeholder=""
                              />
                              <div
                                className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                                  !validationState.studentEmail2
                                    ? "opacity-100 translate-y-0"
                                    : ""
                                }`}
                              >
                                {!validationState.studentEmail2 &&
                                  "*Email is Invalid"}
                              </div>
                            </div>
                          </div>

                          {/* class */}
                          {/* <div className="col-12">
                <label className="form-label">
                  Class <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="classId"
                    className="form-control"
                    onChange={handleInputChange}
                    value={formData.classId}
                  >
                    <option value="" disabled>
                      Select
                    </option>
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
              </div> */}
                          {/* division */}
                          {/* <div className="col-12">
                <label className="form-label">
                  Division <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                > */}
                          {/* division Dropdown */}
                          {/* <select
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
                  </select> */}

                          {/* ChevronDown Icon */}
                          {/* <ChevronDown
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
              </div> */}

                          {/* Category */}
                          {/* <div className="col-12">
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
              </div> */}
                          {/* Religion */}
                          {/* <div className="col-12">
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
              </div> */}
                          {/* Caste */}
                          {/* <div className="col-12">
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
              </div> */}
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

                          {/* Height */}
                          {/* <div className="col-12">
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
              </div> */}
                          {/* Weight */}
                          {/* <div className="col-12">
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
              </div> */}
                        </div>
                        <div className="col-12">
                          <label htmlFor="address" className="form-label">
                            Current Address
                          </label>
                          <textarea
                            id="address"
                            className="form-control"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold mt-3 mb-3 ml-6">
                      Student Academic Details
                    </div>
                    <div className="card m-3">
                      <div className="card-body ">
                        <div className="row grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            {/* Admission Date */}
                            <div className="col-12">
                              <label className="form-label">
                                Admission Date{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
                              </label>
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
                            {/* Class */}
                            <div className="col-12">
                              <label className="form-label">
                                Class{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
                              </label>
                              <div
                                className="form-control-wrapper"
                                style={{ position: "relative" }}
                              >
                                <select
                                  name="class"
                                  className="form-control"
                                  value={formData.class}
                                  onChange={handleInputChange}
                                >
                                  <option value="">--Class--</option>
                                  <option
                                    value="Prathamik"
                                    disabled
                                    className="font-bold text-black hover:bg-white"
                                  >
                                    PRATHAMIK
                                  </option>
                                  <option value="STD I">STD I</option>
                                  <option value="STD II">STD II</option>
                                  <option value="STD III">STD III</option>
                                  <option value="STD IV">STD IV</option>
                                  <option value="STD V">STD V</option>
                                  <option value="STD VI">STD VI</option>
                                  <option value="STD VII">STD VII</option>
                                  <option
                                    value="Madhyamik"
                                    disabled
                                    className="font-bold text-black hover:bg-white"
                                  >
                                    MADHYAMIK
                                  </option>
                                  <option value="STD VIII">STD VIII</option>
                                  <option value="STD IX">STD IX</option>
                                  <option value="STD X">STD X</option>
                                </select>
                                <ChevronDown
                                  className="dropdown-icon"
                                  size={20}
                                  style={{
                                    position: "absolute",
                                    right:
                                      "10px" /* Adjust this value for proper spacing */,
                                    top: "50%",
                                    transform:
                                      "translateY(-50%)" /* Vertically center the icon */,
                                    pointerEvents:
                                      "none" /* Ensures the icon doesn't block interaction */,
                                  }}
                                />
                              </div>
                            </div>
                            {/* Division */}
                            <div className="col-12">
                              <label className="form-label">Division</label>
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
                                    --Division--
                                  </option>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                </select>
                                <ChevronDown
                                  className="dropdown-icon"
                                  size={20}
                                  style={{
                                    position: "absolute",
                                    right:
                                      "10px" /* Adjust this value for proper spacing */,
                                    top: "50%",
                                    transform:
                                      "translateY(-50%)" /* Vertically center the icon */,
                                    pointerEvents:
                                      "none" /* Ensures the icon doesn't block interaction */,
                                  }}
                                />
                              </div>
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
                                  <option value="">--House--</option>
                                  <option value="Blue">Blue</option>
                                  <option value="Green">Green</option>
                                  <option value="Red">Red</option>
                                  <option value="Yellow">Yellow</option>
                                </select>
                                <ChevronDown
                                  className="dropdown-icon"
                                  size={20}
                                  style={{
                                    position: "absolute",
                                    right:
                                      "10px" /* Adjust this value for proper spacing */,
                                    top: "50%",
                                    transform:
                                      "translateY(-50%)" /* Vertically center the icon */,
                                    pointerEvents:
                                      "none" /* Ensures the icon doesn't block interaction */,
                                  }}
                                />
                              </div>
                            </div>
                            {/* Previous School */}
                            <div className="col-12">
                              <label className="form-label">
                                Previous School
                              </label>
                              <input
                                type="text"
                                name="previousSchool"
                                value={formData.previousSchool}
                                onChange={handleInputChange}
                                onWheel={(e) => e.target.blur()}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="col-12">
                              <label className="form-label">
                                Academic Year{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
                              </label>
                              <div
                                className="form-control-wrapper"
                                style={{ position: "relative" }}
                              >
                                <select
                                  name="selectedYear"
                                  value={formData.selectedYear}
                                  onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                  }
                                  className="form-control"
                                >
                                  <option value="">-- Academic Year --</option>
                                  {academicYears.map((year) => (
                                    <option key={year} value={year}>
                                      {year} {year == selectedYear ? "*" : ""}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  className="dropdown-icon"
                                  size={20}
                                  style={{
                                    position: "absolute",
                                    right:
                                      "10px" /* Adjust this value for proper spacing */,
                                    top: "50%",
                                    transform:
                                      "translateY(-50%)" /* Vertically center the icon */,
                                    pointerEvents:
                                      "none" /* Ensures the icon doesn't block interaction */,
                                  }}
                                />
                              </div>
                            </div>
                            {/* grNo */}
                            <div className="col-12">
                              <label className="form-label">
                                Gr No.{" "}
                                <span style={{ color: "#ff0000" }}>*</span>
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
                            <div className="col-12">
                              <label className="form-label">
                                Class In admitted
                              </label>
                              <input
                                type="text"
                                name="classAdmitted"
                                value={formData.classAdmitted}
                                onChange={handleInputChange}
                                onWheel={(e) => e.target.blur()}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Student UID</label>
                              <input
                                type="text"
                                name="UID"
                                value={formData.UID}
                                onChange={handleInputChange}
                                onWheel={(e) => e.target.blur()}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">
                                Swipe Card No
                              </label>
                              <input
                                type="text"
                                name="swipeCardNo"
                                value={formData.swipeCardNo}
                                onChange={handleInputChange}
                                onWheel={(e) => e.target.blur()}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Previous STD</label>
                              <input
                                type="text"
                                name="previousSTD"
                                value={formData.previousSTD}
                                onChange={handleInputChange}
                                onWheel={(e) => e.target.blur()}
                                className="form-control"
                                placeholder=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold mt-3 mb-3 ml-6">
                      Student Other Details
                    </div>
                    <div className="card m-3">
                      <div className="card-body ">
                        <div className="row grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <div className="col-12">
                              <label className="form-label">Nationality</label>
                              <input
                                type="text"
                                name="nationality"
                                onChange={handleInputChange}
                                value={formData.nationality}
                                className={`form-control radius-12 ${
                                  !validationState.nationality
                                    ? "border-danger"
                                    : ""
                                }`}
                                placeholder=""
                              />
                              <div
                                className={`w-100 text-danger mb-8 small mt-2 opacity-0 transform translate-y-2 transition-transform duration-500 ${
                                  !validationState.nationality
                                    ? "opacity-100 translate-y-0"
                                    : ""
                                }`}
                              >
                                {!validationState.nationality &&
                                  "*Invalid Nationality"}
                              </div>
                            </div>

                            {/* Religion*/}
                            <div className="col-12">
                              <label className="form-label">Religion</label>
                              <div
                                className="form-control-wrapper"
                                style={{ position: "relative" }}
                              >
                                <select
                                  name="religion"
                                  onChange={handleInputChange}
                                  value={formData.religion}
                                  className="form-control"
                                >
                                  <option value="" disabled>
                                    --Religion--
                                  </option>
                                  <option value="Gujarati">Gujarati</option>
                                  <option value="Hindu">Hindu</option>
                                  <option value="Hindu (Dev Vanshi)">
                                    Hindu (Dev Vanshi)
                                  </option>
                                  <option value="Hindu (Prajapati)">
                                    Hindu (Prajapati)
                                  </option>
                                  <option value="Islam">Islam</option>
                                  <option value="Musalman">Musalman</option>
                                  <option value="Muslim">Muslim</option>
                                  <option value="Muslim Mansuri">
                                    Muslim Mansuri
                                  </option>
                                  <option value="Rajput">Rajput</option>
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

                            <div className="col-12">
                              <label className="form-label">
                                Mother Tongue
                              </label>
                              <input
                                type="text"
                                name="motherTongue"
                                onChange={handleInputChange}
                                value={formData.motherTongue}
                                className={`form-control radius-12 ${
                                  !validationState.motherTongue
                                    ? "border-danger"
                                    : ""
                                }`}
                                placeholder=""
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-[68.8px]"></div>
                            {/* Caste Category */}
                            <div className="col-12">
                              <label className="form-label">
                                Caste Category
                              </label>
                              <div
                                className="form-control-wrapper"
                                style={{ position: "relative" }}
                              >
                                <select
                                  name="casteCategory"
                                  onChange={handleInputChange}
                                  value={formData.casteCategory}
                                  className="form-control"
                                >
                                  --Caste Category--
                                  <option value="" disabled>
                                    -- Caste Category --
                                  </option>
                                  <option value="Open">Open</option>
                                  <option value="OBC">OBC</option>
                                  <option value="SC">SC</option>
                                  <option value="ST">ST</option>
                                  <option value="NT">NT</option>
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
                            {/* Sub-caste */}
                            <div className="col-12">
                              <label className="form-label">Sub Caste </label>
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
                                  !validationState.caste
                                    ? "opacity-100 translate-y-0"
                                    : ""
                                }`}
                              >
                                {!validationState.caste && "*Invalid Caste"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="address" className="form-label">
                            Birth Place
                          </label>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-white text-xs text-center">
                                  <th className="border px-4 py-2">
                                    (Village/City)
                                  </th>
                                  <th className="border px-4 py-2">(Taluka)</th>
                                  <th className="border px-4 py-2">
                                    (District)
                                  </th>
                                  <th className="border px-4 py-2">(State)</th>
                                  <th className="border px-4 py-2">(Nation)</th>
                                </tr>
                              </thead>
                              <tbody className="text-black">
                                <tr>
                                  <td className="border px-4 py-2">
                                    <input
                                      type="text"
                                      name="village_city"
                                      onChange={handleInputChange}
                                      value={formData.village_city}
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                  </td>
                                  <td className="border px-4 py-2">
                                    <input
                                      type="text"
                                      name="taluka"
                                      onChange={handleInputChange}
                                      value={formData.taluka}
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                  </td>
                                  <td className="border px-4 py-2">
                                    <input
                                      type="text"
                                      name="district"
                                      onChange={handleInputChange}
                                      value={formData.district}
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                  </td>
                                  <td className="border px-4 py-2">
                                    <input
                                      type="text"
                                      name="state"
                                      onChange={handleInputChange}
                                      value={formData.state}
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                  </td>
                                  <td className="border px-4 py-2">
                                    <input
                                      type="text"
                                      name="nation"
                                      onChange={handleInputChange}
                                      value={formData.nation}
                                      className="w-full px-2 py-1 border rounded"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <div className="col-12 flex justify-end">
                  <button
                    type="submit"
                    onClick={handleButtonClick}
                    disabled={!allFieldsValid}
                    className="bg-blue-600 px-28 py-12 m-3 text-white text-md rounded-md hover:bg-blue-700 "
                  >
                    Submit
                  </button>
                  {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                      <div className="loader"></div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="parents">
              <Card className="m-3">
                <CardContent className="m-3">
                  <form action="#">
                    {/* Parent Detail */}
                    <div className="text-lg font-bold mt-2 mb-3"></div>
                    <div className="card pb-12 ">
                      {/* Parents all Detail */}
                      <div className="card-body">
                        <div className="row grid grid-cols-1 gap-4 sm:grid-cols-4">
                          {/* Father Name */}
                          <div className="col-12">
                            <label className="form-label">Father Name </label>
                            <input
                              type="text"
                              name="fatherName"
                              onChange={handleInputChange}
                              value={formData.fatherName}
                              className={`form-control  radius-12 ${
                                !validationState.fatherName
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.fatherName &&
                                "*Name is Invalid"}
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
                                !validationState.fatherPhone
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.fatherPhone &&
                                "*Phone no is Invalid"}
                            </div>
                          </div>
                          {/* Father Occupation */}
                          <div className="col-12">
                            <label
                              htmlFor="fatherOccupation"
                              className="form-label"
                            >
                              Father Occupation{" "}
                            </label>
                            <input
                              type="text"
                              name="fatherOccupation"
                              onChange={handleInputChange}
                              value={formData.fatherOccupation}
                              className={`form-control radius-12 ${
                                !validationState.fatherOccupation
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.fatherOccupation &&
                                "*Invalid Occupation"}
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
                                !validationState.fatherEmail
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.fatherEmail &&
                                "*Email is Invalid"}
                            </div>
                          </div>
                          {/* Father Qualification */}
                          <div className="col-12">
                            <label className="form-label">
                              Father Qualification
                            </label>
                            <input
                              type="text"
                              name="fatherQualification"
                              onChange={handleInputChange}
                              value={formData.fatherQualification}
                              className={`form-control  radius-12 ${
                                !validationState.fatherQualification
                                  ? "border-danger"
                                  : ""
                              }`}
                              placeholder=""
                            />
                          </div>
                          {/* Father Income */}
                          <div className="col-12">
                            <label className="form-label">Father Income</label>
                            <input
                              type="number"
                              name="fatherIncome"
                              onChange={handleInputChange}
                              value={formData.fatherIncome}
                              className={`form-control  radius-12 ${
                                !validationState.fatherIncome
                                  ? "border-danger"
                                  : ""
                              }`}
                              placeholder=""
                            />
                          </div>
                          {/* Father Company */}
                          <div className="col-12">
                            <label className="form-label">Father Company</label>
                            <input
                              type="text"
                              name="fatherCompany"
                              onChange={handleInputChange}
                              value={formData.fatherCompany}
                              className={`form-control  radius-12 ${
                                !validationState.fatherCompany
                                  ? "border-danger"
                                  : ""
                              }`}
                              placeholder=""
                            />
                          </div>
                          {/* Father Photo upload */}
                          <div className="mb-4">
                            <Label>Photo</Label>
                            <div className="mt-2 flex items-start gap-4">
                              <div className="h-32 w-32 overflow-hidden rounded border bg-gray-100">
                                <img
                                  src={fatherImage}
                                  alt="Father Profile photo"
                                  className="h-full w-full object-cover"
                                />
                                <input
                                  type="file"
                                  id="fatherFileInput"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFatherProfileImage}
                                />
                              </div>
                              <Button
                                variant="outline"
                                className="h-10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document
                                    .getElementById("fatherFileInput")
                                    .click();
                                }}
                              >
                                <PenSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      {/* mother detail */}
                      <div className="card-body mt-4">
                        {/* <div>Father Details</div> */}
                        <div className="row grid grid-cols-1 gap-4 sm:grid-cols-4">
                          {/* Mother Name */}
                          <div className="col-12">
                            <label htmlFor="motherName" className="form-label">
                              Mother Name{" "}
                            </label>
                            <input
                              type="text"
                              name="motherName"
                              onChange={handleInputChange}
                              value={formData.motherName}
                              className={`form-control  radius-12 ${
                                !validationState.motherName
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.motherName &&
                                "*Full name is Invalid"}
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
                                !validationState.motherPhone
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.motherPhone &&
                                "*Phone no is Invalid"}
                            </div>
                          </div>
                          {/* Mother Occupation */}
                          <div className="col-12">
                            <label
                              htmlFor="motherOccupation"
                              className="form-label"
                            >
                              Mother Occupation{" "}
                            </label>
                            <input
                              type="text"
                              name="motherOccupation"
                              value={formData.motherOccupation}
                              onChange={handleInputChange}
                              className={`form-control radius-12 ${
                                !validationState.motherOccupation
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.motherOccupation &&
                                "*Full name is Invalid"}
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
                                !validationState.motherEmail
                                  ? "border-danger"
                                  : ""
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
                              {!validationState.motherEmail &&
                                "*Email is Invalid"}
                            </div>
                          </div>
                          {/* Mother Qualification */}
                          <div className="col-12">
                            <label className="form-label">
                              Mother Qualification
                            </label>
                            <input
                              type="text"
                              name="motherQualification"
                              onChange={handleInputChange}
                              value={formData.motherQualification}
                              className={`form-control  radius-12 ${
                                !validationState.motherQualification
                                  ? "border-danger"
                                  : ""
                              }`}
                              placeholder=""
                            />
                          </div>
                          {/* Mother Income */}
                          <div className="col-12">
                            <label className="form-label">Mother Income</label>
                            <input
                              type="number"
                              name="motherIncome"
                              onChange={handleInputChange}
                              value={formData.motherIncome}
                              className={`form-control  radius-12 ${
                                !validationState.motherIncome
                                  ? "border-danger"
                                  : ""
                              }`}
                              placeholder=""
                            />
                          </div>
                          {/* Mother Company */}
                          <div className="col-12">
                            <label className="form-label">Mother Company</label>
                            <input
                              type="text"
                              name="motherCompany"
                              onChange={handleInputChange}
                              value={formData.motherCompany}
                              className={`form-control  radius-12 ${
                                !validationState.motherCompany
                                  ? "border-danger"
                                  : ""
                              }`}
                              placeholder=""
                            />
                          </div>
                          {/* Mother Photo upload */}
                          <div className="mb-4">
                            <Label>Photo</Label>
                            <div className="mt-2 flex items-start gap-4">
                              <div className="h-32 w-32 overflow-hidden rounded border bg-gray-100">
                                <img
                                  src={motherImage}
                                  alt="Mother Profile photo"
                                  className="h-full w-full object-cover"
                                />
                                <input
                                  type="file"
                                  id="motherFileInput"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleMotherProfileImage}
                                />
                              </div>
                              <Button
                                variant="outline"
                                className="h-10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document
                                    .getElementById("motherFileInput")
                                    .click();
                                }}
                              >
                                <PenSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div
                        className={`${
                          isVisible
                            ? "card-body opacity-100"
                            : "hidden opacity-0"
                        } transition-opacity duration-300 ease-in-out`}
                      >
                        <div className="grid grid-cols-4 gap-4">
                          {/* Left Section (3/4 width) */}
                          <div className="col-span-3 space-y-2">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 space-y-2">
                              {/* Guardian Name */}
                              <div className="col-span-1">
                                <label className="form-label">
                                  Guardian Name
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
                              <div className="col-span-1">
                                <label className="form-label">
                                  Guardian Relation
                                </label>
                                <input
                                  type="text"
                                  value={formData.guardianRelation}
                                  onChange={handleInputChange}
                                  name="guardianRelation"
                                  className="form-control"
                                  placeholder=""
                                />
                              </div>
                              {/* Guardian Phone */}
                              <div className="col-span-1">
                                <label className="form-label">
                                  Guardian Phone
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
                              {/* Guardian Email */}
                              <div className="col-span-1">
                                <label className="form-label">
                                  Guardian Email
                                </label>
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
                              {/* Guardian Qualification */}
                              <div className="col-span-1">
                                <label className="form-label">
                                  Guardian Qualification
                                </label>
                                <input
                                  type="text"
                                  name="guardianQualification"
                                  onChange={handleInputChange}
                                  value={formData.guardianQualification}
                                  className={`form-control radius-12 ${
                                    !validationState.guardianQualification
                                      ? "border-danger"
                                      : ""
                                  }`}
                                  placeholder=""
                                />
                              </div>
                              {/* Guardian Income */}
                              <div className="col-span-1">
                                <label className="form-label">
                                  Guardian Income
                                </label>
                                <input
                                  type="number"
                                  name="guardianIncome"
                                  onChange={handleInputChange}
                                  value={formData.guardianIncome}
                                  className={`form-control radius-12 ${
                                    !validationState.guardianIncome
                                      ? "border-danger"
                                      : ""
                                  }`}
                                  placeholder=""
                                />
                              </div>
                              {/* Guardian Company */}
                              <div className="col-span-1">
                                <label className="form-label">
                                  Guardian Company
                                </label>
                                <input
                                  type="text"
                                  name="guardianCompany"
                                  onChange={handleInputChange}
                                  value={formData.guardianCompany}
                                  className={`form-control radius-12 ${
                                    !validationState.guardianCompany
                                      ? "border-danger"
                                      : ""
                                  }`}
                                  placeholder=""
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right Section (1/4 width) */}
                          <div className="col-span-1 ">
                            <div className="space-y-8">
                              {/* Guardian Occupation */}
                              <div className="col-12 mt-2">
                                <label
                                  htmlFor="guardianOccupation"
                                  className="form-label"
                                >
                                  Guardian Occupation
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
                              {/* Guardian Photo Upload */}
                              <div className="mb-4">
                                <label>Photo</label>
                                <div className="mt-2 flex items-start gap-2">
                                  <div className="h-32 w-32 overflow-hidden rounded border bg-gray-100">
                                    <img
                                      src={guardianImage}
                                      alt="Guardian Profile photo"
                                      className="h-full w-full object-cover"
                                    />
                                    <input
                                      type="file"
                                      id="guardianFileInput"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleGuardianProfileImage}
                                    />
                                  </div>
                                  <button
                                    className="h-10 border px-2 rounded-md"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      document
                                        .getElementById("guardianFileInput")
                                        .click();
                                    }}
                                  >
                                    <PenSquare className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Student Document*/}
                    {/* <div className="text-lg font-bold mt-3 mb-3">
                      Upload Document
                    </div> */}

                    {/* <div className="col-12">
                            <label
                              htmlFor="studentAadharCard"
                              className="form-label"
                            >
                              Student Aadhaar
                            </label>
                            <div className="flex justify-between">
                              <input
                                id="studentAadharCard"
                                className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                                type="file"
                                name="studentAadharCard"
                                onChange={handleInputChange}
                                accept="image/*"
                              />
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
                          </div> */}
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;
