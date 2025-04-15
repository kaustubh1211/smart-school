import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  Pencil,
  PenSquare,
  SeparatorHorizontal,
  SeparatorVertical,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Toast from "../ui/Toast";

export default function ExamMasterForm({
  onSubmit,
  onCancel,
  initialData,
  name,
}) {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [isLoading, setIsLoading] = useState(false);
  const [classValue, setClassValue] = useState("");
  const [examName, setExamName] = useState("");
  const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [reportCardDate, setReportCardDate] = useState();
  const [sequence, setSequence] = useState("1");
  const [publish, setPublish] = useState("NO");

  const [errors, setErrors] = useState({
    classValue: "",
    examName: "",
    startDate: "",
    endDate: "",
    reportCardDate: "",
    dateRange: "",
  });

  // Initialize form with initialData if provided
  useEffect(() => {
    if (initialData) {
      setClassValue(initialData.standard);
      setExamName(initialData.examName);
      setSequence(initialData.sequence.toString());
      setPublish(initialData.published ? "YES" : "NO");
      if (initialData.startDate) setStartDate(new Date(initialData.startDate));
      if (initialData.endDate) setEndDate(new Date(initialData.endDate));
      if (initialData.reportCardDate)
        setReportCardDate(new Date(initialData.reportCardDate));
      setShowAdvanceSettings(true); // Show advanced settings if we have dates
    }
  }, [initialData]);

  // Clear date range error when either date changes
  useEffect(() => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        setErrors((prev) => ({
          ...prev,
          dateRange: "Start date must be before end date",
        }));
      } else {
        setErrors((prev) => ({ ...prev, dateRange: "" }));
      }
    }
  }, [startDate, endDate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      classValue: "",
      examName: "",
      startDate: "",
      endDate: "",
      reportCardDate: "",
      dateRange: "",
    };
    //validate class selection
    if (!classValue) {
      newErrors.classValue = "Please select a class";
      isValid = false;
    }

    if (!examName) {
      newErrors.examName = "Please enter an exam name";
      isValid = false;
    } else if (examName.length < 3) {
      newErrors.examName = "Exam name must be atleast 3 characters";
      isValid = false;
    }

    if (showAdvanceSettings) {
      if (!startDate) {
        newErrors.startDate = "Please select a start date";
        isValid = false;
      }
      if (!endDate) {
        newErrors.endDate = "Please select an end date";
        isValid = false;
      }
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        newErrors.dateRange = "Start date must be before end date";
        isValid = false;
      }
      if (!reportCardDate) {
        newErrors.reportCardDate = "Please select a report card date";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const newExam = {
        section: ["STD VIII", "STD IX", "STD X"].includes(classValue)
          ? "MADHYAMIK"
          : "PRATHAMIK",
        standard: classValue,
        examName: examName,
        sequence: parseInt(sequence),
        published: publish === "YES",
        createdOn: initialData
          ? initialData.createdOn
          : new Date().toISOString(),
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
        reportCardDate: reportCardDate
          ? format(reportCardDate, "yyyy-MM-dd")
          : null,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      Toast.showSuccessToast(
        initialData ? "Exam updated successfully" : "Exam created successfully"
      );
      onSubmit(newExam);
    } catch (error) {
      console.log("Error creating exam", error);
      Toast.showErrorToast(
        initialData ? "Error updating exam" : "Error creating exam"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex bg-white p-2 shadow-sm">
        {/* Left Side - Student Master */}
        <div className="flex items-center gap-4 w-full">
          <PenSquare className="h-4 w-4" />
          <h1 className="text-xl font-semibold"> {name} Exam Master</h1>
        </div>

        {/* Right Side - Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" className="gap-2" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button variant="outline" className="text-blue-500">
            Assessment Master
          </Button>
          <Button variant="outline" className="text-green-500">
            List Exam
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <Card className="p-5">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">Class</label>
              <div
                className="form-control-wrapper"
                style={{ position: "relative" }}
              >
                {" "}
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="class"
                    className={`form-control ${
                      errors.classValue ? "border-red-500" : ""
                    }`}
                    value={classValue}
                    onChange={(e) => {
                      setClassValue(e.target.value);
                      setErrors((prev) => ({ ...prev, classValue: "" }));
                    }}
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
                      right: "10px" /* Adjust this value for proper spacing */,
                      top: "50%",
                      transform:
                        "translateY(-50%)" /* Vertically center the icon */,
                      pointerEvents:
                        "none" /* Ensures the icon doesn't block interaction */,
                    }}
                  />
                </div>
                {errors.classValue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.classValue}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">Exam</label>
              <div>
                <input
                  id="exam"
                  value={examName}
                  onChange={(e) => {
                    setExamName(e.target.value);
                    setErrors((prev) => ({ ...prev, examName: "" }));
                  }}
                  placeholder="Enter exam name"
                  className={`form-control radius-12 ${
                    errors.examName ? "border-red-500" : ""
                  }`}
                />
                {errors.examName && (
                  <p className="text-red-500 text-sm mt-1">{errors.examName}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-start gap-4">
              <div className="text-right"></div>
              <Button
                variant="link"
                className="text-blue-500 p-0 h-auto justify-start"
                onClick={() => setShowAdvanceSettings(!showAdvanceSettings)}
              >
                {showAdvanceSettings ? "Hide" : "Show"} Advance Settings
              </Button>
            </div>
            {showAdvanceSettings && (
              <>
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <label className="form-label text-right">Attendance</label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                              errors.startDate && "border-red-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate
                              ? format(startDate, "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date);
                              setErrors((prev) => ({ ...prev, startDate: "" }));
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </div>
                    <div className="mx-4">TO</div>
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                              errors.endDate && "border-red-500 "
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              setErrors((prev) => ({ ...prev, endDate: "" }));
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                  {errors.dateRange && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateRange}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <label className="form-label text-right">
                    ReportCardDate
                  </label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !reportCardDate && "text-muted-foreground",
                            errors.reportCardDate && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {reportCardDate
                            ? format(reportCardDate, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={reportCardDate}
                          onSelect={(date) => {
                            setReportCardDate(date);
                            setErrors((prev) => ({
                              ...prev,
                              reportCardDate: "",
                            }));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.reportCardDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reportCardDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr_120px_1fr] items-center gap-4">
                  <label className="form-label text-right">Sequence</label>
                  <Select value={sequence} onValueChange={setSequence}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sequence" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Array.from({ length: 100 }, (_, i) => i + 1).map(
                        (num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  <label className="form-label text-right">Publish</label>
                  <Select
                    value={publish}
                    onValueChange={setPublish}
                    className="form-control radius-12"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select publish status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YES">YES</SelectItem>
                      <SelectItem value="NO">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                  <div></div>
                  <div className="col-12 mt-4 flex justify-end">
                    <button
                      type="submit"
                      onClick={handleButtonClick}
                      className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 "
                    >
                      {initialData ? "Update Exam" : "Create Exam"}
                    </button>
                    {isLoading && (
                      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                        <div className="loader"></div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
