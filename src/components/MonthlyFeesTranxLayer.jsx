import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import dayjs from "dayjs";

const MonthlyFeesTranxLayer = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState([]); // Updated to handle the nested structure
  const [totalFees, setTotalFees] = useState({});

  const [party, setParty] = useState([]);
  const [selected, setSelected] = useState({
    classId: "",
    category: "",
    displayValue: "", // Add this new state property to track what should show in the select
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
      [name]: value, // Dynamically update the field based on the name
    }));
  };

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}class/list-party`,
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
      // If a category is selected (e.g., "Prathmik")
      setSelected({
        classId: "",
        category: selectedValue,
        displayValue: selectedValue,
      });
    } else {
      // If a class is selected (e.g., "Std I")
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
    from_date: dayjs().format("YYYY-MM"), // Default to current month
    to_date: dayjs().format("YYYY-MM"), // Default to current month
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state with the selected value (already in "YYYY-MM" format)
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
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

        // Handle the responses
        setPaymentData(response.data.data);
      } catch (error) {
        setError("Unable to fetch payments. Please try again later.");
      }
    };

    fetchData();
  }, [btnClicked, tenant, academicYear]);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setBtnClicked(!btnClicked);
  };

  const exportToExcel = () => {
    const worksheetData = [
      [
        "SrNo.",
        "Medium",
        "Trans Date",
        "Enroll No.",
        "Student",
        "Class",
        "Div",
        "Receipt No.",
        "Mode",
        "Particulars",
        "Status",
        "Amount",
      ],
      ...paymentData.details.map((item, index) => [
        index + 1,
        item.student.class.mediumName,
        item.paymentDate.split("T")[0],
        item.student.enrollNo,
        item.student.firstName + " " + item.student.lastName,
        item.student.class.class,
        item.student.division,
        item.reciptNo,
        item.modeOfPayment,
        item.collectFees.map((fee) => fee.feeTypeName).join(", "),
        item.status,
        item.amount,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees Payment");
    XLSX.writeFile(workbook, "FeesPayment.xlsx");
  };

  const printTable = () => {
    const element = document.getElementById("print-fee");
    const opt = {
      margin: 2,
      filename: "FeesPayment.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // Function to flatten the nested response data
  const flattenData = (data) => {
    const flattened = [];

    data.forEach((monthData) => {
      const month = Object.keys(monthData)[0]; // e.g., "02-2025"
      const sections = monthData[month]; // Array of sections

      sections.forEach((sectionData) => {
        const section = Object.keys(sectionData)[0]; // e.g., "PRIMARY"
        const fees = sectionData[section]; // Fee details

        flattened.push({
          month,
          section,
          ...fees, // Spread the fee details
        });
      });
    });

    return flattened;
  };

  // Flatten the payment data
  const flattenedData = flattenData(paymentData);

  // Function to calculate totals for each column
  const calculateTotals = (data) => {
    const totals = {};

    data.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "month" && key !== "section") {
          if (!totals[key]) {
            totals[key] = 0;
          }
          totals[key] += value;
        }
      });
    });

    return totals;
  };

  // Calculate totals
  const totals = calculateTotals(flattenedData);

  // Collect all unique columns from the response data
  const allColumns = new Set();
  flattenedData.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "month" && key !== "section") {
        allColumns.add(key);
      }
    });
  });

  // Convert the Set to an array and add static columns
  const columns = ["Month-Year", "Section", ...Array.from(allColumns)];

  return (
    <div>
      <div className="text-lg font-bold mb-3 ">Search Fees Payment</div>
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <div className="d-flex flex-column flex-md-row align-items-start gap-4 mb-3">
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                From
              </label>
              <input
                type="month" // Use type="month" for month picker
                name="from_date"
                value={formData.from_date} // Use the state value directly
                className="form-control"
                onChange={handleInputChange}
              />
            </div>
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                To
              </label>
              <input
                type="month" // Use type="month" for month picker
                name="to_date"
                value={formData.to_date} // Use the state value directly
                className="form-control"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3 w-full">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Party :
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
                  <option value="All">Payment Mode</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              onClick={handleOnSubmit}
              className="btn btn-primary px-5"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center gap-2 pt-4">
            <button
              onClick={exportToExcel}
              className="btn btn-success px-4 py-2"
            >
              Export to Excel
            </button>
            <button onClick={printTable} className="btn btn-warning px-4 py-2">
              Print
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
                  Fee Transaction Month Wise
                </p>
              </div>
            </div>
            <div className="table-responsive scroll-sm text-xs">
              <table className="table-bordered-custom sm-table mb-0 overflow-y-visible ">
                <thead>
                  <tr>
                    <th
                      className="text-start text-md text-red-600 font-bold p-2"
                      scope="col"
                    >
                      Payment Mode : <span>{options.mode}</span>
                    </th>
                  </tr>
                </thead>
              </table>
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
                  {flattenedData.length > 0 ? (
                    flattenedData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2">{item.month}</td>
                        <td className="px-2 py-2">{item.section}</td>
                        {columns.slice(2).map((column, colIndex) => (
                          <td key={colIndex} className="px-2 py-2">
                            {item[column]
                              ? Number(item[column]).toFixed(2)
                              : " "}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-4">
                        No records found
                      </td>
                    </tr>
                  )}
                  {/* Total Row */}
                  <tr>
                    <td colSpan={2} className="text-center font-bold text-sm">
                      TOTAL
                    </td>
                    {columns.slice(2).map((column, index) => (
                      <td key={index} className="text-center font-bold text-sm">
                        {totals[column] ? Number(totals[column]).toFixed(2) : 0}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyFeesTranxLayer;