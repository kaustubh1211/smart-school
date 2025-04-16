import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import axios from "axios";
// import { input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, FileText, Lock, User, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Toast from "../components/ui/Toast";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function GenerateLeavingCertificateLayer({
  onSubmit,
  onCancel,
  studentData,
}) {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const [studentId, setStudentId] = useState(null);

  const navigate = useNavigate();

  const [fetchClass, setFetchClass] = useState([]);

  const [formData, setFormData] = useState({
    // Left Details
    leftDate: "",
    leftReason: "",
    remark: "",

    // LC Details
    issueDate: "",
    lcNo: "",
    progress: "",
    conduct: "",

    // Personal Details
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    mobile: "",
    uidAadharCardNo: "",
    address: "",

    // Academic Details
    admissionDate: "",
    classAdmitted: "",
    generalRegisterNo: "",
    enrollNo: "",
    class: "",
    classStudying: "",
    lastSchoolAttended: "",
    lastSchoolStandard: "",
    studentIdNo: "",

    // Other Details
    nationality: "INDIAN",
    religion: "",
    caste: "",
    motherTongue: "",
    subCaste: "",
    placeOfBirth: "",
    taluka: "",
    district: "",
    state: "",
    nation: "INDIA",
  });

  useEffect(() => {
    console.log("student data", studentData);
    if (studentData) {
      // Format dates from ISO to "dd-MM-yyyy" format
      setStudentId(studentData?.id);
      const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
          const date =
            typeof dateString === "string" ? parseISO(dateString) : dateString;
          return format(date, "dd-MM-yyyy");
        } catch (e) {
          console.error("Error formatting date:", e);
          return "";
        }
      };

      console.log("firstName:", studentData?.firstName);

      setFormData((prev) => ({
        ...prev,
        // Personal Details
        firstName: studentData?.firstName || "hii",
        lastName: studentData.lastName || "",
        fatherName: studentData.fatherName || "",
        motherName: studentData.motherName || "",
        dateOfBirth: formatDate(studentData.dob),
        gender: studentData.gender || "Male",
        mobile: studentData.fatherPhone || studentData.motherPhone || "",
        uidAadharCardNo: studentData.studentAadhaar || "",
        address: studentData.address || "",

        // Academic Details
        admissionDate: formatDate(studentData.admissionDate),
        generalRegisterNo: studentData.grNo || "",
        enrollNo: studentData.enrollNo?.toString() || "",
        class: studentData?.class?.id,
        classStudying: "",
        studentIdNo: studentData.id?.toString() || "",

        // Other Details
        religion: studentData.caste || "",
        caste: studentData.category || "",
        placeOfBirth: studentData.city || "",
        state: studentData.state || "",

        // Set default values for these fields
        motherTongue: "English",
        subCaste: "",
        district: "",
        taluka: "",
      }));
    }
  }, [studentData]);

  // useEffect for fetching class
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }class/list?medium=${tenant}&year=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data.data);
        setFetchClass(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClassData();
  }, [tenant, academicYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? format(date, "dd-MM-yyyy") : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatDate = (dateString) => {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    };

    const leftDate = formatDate(formData.leftDate);
    const issueDate = formatDate(formData.issueDate);

    // Create a new student record
    const newStudent = {
      leftReason: formData.leftReason,
      remark: formData.remark,
      leftDate,
      issueDate,
      progress: formData.progress,
      conduct: formData.conduct,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}certificate/student-lc/generate`,
        {
          studentId: studentId,
          leftDate: newStudent.leftDate,
          issueDate: newStudent.issueDate,
          leftReason: newStudent.leftReason,
          remark: newStudent.remark,
          conduct: newStudent.conduct,
          progress: newStudent.progress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        navigate(`/download/lc/${studentId}`);
      }
    } catch (error) {
      if (error.response) {
        Toast.showWarningToast(`${error.response.data.message}`);
        console.log(error.response.data.message);
      } else {
        Toast.showErrorToast("Sorry, our server is down");
      }
    }
  };

  const categories = [...new Set(fetchClass.map((item) => item.category))];
  // Safely group classes (fallback to empty object if data is undefined)
  const groupedClasses =
    fetchClass?.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {}) || {}; // Fallback: empty object if data is undefined

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center text-xl font-semibold">
          <span className="bg-orange-400 p-1 text-white mr-2">
            <FileText size={24} />
          </span>
          {studentData ? "Edit" : "Add New"} Leaving Certificate
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={onCancel}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Left Details Section */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-500 mb-4">
            <FileText size={20} />
            <h6>Left Details</h6>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leftDate" className="flex items-center">
                Left Date <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.leftDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.leftDate ? (
                        formData.leftDate
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.leftDate
                          ? new Date(
                              formData.leftDate.split("-").reverse().join("-")
                            )
                          : undefined
                      }
                      onSelect={(date) => handleDateChange("leftDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leftReason">Left Reason</Label>
              <input
                id="leftReason"
                name="leftReason"
                value={formData.leftReason}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remark">Remark</Label>
              <input
                id="remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* LC Details Section */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-500 mb-4">
            <FileText size={20} />
            <h6>LC Details</h6>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate" className="flex items-center">
                Issue Date <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.issueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.issueDate ? (
                        formData.issueDate
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.issueDate
                          ? new Date(
                              formData.issueDate.split("-").reverse().join("-")
                            )
                          : undefined
                      }
                      onSelect={(date) => handleDateChange("issueDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lcNo">LC Number</Label>
              <input
                id="lcNo"
                name="lcNo"
                value={formData.lcNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress</Label>
              <input
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                placeholder="e.g., SATISFACTORY"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conduct">Conduct</Label>
              <input
                id="conduct"
                name="conduct"
                value={formData.conduct}
                onChange={handleChange}
                placeholder="e.g., GOOD"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-500 mb-4">
            <User size={20} />
            <h6>Personal Detail</h6>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center">
                First Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                readOnly
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Lastname</Label>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName" className="flex items-center">
                Father Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <input
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                readOnly
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherName">Mother Name</Label>
              <input
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? (
                        formData.dateOfBirth
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.dateOfBirth
                          ? new Date(
                              formData.dateOfBirth
                                .split("-")
                                .reverse()
                                .join("-")
                            )
                          : undefined
                      }
                      onSelect={(date) => handleDateChange("dateOfBirth", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center">
                Gender <span className="text-red-500 ml-1">*</span>
              </Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uidAadharCardNo">Aadhar No</Label>
              <input
                id="uidAadharCardNo"
                name="uidAadharCardNo"
                value={formData.uidAadharCardNo}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Student Academic Details Section */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-500 mb-4">
            <FileText size={20} />
            <h6>Student Academic Details</h6>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-2">
              <Label htmlFor="admissionDate" className="flex items-center">
                Admission Date <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative pt-2.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.admissionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.admissionDate ? (
                        formData.admissionDate
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.admissionDate
                          ? new Date(
                              formData.admissionDate
                                .split("-")
                                .reverse()
                                .join("-")
                            )
                          : undefined
                      }
                      onSelect={(date) =>
                        handleDateChange("admissionDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classAdmitted">Class Admitted</Label>
              <input
                id="classAdmitted"
                name="classAdmitted"
                value={formData.classAdmitted}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generalRegisterNo">GR No</Label>
              <input
                id="generalRegisterNo"
                name="generalRegisterNo"
                value={formData.generalRegisterNo}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollNo">Enroll No</Label>
              <input
                id="enrollNo"
                name="enrollNo"
                value={formData.enrollNo}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="class" className="flex items-center">
                Class <span className="text-red-">*</span>
              </Label>
              <select
                className="form-select form-select-sm px-3 py-2 rounded-md w-full"
                name="class"
                id="class"
                value={formData.class} // This controls the selected option
                onChange={(e) => handleSelectChange("class", e.target.value)}
              >
                <option value="">Select</option>

                {Object.entries(groupedClasses).length > 0 ? (
                  Object.entries(groupedClasses).map(([category, classes]) => (
                    <optgroup key={category} label={category}>
                      {classes
                        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                        .map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={formData.class === item.id} // Optional: Explicit selected (React prefers `value` on <select>)
                          >
                            {item.class}
                          </option>
                        ))}
                    </optgroup>
                  ))
                ) : (
                  <option disabled>Loading classes...</option>
                )}
              </select>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="classStudying">Class Studying</Label>
              <input
                id="classStudying"
                name="classStudying"
                value={formData.classStudying}
                onChange={handleChange}
                placeholder="e.g., STD 8TH (EIGHTH) SINCE JUNE 2023"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="lastSchoolAttended" className="flex items-center">
                Last School Attend <span className="text-red-500 ml-1">*</span>
              </Label>
              <input
                id="lastSchoolAttended"
                name="lastSchoolAttended"
                value={formData.lastSchoolAttended}
                onChange={handleChange}
                required
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="pt-2">
                {" "}
                <Label
                  htmlFor="lastSchoolStandard"
                  className="flex items-center"
                >
                  Last School Standard{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <input
                  id="lastSchoolStandard"
                  name="lastSchoolStandard"
                  value={formData.lastSchoolStandard}
                  onChange={handleChange}
                  readOnly
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentIdNo">Student UID</Label>
              <input
                id="studentIdNo"
                name="studentIdNo"
                value={formData.studentIdNo}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Student Other Detail Section */}
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-500 mb-4">
            <Lock size={20} />
            <h6>Student Other Detail</h6>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Select
                value={formData.religion}
                onValueChange={(value) => handleSelectChange("religion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Religion --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hindu">Hindu</SelectItem>
                  <SelectItem value="Muslim">Muslim</SelectItem>
                  <SelectItem value="Christian">Christian</SelectItem>
                  <SelectItem value="Sikh">Sikh</SelectItem>
                  <SelectItem value="Buddhist">Buddhist</SelectItem>
                  <SelectItem value="Jain">Jain</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caste">Caste Category</Label>
              <Select
                value={formData.caste}
                onValueChange={(value) => handleSelectChange("caste", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Caste --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                  <SelectItem value="OBC">OBC</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="MUSLIM">MUSLIM</SelectItem>
                  <SelectItem value="BRAHMIN">BRAHMIN</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherTongue">Mother Tongue</Label>
              <input
                id="motherTongue"
                name="motherTongue"
                value={formData.motherTongue}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCaste">Sub Caste</Label>
              <input
                id="subCaste"
                name="subCaste"
                value={formData.subCaste}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="birthPlace">Birth Place</Label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
              <input
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                readOnly
                placeholder="(Village/City)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="taluka"
                name="taluka"
                value={formData.taluka}
                onChange={handleChange}
                readOnly
                placeholder="(Taluka)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                readOnly
                placeholder="(District)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                readOnly
                placeholder="(State)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="nation"
                name="nation"
                value={formData.nation}
                onChange={handleChange}
                readOnly
                placeholder="(Nation)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
