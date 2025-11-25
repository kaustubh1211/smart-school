import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Toast from "../../src/components/ui/Toast";
import axios from "axios";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import Select from "react-select";
import qs from "qs";


const colors = {
  "PRE-PRIMARY": "bg-blue-500",
  PRATHAMIK: "bg-red-500",
  PRIMARY: "bg-yellow-500",
  MADHYAMIK: "bg-orange-500",
  SECONDARY: "bg-red-500",
};

const OutstandingReport = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();
  
  const [outstandingData, setOutstandingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [installmentTypes, setInstallmentTypes] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  
  const [party, setParty] = useState([]);
  const [selected, setSelected] = useState({
    classId: "",
    category: "",
    displayValue: "",
  });

  const [options, setOptions] = useState({
    division: "",
    installmentType: "",
    feeTypeName: "",
    renderMode: "ALL",
  });

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
        setParty(response.data.data);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch class data");
      }
    };
    fetchParty();
  }, [tenant]);

  // Fetch installment types and fee types
  useEffect(() => {
    const fetchFeeStructureData = async () => {
      try {
        // Fetch installment types
        const installmentResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}fee/installment-types`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        
        // Fetch fee types
        const feeTypeResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}fee/fee-types`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setInstallmentTypes(installmentResponse.data.data || []);
        setFeeTypes(feeTypeResponse.data.data || []);
      } catch (error) {
        console.log(error);
        // Don't set error state here as these are optional filters
      }
    };
    fetchFeeStructureData();
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

  const handleOptions = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch outstanding report data
  useEffect(() => {
    const fetchOutstandingData = async () => {
      if (!academicYear) return;

      setLoading(true);
      setError("");
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}fee/outstanding-report`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              classId: selected.classId || undefined,
              category: selected.category || undefined,
              division: options.division || undefined,
              academicYear: academicYear,
              installmentType: options.installmentType || undefined,
              feeTypeName: options.feeTypeName || undefined,
              renderMode: options.renderMode || undefined,
            },
              paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }) // <-- KEY FIX
  
          }
        );
        setOutstandingData(response.data.data || []);
      } catch (error) {
        console.error(error);
        setError("Unable to fetch outstanding report. Please try again later.");
        setOutstandingData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOutstandingData();
  }, [btnClicked, academicYear, tenant]); 

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setBtnClicked(!btnClicked);
  };

  // Calculate totals
  const calculateTotals = () => {
    return outstandingData.reduce(
      (acc, item) => ({
        totalFees: acc.totalFees + (item.totalFees || 0),
        paidFees: acc.paidFees + (item.paidFees || 0),
        dueFees: acc.dueFees + (item.dueFees || 0),
        discountFees: acc.discountFees + (item.discount || 0),
      }),
      { totalFees: 0, paidFees: 0, dueFees: 0 , discountFees: 0}
    );
  };

  const totals = calculateTotals();

  // Export to Excel
  const exportToExcel = () => {
    const worksheetData = [
      [
        "Enroll No.",
        "Roll No.",
        "Student Name",
        "Class",
        "Division",
        "Mobile",
        "Total Fees",
        "Discount",
        "Paid Fees",
        "Due Fees",
      ],
      ...outstandingData.map((item) => [
        item.enrollNo || "",
        item.rollNo || "",
        item.studentName || "",
        item.class || "",
        item.division || "",
        item.mobile || "",
        item.totalFees || 0,
        item.discount || 0,
        item.paidFees || 0,
        item.dueFees || 0,
      ]),
      // Add totals row
      [
        "",
        "",
        "",
        "",
        "",
        "TOTAL",
        totals.totalFees,
        totals.paidFees,
        totals.dueFees,
        totals.discountFees,
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 12 }, // Enroll No
      { wch: 10 }, // Roll No
      { wch: 25 }, // Student Name
      { wch: 15 }, // Class
      { wch: 10 }, // Division
      { wch: 15 }, // Mobile
      { wch: 12 }, // Total Fees
      { wch: 12 }, // Discount
      { wch: 12 }, // Paid Fees
      { wch: 12 }, // Due Fees
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Outstanding Report");
    XLSX.writeFile(workbook, `Outstanding_Report_${academicYear}.xlsx`);
  };

  // Print as PDF
  const printTable = () => {
    const element = document.getElementById("print-outstanding");
    const opt = {
      margin: 10,
      filename: `Outstanding_Report_${academicYear}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <div className="text-lg font-bold mb-3">Outstanding Fees Report</div>
      
      {error && (
        <div className="alert alert-danger mb-3" role="alert">  
          {error}
        </div>
      )}

      <div className="card text-sm h-100 p-0 radius-12">
        {/* Filter Section */}
        <div className="card-header border-bottom bg-base py-16 px-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3 w-full">
            <div className="flex flex-col w-full md:w-1/3">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Academic Year:
              </label>
              <input
                type="text"
                value={academicYear || ""}
                className="w-full border border-gray-300 p-2 rounded-md px-4 font-bold bg-gray-100"
                disabled
              />
            </div>

            <div className="flex flex-col w-full md:w-1/3">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Course:
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

            <div className="flex flex-col w-full md:w-1/3">
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

          {/* Second Row - New Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3 w-full">
            {/* <div className="flex flex-col w-full md:w-1/3">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Installment Type:
              </label>
              <select
                name="installmentType"
                className="w-full border border-gray-300 py-2 rounded-md px-4 font-bold"
                value={options.installmentType}
                onChange={handleOptions}
              >
                <option value="">All Installments</option>
                <option value="One time">One Time</option>
                <option value="Monthly fee">Monthly Fee</option>
                <option value="Term fee">Term Fee</option>
                <option value="Quarterly fee">Quarterly Fee</option>
                <option value="Yearly fee">Yearly Fee</option>
              </select>
            </div> */}

            <div className="flex flex-col w-full md:w-1/3">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Fee Type:
              </label>
          <Select
  isMulti
  name="feeTypeName"

  options={
    feeTypes.length > 0
      ? feeTypes.map((f) => ({
          label: f.name || f,
          value: f.name || f
        }))
      : [
        { label: "Admission Fee", value: "Admission Fee" },
           { label: "Term 1", value: "Term 1" },
              { label: "Term 2", value: "Term 2" },
        { label: "Jan", value: "Jan" }, 
          { label: "Feb", value: "Feb" },
          { label: "Mar", value: "Mar" },
          { label: "Apr", value: "Apr" },
          { label: "May", value: "May" },
          { label: "Jun", value: "Jun" },
          { label: "Jul", value: "Jul" },
          { label: "Aug", value: "Aug" },
          { label: "Sep", value: "Sep" },
          { label: "Oct", value: "Oct" },
          { label: "Nov", value: "Nov" },
          { label: "Dec", value: "Dec" },
        ]
  }
  value={
    (options.feeTypeName || []).map((v) => ({ label: v, value: v }))
  }
onChange={(selected) => {
  setOptions((prev) => ({
    ...prev,
    feeTypeName: selected ? selected.map((s) => s.value) : []
  }));
}}


  className="w-full"
  classNamePrefix="select"
/>
            </div>

            <div className="flex flex-col w-full md:w-1/3">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Display Mode:
              </label>
              <select
                name="renderMode"
                className="w-full border border-gray-300 py-2 rounded-md px-4 font-bold"
                value={options.renderMode}
                onChange={handleOptions}
              >
                <option value="ALL">All Students</option>
                <option value="HIDE_ZERO">Hide Zero Due</option>
                <option value="FULL_PAID">Full Paid Only</option>
              </select>
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
              disabled={outstandingData.length === 0}
            >
              <Icon icon="vscode-icons:file-type-excel" className="mr-2" />
              Export to Excel
            </button>
            <button
              onClick={printTable}
              className="btn btn-warning px-4 py-2"
              disabled={outstandingData.length === 0}
            >
              <Icon icon="material-symbols:print" className="mr-2" />
              Print PDF
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div id="print-outstanding">
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
                  Outstanding Fees Report - {academicYear}
                </p>
              </div>
              <div className="border border-b-1 border-slate-900 w-full mt-4"></div>
            </div>

            <div className="table-responsive scroll-sm text-xs">
              <table className="table-bordered-custom sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-center text-xs" scope="col">
                      Sr No.
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Enroll No.
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Roll No.
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Student Name
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Class
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Division
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Mobile
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Total Fees
                    </th>
                      <th className="text-center text-xs" scope="col">
                      Discount
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Paid Fees
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Due Fees
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs text-center">
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : outstandingData.length > 0 ? (
                    <>
                      {outstandingData.map((item, index) => (
                        <tr key={index} className="w-full">
                          <td className="px-2 py-2">{index + 1}</td>
                          <td className="px-2 py-2">{item.enrollNo || "-"}</td>
                          <td className="px-2 py-2">{item.rollNo || "-"}</td>
                          <td className="px-2 py-2 text-left">
                            {item.studentName || "-"}
                          </td>
                          <td className="px-2 py-2">{item.class || "-"}</td>
                          <td className="px-2 py-2">{item.division || "-"}</td>
                          <td className="px-2 py-2">{item.mobile || "-"}</td>
                          <td className="px-2 py-2 text-right">
                            ₹{item.totalFees?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-2 py-2 text-right">
                            ₹{item.discount?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-2 py-2 text-right">
                            ₹{item.paidFees?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-2 py-2 text-right">
                            <span
                              className={`px-3 py-1 rounded-md font-semibold ${
                                item.dueFees > 0
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            > 
                              ₹{item.dueFees?.toFixed(2) || "0.00"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {/* Totals Row */}
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan="7" className="px-2 py-3 text-right">
                          TOTAL
                        </td>
                        <td className="px-2 py-3 text-right">
                          ₹{totals.totalFees.toFixed(2)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          ₹{totals.discountFees.toFixed(2)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          ₹{totals.paidFees.toFixed(2)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          ₹{totals.dueFees.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-4 text-gray-500"
                      >
                        No outstanding records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            {outstandingData.length > 0 && (
              <div className="flex gap-4 flex-wrap mt-6">
                <div className="border shadow-md rounded-md flex-grow min-w-60 bg-blue-50">
                  <div className="bg-blue-500 text-white text-center py-2 font-bold rounded-t-md">
                    Total Fees
                  </div>
                  <div className="p-4 text-center text-2xl font-bold text-blue-700">
                    ₹{totals.totalFees.toFixed(2)}
                  </div>
                </div>

                <div className="border shadow-md rounded-md flex-grow min-w-60 bg-green-50">
                  <div className="bg-green-500 text-white text-center py-2 font-bold rounded-t-md">
                    Paid Fees
                  </div>
                  <div className="p-4 text-center text-2xl font-bold text-green-700">
                    ₹{totals.paidFees.toFixed(2)}
                  </div>
                </div>

                <div className="border shadow-md rounded-md flex-grow min-w-60 bg-red-50">
                  <div className="bg-red-500 text-white text-center py-2 font-bold rounded-t-md">
                    Due Fees
                  </div>
                  <div className="p-4 text-center text-2xl font-bold text-red-700">
                    ₹{totals.dueFees.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutstandingReport;