import { useState } from "react";
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
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function UpdateBonafideCertificate({
  student,
  onUpdate,
  onCancel,
}) {
  const [open, setOpen] = useState(false);

  // Extract first name from full name (assuming format is "LASTNAME FIRSTNAME")
  const fullName = student.student || "";

  // Function to format date
  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "dd-MM-yyyy");
  };

  // Form state
  const [formData, setFormData] = useState({
    // Bonafide Details
    issueDate: student.date || formatDate(new Date()),
    number: student.bno || "",
    purpose: student.purpose || "",

    // Student Details
    grNo: student.grNo || "",
    enrollNo: student.enrollNo || "",
    class: student.class || "",
    year: student.year || "",
    firstName: student.student || "",
    lastName: student.lastName || "",
    fatherName: student.fatherName || "",
    motherName: student.motherName || "",
    dateOfBirth: student.dateOfBirth || "",
    gender: student.gender || "",
    aadhaarNo: student.aadhaarNo || "",
    motherTongue: student.motherTongue || "",
    religion: student.religion || "",
    casteCategory: student.casteCategory || "",
    subCaste: student.subCaste || "",
    birthPlace: student.birthPlace || {
      village: "",
      taluka: "",
      district: "",
      state: "",
      nation: "",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an updated student object
    const updatedStudent = {
      ...student,
      date: formData.issueDate,
      bno: formData.number,
      student: `${formData.firstName} ${formData.lastName}`.trim(),
      class: formData.class,
      purpose: formData.purpose,
      grNo: formData.grNo,
      enrollNo: formData.enrollNo,
      year: formData.year,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      aadhaarNo: formData.aadhaarNo,
      motherTongue: formData.motherTongue,
      religion: formData.religion,
      casteCategory: formData.casteCategory,
      birthPlace: formData.birthPlace,
    };

    // Call the onUpdate function passed from the parent component
    onUpdate(updatedStudent);
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
            <Button
              type="button"
              variant="outline"
              className="ml-auto px-16 py-8 mt-16"
              onClick={onCancel}
            >
              <ArrowLeft />
              Back
            </Button>
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
                  onChange={(e) =>
                    handleInputChange("issueDate", e.target.value)
                  }
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
                Purpose
              </Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                className="ml-4 flex-1"
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
              onChange={(e) => handleInputChange("grNo", e.target.value)}
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
              onChange={(e) => handleInputChange("enrollNo", e.target.value)}
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="class" className="w-32 text-right">
              Class <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.class}
              onValueChange={(value) => handleInputChange("class", value)}
            >
              <SelectTrigger className="ml-4 flex-1">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MADHYAMIK ⇒ STD X">
                  MADHYAMIK ⇒ STD X
                </SelectItem>
                <SelectItem value="MADHYAMIK ⇒ STD IX">
                  MADHYAMIK ⇒ STD IX
                </SelectItem>
                <SelectItem value="MADHYAMIK ⇒ STD VIII">
                  MADHYAMIK ⇒ STD VIII
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="year" className="w-32 text-right">
              Year
            </Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="firstName" className="w-32 text-right">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
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
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="fatherName" className="w-32 text-right">
              Father Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fatherName"
              value={formData.fatherName}
              onChange={(e) => handleInputChange("fatherName", e.target.value)}
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
              onChange={(e) => handleInputChange("motherName", e.target.value)}
              className="ml-4 flex-1"
            />
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="dateOfBirth" className="w-32 text-right">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <div className="ml-4 flex-1">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth
                      ? format(new Date(formData.dateOfBirth), "dd-MM-yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    className={"text-sm justify-center items-center"}
                    onChange={(date) => {
                      handleInputChange(
                        "dateOfBirth",
                        format(date, "yyyy-MM-dd")
                      );
                      setOpen(false); // Close popover after selection
                    }}
                    value={
                      formData.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                        : new Date()
                    }
                    calendarType="gregory"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex items-center">
            <Label htmlFor="gender" className="w-32 text-right">
              Gender <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
              className="ml-4 flex-1 flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Left Column */}
          <div className="flex items-center">
            <Label htmlFor="aadhaarNo" className="w-32 text-right">
              Aadhaar No <span className="text-red-500">*</span>
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
                  <SelectItem value="MUSLIM">MUSLIM</SelectItem>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                  <SelectItem value="OBC">OBC</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
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

        <div className="flex justify-start gap-4 mt-8 ml-16">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-16 py-8 mt-16"
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
