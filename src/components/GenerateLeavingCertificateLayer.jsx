import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function GenerateLeavingCertificateLayer({
  onSubmit,
  onCancel,
  studentData,
}) {
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
    gender: "Male",
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

      // Get class from classId (15) or mediumName
      const getClassFromData = () => {
        // If classId is available (e.g., 15), map it to your class format
        if (studentData.classId) {
          const classMap = {
            15: "STD X-A", // Example mapping - adjust according to your system
            // Add other mappings as needed
          };
          return classMap[studentData.classId] || "";
        }

        // Fallback to mediumName if classId not available
        if (studentData.mediumName) {
          // Handle different mediumName formats
          if (studentData.mediumName.includes("ENG")) return "STD X-A"; // Example
          if (studentData.mediumName.includes("1")) return "STD I-A";
          // Add other cases as needed
        }

        return "";
      };

      setFormData((prev) => ({
        ...prev,
        // Personal Details
        firstName: studentData.firstName || "",
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
        class: getClassFromData(),
        classStudying: getClassFromData(),
        studentIdNo: studentData.id?.toString() || "",

        // Other Details
        religion: studentData.religion || "",
        caste: studentData.caste || studentData.category || "",
        placeOfBirth: studentData.city || "",
        state: studentData.state || "",

        // Map additional fields
        motherTongue: "English", // Default or from data if available
        subCaste: "", // Not in sample data
        district: "", // Not in sample data
        taluka: "", // Not in sample data
      }));
    }
  }, [studentData]);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new student record
    const newStudent = {
      id: formData.studentIdNo || Math.ceil(Math.random() * 100), // Use existing ID or generate new
      lcNo: formData.lcNo,
      enrollNo: formData.enrollNo,
      name: `${formData.firstName} ${formData.lastName}`.toUpperCase(),
      stdFromLeave: formData.classStudying,
      stdClass: formData.class,
      reasonOfLeaving: formData.leftReason.toUpperCase(),
      remark: formData.remark.toUpperCase(),
      leftDate: formData.leftDate,
      issueDate: formData.issueDate,

      // Additional data for certificate
      studentIdNo: formData.studentIdNo,
      serialNo: formData.lcNo,
      generalRegisterNo: formData.generalRegisterNo,
      uidAadharCardNo: formData.uidAadharCardNo,
      fatherName: formData.fatherName.toUpperCase(),
      motherName: formData.motherName.toUpperCase(),
      nationality: formData.nationality.toUpperCase(),
      motherTongue: formData.motherTongue.toUpperCase(),
      religion: formData.religion.toUpperCase(),
      caste: formData.caste.toUpperCase(),
      subCaste: formData.subCaste.toUpperCase(),
      placeOfBirth: formData.placeOfBirth.toUpperCase(),
      district: formData.district.toUpperCase(),
      state: formData.state.toUpperCase(),
      nation: formData.nation.toUpperCase(),
      taluka: formData.taluka.toUpperCase(),
      dateOfBirth: formData.dateOfBirth,
      dateOfBirthInWords: convertDateToWords(formData.dateOfBirth),
      lastSchoolAttended: formData.lastSchoolAttended.toUpperCase(),
      lastSchoolStandard: formData.lastSchoolStandard.toUpperCase(),
      dateOfAdmission: formData.admissionDate,
      progressInStudies: formData.progress.toUpperCase(),
      conduct: formData.conduct.toUpperCase(),
      standardStudying: formData.classStudying.toUpperCase(),
    };
    onSubmit(newStudent);
  };

  // Helper function to convert date to words
  const convertDateToWords = (dateString) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("-");

    const dayInWords = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth",
      "Thirteenth",
      "Fourteenth",
      "Fifteenth",
      "Sixteenth",
      "Seventeenth",
      "Eighteenth",
      "Nineteenth",
      "Twentieth",
      "Twenty First",
      "Twenty Second",
      "Twenty Third",
      "Twenty Fourth",
      "Twenty Fifth",
      "Twenty Sixth",
      "Twenty Seventh",
      "Twenty Eighth",
      "Twenty Ninth",
      "Thirtieth",
      "Thirty First",
    ];

    const monthInWords = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const yearInWords = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];

    const dayWord = dayInWords[parseInt(day) - 1];
    const monthWord = monthInWords[parseInt(month) - 1];

    // Convert year to words (e.g., 2010 -> "Two Thousand Ten")
    let yearWord = "Two Thousand";
    if (year.substring(2) !== "00") {
      const lastTwoDigits = parseInt(year.substring(2));
      if (lastTwoDigits < 10) {
        yearWord += " " + yearInWords[lastTwoDigits];
      } else if (lastTwoDigits < 20) {
        const teens = [
          "Ten",
          "Eleven",
          "Twelve",
          "Thirteen",
          "Fourteen",
          "Fifteen",
          "Sixteen",
          "Seventeen",
          "Eighteen",
          "Nineteen",
        ];
        yearWord += " " + teens[lastTwoDigits - 10];
      } else {
        const tens = [
          "Twenty",
          "Thirty",
          "Forty",
          "Fifty",
          "Sixty",
          "Seventy",
          "Eighty",
          "Ninety",
        ];
        const tensDigit = Math.floor(lastTwoDigits / 10);
        const onesDigit = lastTwoDigits % 10;
        yearWord += " " + tens[tensDigit - 2];
        if (onesDigit > 0) {
          yearWord += " " + yearInWords[onesDigit];
        }
      }
    }

    return `${dayWord} ${monthWord} ${yearWord}`;
  };

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
              <Input
                id="leftReason"
                name="leftReason"
                value={formData.leftReason}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remark">Remark</Label>
              <Input
                id="remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
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
              <Input
                id="lcNo"
                name="lcNo"
                value={formData.lcNo}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress</Label>
              <Input
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                placeholder="e.g., SATISFACTORY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conduct">Conduct</Label>
              <Input
                id="conduct"
                name="conduct"
                value={formData.conduct}
                onChange={handleChange}
                placeholder="e.g., GOOD"
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
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Lastname</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName" className="flex items-center">
                Father Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherName">Mother Name</Label>
              <Input
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
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
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uidAadharCardNo">Aadhar No</Label>
              <Input
                id="uidAadharCardNo"
                name="uidAadharCardNo"
                value={formData.uidAadharCardNo}
                onChange={handleChange}
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
            <div className="space-y-2">
              <Label htmlFor="admissionDate" className="flex items-center">
                Admission Date <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
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
              <Input
                id="classAdmitted"
                name="classAdmitted"
                value={formData.classAdmitted}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generalRegisterNo">GR No</Label>
              <Input
                id="generalRegisterNo"
                name="generalRegisterNo"
                value={formData.generalRegisterNo}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollNo">Enroll No</Label>
              <Input
                id="enrollNo"
                name="enrollNo"
                value={formData.enrollNo}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="flex items-center">
                Class <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.class}
                onValueChange={(value) => handleSelectChange("class", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Class --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STD I-A">STD I-A</SelectItem>
                  <SelectItem value="STD I-B">STD I-B</SelectItem>
                  <SelectItem value="STD II-A">STD II-A</SelectItem>
                  <SelectItem value="STD II-B">STD II-B</SelectItem>
                  <SelectItem value="STD III-A">STD III-A</SelectItem>
                  <SelectItem value="STD III-B">STD III-B</SelectItem>
                  <SelectItem value="STD IV-A">STD IV-A</SelectItem>
                  <SelectItem value="STD IV-B">STD IV-B</SelectItem>
                  <SelectItem value="STD V-A">STD V-A</SelectItem>
                  <SelectItem value="STD V-B">STD V-B</SelectItem>
                  <SelectItem value="STD VI-A">STD VI-A</SelectItem>
                  <SelectItem value="STD VI-B">STD VI-B</SelectItem>
                  <SelectItem value="STD VII-A">STD VII-A</SelectItem>
                  <SelectItem value="STD VII-B">STD VII-B</SelectItem>
                  <SelectItem value="STD VIII-A">STD VIII-A</SelectItem>
                  <SelectItem value="STD VIII-B">STD VIII-B</SelectItem>
                  <SelectItem value="STD IX-A">STD IX-A</SelectItem>
                  <SelectItem value="STD IX-B">STD IX-B</SelectItem>
                  <SelectItem value="STD X-A">STD X-A</SelectItem>
                  <SelectItem value="STD X-B">STD X-B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classStudying">Class Studying</Label>
              <Input
                id="classStudying"
                name="classStudying"
                value={formData.classStudying}
                onChange={handleChange}
                placeholder="e.g., STD 8TH (EIGHTH) SINCE JUNE 2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastSchoolAttended" className="flex items-center">
                Last School Attend <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="lastSchoolAttended"
                name="lastSchoolAttended"
                value={formData.lastSchoolAttended}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastSchoolStandard" className="flex items-center">
                Last School Standard{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="lastSchoolStandard"
                name="lastSchoolStandard"
                value={formData.lastSchoolStandard}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentIdNo">Student UID</Label>
              <Input
                id="studentIdNo"
                name="studentIdNo"
                value={formData.studentIdNo}
                onChange={handleChange}
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
              <Input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
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
                  <SelectItem value="HINDU">HINDU</SelectItem>
                  <SelectItem value="MUSLIM">MUSLIM</SelectItem>
                  <SelectItem value="CHRISTIAN">CHRISTIAN</SelectItem>
                  <SelectItem value="SIKH">SIKH</SelectItem>
                  <SelectItem value="BUDDHIST">BUDDHIST</SelectItem>
                  <SelectItem value="JAIN">JAIN</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
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
              <Input
                id="motherTongue"
                name="motherTongue"
                value={formData.motherTongue}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCaste">Sub Caste</Label>
              <Input
                id="subCaste"
                name="subCaste"
                value={formData.subCaste}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="birthPlace">Birth Place</Label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
              <Input
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                placeholder="(Village/City)"
              />
              <Input
                id="taluka"
                name="taluka"
                value={formData.taluka}
                onChange={handleChange}
                placeholder="(Taluka)"
              />
              <Input
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="(District)"
              />
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="(State)"
              />
              <Input
                id="nation"
                name="nation"
                value={formData.nation}
                onChange={handleChange}
                placeholder="(Nation)"
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
