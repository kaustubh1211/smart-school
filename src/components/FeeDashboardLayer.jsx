"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FeeDashboardDetails from "./child/FeeDashboardDetails";

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

  const totalSummary = {
    level: "",
    totalFee: summaryData[0].totalFee + summaryData[1].totalFee,
    exemption: summaryData[0].exemption + summaryData[1].exemption,
    paidAmount: summaryData[0].paidAmount + summaryData[1].paidAmount,
    balance: summaryData[0].balance + summaryData[1].balance,
    balancePercent:
      (summaryData[0].balancePercent + summaryData[1].balancePercent) / 2,
  };

  summaryData.push(totalSummary);

  const feeDetails = [
    {
      name: "Fee Amount",
      textColor: "text-gray-900",
      labFees: 0,
      extraClass: 0,
      workbook: 515020,
      labCharge: 0,
      projectBook: 0,
      dress2Pair: 0,
      bus: 0,
      pendingFees: 0,
      miscFee: 0,
      pendingFees1819: 0,
      pendingFees1718: 0,
      pendingFees1617: 0,
      pendingFees1516: 0,
      dress: 0,
      admissionFees: 173900,
      term1: 173900,
      monthlyFee: 2086800,
      Term2: 173900,
      journal: 0,
      examFee: 0,
      idCardGym: 0,
      idCard: 67100,
      computerFee: 404300,
      examFee1: 129200,
      examFee2: 129200,
      projectJournalBook: 0,
      bonafideFee: 0,
      itFees: 0,
      sportsFee: 67100,
      computerScience: 0,
      total: 3920430,
      // ... other columns
    },
    {
      name: "Received",
      textColor: "text-green-500",
      labFees: 0,
      extraClass: 0,
      workbook: 377370,
      labCharge: 0,
      projectBook: 0,
      dress2Pair: 0,
      bus: 0,
      pendingFees: 0,
      miscFee: 0,
      pendingFees1819: 0,
      pendingFees1718: 0,
      pendingFees1617: 0,
      pendingFees1516: 0,
      dress: 0,
      admissionFees: 42300,
      term1: 119900,
      monthlyFee: 1072400,
      Term2: 108150,
      journal: 0,
      examFee: 0,
      idCardGym: 0,
      idCard: 42400,
      computerFee: 115400,
      examFee1: 129200,
      examFee2: 129200,
      projectJournalBook: 0,
      bonafideFee: 0,
      itFees: 0,
      sportsFee: 67100,
      computerScience: 0,
      total: 3920430,
      // ... other columns
    },
  ];

  const balance = {
    name: "Balance",
    textColor: "text-red-500",
    labFees: feeDetails[0].labFees - feeDetails[1].labFees,
    extraClass: feeDetails[0].extraClass - feeDetails[1].extraClass,
    workbook: feeDetails[0].workbook - feeDetails[1].workbook,
    labCharge: feeDetails[0].labCharge - feeDetails[1].labCharge,
    projectBook: feeDetails[0].projectBook - feeDetails[1].projectBook,
    dress2Pair: feeDetails[0].dress2Pair - feeDetails[1].dress2Pair,
    bus: feeDetails[0].bus - feeDetails[1].bus,
    pendingFees: feeDetails[0].pendingFees - feeDetails[1].pendingFees,
    miscFee: feeDetails[0].miscFee - feeDetails[1].miscFee,
    pendingFees1819:
      feeDetails[0].pendingFees1819 - feeDetails[1].pendingFees1819,
    pendingFees1718:
      feeDetails[0].pendingFees1718 - feeDetails[1].pendingFees1718,
    pendingFees1617:
      feeDetails[0].pendingFees1617 - feeDetails[1].pendingFees1617,
    pendingFees1516:
      feeDetails[0].pendingFees1516 - feeDetails[1].pendingFees1516,
    dress: feeDetails[0].dress - feeDetails[1].dress,
    admissionFees: feeDetails[0].admissionFees - feeDetails[1].admissionFees,
    term1: feeDetails[0].term1 - feeDetails[1].term1,
    monthlyFee: feeDetails[0].monthlyFee - feeDetails[1].monthlyFee,
    Term2: feeDetails[0].Term2 - feeDetails[1].Term2,
    journal: feeDetails[0].journal - feeDetails[1].journal,
    examFee: feeDetails[0].examFee - feeDetails[1].examFee,
    idCardGym: feeDetails[0].idCardGym - feeDetails[1].idCardGym,
    idCard: feeDetails[0].idCard - feeDetails[1].idCard,
    computerFee: feeDetails[0].computerFee - feeDetails[1].computerFee,
    examFee1: feeDetails[0].examFee1 - feeDetails[1].examFee1,
    examFee2: feeDetails[0].examFee2 - feeDetails[1].examFee2,
    projectJournalBook:
      feeDetails[0].projectJournalBook - feeDetails[1].projectJournalBook,
    bonafideFee: feeDetails[0].bonafideFee - feeDetails[1].bonafideFee,
    itFees: feeDetails[0].itFees - feeDetails[1].itFees,
    sportsFee: feeDetails[0].sportsFee - feeDetails[1].sportsFee,
    computerScience:
      feeDetails[0].computerScience - feeDetails[1].computerScience,
    total: feeDetails[0].total - feeDetails[1].total,
  };

  feeDetails.push(balance);

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
      <FeeDashboardDetails feeDetails={feeDetails}/>
    </div>
  );
};

export default FeeDashboardLayer;
