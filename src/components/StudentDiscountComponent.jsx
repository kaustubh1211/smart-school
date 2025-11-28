import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "../components/ui/Toast";
import { Download } from "lucide-react";

const StudentDiscountView = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  // State for discount data
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    classId: "",
    studentId: "",
    feeTypeName: "",
    academicYearName: academicYear,
  });

  // Available years list
  const availableYears = ["2025-2026", "2024-2025", "2023-2024"];

  // Fetch classes
  const [fetchClass, setFetchClass] = useState([]);
  
  // Fetch students
  const [studentData, setStudentData] = useState({
    details: [],
  });



  // Fetch classes
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}class/list?medium=${tenant}&year=${filters.academicYearName}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFetchClass(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClassData();
  }, [tenant, filters.academicYearName]);

  // Fetch students based on class selection
  useEffect(() => {
    const fetchStudents = async () => {
      if (!filters.classId) {
        setStudentData({ details: [] });
        return;
      }
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}students/list-student-branchwise`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              classId: filters.classId,
              mediumName: tenant,
              academicYearName: filters.academicYearName,
            },
          }
        );
        setStudentData(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [filters.classId, tenant, filters.academicYearName]);

  // Fetch discount data
  const fetchDiscountData = async () => {
    setLoading(true);
    setApiError("");
    
    try {
      const params = {};
      
      if (filters.classId) params.classId = filters.classId;
      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.feeTypeName) params.feeTypeName = filters.feeTypeName;
      if (filters.academicYearName) params.academicYearName = filters.academicYearName;

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}fee/view-student-discount`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params,
        }
      );

      setDiscountData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching discount data:", error);
      setApiError("Unable to fetch discount data. Please try again later.");
      setDiscountData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchDiscountData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear student when class changes
    if (field === "classId") {
      setFilters((prev) => ({
        ...prev,
        studentId: "",
      }));
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    fetchDiscountData();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      classId: "",
      studentId: "",
      feeTypeName: "",
      academicYearName: academicYear,
    });
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (discountData.length === 0) {
      Toast.showErrorToast("No data to export");
      return;
    }

    // Create CSV content
    const headers = ["Student Name", "Class", "Category", "Fee Type", "Installment Type", "Discount Amount", "Reason", "Date"];
    const csvContent = [
      headers.join(","),
      ...discountData.map(item => [
        `"${item.studentName}"`,
        `"${item.class}"`,
        `"${item.classCategory}"`,
        `"${item.feeTypeName}"`,
        `"${item.installmentType}"`,
        item.discountAmount,
        `"${item.reason}"`,
        new Date(item.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `student_discounts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Toast.showSuccessToast("Data exported successfully!");
  };

  // Calculate total discount
  const totalDiscount = discountData.reduce((sum, item) => sum + Number(item.discountAmount), 0);

  // Group classes by category
  const groupClassesByCategory = (classes) => {
    const categoryOrder = [
      "PRE-PRIMARY",
      "PRIMARY",
      "PRATHAMIK",
      "SECONDARY",
      "MADHYAMIK",
      "HIGHER SECONDARY",
    ];

    const grouped = classes.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    const sortedCategories = categoryOrder.filter((cat) => grouped[cat]);

    return sortedCategories.map((category) => ({
      category,
      classes: grouped[category],
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-bold">Student Discount Details</div>
        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Filter Panel */}
      <div className="card text-sm mb-4 p-4 radius-12 bg-white">
        <h6 className="font-semibold text-gray-800 mb-4">Filters</h6>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Academic Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <select
              className="form-select form-select-sm w-full px-3 py-2 rounded-md border border-gray-300"
              value={filters.academicYearName}
              onChange={(e) => handleFilterChange("academicYearName", e.target.value)}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <select
              className="form-select form-select-sm w-full px-3 py-2 rounded-md border border-gray-300"
              value={filters.classId}
              onChange={(e) => handleFilterChange("classId", e.target.value)}
            >
              <option value="">All Classes</option>
              {groupClassesByCategory(fetchClass).map((group) => (
                <optgroup key={group.category} label={group.category}>
                  {group.classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.class}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Student Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <select
              className="form-select form-select-sm w-full px-3 py-2 rounded-md border border-gray-300"
              value={filters.studentId}
              onChange={(e) => handleFilterChange("studentId", e.target.value)}
              disabled={!filters.classId}
            >
              <option value="">All Students</option>
              {studentData.details.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.fatherName} {student.lastName} (GR: {student.grNo})
                </option>
              ))}
            </select>
          </div>

          {/* Fee Type Filter */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fee Type
            </label>
            <input
              type="text"
              className="form-control form-control-sm w-full px-3 py-2 rounded-md border border-gray-300"
              placeholder="Enter fee type"
              value={filters.feeTypeName}
              onChange={(e) => handleFilterChange("feeTypeName", e.target.value)}
            />
          </div> */}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleResetFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-md text-sm transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading discount data...</p>
              </div>
            ) : apiError ? (
              <div className="text-center py-8 text-red-500">{apiError}</div>
            ) : discountData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No discount records found
              </div>
            ) : (
              <table className="table-bordered-custom sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-center text-sm" scope="col">Sr. No</th>
                    <th className="text-center text-sm" scope="col">Student Name</th>
                    <th className="text-center text-sm" scope="col">Class</th>
                    <th className="text-center text-sm" scope="col">Category</th>
                    <th className="text-center text-sm" scope="col">Fee Type</th>
                    <th className="text-center text-sm" scope="col">Installment Type</th>
                    <th className="text-center text-sm" scope="col">Discount Amount</th>
                    <th className="text-center text-sm" scope="col">Reason</th>
                    <th className="text-center text-sm" scope="col">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-center">
                  {discountData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="text-left">{item.studentName}</td>
                      <td>{item.class}</td>
                      <td>{item.classCategory}</td>
                      <td>{item.feeTypeName}</td>
                      <td>{item.installmentType}</td>
                      <td>₹{item.discountAmount.toLocaleString()}</td>
                      <td className="text-left max-w-xs truncate" title={item.reason}>
                        {item.reason}
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="6" className="text-right">Total:</td>
                    <td>₹{totalDiscount.toLocaleString()}</td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDiscountView;