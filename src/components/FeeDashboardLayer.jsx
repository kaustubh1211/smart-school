import { useState } from "react";
import { ChevronDown, Section } from "lucide-react";
import FeeDashboardDetails from "./child/FeeDashboardDetails";
import FeeSummary from "./child/FeeSummary";
import { data } from "autoprefixer";
import StandardWiseFeeData from "./child/StandardWiseFeeData";
import StudentFeeDetailsTable from "./child/StudentFeeDetailsTable";
import { Checkbox } from "./ui/checkbox";

const FeeDashboardLayer = () => {
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [showStudents, setShowStudents] = useState(false);
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

  const prathamikFeeData = [
    {
      standard: "STD I",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD II",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD III",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD IV",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD V",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD VI",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD VII",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
  ];

  const totalPrathamikFeeData = {
    standard: "Total",
    division: "",
    students: "",
    totalFee: prathamikFeeData.reduce((data, item) => data + item.totalFee, 0),
    exemption: prathamikFeeData.reduce(
      (data, item) => data + item.exemption,
      0
    ),
    paidAmount: prathamikFeeData.reduce(
      (data, item) => data + item.paidAmount,
      0
    ),
    balance: prathamikFeeData.reduce((data, item) => data + item.balance, 0),
    balancePercent:
      prathamikFeeData.reduce((data, item) => data + item.balancePercent, 0) /
        prathamikFeeData.length || 0,
  };

  prathamikFeeData.push(totalPrathamikFeeData);

  const madhyamikFeeData = [
    {
      standard: "STD VIII",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD IX",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
    {
      standard: "STD X",
      division: "A",
      students: 41,
      totalFee: 2277630,
      exemption: 0,
      paidAmount: 1103270,
      balance: 1174360,
      balancePercent: 51.56,
    },
  ];

  const totalMadhyamikFeeData = {
    standard: "Total",
    division: "",
    students: "",
    totalFee: madhyamikFeeData.reduce((data, item) => data + item.totalFee, 0),
    exemption: madhyamikFeeData.reduce(
      (data, item) => data + item.exemption,
      0
    ),
    paidAmount: madhyamikFeeData.reduce(
      (data, item) => data + item.paidAmount,
      0
    ),
    balance: madhyamikFeeData.reduce((data, item) => data + item.balance, 0),
    balancePercent:
      madhyamikFeeData.reduce((data, item) => data + item.balancePercent, 0) /
        madhyamikFeeData.length || 0,
  };

  madhyamikFeeData.push(totalMadhyamikFeeData);

  const filteredDataByClass = (data, selectedClass) => {
    return data.filter((row) => {
      if (selectedClass === "Prathamik") {
        return [
          "STD I",
          "STD II",
          "STD III",
          "STD IV",
          "STD V",
          "STD VI",
          "STD VII",
        ].includes(row.standard);
      } else if (selectedClass === "Madhyamik") {
        return ["STD VIII", "STD IX", "STD X"].includes(row.standard);
      } else if (selectedClass === "All") {
        return true;
      }
      return row.standard === selectedClass;
    });
  };

  const filteredPrathamik = filteredDataByClass(
    prathamikFeeData,
    selectedClass
  );
  const filteredMadhyamik = filteredDataByClass(
    madhyamikFeeData,
    selectedClass
  );

  const feeDetails = [
    {
      textColor: "text-gray-900",
      name: "Fee Amount",
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
      textColor: "text-green-600",
      name: "Received",
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
    textColor: "text-red",
    name: "Balance",
    ...Object.fromEntries(
      //used to convert key-value pairs into an object
      Object.keys(feeDetails[0]) // all keys are extracted from feeDetails[0] matlb from first object in feeDetails
        .filter((key) => typeof feeDetails[0][key] === "number") // Only numeric fields
        .map((key) => [key, feeDetails[0][key] - feeDetails[1][key]]) // Calculate difference aur generates an array of key-value pairs
    ),
  };

  feeDetails.push(balance);

  return (
    <div className="p-4 max-w-full mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <svg
            width="25"
            height="25"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
          <h1 className="text-xl font-semibold">Fee Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="form-label">Class</label>
            <div
              className="form-control-wrapper"
              style={{ position: "relative" }}
            >
              <select
                name="class"
                className="form-control pr-14"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="All">--ALL--</option>
                <option value="Prathamik" className="font-bold text-black">
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

          <div className="flex items-center">
            <label className="form-label">
              Year <span style={{ color: "#ff0000" }}>*</span>
            </label>
            <div className="">
              <div
                className="form-control-wrapper"
                style={{ position: "relative" }}
              >
                <select
                  name="class"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className={`form-control mr-12 py-2  ${
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showStudents"
              name="showStudents"
              checked={showStudents}
              onChange={(e) => setShowStudents(e.target.checked)}
              className="h-5 w-5 border-1 border-black rounded-sm appearance-none checked:bg-white checked:border-white checked:before:content-['✔'] checked:before:text-black checked:before:text-sm checked:before:flex checked:before:items-center checked:before:justify-center"
            />
            <label
              htmlFor="showStudents"
              className="text-sm font-medium text-gray-700"
            >
              Students
            </label>
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      {selectedClass === "All" && (
        <div className="mb-8 shadow-xl">
          <h2 className="text-lg font-semibold m-4 text-cyan-500">
            Overall Summary
          </h2>
          <FeeSummary summaryData={summaryData} />
          <FeeDashboardDetails feeDetails={feeDetails} />
        </div>
      )}
      {/* Prathamik */}
      {(selectedClass === "All" ||
        selectedClass === "Prathamik" ||
        [
          "STD I",
          "STD II",
          "STD III",
          "STD IV",
          "STD V",
          "STD VI",
          "STD VII",
        ].includes(selectedClass)) && (
        <div className="mb-8 shadow-xl">
          <h2 className="text-lg font-semibold m-4 text-cyan-500">Prathamik</h2>
          <FeeDashboardDetails feeDetails={feeDetails} />
          <StandardWiseFeeData filteredData={filteredPrathamik} />
        </div>
      )}
      {/* Madhyamik */}
      {(selectedClass === "All" ||
        selectedClass === "Madhyamik" ||
        ["STD X", "STD IX", "STD VIII"].includes(selectedClass)) && (
        <div className="mb-8 shadow-xl">
          <h2 className="text-lg font-semibold m-4 text-cyan-500">Madhyamik</h2>
          <FeeDashboardDetails feeDetails={feeDetails} />
          <StandardWiseFeeData filteredData={filteredMadhyamik} />
        </div>
      )}
      {showStudents && (
       <div className="bg-white mb-8 shadow-xl">
        <StudentFeeDetailsTable
          studentData={[
            {
              standard: "STD I",
              section: "PRATHAMIK",
              division: "A",
              name: "AAYMAN ANSARI",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 2500,
              balance: 1860,
            },
            {
              standard: "STD I",
              section: "PRATHAMIK",
              division: "A",
              name: "SWEETY GUPTA",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 660,
              balance: 3700,
            },
            {
              standard: "STD I",
              section: "PRATHAMIK",
              division: "A",
              name: "ARCHITA YADAV",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 3360,
              balance: 1000,
            },
            {
              standard: "STD I",
              section: "PRATHAMIK",
              division: "A",
              name: "ANUSHKA YADAV",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 3200,
              balance: 1160,
            },
            {
              standard: "STD I",
              section: "PRATHAMIK",
              division: "A",
              name: "KOMAL KUMARI YADAV",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 200,
              balance: 4160,
            },
            {
              standard: "STD VIII",
              section: "MADHAYMIK",
              division: "A",
              name: "RAHUL SHARMA",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 2500,
              balance: 1860,
            },
            {
              standard: "STD VIII",
              section: "MADHAYMIK",

              division: "A",
              name: "PRIYA PATEL",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 3000,
              balance: 1360,
            },
            {
              standard: "STD IX",
              section: "MADHAYMIK",

              division: "A",
              name: "AMIT KUMAR",
              totalFee: 4360,
              exemption: 0,
              paidAmount: 4000,
              balance: 360,
            },
          ]}
        />
        </div>
      )}
    </div>
  );
};

export default FeeDashboardLayer;
