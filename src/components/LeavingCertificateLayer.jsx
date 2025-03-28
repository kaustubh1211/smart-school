import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ChevronDown,
  FileEdit,
  FilePlus,
  Printer,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import GenerateLeavingCertificateLayer from "./GenerateLeavingCertificateLayer";
import { useNavigate } from "react-router-dom";
import { lcStudents as initialLcStudents } from "@/lib/lcStudents";
import { leftStudents as initialLeftStudents } from "@/lib/leftStudents";
import { exStudents as initialExStudents } from "@/lib/exStudents";

export default function LeavingCertificateLayer() {
  const navigate = useNavigate();
  const [viewOptions, setViewOptions] = useState({
    lc: true,
    left: false,
    exStudent: false,
  });
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // LC data - load from localStorage on initialization
  const [lcStudents, setLcStudents] = useState(() => {
    const stored = localStorage.getItem("lcStudents");
    return stored ? JSON.parse(stored) : [];
  });

  // LEFT data - load from localStorage on initialization
  const [leftStudents, setLeftStudents] = useState(() => {
    const stored = localStorage.getItem("leftStudents");
    return stored ? JSON.parse(stored) : [];
  });

  // Ex-Student data - load from localStorage on initialization
  const [exStudents, setExStudents] = useState(() => {
    const stored = localStorage.getItem("exStudents");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("lcStudents", JSON.stringify(lcStudents));
    localStorage.setItem("leftStudents", JSON.stringify(leftStudents));
    localStorage.setItem("exStudents", JSON.stringify(exStudents));
  }, [lcStudents, leftStudents, exStudents]);

  // Load data when view option changes
  useEffect(() => {
    const viewOption = localStorage.getItem("currentViewOption");

    if (viewOption === "lc") {
      const storedLcStudents = JSON.parse(
        localStorage.getItem("lcStudents") || "[]"
      );
      setLcStudents(storedLcStudents);
    } else if (viewOption === "left") {
      const storedLeftStudents = JSON.parse(
        localStorage.getItem("leftStudents") || "[]"
      );
      setLeftStudents(storedLeftStudents);
    } else if (viewOption === "exStudent") {
      const storedExStudents = JSON.parse(
        localStorage.getItem("exStudents") || "[]"
      );
      setExStudents(storedExStudents);
    }
  }, [viewOptions]);

  // Get the appropriate data based on the selected view
  const getStudentData = () => {
    if (viewOptions.lc) return lcStudents;
    if (viewOptions.left) return leftStudents;
    if (viewOptions.exStudent) return exStudents;
    return lcStudents; // Default to LC data
  };

  // Parse date string in DD-MM-YYYY format to Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;

    // Handle HTML date input format (YYYY-MM-DD)
    if (dateString.includes("-") && dateString.indexOf("-") === 4) {
      return new Date(dateString);
    }

    // Handle DD-MM-YYYY format
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  // Check if a date is within the selected range
  const isWithinDateRange = (dateString) => {
    if (!dateRange.from && !dateRange.to) return true;

    const date = parseDate(dateString);
    if (!date) return false;

    const fromDate = dateRange.from ? parseDate(dateRange.from) : null;
    const toDate = dateRange.to ? parseDate(dateRange.to) : null;

    if (fromDate && toDate) {
      return date >= fromDate && date <= toDate;
    } else if (fromDate) {
      return date >= fromDate;
    } else if (toDate) {
      return date <= toDate;
    }

    return true;
  };
  // Filter students based on class selection
  const filterStudentsByClass = (students) => {
    if (selectedClass === "All") return students;

    return students.filter((student) => {
      const classMatch = student.stdClass.includes(selectedClass);
      return classMatch;
    });
  };

  // Filter students based on search query
  const filterStudentsBySearch = (students) => {
    if (!searchQuery) return students;

    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.enrollNo.toLowerCase().includes(query) ||
        student.lcNo.toLowerCase().includes(query) ||
        student.stdClass.toLowerCase().includes(query) ||
        student.reasonOfLeaving.toLowerCase().includes(query)
    );
  };

  // Filter students based on date range
  const filterStudentsByDateRange = (students) => {
    if (!dateRange.from && !dateRange.to) return students;

    return students.filter((student) => isWithinDateRange(student.leftDate));
  };

  // Apply all filters
  const filteredStudents = filterStudentsBySearch(
    filterStudentsByDateRange(filterStudentsByClass(getStudentData()))
  );

  // Handle view option changes
  const handleViewOptionChange = (option, checked) => {
    // Reset all options first
    const newOptions = {
      lc: false,
      left: false,
      exStudent: false,
    };

    // Set the selected option
    newOptions[option] = checked;

    // If no option is selected, default to LC
    if (!newOptions.lc && !newOptions.left && !newOptions.exStudent) {
      newOptions.lc = true;
    }

    setViewOptions(newOptions);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDateRange({ from: "", to: "" });
    setSelectedClass("All");
  };

  // Format date for display in the date picker
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    // If already in YYYY-MM-DD format, return as is
    if (dateString.includes("-") && dateString.indexOf("-") === 4) {
      return dateString;
    }

    // Convert from DD-MM-YYYY to YYYY-MM-DD
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const handlePrint = (student) => {
    // Open a new window
    const certificateWindow = window.open(
      `/certificate/${student.lcNo}`,
      "_blank"
    );

    // Pass the student data to the new window
    if (certificateWindow) {
      certificateWindow.studentData = student;
    }
  };

  const handleEdit = (student) => {
    console.log(student.id);
    navigate(`/updateLC/${student.id}`);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!studentToDelete) return;

    if (viewOptions.lc) {
      setLcStudents(lcStudents.filter((s) => s.id !== studentToDelete.id));
    } else if (viewOptions.left) {
      setLeftStudents(leftStudents.filter((s) => s.id !== studentToDelete.id));
    } else if (viewOptions.exStudent) {
      setExStudents(exStudents.filter((s) => s.id !== studentToDelete.id));
    }

    setShowDeleteConfirm(false);
    setStudentToDelete(null);
  };

  const handleAddStudent = (newStudent) => {
    // Determine which student list to update
    if (viewOptions.lc) {
      setLcStudents([newStudent, ...lcStudents]);
    } else if (viewOptions.left) {
      setLeftStudents([newStudent, ...leftStudents]);
    } else if (viewOptions.exStudent) {
      setExStudents([newStudent, ...exStudents]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center text-xl font-semibold">
          <span className="bg-orange-400 p-1 text-white mr-2">
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
              className="lucide lucide-file-text"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <line x1="10" x2="8" y1="9" y2="9" />
            </svg>
          </span>
          Left Student
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-1 text-blue-600"
            onClick={() => navigate("/bulkLC")}
          >
            <FilePlus className="h-4 w-4" />
            Bulk Generate
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-1 text-blue-600"
            onClick={() => {
              // Store current view option in localStorage
              localStorage.setItem(
                "currentViewOption",
                viewOptions.lc ? "lc" : viewOptions.left ? "left" : "exStudent"
              );
              // Navigate to the add new page
              window.location.href = "/leaving-certificate";
            }}
          >
            <FilePlus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="flex items-center gap-4">
          <div className="w-24 text-right">Class</div>
          <div className="relative w-full">
            <select
              className="w-full h-10 px-3 py-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="All">--ALL--</option>
              <option value="PRATHAMIK" className="font-bold">
                PRATHAMIK
              </option>
              <option value="STD I">STD I</option>
              <option value="STD II">STD II</option>
              <option value="STD III">STD III</option>
              <option value="STD IV">STD IV</option>
              <option value="STD V">STD V</option>
              <option value="STD VI">STD VI</option>
              <option value="STD VII">STD VII</option>
              <option value="MADHYAMIK" className="font-bold">
                MADHYAMIK
              </option>
              <option value="STD VIII">STD VIII</option>
              <option value="STD IX">STD IX</option>
              <option value="STD X">STD X</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 text-right">View</div>
          <div className="flex items-center gap-4 border rounded-md p-2 w-full">
            <div className="flex items-center gap-2">
              <Checkbox
                id="lc"
                checked={viewOptions.lc}
                onCheckedChange={(checked) =>
                  handleViewOptionChange("lc", checked === true)
                }
              />
              <Label htmlFor="lc">LC</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="left"
                checked={viewOptions.left}
                onCheckedChange={(checked) =>
                  handleViewOptionChange("left", checked === true)
                }
              />
              <Label htmlFor="left">LEFT</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="exStudent"
                checked={viewOptions.exStudent}
                onCheckedChange={(checked) =>
                  handleViewOptionChange("exStudent", checked === true)
                }
              />
              <Label htmlFor="exStudent">Ex-Student</Label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 text-right">Left Date</div>
          <div className="flex items-center w-full">
            <Input
              type="date"
              className="rounded-r-none text-black"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
            <div className="px-4 py-2 border-y bg-gray-100">TO</div>
            <Input
              type="date"
              className="rounded-l-none text-black"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 text-right">Search</div>
          <div className="flex w-full">
            <Input
              type="text"
              placeholder="Name/Enroll.No./GrNo"
              className="rounded-r-none text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="rounded-l-none" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 m-4">
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">LC NO</th>
              <th className="border p-2 text-left">ENROLLNO</th>
              <th className="border p-2 text-left">STUDENT</th>
              <th className="border p-2 text-left">STD FROM LEAVE</th>
              <th className="border p-2 text-left">REASON OF LEAVING</th>
              <th className="border p-2 text-left">REMARK</th>
              <th className="border p-2 text-left ">LEFT DATE</th>
              <th className="border p-2 text-left">ISSUE DATE</th>
              <th className="border p-2 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 text-xs text-center"
                >
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{student.lcNo}</td>
                  <td className="border p-2">{student.enrollNo}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">
                    {student.stdFromLeave}
                    <div className="text-blue-600">{student.stdClass}</div>
                  </td>
                  <td className="border p-2">{student.reasonOfLeaving}</td>
                  <td className="border p-2">{student.remark}</td>
                  <td className="border p-2">{student.leftDate}</td>
                  <td className="border p-2">{student.issueDate}</td>
                  <td className="border p-2">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handlePrint(student)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleEdit(student)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDelete(student)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-red-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <div>
            Found total{" "}
            <span className="font-bold">{filteredStudents.length}</span> records
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="mt-2">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the student record for{""}
              <span className="font-semibold">{studentToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex flex-row gap-4">
              <AlertDialogCancel className="mb-1">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="mt-2 mr-2 bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
