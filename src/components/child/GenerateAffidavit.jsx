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
import { useState } from "react";
import { studentDetails } from "@/lib/studentDetails";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export default function GenerateAffidavit() {
  const [date, setDate] = useState(new Date());
  const [enrollNo, setEnrollNo] = useState("");
  const [searchBy, setSearchBy] = useState("enrollNo");
  const [studentInfo, setStudentInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const getFilteredStudents = () => {
    if (!studentDetails || !searchQuery) return [];
    
    const searchLower = searchQuery.toLowerCase();
    return studentDetails.filter(student => {
      switch (searchBy) {
        case "enrollNo":
          return student.enrollNo.toLowerCase().includes(searchLower);
        case "name":
          return student.name.toLowerCase().includes(searchLower);
        case "grNo":
          return student.grNo.toLowerCase().includes(searchLower);
        default:
          return false;
      }
    });
  };

  const handleStudentSelect = (student) => {
    setStudentInfo(student);
    setEnrollNo(student.enrollNo);
    setSearchQuery(student.name);
    setShowDropdown(false);
  };

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
    setShowDropdown(true);
    setStudentInfo(null);
    setEnrollNo("");
  };

  const filteredStudents = getFilteredStudents();

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
                placeholder={`Search by ${searchBy === 'enrollNo' ? 'enrollment number' : searchBy === 'name' ? 'student name' : 'GR number'}`}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showDropdown && searchQuery && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-50">
                  {!studentDetails ? (
                    <div className="p-2 text-gray-500">Loading students...</div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-2 text-gray-500">No students found</div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.enrollNo}
                        onClick={() => handleStudentSelect(student)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{student.name}</span>
                          <span className="text-sm text-gray-500">
                            Enroll: {student.enrollNo} | GR: {student.grNo} | Class: {student.class}
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
        
        <div className="grid grid-cols-4 items-center gap-4">
          <div></div>
          {/* Student Info Display */}
          {studentInfo && (
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
          )}
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8"
            disabled={!studentInfo}
            onClick={() => {
              studentInfo
                ? navigate(`/affidavits/download/${studentInfo.enrollNo}`)
                : navigate("#");
            }}
          >
            Generate Affidavit
          </Button>
        </div>
      </div>
    </div>
  );
}
