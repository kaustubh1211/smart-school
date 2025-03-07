"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FeeDashboardLayer = () => {
  const [selectedClass, setSelectedClass] = useState("-- ALL --");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [showStudents, setShowStudents] = useState(true);
  const [yearError, setYearError] = useState("");

  const validateYear = (year) => {
    const yearPattern = /^\d{4}-\d{4}$/;
    const [startYear, endYear] = year.split("-").map(Number);

    if (!yearPattern.test(year)) {
      setYearError("Select Year");
      return false;
    }

    if (endYear !== startYear + 1) {
      setYearError("End year must be one year after start year");
      return false;
    }

    if (startYear < 2000 || startYear > 2100) {
      setYearError("Year must be between 2000-2100");
      return false;
    }

    setYearError("");
    return true;
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    if (validateYear(year)) {
      setSelectedYear(year);
    }
  };

  const summaryData = [
    {
      level: "PRATHAMIK",
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      level: "MADHYAMIK",
      totalFee: 1642800,
      exemption: 0,
      paidAmount: 784900,
      balance: 857900,
      balancePercent: 52.22,
    },
  ];

  const feeDetails = {
    feeAmount: {
      feeHead: 515020,
      labFees: 0,
      extraClass: 0,
      workbook: 0,
      labCharge: 0,
      projectBook: 0,
      dress: 0,
      bus: 0,
      // ... other columns
    },
    received: {
      feeHead: 377370,
      labFees: 0,
      extraClass: 0,
      workbook: 0,
      labCharge: 0,
      projectBook: 0,
      dress: 0,
      bus: 0,
      // ... other columns
    },
  };

  return (
    <div className="p-4 max-w-full mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Fee Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex">
            <label className="form-label">
              Class <span style={{ color: "#ff0000" }}>*</span>
            </label>
            <div
              className="form-control-wrapper"
              style={{ position: "relative" }}
            >
              <select
                name="class"
                className="form-control"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">--Class--</option>
                <option
                  value="Prathamik"
                  disabled
                  className="font-bold text-black hover:bg-white"
                >
                  PRATHAMIK
                </option>
                <option value="STD I">STD I</option>
                <option value="STD II">STD II</option>
                <option value="STD III">STD III</option>
                <option value="STD IV">STD IV</option>
                <option value="STD V">STD V</option>
                <option value="STD VI">STD VI</option>
                <option value="STD VII">STD VII</option>
                <option
                  value="Madhyamik"
                  disabled
                  className="font-bold text-black hover:bg-white"
                >
                  MADHYAMIK
                </option>
                <option value="STD VIII">STD VIII</option>
                <option value="STD IX">STD IX</option>
                <option value="STD X">STD X</option>
              </select>
              <ChevronDown
                className="dropdown-icon"
                size={20}
                style={{
                  position: "absolute",
                  right: "10px" /* Adjust this value for proper spacing */,
                  top: "50%",
                  transform:
                    "translateY(-50%)" /* Vertically center the icon */,
                  pointerEvents:
                    "none" /* Ensures the icon doesn't block interaction */,
                }}
              />
            </div>
          </div>

          <div className="relative flex">
            <div>
              <label className="form-label">
                Year <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <div
                className="form-control-wrapper"
                style={{ position: "relative" }}
              >
                <select
                  name="class"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className={`form-control border rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${
                    yearError ? "border-red-500" : ""
                  }`}
                >
                  <option value="">--Year--</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2021-2022">2021-2022</option>
                  <option value="2020-2021">2020-2021</option>
                  <option value="2019-2020">2019-2020</option>
                  <option value="2018-2019">2018-2019</option>
                </select>
                <ChevronDown
                  className="dropdown-icon"
                  size={20}
                  style={{
                    position: "absolute",
                    right: "10px" /* Adjust this value for proper spacing */,
                    top: "50%",
                    transform:
                      "translateY(-50%)" /* Vertically center the icon */,
                    pointerEvents:
                      "none" /* Ensures the icon doesn't block interaction */,
                  }}
                />
              </div>
              {yearError && (
                <p className="absolute text-red-500 text-xs mt-1">
                  {yearError}
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showStudents}
              onChange={(e) => setShowStudents(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>Students</span>
          </label>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Overall Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Fee
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exemption
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bal(%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summaryData.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.totalFee.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.exemption}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                    {row.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                    {row.balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                    {row.balancePercent.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Fee Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Fee Head
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Fee Head
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Lab Fees
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Extra Class
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Workbook
              </th>
              
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                Fee Amount
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {feeDetails.feeAmount.feeHead.toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {feeDetails.feeAmount.labFees}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {feeDetails.feeAmount.extraClass}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                {feeDetails.feeAmount.workbook}
              </td>
              {/* Add more columns */}
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                Received
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-green-600">
                {feeDetails.received.feeHead.toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-green-600">
                {feeDetails.received.labFees}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-green-600">
                {feeDetails.received.extraClass}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-green-600">
                {feeDetails.received.workbook}
              </td>
              {/* Add more columns */}
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                Balance
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-red-600">
                {(
                  feeDetails.feeAmount.feeHead - feeDetails.received.feeHead
                ).toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-red-600">
                {feeDetails.feeAmount.labFees - feeDetails.received.labFees}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-red-600">
                {feeDetails.feeAmount.extraClass -
                  feeDetails.received.extraClass}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-red-600">
                {feeDetails.feeAmount.workbook - feeDetails.received.workbook}
              </td>
              {/* Add more columns */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeDashboardLayer;
