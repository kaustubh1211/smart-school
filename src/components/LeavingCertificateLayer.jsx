import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  Minus,
  ArrowRight,
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
import { useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import Toast from "../components/ui/Toast";

// Improved debounce function with cancel capability
function debounce(func, delay) {
  let timer;
  const debounced = function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
}

export default function LeavingCertificateLayer() {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fetchClass, setFetchClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState({ id: "", class: "" });

  const [studentData, setStudentData] = useState([]);
  const [studentRecord, setStudentRecord] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const debouncedFetchStudentsRef = useRef();

  // Fetch class data - runs only once on mount
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
        console.error("Error fetching classes:", error);
      }
    };
    fetchClassData();
  }, [tenant, academicYear, accessToken]);

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
    }
  };

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

  const clearFilters = () => {
    setSearchQuery("");
    setDateRange({ from: "", to: "" });
    setSelectedClass({ id: "", class: "" });
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Fetch students function
  const fetchStudents = useCallback(async () => {
    // Cancel any pending requests
    if (debouncedFetchStudentsRef.current) {
      debouncedFetchStudentsRef.current.cancel();
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}certificate/student-list/lc`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            classId: selectedClass.id,
            search_string: searchQuery,
            from_date: dateRange.from,
            to_date: dateRange.to,
            page: currentPage,
            limit: itemsPerPage,
          },
        }
      );
      setStudentRecord(response.data.data);
      setStudentData(response.data.data.details);
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError("Failed to load student data");
        console.error("Error fetching students:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    accessToken,
    selectedClass.id,
    searchQuery,
    dateRange.from,
    dateRange.to,
    currentPage,
    itemsPerPage,
  ]);

  // Create debounced version on mount and when dependencies change
  useEffect(() => {
    debouncedFetchStudentsRef.current = debounce(fetchStudents, 500);
    return () => {
      if (debouncedFetchStudentsRef.current) {
        debouncedFetchStudentsRef.current.cancel();
      }
    };
  }, [fetchStudents]);

  // Main effect for API calls
  useEffect(() => {
    debouncedFetchStudentsRef.current();
  }, [
    selectedClass.id,
    searchQuery,
    dateRange.from,
    dateRange.to,
    currentPage,
    itemsPerPage,
  ]);

  // Calculate current items for display
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return studentData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, studentData]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrint = (student) => {
    if (student) {
      navigate(`/download/lc/${student.studentId}`);
    }
  };

  const handleEdit = (student) => {
    navigate(`/updateLC/${student.id}`);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    const id = studentToDelete.id;

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}certificate/del-lc/${id}`,
        null, // Add null as the second parameter since you're not sending a request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Show success message
      Toast.showSuccessToast(response.data.message);

      // Refresh the student list after successful deletion
      await fetchStudents(); // Wait for the fetch to complete
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student record");
      Toast.showErrorToast("Failed to delete student record");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setStudentToDelete(null);
    }
  };

  const handleAddStudent = (newStudent) => {};

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
              navigate("/leaving-certificate");
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
          <div className="text-right">Class</div>
          <div className="relative w-full">
            <select
              className="form-select form-select-sm w-full ps-12 py-1 radius-12 h-36-px"
              name="class"
              id="class-select"
              value={selectedClass.id}
              onChange={handleInputChange}
            >
              <option value="">Select</option>

              {/* Dynamically render categories from API */}
              {Object.entries(groupedClasses).map(([category, classes]) => (
                <optgroup key={category} label={category}>
                  {" "}
                  {/* Use raw category name */}
                  {classes
                    .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Sort classes by ID
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.class}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-24 text-right">View</div>
          <div className="flex items-center gap-4 border rounded-md p-2 w-full">
            <div className="flex items-center gap-2">
              <Checkbox
                id="lc"
                // checked={viewOptions.lc}
                // onCheckedChange={(checked) =>
                //   handleViewOptionChange("lc", checked === true)
                // }
              />
              <Label htmlFor="lc">LC</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="left"
                // checked={viewOptions.left}
                // onCheckedChange={(checked) =>
                //   handleViewOptionChange("left", checked === true)
                // }
              />
              <Label htmlFor="left">LEFT</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="exStudent"
                // checked={viewOptions.exStudent}
                // onCheckedChange={(checked) =>
                //   handleViewOptionChange("exStudent", checked === true)
                // }
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

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 m-4 text-sm text-slate-700">
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
            {studentData.length > 0 ? (
              currentItems.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 text-xs text-center"
                >
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{student.lcNo}</td>
                  <td className="border p-2">{student.enrollNo}</td>
                  <td className="border p-2">{student.fullName}</td>
                  <td className="border p-2">
                    {student.stdFromLeave}
                    <div className="text-blue-600">{student.class}</div>
                  </td>
                  <td className="border p-2">
                    {student.leftReason ? (
                      student.leftReason
                    ) : (
                      <span className="text-center">
                        <Minus size={20} />
                      </span>
                    )}
                  </td>
                  <td className="border p-2">
                    {student.remark ? (
                      student.remark
                    ) : (
                      <span className="text-center">
                        <Minus size={20} />
                      </span>
                    )}
                  </td>
                  <td className="border p-2">
                    {dayjs(student.leftDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="border p-2">
                    {dayjs(student.issueDate).format("DD-MM-YYYY")}
                  </td>
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
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleEdit(student)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button> */}
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

        {/* Pagination */}
        <div className="mt-4 p-4 flex items-center justify-between border-t">
          <div className="flex items-center gap-4">
            <div>
              Found total{" "}
              <span className="font-bold">{studentRecord.totalRecords}</span>{" "}
              records
            </div>
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select
                className="border rounded px-2 py-1"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: studentRecord.totalPages },
                (_, i) => i + 1
              ).map((page) => (
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
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === studentRecord.totalPages}
            >
              <ArrowRight />
            </Button>
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
