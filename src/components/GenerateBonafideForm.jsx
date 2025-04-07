import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import Toast from "../components/ui/Toast";
import dayjs from "dayjs";

export default function GenerateBonafideForm({ type, student, onClose }) {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const [studentId, setStudentId] = useState(null);
  const [fetchClass, setFetchClass] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(() => {
    const existing = JSON.parse(
      localStorage.getItem("bonafideCertificates") || "[]"
    );
    return existing.length + 1;
  });

  // Format date to DD-MM-YYYY using dayjs
  const formatDate = (date) => {
    if (!date) return "";
    try {
      return dayjs(date).isValid() ? dayjs(date).format("DD-MM-YYYY") : "";
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    // Bonafide Details
    issueDate: formatDate(new Date()),
    number: "",
    purpose: "",

    // Student Details
    grNo: "",
    enrollNo: "",
    class: "",
    year: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    aadhaarNo: "",
    motherTongue: "",
    religion: "",
    casteCategory: "",
    subCaste: "",
    birthPlace: {
      village: "",
      taluka: "",
      district: "",
      state: "",
      nation: "",
    },
  });

  useEffect(() => {
    if (student) {
      setStudentId(student.id);
      setFormData((prev) => ({
        ...prev,
        // Bonafide Details
        issueDate: formatDate(new Date()),

        // Student Details
        grNo: student.grNo || "",
        enrollNo: student.enrollNo?.toString() || "",
        class: student.class?.id || "",
        year: student.academicYearName || "",
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        dob: student.dob ? formatDate(student.dob) : "",
        gender: student.gender || "Male",
        aadhaarNo: "",
        motherTongue: "English",
        religion: student.caste || "",
        casteCategory: student.category || "",
        subCaste: "",
        birthPlace: {
          village: student.city || "",
          taluka: "",
          district: "",
          state: student.state || "",
          nation: "India",
        },
      }));
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.purpose) {
      alert("Please fill in the purpose field.");
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }certificate/student/bonafied/create`,
        {
          studentId: studentId,
          issueDate: formData.issueDate,
          purpose: formData.purpose,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        Toast.showSuccessToast(response.data.message);

        navigate(`/bonafide-certificate/${studentId}`);
        onClose();
      }
    } catch (error) {
      if (error.response) {
        Toast.showWarningToast(`${error.response.data.message}`);
        console.log(error.response.data.message);
      } else if (error.request) {
        Toast.showErrorToast("Sorry, our server is down");
      } else {
        Toast.showErrorToast("Sorry, please try again later");
      }
    }
  };

  // useEffect for fetching class
  useEffect(() => {
    const fetchClassData = async () => {
      try {
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
        setFetchClass(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClassData();
  }, [tenant, academicYear]);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBirthPlaceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      birthPlace: {
        ...prev.birthPlace,
        [field]: value,
      },
    }));
  };

  const categories = [...new Set(fetchClass.map((item) => item.category))];
  const groupedClasses =
    fetchClass?.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {}) || {};

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bonafide Details Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
            </svg>
            <h1 className="text-xl font-semibold">Bonafide Details</h1>
            <div
              className={`ml-auto px-3 py-1 ${
                type === "Student" ? "bg-green-500" : "bg-red-500"
              } text-white rounded text-sm`}
            >
              {type}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
            <div className="flex items-center">
              <Label htmlFor="issueDate" className="w-32 text-right">
                Issue Date <span className="text-red-500">*</span>
              </Label>
              <div className="ml-4 flex-1 relative">
                <Input
                  id="issueDate"
                  value={formData.issueDate}
                  readOnly
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <CalendarIcon className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Label htmlFor="number" className="w-32 text-right">
                Number
              </Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                className="ml-4 flex-1"
              />
            </div>

            <div className="flex items-center md:col-span-2">
              <Label htmlFor="purpose" className="w-32 text-right">
                Purpose <span className="text-red-500">*</span>
              </Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                className="ml-4 flex-1"
                required
              />
            </div>
          </div>
        </div>

        {/* Student Details Section */}
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <h1 className="text-xl font-semibold">Student Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="grNo" className="w-32 text-right">
              GR No
            </Label>
            <Input
              id="grNo"
              value={formData.grNo}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="enrollNo" className="w-32 text-right">
              Enroll No
            </Label>
            <Input
              id="enrollNo"
              value={formData.enrollNo}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="class" className="w-32 text-right">
              Class
            </Label>
            <Input
              id="class"
              value={student?.class?.class || ""}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="year" className="w-32 text-right">
              Year
            </Label>
            <Input
              id="year"
              value={formData.year}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="firstName" className="w-32 text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="lastName" className="w-32 text-right">
              Lastname
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="fatherName" className="w-32 text-right">
              Father Name
            </Label>
            <Input
              id="fatherName"
              value={formData.fatherName}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="motherName" className="w-32 text-right">
              Mother Name
            </Label>
            <Input
              id="motherName"
              value={formData.motherName}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="dob" className="w-32 text-right">
              Date of Birth
            </Label>
            <Input
              id="dob"
              value={formData.dob}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="gender" className="w-32 text-right">
              Gender
            </Label>
            <Input
              id="gender"
              value={formData.gender}
              readOnly
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="aadhaarNo" className="w-32 text-right">
              Aadhaar No
            </Label>
            <Input
              id="aadhaarNo"
              value={formData.aadhaarNo}
              onChange={(e) => handleInputChange("aadhaarNo", e.target.value)}
              className="ml-4 flex-1"
            />
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="motherTongue" className="w-32 text-right">
              Mother Tongue
            </Label>
            <Input
              id="motherTongue"
              value={formData.motherTongue}
              onChange={(e) =>
                handleInputChange("motherTongue", e.target.value)
              }
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="religion" className="w-32 text-right">
              Religion
            </Label>
            <Select
              value={formData.religion}
              onValueChange={(value) => handleInputChange("religion", value)}
            >
              <SelectTrigger className="ml-4 flex-1">
                <SelectValue placeholder="Select Religion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MUSLIM">MUSLIM</SelectItem>
                <SelectItem value="HINDU">HINDU</SelectItem>
                <SelectItem value="CHRISTIAN">CHRISTIAN</SelectItem>
                <SelectItem value="SIKH">SIKH</SelectItem>
                <SelectItem value="BUDDHIST">BUDDHIST</SelectItem>
                <SelectItem value="JAIN">JAIN</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="casteCategory" className="w-32 text-right">
              Caste Category
            </Label>
            <div className="ml-4 flex-1 grid grid-cols-3 gap-4">
              <Select
                value={formData.casteCategory}
                onValueChange={(value) =>
                  handleInputChange("casteCategory", value)
                }
              >
                <SelectTrigger className="col-span-1">
                  <SelectValue placeholder="Select Caste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AHIR">AHIR</SelectItem>
                  <SelectItem value="BADHAI">BADHAI</SelectItem>
                  <SelectItem value="BHUMIHAR">BHUMIHAR</SelectItem>
                  <SelectItem value="BOISAR">BOISAR</SelectItem>
                  <SelectItem value="BRAHAMAN">BRAHAMAN</SelectItem>
                  <SelectItem value="BRAHMAN">BRAHMAN</SelectItem>
                  <SelectItem value="BRAHMIN">BRAHMIN</SelectItem>
                  <SelectItem value="GUJARATI">GUJARATI</SelectItem>
                  <SelectItem value="H">H</SelectItem>
                  <SelectItem value="HINDI">HINDI</SelectItem>
                  <SelectItem value="HINDU">HINDU</SelectItem>
                  <SelectItem value="HINDU (DEV VANSHI)">
                    HINDU (DEV VANSHI)
                  </SelectItem>
                  <SelectItem value="HINDU (PRAJAPATI)">
                    HINDU (PRAJAPATI)
                  </SelectItem>
                  <SelectItem value="ISLAM">ISLAM</SelectItem>
                  <SelectItem value="KSHATRIYA">KSHATRIYA</SelectItem>
                  <SelectItem value="KUMHAR">KUMHAR</SelectItem>
                  <SelectItem value="MANIHAR">MANIHAR</SelectItem>
                  <SelectItem value="MEHRA">MEHRA</SelectItem>
                  <SelectItem value="MU">MU</SelectItem>
                  <SelectItem value="MUSALMAN">MUSALMAN</SelectItem>
                  <SelectItem value="MUSLIM">MUSLIM</SelectItem>
                  <SelectItem value="MUSLIM MANSURI">MUSLIM MANSURI</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="RAJPUT">RAJPUT</SelectItem>
                  <SelectItem value="TELI">TELI</SelectItem>
                </SelectContent>
              </Select>
              <Input
                className="col-span-2"
                placeholder="Sub-caste (if any)"
                value={formData.subCaste}
                onChange={(e) => handleInputChange("subCaste", e.target.value)}
              />
            </div>
          </div>

          {/* Birth Place - Full Width */}
          <div className="flex items-center md:col-span-2">
            <Label htmlFor="birthPlace" className="w-32 text-right">
              Birth Place
            </Label>
            <div className="ml-4 flex-1 grid grid-cols-5 gap-2">
              <Input
                placeholder="(Village/City)"
                value={formData.birthPlace.village}
                onChange={(e) =>
                  handleBirthPlaceChange("village", e.target.value)
                }
              />
              <Input
                placeholder="(Taluka)"
                value={formData.birthPlace.taluka}
                onChange={(e) =>
                  handleBirthPlaceChange("taluka", e.target.value)
                }
              />
              <Input
                placeholder="(District)"
                value={formData.birthPlace.district}
                onChange={(e) =>
                  handleBirthPlaceChange("district", e.target.value)
                }
              />
              <Input
                placeholder="(State)"
                value={formData.birthPlace.state}
                onChange={(e) =>
                  handleBirthPlaceChange("state", e.target.value)
                }
              />
              <Input
                placeholder="(Nation)"
                value={formData.birthPlace.nation}
                onChange={(e) =>
                  handleBirthPlaceChange("nation", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-start mt-8 ml-16">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-16 py-2 mt-16"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
