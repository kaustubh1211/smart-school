import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "../components/ui/Toast";
import { Download, RefreshCw } from "lucide-react";

const FeeDashboard = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    academicYear: academicYear,
    classId: "",
    medium: tenant,
  });

  // Available years list
  const availableYears = ["2025-2026", "2024-2025", "2023-2024"];

  // Fetch classes
  const [fetchClass, setFetchClass] = useState([]);

  // Fetch classes
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}class/list?medium=${filters.medium}&year=${filters.academicYear}`,
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
  }, [filters.medium, filters.academicYear]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setApiError("");

    try {
      const params = {
        academicYear: filters.academicYear,
        medium: filters.medium,
      };

      if (filters.classId) {
        params.classId = filters.classId;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}fee/fees-dashboard`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params,
        }
      );

      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setApiError("Unable to fetch dashboard data. Please try again later.");
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    fetchDashboardData();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      academicYear: academicYear,
      classId: "",
      medium: tenant,
    });
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (!dashboardData) {
      Toast.showErrorToast("No data to export");
      return;
    }

    // Create CSV content for overall summary
    const headers = ["Category", "Total Fees", "Discount", "Paid Fees", "Balance", "Balance %"];
    const summaryRows = dashboardData.overallSummary.categories.map((cat) => [
      cat.category,
      cat.totalFees,
      cat.discount,
      cat.paidFees,
      cat.balance,
      cat.balancePercentage,
    ]);

    // Add total row
    summaryRows.push([
      "TOTAL",
      dashboardData.overallSummary.total.totalFees,
      dashboardData.overallSummary.total.discount,
      dashboardData.overallSummary.total.paidFees,
      dashboardData.overallSummary.total.balance,
      dashboardData.overallSummary.total.balancePercentage,
    ]);

    const csvContent = [headers.join(","), ...summaryRows.map((row) => row.join(","))].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `fee_dashboard_${filters.academicYear}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Toast.showSuccessToast("Data exported successfully!");
  };

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
        <div className="text-lg font-bold">Fee Dashboard</div>
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="card text-sm mb-4 p-4 radius-12 bg-white">
        <h6 className="font-semibold text-gray-800 mb-4">Filters</h6>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Academic Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <select
              className="form-select form-select-sm w-full px-3 py-2 rounded-md border border-gray-300"
              value={filters.academicYear}
              onChange={(e) => handleFilterChange("academicYear", e.target.value)}
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
              Class (Optional)
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

          {/* Medium Filter - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medium</label>
            <input
              type="text"
              className="form-control form-control-sm w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
              value={filters.medium}
              readOnly
            />
          </div>
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

      {/* Dashboard Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      ) : apiError ? (
        <div className="text-center py-8 text-red-500">{apiError}</div>
      ) : !dashboardData ? (
        <div className="text-center py-8 text-gray-500">No data available</div>
      ) : (
        <>
          {/* Overall Summary */}
          <div className="card text-sm mb-4 p-0 radius-12">
            <div className="card-header bg-blue-600 text-black  py-3 px-4 font-semibold">
              Overall Summary
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table-bordered-custom sm-table mb-0">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-center text-sm">Category</th>
                      <th className="text-center text-sm">Total Fees</th>
                      <th className="text-center text-sm">Discount</th>
                      <th className="text-center text-sm">Paid Amount</th>
                      <th className="text-center text-sm">Balance</th>
                      <th className="text-center text-sm">Balance %</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-center">
                    {dashboardData.overallSummary.categories.map((category, index) => (
                      <tr key={index}>
                        <td className="font-medium text-left">{category.category}</td>
                        <td>₹{Number(category.totalFees).toLocaleString()}</td>
                        <td>₹{Number(category.discount).toLocaleString()}</td>
                        <td className="text-green-600 font-medium">
                          ₹{Number(category.paidFees).toLocaleString()}
                        </td>
                        <td className="text-red-600 font-medium">
                          ₹{Number(category.balance).toLocaleString()}
                        </td>
                        <td>{category.balancePercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-200 font-semibold">
                      <td className="text-left">TOTAL</td>
                      <td className="text-center">
                        ₹{Number(dashboardData.overallSummary.total.totalFees).toLocaleString()}
                      </td>
                      <td className="text-center">
                        ₹{Number(dashboardData.overallSummary.total.discount).toLocaleString()}
                      </td>
                      <td className="text-center text-green-600">
                        ₹{Number(dashboardData.overallSummary.total.paidFees).toLocaleString()}
                      </td>
                      <td className="text-center text-red-600">
                        ₹{Number(dashboardData.overallSummary.total.balance).toLocaleString()}
                      </td>
                      <td className="text-center">
                        {dashboardData.overallSummary.total.balancePercentage}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Category-wise Details */}
          {dashboardData.categoryWiseData.map((categoryData, catIndex) => (
            <div key={catIndex} className="card text-sm mb-4 p-0 radius-12">
              <div className="card-header bg-gray-700  py-3 px-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-black text-base">{categoryData.category}</span>
                  <div className="flex gap-4 text-xs">
                    <span>Total: ₹{Number(categoryData.totalFees).toLocaleString()}</span>
                    <span className="text-green-300">
                      Paid: ₹{Number(categoryData.paid).toLocaleString()}
                    </span>
                    <span className="text-red-300">
                      Balance: ₹{Number(categoryData.balance).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                {/* Standards by Division Table */}
                <div className="table-responsive">
                  <table className="table-bordered-custom sm-table mb-0">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-center text-sm">Standard</th>
                        <th className="text-center text-sm">Division</th>
                        <th className="text-center text-sm">Total Students</th>
                        <th className="text-center text-sm">Total Fees</th>
                        <th className="text-center text-sm">Discount</th>
                        <th className="text-center text-sm">Paid Fees</th>
                        <th className="text-center text-sm">Balance</th>
                        <th className="text-center text-sm">Balance %</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-center">
                      {categoryData.standards.map((standard, stdIndex) => (
                        <tr key={stdIndex}>
                          <td className="font-medium text-left">{standard.standard}</td>
                          <td>{standard.division}</td>
                          <td>{standard.totalStudents}</td>
                          <td>₹{Number(standard.totalFees).toLocaleString()}</td>
                          <td>₹{Number(standard.discount).toLocaleString()}</td>
                          <td className="text-green-600">
                            ₹{Number(standard.paidFees).toLocaleString()}
                          </td>
                          <td className="text-red-600">
                            ₹{Number(standard.balance).toLocaleString()}
                          </td>
                          <td>{standard.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-semibold">
                        <td colSpan="3" className="text-left">
                          {categoryData.category} Total
                        </td>
                        <td className="text-center">
                          ₹{Number(categoryData.totalFees).toLocaleString()}
                        </td>
                        <td className="text-center">-</td>
                        <td className="text-center text-green-600">
                          ₹{Number(categoryData.paid).toLocaleString()}
                        </td>
                        <td className="text-center text-red-600">
                          ₹{Number(categoryData.balance).toLocaleString()}
                        </td>
                        <td className="text-center">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Fee Type Breakdown Table */}
              <div className="px-4 py-4 bg-gray-50 border-t">
                <h6 className="font-semibold text-gray-800 mb-3">Fee Type Breakdown</h6>
                
                <div className="table-responsive">
                  <table className="table-bordered-custom sm-table mb-0">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-center text-sm"></th>
                        <th className="text-center text-sm">Monthly Fees</th>
                        <th className="text-center text-sm">Admission Fees</th>
                        <th className="text-center text-sm">Term 1 Fees</th>
                        <th className="text-center text-sm">Term 2 Fees</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-center">
                      {/* Total Row */}
                      <tr>
                        <td className="text-left font-medium">Total</td>
                        <td>₹{Number(categoryData.monthlyTotal).toLocaleString()}</td>
                        <td>₹{Number(categoryData.admissionFees).toLocaleString()}</td>
                        <td>₹{Number(categoryData.term1).toLocaleString()}</td>
                        <td>₹{Number(categoryData.term2).toLocaleString()}</td>
                      </tr>
                      
                      {/* Received Row */}
                      <tr className="bg-green-50">
                        <td className="text-left font-medium">Received</td>
                        <td className="text-green-600 font-medium">
                          ₹{Number(categoryData.monthlyReceived).toLocaleString()}
                        </td>
                        <td className="text-green-600 font-medium">
                          ₹{Number(categoryData.admissionReceived).toLocaleString()}
                        </td>
                        <td className="text-green-600 font-medium">
                          ₹{Number(categoryData.term1Received).toLocaleString()}
                        </td>
                        <td className="text-green-600 font-medium">
                          ₹{Number(categoryData.term2Received).toLocaleString()}
                        </td>
                      </tr>
                      
                      {/* Balance Row */}
                      <tr className="bg-red-50">
                        <td className="text-left font-medium">Balance</td>
                        <td className="text-red-600 font-medium">
                          ₹{Number(categoryData.monthlyBalance).toLocaleString()}
                        </td>
                        <td className="text-red-600 font-medium">
                          ₹{Number(categoryData.admissionBalance).toLocaleString()}
                        </td>
                        <td className="text-red-600 font-medium">
                          ₹{Number(categoryData.term1Balance).toLocaleString()}
                        </td>
                        <td className="text-red-600 font-medium">
                          ₹{Number(categoryData.term2Balance).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Category Total Summary */}
                <div className="mt-4 p-3 bg-white border rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {categoryData.category} Grand Total:
                    </span>
                    <div className="flex gap-6 text-sm">
                      <span>
                        Total: <span className="font-semibold">₹{Number(categoryData.totalFees).toLocaleString()}</span>
                      </span>
                      <span className="text-green-600">
                        Paid: <span className="font-semibold">₹{Number(categoryData.paid).toLocaleString()}</span>
                      </span>
                      <span className="text-red-600">
                        Balance: <span className="font-semibold">₹{Number(categoryData.balance).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeeDashboard;