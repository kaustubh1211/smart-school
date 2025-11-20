import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import dayjs from "dayjs";
import Papa from "papaparse";

const MonthlyFeesTranxLayer = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [paymentData, setPaymentData] = useState({}); // Changed to object to match new API structure
  const [totalFees, setTotalFees] = useState({});

  const [party, setParty] = useState([]);
  const [selected, setSelected] = useState({
    classId: "",
    category: "",
    displayValue: "",
  });

  const [options, setOptions] = useState({
    mode: "All",
    adminId: "",
  });

  const [admins, setAdmins] = useState([]);

  const handleOptions = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}class/list-party`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setParty(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchParty();
  }, []);

  // Group data by category
  const groupedData = party.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

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

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    from_date: dayjs().format("YYYY-MM"),
    to_date: dayjs().format("YYYY-MM"),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }fee/search/monthly-fees/transaction`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              classId: selected.classId,
              category: selected.category,
              from_date: dayjs(formData.from_date).format("MM-YYYY"),
              to_date: dayjs(formData.to_date).format("MM-YYYY"),
              modeOfPayment: options.mode === "All" ? "" : options.mode,
            },
          }
        );

        setPaymentData(response.data.data || {});
      } catch (error) {
        console.error(error);
        setError("Unable to fetch payments. Please try again later.");
        setPaymentData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [btnClicked, tenant, academicYear]);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setBtnClicked(!btnClicked);
  };

  // Function to organize data by payment mode for separate tables
  const organizeDataByPaymentMode = (data) => {
    const organized = {};

    // Iterate through each month
    Object.entries(data).forEach(([month, categories]) => {
      // Iterate through each category (PRE-PRIMARY, PRIMARY, etc.)
      Object.entries(categories).forEach(([category, paymentModes]) => {
        // Iterate through each payment mode (cash, cheque, online)
        Object.entries(paymentModes).forEach(([paymentMode, fees]) => {
          // Initialize payment mode array if it doesn't exist
          if (!organized[paymentMode]) {
            organized[paymentMode] = [];
          }

          organized[paymentMode].push({
            month,
            category,
            monthlyFees: fees.monthlyFees || 0,
            admissionFee: fees.admissionFee || 0,
            term1: fees.term1 || 0,
            term2: fees.term2 || 0,
            ...fees.otherFees, // Spread other fees if any
            total: fees.total || 0,
          });
        });
      });
    });

    return organized;
  };

  // Organize the payment data by payment mode
  const organizedData = organizeDataByPaymentMode(paymentData);

  // Get all payment modes present in the data
  const paymentModes = Object.keys(organizedData);

  // Function to calculate totals for a specific payment mode data
  const calculateTotals = (data) => {
    const totals = {};

    data.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "month" && key !== "category" && typeof value === "number") {
          if (!totals[key]) {
            totals[key] = 0;
          }
          totals[key] += value;
        }
      });
    });

    return totals;
  };

  // Collect all unique fee columns across all payment modes
  const getAllFeeColumns = () => {
    const allColumns = new Set();
    
    Object.values(organizedData).forEach((modeData) => {
      modeData.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key !== "month" && key !== "category" && key !== "total") {
            allColumns.add(key);
          }
        });
      });
    });

    return Array.from(allColumns);
  };

  const feeColumns = getAllFeeColumns();

  // Create table columns
  const columns = ["Month-Year", "Category", ...feeColumns, "Total"];

  // Calculate overall total across all payment modes
  const calculateOverallTotal = () => {
    let grandTotal = 0;
    Object.values(organizedData).forEach((modeData) => {
      const totals = calculateTotals(modeData);
      grandTotal += totals.total || 0;
    });
    return grandTotal;
  };

  const overallTotal = calculateOverallTotal();

  const exportToCSV = () => {
    if (!organizedData || Object.keys(organizedData).length === 0) {
      alert("No data to export");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Create a sheet for each payment mode
    Object.entries(organizedData).forEach(([paymentMode, modeData]) => {
      const totals = calculateTotals(modeData);

      const worksheetData = [
        [`Payment Mode: ${paymentMode.toUpperCase()}`],
        [],
        columns,
        ...modeData.map((item) => [
          item.month,
          item.category,
          ...feeColumns.map((column) =>
            item[column] ? Number(item[column]).toFixed(2) : ""
          ),
          item.total ? Number(item.total).toFixed(2) : "0.00",
        ]),
        [],
        [
          "TOTAL",
          "",
          ...feeColumns.map((column) =>
            totals[column] ? Number(totals[column]).toFixed(2) : "0.00"
          ),
          totals.total ? Number(totals.total).toFixed(2) : "0.00",
        ],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet["!cols"] = [
        { wch: 12 },
        { wch: 20 },
        ...feeColumns.map(() => ({ wch: 15 })),
        { wch: 12 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        paymentMode.toUpperCase()
      );
    });

    // Add summary sheet
    const summaryData = [
      ["Overall Summary"],
      [],
      ["Payment Mode", "Total Amount"],
      ...Object.entries(organizedData).map(([mode, modeData]) => {
        const totals = calculateTotals(modeData);
        return [mode.toUpperCase(), totals.total?.toFixed(2) || "0.00"];
      }),
      [],
      ["GRAND TOTAL", overallTotal.toFixed(2)],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    XLSX.writeFile(
      workbook,
      `Monthly_Fees_${formData.from_date}_to_${formData.to_date}.xlsx`
    );
  };

  const printTable = () => {
    const element = document.getElementById("print-fee");
    const opt = {
      margin: 2,
      filename: `Monthly_Fees_${formData.from_date}_to_${formData.to_date}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <div className="text-lg font-bold mb-3">Monthly Fees Transaction</div>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <div className="d-flex flex-column flex-md-row align-items-start gap-4 mb-3">
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                From
              </label>
              <input
                type="month"
                name="from_date"
                value={formData.from_date}
                className="form-control"
                onChange={handleInputChange}
              />
            </div>
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                To
              </label>
              <input
                type="month"
                name="to_date"
                value={formData.to_date}
                className="form-control"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3 w-full">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Party:
              </label>
              <select
                value={selected.displayValue}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md px-4 font-bold"
              >
                <option value="">-- Select Class --</option>
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
                Mode of Payment:
              </label>
              <div className="relative flex-1">
                <select
                  name="mode"
                  className="w-full border border-gray-300 py-2 rounded-md px-4 font-bold"
                  value={options.mode}
                  onChange={handleOptions}
                >
                  <option value="All">All Payment Modes</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online</option>
                </select>
              </div>
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

        <div className="flex flex-col">
          <div className="flex justify-center gap-2 pt-4">
            <button
              onClick={exportToCSV}
              className="btn btn-success px-4 py-2"
              disabled={Object.keys(organizedData).length === 0 || loading}
            >
              Export to Excel
            </button>
            <button
              onClick={printTable}
              className="btn btn-warning px-4 py-2"
              disabled={Object.keys(organizedData).length === 0 || loading}
            >
              Print PDF
            </button>
          </div>
        </div>

        <div id="print-fee">
          <div className="card-body p-24">
            <div className="flex flex-col justify-between items-center mb-4">
              <div className="border border-b-1 border-slate-900 w-full mb-4"></div>
              <div>
                <h2 className="text-xl font-bold text-center">
                  Shri Raghubir High School & Junior College
                </h2>
                <p className="text-sm text-center">
                  Yadav Nagar, Boisar (East), Palghar-401501, Maharashtra
                </p>
                <p className="text-center underline text-md font-bold pt-2">
                  Monthly Fee Transaction Report
                </p>
                <p className="text-sm text-center">
                  Period: {formData.from_date} to {formData.to_date}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-gray-600">Loading data...</p>
              </div>
            ) : Object.keys(organizedData).length > 0 ? (
              <>
                {/* Display separate table for each payment mode */}
                {Object.entries(organizedData).map(([paymentMode, modeData], modeIndex) => {
                  const totals = calculateTotals(modeData);
                  
                  // Get color for payment mode
                  const getPaymentModeColor = (mode) => {
                    const colors = {
                      cash: "bg-green-500",
                      cheque: "bg-blue-500",
                      online: "bg-orange-500",
                    };
                    return colors[mode?.toLowerCase()] || "bg-gray-500";
                  };

                  return (
                    <div key={modeIndex} className="mb-6">
                      {/* Payment Mode Header */}
                      <div
                        className={`${getPaymentModeColor(
                          paymentMode
                        )} text-white text-left py-3 px-4 font-bold text-lg mb-3 rounded-md`}
                      >
                        Payment Mode: {paymentMode.toUpperCase()}
                      </div>

                      {/* Table for this payment mode */}
                      <div className="table-responsive scroll-sm text-xs mb-4">
                        <table className="table-bordered-custom sm-table mb-0 overflow-y-visible">
                          <thead>
                            <tr>
                              {columns.map((column, index) => (
                                <th
                                  key={index}
                                  className="text-center text-sm font-bold"
                                  scope="col"
                                >
                                  {column.charAt(0).toUpperCase() + column.slice(1)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="text-xs text-center">
                            {modeData.length > 0 ? (
                              <>
                                {modeData.map((item, index) => (
                                  <tr key={index}>
                                    <td className="px-2 py-2">{item.month}</td>
                                    <td className="px-2 py-2 text-left">
                                      {item.category}
                                    </td>
                                    {feeColumns.map((column, colIndex) => (
                                      <td
                                        key={colIndex}
                                        className="px-2 py-2 text-right"
                                      >
                                        {item[column]
                                          ? Number(item[column]).toFixed(2)
                                          : ""}
                                      </td>
                                    ))}
                                    <td className="px-2 py-2 text-right font-semibold">
                                      {item.total
                                        ? Number(item.total).toFixed(2)
                                        : "0.00"}
                                    </td>
                                  </tr>
                                ))}
                                {/* Total Row for this payment mode */}
                                <tr className="bg-gray-100 font-bold">
                                  <td
                                    colSpan={2}
                                    className="text-center font-bold text-sm"
                                  >
                                    {paymentMode.toUpperCase()} TOTAL
                                  </td>
                                  {feeColumns.map((column, index) => (
                                    <td
                                      key={index}
                                      className="text-center font-bold text-sm text-right"
                                    >
                                      {totals[column]
                                        ? Number(totals[column]).toFixed(2)
                                        : "0.00"}
                                    </td>
                                  ))}
                                  <td className="text-center font-bold text-sm text-right">
                                    {totals.total
                                      ? Number(totals.total).toFixed(2)
                                      : "0.00"}
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td
                                  colSpan={columns.length}
                                  className="text-center py-4 text-gray-500"
                                >
                                  No records found for {paymentMode}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

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
                    {Object.entries(organizedData).map(([mode, modeData], index) => {
                      const totals = calculateTotals(modeData);
                      const getPaymentModeColor = (mode) => {
                        const colors = {
                          cash: "bg-green-500",
                          cheque: "bg-blue-500",
                          online: "bg-orange-500",
                        };
                        return colors[mode?.toLowerCase()] || "bg-gray-500";
                      };

                      return (
                        <div
                          key={index}
                          className="border shadow-md rounded-md flex-grow min-w-60"
                        >
                          <div
                            className={`${getPaymentModeColor(
                              mode
                            )} text-white text-center py-2 font-bold rounded-t-md`}
                          >
                            {mode.toUpperCase()}
                          </div>
                          <div className="p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">
                              Total Amount
                            </div>
                            <div className="text-2xl font-bold">
                              ₹{totals.total?.toFixed(2) || "0.00"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No data available for the selected period
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyFeesTranxLayer;