import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import Toast from "../../components/ui/Toast";

export default function GenerateAffidavit() {
  const accessToken = localStorage.getItem("accessToken");

  const [date, setDate] = useState(new Date());
  const [enrollNo, setEnrollNo] = useState("");
  const [searchBy, setSearchBy] = useState("enrollNo");
  const [studentInfo, setStudentInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const navigate = useNavigate();

  // Debounced API call function
  const debouncedSearch = debounce(async (query, searchBy) => {
    if (!query) {
      setFilteredStudents([]);
      return;
    }

    // Prepare parameters based on searchBy
    const params = {
      grNo: searchBy === "grNo" ? query : "",
      enrollNo: searchBy === "enrollNo" ? query : "",
      studentName: searchBy === "name" ? query : "",
    };

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }certificate/student-details/affidavits`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: params,
        }
      );

      setFilteredStudents(response.data.data.details);
    } catch (error) {
      console.error("Error fetching students:", error);
      setFilteredStudents([]);
    }
  }, 1000); // 2-second debounce

  // Effect to trigger debounced search when searchQuery or searchBy changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery, searchBy);
    } else {
      setFilteredStudents([]);
    }

    // Cleanup debounce on unmount
    return () => debouncedSearch.cancel();
  }, [searchQuery, searchBy]);

  // Handle student selection
  const handleStudentSelect = (student) => {
    setStudentInfo({
      id: student.id,
      name: student.fullName,
      class: student.class,
      division: student.division,
      enrollNo: student.enrollNo,
      grNo: student.grNo,
      date: format(new Date(), "dd-MM-yyyy"),
    });
    setEnrollNo(student.enrollNo);
    setSearchQuery(student.fullName);
    setShowDropdown(false);
  };

  // Handle search input change
  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
    setShowDropdown(true);
    setStudentInfo(null);
    setEnrollNo("");
  };

  const handleGenerateAffidavit = async () => {
    if (!studentInfo) return;

    try {
      // Convert date to YYYY-MM-DD format
      const currentDate = date;
      const formattedDate = currentDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD

      console.log("formattedDate", formattedDate);
      console.log("id", studentInfo.id);
      // API call
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}certificate/affidavit/create`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            studentId: studentInfo.id,
            issueDate: formattedDate,
          },
        }
      );
      Toast.showSuccessToast(response.data.message);
      // Navigate with response data
      navigate(`/affidavits/download/${studentInfo.enrollNo}`, {
        state: response.data.data,
      });
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

  console.log(date);
  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            📝
          </span>
          Student Affidavit
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(`/affidavits`)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Date Picker */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="col-span-3 w-1/2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd-MM-yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Search By Dropdown */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium leading-none">
            Search By
          </label>
          <div className="col-span-3 w-3/4">
            <Select value={searchBy} onValueChange={setSearchBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select search criteria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enrollNo">Enroll.No.</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="grNo">GR No.</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Input with Dropdown */}
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right text-sm font-medium leading-none">
            Search Student
          </label>
          <div className="col-span-3 w-3/4 relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder={`Search by ${
                  searchBy === "enrollNo"
                    ? "enrollment number"
                    : searchBy === "name"
                    ? "student name"
                    : "GR number"
                }`}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showDropdown && searchQuery && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-50">
                  {filteredStudents.length === 0 ? (
                    <div className="p-2 text-gray-500">No students found</div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.enrollNo}
                        onClick={() => handleStudentSelect(student)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {student.fullName}
                          </span>
                          <span className="text-sm text-gray-500">
                            Enroll: {student.enrollNo} | GR: {student.grNo} |
                            Class: {student.class}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Info Display */}
        {studentInfo && (
          <div className="grid grid-cols-4 items-center gap-4">
            <div></div>
            <div className="col-span-3 w-3/4 mt-8 bg-yellow-100 p-6 rounded-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-medium">Name</span>
                  <span className="col-span-3">: {studentInfo.name}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-medium">Class</span>
                  <span className="col-span-3">: {studentInfo.class}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-medium">Enroll No</span>
                  <span className="col-span-3">: {studentInfo.enrollNo}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-medium">GR No</span>
                  <span className="col-span-3">: {studentInfo.grNo}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8"
            disabled={!studentInfo}
            onClick={handleGenerateAffidavit}
          >
            Generate Affidavit
          </Button>
        </div>
      </div>
    </div>
  );
}
