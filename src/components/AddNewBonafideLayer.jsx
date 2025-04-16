import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GenerateBonafideForm from "./GenerateBonafideForm";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import axios from "axios";

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

export default function AddNewBonafideLayer() {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const navigate = useNavigate();
  const [searchBy, setSearchBy] = useState("Name");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fetchClass, setFetchClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState({ id: "", class: "" });

  // Use the debounce hook
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);
  const debouncedSelectedClass = useDebounce(selectedClass.id, 1500);

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

  const fetchStudents = useCallback(async () => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredStudents([]);
      setShowTable(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {};

      if (debouncedSelectedClass) {
        params.classId = debouncedSelectedClass;
      }

      if (searchBy === "Name") {
        params.studentName = debouncedSearchQuery;
      } else if (searchBy === "GR No") {
        params.grNo = debouncedSearchQuery;
      } else if (searchBy === "Enroll No") {
        params.enrollNo = debouncedSearchQuery;
      }

      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_API_URL
        }certificate/student-list/bonafied`,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFilteredStudents(response.data.data.details || []);
      setShowTable(true);
    } catch (err) {
      setError("Failed to fetch students. Please try again.");
      console.error("Error fetching students:", err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, searchBy, debouncedSelectedClass, accessToken]);

  // Effect to trigger the debounced search
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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

  const handleSelect = async (student) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_API_URL
        }certificate/student-details/bonafied/${student.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSelectedStudent(response.data.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setError("Failed to fetch student details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="text-orange-500" />
            <h1 className="text-xl font-semibold">Student Search</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-24">
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
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-28 text-right">Search By</label>
            <div className="flex w-full gap-2">
              <Select value={searchBy} onValueChange={setSearchBy}>
                <SelectTrigger className="w-[125px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Name">Name</SelectItem>
                  <SelectItem value="GR No">GR No</SelectItem>
                  <SelectItem value="Enroll No">Enroll No</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                placeholder={`Search by ${searchBy}...`}
              />
            </div>
          </div>
        </div>

        {isLoading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-red-500 text-center py-4">{error}</div>}

        {selectedStudent ? (
          <GenerateBonafideForm
            type={"Student"}
            student={selectedStudent}
            onClose={handleCloseForm}
          />
        ) : (
          <>
            {showTable && filteredStudents.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs">
                      <th className="border p-2 text-center">GRNO</th>
                      <th className="border p-2 text-center">ENROLL NO</th>
                      <th className="border p-2 text-left">STUDENT</th>
                      <th className="border p-2 text-left">CLASS</th>
                      <th className="border p-2 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 text-sm">
                        <td className="border p-2 text-center">
                          {student.grNo}
                        </td>
                        <td className="border p-2 text-center">
                          {student.enrollNo}
                        </td>
                        <td className="border p-2">{student.fullName}</td>
                        <td className="border p-2">
                          {student.class}{" "}
                          {student.division ? `(${student.division})` : ""}
                        </td>
                        <td className="border text-center">
                          <Button
                            variant="link"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleSelect(student)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Loading..." : "SELECT"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : showTable ? (
              <>
                <div className="text-center py-2 text-red-600 font-medium text-lg border rounded-md mb-4">
                  No Student Found! Are you generating Bonafide for Ex-Student?
                </div>
                <GenerateBonafideForm
                  type={"Ex Student"}
                  student={{}}
                  onClose={() => navigate(`/bonafide-certificates`)}
                />
              </>
            ) : null}
          </>
        )}
      </>
    </div>
  );
}
