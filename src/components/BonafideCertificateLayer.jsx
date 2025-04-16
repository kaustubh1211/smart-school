import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ChevronDown,
  Printer,
  Trash2,
  ArrowLeft,
  PlusCircle,
  PenSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Toast from "../components/ui/Toast";
import { useSelector } from "react-redux";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ITEMS_PER_PAGE = 12;

export default function BonafideCertificateLayer() {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const navigate = useNavigate();

  // State variables
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [fetchClass, setFetchClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Debounced values
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedSelectedClass = useDebounce(selectedClass, 500);
  const debouncedFromDate = useDebounce(fromDate, 500);
  const debouncedToDate = useDebounce(toDate, 500);

  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    return dayjs(date).isValid() ? dayjs(date).format("DD-MM-YYYY") : "";
  };
  // Format date to DD-MM-YYYY
  const datetoSend = (date) => {
    return dayjs(date).isValid() ? dayjs(date).format("YYYY-MM-DD") : "";
  };

  // Fetch class data
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

  // Group classes by category
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

  // Fetch students with debounced filters
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search_string: debouncedSearchQuery,
        classId: debouncedSelectedClass,
      };

      if (debouncedFromDate) {
        params.from_date = datetoSend(debouncedFromDate);
      }

      if (debouncedToDate) {
        params.to_date = datetoSend(debouncedToDate);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}certificate/bonafied`,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setStudents(response.data.data.details || []);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalRecords);
      } else {
        setError("Failed to fetch students");
      }
    } catch (err) {
      setError("Error fetching students. Please try again.");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearchQuery,
    debouncedSelectedClass,
    debouncedFromDate,
    debouncedToDate,
    accessToken,
  ]);

  // Trigger fetch when filters change
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle delete certificate
  const handleDelete = async (studentId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_API_URL
        }certificate/del-bonafied/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        Toast.showSuccessToast(response.data.message);
        fetchStudents();
      }
    } catch (err) {
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

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedClass("");
    setFromDate(null);
    setToDate(null);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <PenSquare className="text-orange-500" />
          <h1 className="text-xl font-semibold">Bonafide List</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            onClick={() => navigate("/new-bonafide")}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New</span>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Filters - Keeping original structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        {/* Date Range Picker - Original structure */}
        <div className="flex items-center gap-2">
          <label className="w-32">Date</label>
          <div className="flex items-center w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  {fromDate ? formatDate(fromDate) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="p-2 text-center bg-gray-200">TO</div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  {toDate ? formatDate(toDate) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Class Selector - Original structure */}
        <div className="flex items-center gap-2">
          <label className="w-32">Class</label>
          <div className="relative w-full">
            <select
              className="form-select form-select-sm w-full ps-12 py-1 radius-12 h-36-px"
              name="class"
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option value="">Select</option>
              {Object.entries(groupedClasses).map(([category, classes]) => (
                <optgroup key={category} label={category}>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.class}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Search Filter - Original structure */}
        <div className="flex items-center gap-2">
          <label className="w-32">Search</label>
          <div className="flex w-full">
            <Input
              placeholder="Name/Enroll.No./GrNo"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button
              className="bg-red-600 hover:bg-red-700 text-white rounded-l-none"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 text-xs justify-center">
              <th className="border p-2 text-center">#</th>
              <th className="border p-2 text-center">Enroll No</th>
              <th className="border p-2 text-left">Student Name</th>
              <th className="border p-2 text-left">Class</th>
              <th className="border p-2 text-left">Purpose</th>
              <th className="border p-2 text-center">Created At</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.id} className="hover:bg-slate-50 text-sm">
                  <td className="border p-2 text-center">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="border p-2 text-center">{student.enrollNo}</td>
                  <td className="border p-2">{student.fullName}</td>
                  <td className="border p-2">{student.class}</td>
                  <td className="border p-2">{student.purpose}</td>
                  <td className="border p-2 text-center">
                    {formatDate(student.createdAt)}
                  </td>
                  <td className="border">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800"
                        onClick={() =>
                          window.open(
                            `/bonafide-certificate/${student.studentId}`,
                            "_blank"
                          )
                        }
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)} of{" "}
          {totalRecords} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
