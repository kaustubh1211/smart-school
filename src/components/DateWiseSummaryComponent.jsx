import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

const DateWiseSummaryReport = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [party, setParty] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  
  const [selected, setSelected] = useState({
    classId: "",
    category: "",
    displayValue: "",
  });

  // get YYYY-MM-DD in local time (avoids UTC offset issues)
  const toDateInputValue = (d) => {
    const offMs = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offMs).toISOString().slice(0, 10);
  };

  const today = toDateInputValue(new Date());
  const [formData, setFormData] = useState({
    startDate: today,
    endDate: today,
  });

  const [options, setOptions] = useState({
    division: "",
    paymentMode: [],
    feeTypeName: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOptions = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multi-select for paymentMode and feeTypeName
  const handleMultiSelect = (name, value) => {
    setOptions((prev) => {
      const currentValues = prev[name];
      if (currentValues.includes(value)) {
        // Remove if already selected
        return {
          ...prev,
          [name]: currentValues.filter((v) => v !== value),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          [name]: [...currentValues, value],
        };
      }
    });
  };

  // Handle class selection
  const handleChange = (event) => {
    const selectedValue = event.target.value;

    // Check if the selected value is a category
    const isCategory = Object.keys(groupedData).includes(selectedValue);

    if (isCategory) {
      setSelected({
        classId: "",
        category: selectedValue,
        displayValue: selectedValue,
      });
    } else {
      const selectedClass = party.find((cls) => cls.id === selectedValue);
      if (selectedClass) {
        setSelected({
          classId: selectedClass.id,
          category: "",
          displayValue: selectedValue,
        });
      }
    }
  };

  // Fetch class/party data
  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}class/list-party`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              mediumNames: tenant,
            },
          }
        );
        setParty(response.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchParty();
  }, [tenant]);

  // Fetch fee types
  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}fee/fee-types`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFeeTypes(response.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFeeTypes();
  }, []);

  // Group data by category
  const groupedData = party.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Fetch date-wise report data
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          startDate: formData.startDate,
          endDate: formData.endDate,
        };

        // Add optional filters only if they have values
        if (selected.classId) {
          params.classId = selected.classId;
        }
        if (options.division) {
          params.division = options.division;
        }
        if (options.paymentMode.length > 0) {
          params.paymentMode = options.paymentMode;
        }
        if (options.feeTypeName.length > 0) {
          params.feeTypeName = options.feeTypeName;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}fee/date-wise-report`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: params,
          }
        );
        setReportData(response.data.data || []);
      } catch (error) {
        console.error(error);
        setError("Unable to fetch date-wise report. Please try again later.");
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [btnClicked]);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setBtnClicked(!btnClicked);
  };

  // Get all unique fee type columns from the data
  const getAllFeeColumns = () => {
    const columns = new Set(["admissionFee", "term1", "term2", "monthlyFee"]);
    
    reportData.forEach((modeData) => {
      modeData.rows?.forEach((row) => {
        if (row.otherFeeTypes) {
          Object.keys(row.otherFeeTypes).forEach((key) => columns.add(key));
        }
      });
    });

    return Array.from(columns);
  };

  const feeColumns = getAllFeeColumns();

  // Calculate overall total across all payment modes
  const calculateOverallTotal = () => {
    return reportData.reduce((sum, modeData) => sum + (modeData.totalOfMode || 0), 0);
  };

  const overallTotal = calculateOverallTotal();

  // Export to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    reportData.forEach((modeData) => {
      const worksheetData = [
        [
          `Payment Mode: ${modeData.paymentMode?.toUpperCase() || "UNKNOWN"}`,
        ],
        [],
        [
          "Date",
          "Course",
          "Admission Fee",
          "Term 1",
          "Monthly Fee",
          "Term 2",
          "IT FEES",
          "COMPUTER SCIENCE",
          "Total",
        ],
        ...modeData.rows.map((row) => [
          row.date || "",
          row.className || "",
          row.admissionFee?.toFixed(2) || "0.00",
          row.term1?.toFixed(2) || "0.00",
          row.monthlyFee?.toFixed(2) || "0.00",
          row.term2?.toFixed(2) || "0.00",
          row.otherFeeTypes?.["IT FEES"]?.toFixed(2) || "",
          row.otherFeeTypes?.["COMPUTER SCIENCE"]?.toFixed(2) || "",
          row.total?.toFixed(2) || "0.00",
        ]),
        [],
        ["", "", "", "", "", "", "Mode Total:", modeData.totalOfMode?.toFixed(2) || "0.00"],
        [],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet["!cols"] = [
        { wch: 12 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 18 },
        { wch: 12 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        modeData.paymentMode?.toUpperCase() || "UNKNOWN"
      );
    });

    // Add overall summary sheet
    const summaryData = [
      ["Overall Summary"],
      [],
      ["Payment Mode", "Total Amount"],
      ...reportData.map((modeData) => [
        modeData.paymentMode?.toUpperCase() || "UNKNOWN",
        modeData.totalOfMode?.toFixed(2) || "0.00",
      ]),
      [],
      ["GRAND TOTAL", overallTotal.toFixed(2)],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    XLSX.writeFile(
      workbook,
      `DateWise_Summary_Report_${formData.startDate}_to_${formData.endDate}.xlsx`
    );
  };

  // Print as PDF
  const printTable = () => {
    const element = document.getElementById("print-datewise");
    const opt = {
      margin: 10,
      filename: `DateWise_Summary_Report_${formData.startDate}_to_${formData.endDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // Format payment mode for display
  const formatPaymentMode = (mode) => {
    if (!mode) return "UNKNOWN";
    return mode.toUpperCase();
  };

  // Get background color for payment mode
  const getPaymentModeColor = (mode) => {
    const modeColors = {
      cash: "bg-green-500",
      cheque: "bg-blue-500",
      online: "bg-orange-500",
    };
    return modeColors[mode?.toLowerCase()] || "bg-gray-500";
  };

  return (
    <div>
      <div className="text-lg font-bold mb-3">Date Wise Summary Report</div>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <div className="card text-sm h-100 p-0 radius-12">
        {/* Filter Section */}
        <div className="card-header border-bottom bg-base py-16 px-24">
          {/* First Row - Date Filters */}
          <div className="d-flex flex-column flex-md-row align-items-start gap-4 mb-3">
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                className="form-control"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                className="form-control"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Second Row - Class and Division */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3 w-full">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Course:
              </label>
              <select
                value={selected.displayValue}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md px-4 font-bold"
              >
                <option value="">-- All Classes --</option>
                {Object.entries(groupedData).flatMap(([category, classes]) => [
                  <option
                    key={category}
                    value={category}
                    className="font-bold bg-neutral-200"
                  >
                    {category}
                  </option>,
                  ...classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class}
                    </option>
                  )),
                ])}
              </select>
            </div>

            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Division:
              </label>
              <select
                name="division"
                className="w-full border border-gray-300 py-2 rounded-md px-4 font-bold"
                value={options.division}
                onChange={handleOptions}
              >
                <option value="">All Divisions</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          {/* Third Row - Payment Mode and Fee Type (Multi-select) */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3 w-full">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light mb-2">
                Payment Mode: (Select multiple)
              </label>
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <div className="flex flex-col gap-2">
                  {["cash", "cheque", "online"].map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={options.paymentMode.includes(mode)}
                        onChange={() => handleMultiSelect("paymentMode", mode)}
                        className="form-check-input cursor-pointer"
                      />
                      <span className="text-sm font-medium capitalize">
                        {mode}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {options.paymentMode.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  Selected: {options.paymentMode.join(", ")}
                </div>
              )}
            </div>

            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light mb-2">
                Fee Type: (Select multiple)
              </label>
              <div className="border border-gray-300 rounded-md p-3 bg-white max-h-48 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {feeTypes.length > 0 ? (
                    feeTypes.map((feeType, index) => {
                      const feeTypeName = feeType.name || feeType;
                      return (
                        <label
                          key={index}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={options.feeTypeName.includes(feeTypeName)}
                            onChange={() =>
                              handleMultiSelect("feeTypeName", feeTypeName)
                            }
                            className="form-check-input cursor-pointer"
                          />
                          <span className="text-sm font-medium">
                            {feeTypeName}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <>
                      {[
                        "Admission Fee",
                        "Tuition Fee",
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((feeType) => (
                        <label
                          key={feeType}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={options.feeTypeName.includes(feeType)}
                            onChange={() =>
                              handleMultiSelect("feeTypeName", feeType)
                            }
                            className="form-check-input cursor-pointer"
                          />
                          <span className="text-sm font-medium">{feeType}</span>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>
              {options.feeTypeName.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  Selected: {options.feeTypeName.join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              onClick={handleOnSubmit}
              className="btn btn-primary px-5"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col">
          <div className="flex justify-center gap-2 pt-4">
            <button
              onClick={exportToExcel}
              className="btn btn-success px-4 py-2"
              disabled={reportData.length === 0}
            >
              <Icon icon="vscode-icons:file-type-excel" className="mr-2" />
              Export to Excel
            </button>
            <button
              onClick={printTable}
              className="btn btn-warning px-4 py-2"
              disabled={reportData.length === 0}
            >
              <Icon icon="material-symbols:print" className="mr-2" />
              Print PDF
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div id="print-datewise">
          <div className="card-body p-24">
            <div className="flex flex-col justify-between items-center mb-4">
              <div className="border border-b-1 border-slate-900 w-full mb-4"></div>
              <div className="text-center">
                <h2 className="text-xl font-bold">
                  Shri Raghubir High School & Junior College
                </h2>
                <p className="text-sm">
                  Yadav Nagar, Boisar (East), Palghar-401501, Maharashtra
                </p>
                <p className="text-md font-semibold mt-2">
                  Date Wise Summary Report
                </p>
                <p className="text-sm">
                  Period: {formData.startDate} to {formData.endDate}
                </p>
              </div>
              <div className="border border-b-1 border-slate-900 w-full mt-4"></div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : reportData.length > 0 ? (
              <>
                {/* Display tables for each payment mode */}
                {reportData.map((modeData, modeIndex) => (
                  <div key={modeIndex} className="mb-6">
                    {/* Payment Mode Header */}
                    <div
                      className={`${getPaymentModeColor(
                        modeData.paymentMode
                      )} text-white text-left py-3 px-4 font-bold text-lg mb-3 rounded-md`}
                    >
                      Payment Mode: {formatPaymentMode(modeData.paymentMode)}
                    </div>

                    {/* Table */}
                    <div className="table-responsive scroll-sm text-xs mb-4">
                      <table className="table-bordered-custom sm-table mb-0">
                        <thead>
                          <tr>
                            <th className="text-center text-xs" scope="col">
                              Date
                            </th>
                            <th className="text-center text-xs" scope="col">
                              Course
                            </th>
                            <th className="text-center text-xs" scope="col">
                              Admission Fee
                            </th>
                            <th className="text-center text-xs" scope="col">
                              Term 1
                            </th>
                            <th className="text-center text-xs" scope="col">
                              Monthly Fee
                            </th>
                            <th className="text-center text-xs" scope="col">
                              Term 2
                            </th>
                            {/* <th className="text-center text-xs" scope="col">
                              IT FEES
                            </th>
                            <th className="text-center text-xs" scope="col">
                              COMPUTER SCIENCE
                            </th> */}
                            <th className="text-center text-xs" scope="col">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-center">
                          {modeData.rows && modeData.rows.length > 0 ? (
                            modeData.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                <td className="px-2 py-2">{row.date || "-"}</td>
                                <td className="px-2 py-2 text-left">
                                  {row.className || "-"}
                                </td>
                                <td className="px-2 py-2 text-right">
                                  {row.admissionFee
                                    ? row.admissionFee.toFixed(2)
                                    : ""}
                                </td>
                                <td className="px-2 py-2 text-right">
                                  {row.term1 ? row.term1.toFixed(2) : ""}
                                </td>
                                <td className="px-2 py-2 text-right">
                                  {row.monthlyFee
                                    ? row.monthlyFee.toFixed(2)
                                    : ""}
                                </td>
                                <td className="px-2 py-2 text-right">
                                  {row.term2 ? row.term2.toFixed(2) : ""}
                                </td>
                                {/* <td className="px-2 py-2 text-right">
                                  {row.otherFeeTypes?.["IT FEES"]
                                    ? row.otherFeeTypes["IT FEES"].toFixed(2)
                                    : ""}
                                </td>
                                <td className="px-2 py-2 text-right">
                                  {row.otherFeeTypes?.["COMPUTER SCIENCE"]
                                    ? row.otherFeeTypes[
                                        "COMPUTER SCIENCE"
                                      ].toFixed(2)
                                    : ""}
                                </td> */}
                                <td className="px-2 py-2 text-right font-semibold">
                                  {row.total ? row.total.toFixed(2) : "0.00"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="9"
                                className="text-center py-4 text-gray-500"
                              >
                                No records found
                              </td>
                            </tr>
                          )}

                          {/* Mode Total Row */}
                          {modeData.rows && modeData.rows.length > 0 && (
                            <tr className="bg-gray-100 font-bold ">
                              <td
                                colSpan="8"
                                className="px-2 py-3 text-right text-base text-black "
                              >
                                {formatPaymentMode(modeData.paymentMode)} Total:
                              </td>
                              <td className="px-2 py-3 text-right text-base text-black">
                                ₹{modeData.totalOfMode?.toFixed(2) || "0.00"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {/* Overall Total Section */}
                <div className="mt-6 border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-end items-center gap-4">
                    <div className="text-xl font-bold">Overall Total:</div>
                    <div className="text-2xl font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-md border-2 border-blue-300">
                      ₹{overallTotal.toFixed(2)}
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="flex gap-4 flex-wrap mt-6">
                    {reportData.map((modeData, index) => (
                      <div
                        key={index}
                        className="border shadow-md rounded-md flex-grow min-w-60"
                      >
                        <div
                          className={`${getPaymentModeColor(
                            modeData.paymentMode
                          )} text-white text-center py-2 font-bold rounded-t-md`}
                        >
                          {formatPaymentMode(modeData.paymentMode)}
                        </div>
                        <div className="p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">
                            Total Amount
                          </div>
                          <div className="text-2xl font-bold">
                            ₹{modeData.totalOfMode?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No data available for the selected date range
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateWiseSummaryReport;