import Breadcrumb from "@/components/Breadcrumb";
import GenerateLeavingCertificateLayer from "@/components/GenerateLeavingCertificateLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, FileEdit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import Toast from "../components/ui/Toast";

const GenerateLeavingCertificatePage = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [searchBy, setSearchBy] = useState("Name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const debounceTimer = useRef(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isStudentSelected, setIsStudentSelected] = useState(false);

  // Proper debounce implementation
  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // API call function for searching students
  const fetchStudents = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setShowDropdown(true);

      try {
        let params = {};
        if (searchBy === "Name") {
          params.studentName = query;
        } else if (searchBy === "EnrollNo") {
          params.enrollNo = query;
        } else if (searchBy === "GRNo") {
          params.grNo = query;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}certificate/students-list/lc`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params,
          }
        );

        setSearchResults(response.data.data.details);
      } catch (err) {
        setError("Failed to fetch students. Please try again.");
        console.error("Error fetching students:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [searchBy, accessToken]
  );

  // Debounced version of fetchStudents
  const debouncedFetchStudents = useCallback(debounce(fetchStudents, 500), [
    fetchStudents,
  ]);

  // Modified useEffect for search
  useEffect(() => {
    if (!isStudentSelected) {
      // Only search if no student is selected
      debouncedFetchStudents(searchQuery);
    }
    return () => {
      clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, debouncedFetchStudents, isStudentSelected]);

  // Modified handleSelect function
  const handleSelect = (student) => {
    const id = student?.studentId;
    setSelectedStudentId(id);
    setIsStudentSelected(true); // Mark that a student has been selected
    setSelectedStudent(student);
    setSearchQuery(student.name || student.fullName || "");
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Modified handleInputChange function
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) {
      setStudentDetails(null);
      setSelectedStudent(null);
      setSelectedStudentId("");
      setIsStudentSelected(false);
    }
  };

  const handleShowDetails = async () => {
    if (selectedStudentId) {
      await fetchStudentDetails(selectedStudentId);
    }
  };

  // Fetch student details when selected
  const fetchStudentDetails = useCallback(
    async (studentId) => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }certificate/students-details/lc/generate?studentId=${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStudentDetails(response.data.data);
        Toast.showSuccessToast(response.data.message);
      } catch (error) {
        setError("Failed to fetch student details. Please try again.");
        if (error.response) {
          Toast.showWarningToast(`${error.response.data.message}`);
          console.log(error.response.data.message);
        } else if (error.request) {
          Toast.showErrorToast("Sorry, our server is down");
        } else {
          Toast.showErrorToast("Sorry, please try again later");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  const handleSubmit = (newStudent) => {
    try {
      // Your submit logic here
    } catch (error) {
      console.error("Error saving leaving certificate:", error);
    }
  };

  return (
    <div>
      <MasterLayout>
        <Breadcrumb title="Generate Leaving Certificate" />
        <div className="flex justify-between mb-3">
          <div className="flex gap-2 text-xl">
            <FileEdit className="text-orange-500" />
            Student Search
          </div>
          <Button
            variant="outline"
            className="gap-3"
            onClick={() => (window.location.href = "/leaving-certificates")}
          >
            <ArrowLeft />
            Back
          </Button>
        </div>
        <Separator />
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 text-right">Search By</div>
            <div className="flex w-full gap-4 relative">
              <Select value={searchBy} onValueChange={setSearchBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Name">Name</SelectItem>
                  <SelectItem value="EnrollNo">Enroll No.</SelectItem>
                  <SelectItem value="GRNo">GR No.</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search by ${searchBy}...`}
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showDropdown && searchQuery && !isStudentSelected && (
                  <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-50">
                    {isLoading ? (
                      <div className="p-2 text-gray-500">Searching...</div>
                    ) : error ? (
                      <div className="p-2 text-red-500">{error}</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-2 text-gray-500">No students found</div>
                    ) : (
                      searchResults.map((student) => (
                        <div
                          key={student.enrollNo}
                          onClick={() => handleSelect(student)}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {student.name || student.fullName}
                            </span>
                            <span className="text-sm text-gray-500">
                              Enroll: {student.enrollNo} | GR:{" "}
                              {student.generalRegisterNo || student.grNo} |
                              Class: {student.stdClass || student.class}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={handleShowDetails}
                disabled={!selectedStudentId || isLoading}
              >
                {isLoading ? "Loading..." : "Show"}
              </Button>
            </div>
          </div>
          <div>
            {studentDetails && (
              <GenerateLeavingCertificateLayer
                studentData={studentDetails}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setSelectedStudent(null);
                  setStudentDetails(null);
                  setSearchQuery("");
                  setSelectedStudentId("");
                  setIsStudentSelected(false);
                }}
              />
            )}
          </div>
        </div>
      </MasterLayout>
    </div>
  );
};

export default GenerateLeavingCertificatePage;
