import { useEffect, useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  CalendarIcon,
  ChevronDown,
  PenSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Toast from "../ui/Toast";
import TimePicker from "react-time-picker";
import axios from "axios";
import dayjs from "dayjs";

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
  const [examId, setExamId] = useState(null);
  const [examCreated, setExamCreated] = useState(false);
  const [fetchClass, setFetchClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState({ id: "", class: "" });
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [reportCardDate, setReportCardDate] = useState();
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [fetchSubject, setFetchSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    assessment: "EXAM",
    examDate: new Date(),
    fromTime: "10:30",
    toTime: "12:30",
  });

  const [errors, setErrors] = useState({
    classId: "",
    examName: "",
    startDate: "",
    endDate: "",
    reportCardDate: "",
    dateRange: "",
  });

  // Fetch class data - runs only once on mount
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
        setFetchClass(response.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClassData();
  }, [tenant, academicYear, accessToken]);

  // Fetch subjects after exam is created
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!examId) return;

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }exam/time-table?examId=${examId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setSubjects(response.data.data || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (examCreated) {
      fetchSubjects();
    }
  }, [examCreated, examId, accessToken, fetchSubject]);

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

  const groupedClasses = useMemo(
    () =>
      fetchClass?.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
        return groups;
      }, {}) || {},
    [fetchClass]
  );

  const handleInputChange = (event) => {
    const { name, value: selectedId } = event.target;
    if (name === "class") {
      if (selectedId === "") {
        setSelectedClass({ id: "", class: "" });
      } else {
        const selectedClassObj = fetchClass.find(
          (item) => item.id === selectedId
        );
        if (selectedClassObj) {
          setSelectedClass(selectedClassObj);
        }
      }
      setErrors((prev) => ({ ...prev, classId: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      classId: "",
      examName: "",
      startDate: "",
      endDate: "",
      reportCardDate: "",
      dateRange: "",
    };

    if (!selectedClass.id) {
      newErrors.classId = "Please select a class";
      isValid = false;
    }

    if (!examName) {
      newErrors.examName = "Please enter an exam name";
      isValid = false;
    } else if (examName.length < 3) {
      newErrors.examName = "Exam name must be at least 3 characters";
      isValid = false;
    }

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectDateChange = (date) => {
    setNewSubject((prev) => ({
      ...prev,
      examDate: date,
    }));
  };

  const handleSubjectTimeChange = (field, time) => {
    console.log("field", field);
    console.log("time", time);
    setNewSubject((prev) => ({
      ...prev,
      [field]: time,
    }));
  };

  const handleSaveSubject = async () => {
    if (!newSubject.name.trim()) {
      Toast.showErrorToast("Please enter a subject name");
      return;
    }

    try {
      setIsLoading(true);

      console.log("From time:", newSubject.fromTime);
      console.log("To time:", newSubject.toTime);

      // Format 24-hour times from TimePicker to 12-hour format for Zod validation
      const formatTimeFor12Hour = (time24) => {
        if (!time24 || typeof time24 !== "string") return "12:00 PM"; // Default

        // Parse hours and minutes from the 24-hour format
        const [hoursStr, minutesStr] = time24.split(":");
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (isNaN(hours) || isNaN(minutes)) return "12:00 PM"; // Default if parsing fails

        // Convert to 12-hour format with AM/PM indicator
        const period = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        const minutesFormatted = minutes.toString().padStart(2, "0");

        return `${hours12}:${minutesFormatted} ${period}`;
      };

      // Convert the 24-hour format times to 12-hour format with AM/PM for Zod
      const fromTime = formatTimeFor12Hour(newSubject.fromTime);
      const toTime = formatTimeFor12Hour(newSubject.toTime);

      const subjectData = {
        examId: examId,
        subject: newSubject.name,
        assessment: newSubject.assessment,
        examDate: format(newSubject.examDate, "yyyy-MM-dd"),
        startTime: fromTime,
        endTime: toTime,
        mediumName: tenant,
        academicYearName: academicYear,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}exam/add-subject`,
        subjectData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFetchSubject((fetchSubject) => !fetchSubject);
      setIsAddSubjectModalOpen(false);

      // Rest of your function remains the same
    } catch (error) {
      console.error("Error adding subject:", error);
      console.error("Request data:", error.config?.data);
      console.error("Response:", error.response?.data);
      Toast.showErrorToast("Failed to add subject");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_API_URL
        }exam/time-table/delete?id=${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        Toast.showSuccessToast("Subject deleted successfully");
      }
      setFetchSubject((fetchSubject) => !fetchSubject);
    } catch (error) {
      console.error("Error deleting subject:", error);
      Toast.showErrorToast("Failed to delete subject");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Prepare form data
      const formData = {
        classId: selectedClass.id,
        examName: examName,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        mediumName: tenant,
        academicYearName: academicYear,
      };

      // Add reportCardDate only if it exists
      if (reportCardDate) {
        formData.reportCardDate = format(reportCardDate, "yyyy-MM-dd");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}exam/create-exam`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        Toast.showSuccessToast("Exam created successfully");
        setExamId(response.data?.data?.id);
        setExamCreated(true);
      }
    } catch (error) {
      console.log("Error creating exam", error);
      Toast.showErrorToast("Error creating exam");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex bg-white p-2 shadow-sm">
        <div className="flex items-center gap-4 w-full">
          <PenSquare className="h-4 w-4" />
          <h1 className="text-xl font-semibold">Create Exam</h1>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" className="gap-2" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" /> Back
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
                <select
                  className="form-select form-select-sm w-full ps-12 py-1 radius-12 h-36-px"
                  name="class"
                  id="class-select"
                  value={selectedClass.id}
                  onChange={handleInputChange}
                  disabled={examCreated}
                >
                  <option value="">Select</option>
                  {Object.entries(groupedClasses).map(([category, classes]) => (
                    <optgroup key={category} label={category}>
                      {classes
                        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.class}
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
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
                {errors.classId && (
                  <p className="text-red-500 text-sm mt-1">{errors.classId}</p>
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
                  disabled={examCreated}
                />
                {errors.examName && (
                  <p className="text-red-500 text-sm mt-1">{errors.examName}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">From</label>
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
                        disabled={examCreated}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
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
                <div className="mx-4">To</div>
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
                        disabled={examCreated}
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
                <div className="col-start-2">
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateRange}
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="form-label text-right">Report Card</label>
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
                      disabled={examCreated}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {reportCardDate
                        ? format(reportCardDate, "PPP")
                        : "Select date (optional)"}
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

            {!examCreated && (
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <div></div>
                <div className="col-12 mt-4 flex justify-end">
                  <button
                    type="submit"
                    onClick={handleCreateExam}
                    className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700"
                  >
                    Create Exam
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subjects Section - Only visible after exam creation */}
        {examCreated && (
          <div className="bg-white border-black-700 b-2 rounded-lg h-auto">
            <div className="mt-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Subjects</h3>
                <Button
                  onClick={() => setIsAddSubjectModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam Date
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From Time
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To Time
                      </th>
                      <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subjects.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No timetable created
                        </td>
                      </tr>
                    ) : (
                      subjects.map((subject) => (
                        <tr key={subject.id}>
                          <td className="px-6 py-2 whitespace-nowrap">
                            {subject.subject}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            {subject.assessment}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            {dayjs(subject.examDate).format("DD-MM-YYYY")}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            {/* {subject.startTime || subject.fromTime || "N/A"} */}
                            {dayjs(subject.startTime).format(
                              "hh:mm A" || "N/A"
                            )}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            {/* {subject.endTime || subject.toTime || "N/A"} */}
                            {dayjs(subject.endTime).format("hh:mm A" || "N/A")}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteSubject(subject.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Add New Subject</h2>
              <button
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newSubject.name}
                  onChange={handleSubjectInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter subject name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Type
                </label>
                <select
                  name="assessment"
                  value={newSubject.assessment}
                  onChange={handleSubjectInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="EXAM">Exam</option>
                  <option value="TEST">Test</option>
                  <option value="QUIZ">Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSubject.examDate
                        ? format(newSubject.examDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSubject.examDate}
                      onSelect={handleSubjectDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <TimePicker
                    value={newSubject.fromTime}
                    onChange={(time) =>
                      handleSubjectTimeChange("fromTime", time)
                    }
                    className="w-full"
                    format="h:mm a"
                    disableClock={true}
                    clearIcon={null}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <TimePicker
                    value={newSubject.toTime}
                    onChange={(time) => handleSubjectTimeChange("toTime", time)}
                    className="w-full"
                    format="h:mm a"
                    disableClock={true}
                    clearIcon={null}
                  />
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end space-x-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded"
                onClick={() => setIsAddSubjectModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleSaveSubject}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
