import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import Toast from "../../src/components/ui/Toast";
import axios from "axios";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

const colors = {
  "PRE-PRIMARY": "bg-blue-500",
  PRATHAMIK: "bg-red-500",
  PRIMARY: "bg-yellow-500",
  MADHYAMIK: "bg-orange-500",
  SECONDARY: "bg-red-500",
};

const FeeReportLayer = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const [paymentData, setPaymentData] = useState({
    details: [],
  });

  const [totalFees, setTotalFees] = useState({});

  const [party, setParty] = useState([]);
  const [selected, setSelected] = useState({
    classId: "",
    category: "",
    displayValue: "", // Add this new state property to track what should show in the select
  });

  const [options, setOptions] = useState({
    mode: "",
    adminId: "",
  });

  const [admins, setAdmins] = useState([]);
const handleOptions = (e) => {
  const { name, value } = e.target;
  setOptions((prev) => ({
    ...prev,
    [name]: value, // ✅ properly update state
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

  // useEffect for fetching admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}admin/user-admin`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAdmins(response.data.data);
        console.log(JSON.stringify(response.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdmins();
  }, []);
  // Group data by category
  const groupedData = party.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    console.log("selectedValue" + selectedValue);

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
      console.log("selectedclass" + selectedClass.id);
      if (selectedClass) {
        setSelected({
          classId: selectedClass.id,
          category: "",
          displayValue: selectedValue,
        });
      }
    }
  };

  const startRecord = `${
    paymentData.currentPage == 0 ? 0 : (paymentData.currentPage - 1) * 12 + 1
  }`;
  const endRecord = Math.min(
    paymentData.currentPage * 12,
    paymentData.totalRecords
  );

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    page: page,
    from_date: "",
    to_date: "",
  });

  function incrementPage() {
    if (page !== paymentData.totalPages) {
      setPage((page) => page + 1);
    }
  }

  function decrementPage() {
    setPage((page) => page - 1);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request1 = axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}fee/search/fees/transaction`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              classId: selected.classId,
              category: selected.category,
              page: page,
              from_date: formData.from_date,
              to_date: formData.to_date,
              search_string: formData.search_string,
              adminId: options.adminId,
              modeOfPayment: options.mode,
            },
          }
        );

        const request2 = axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }fee/search/fees/transaction/total`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              classId: selected.classId,
              category: selected.category,
              from_date: formData.from_date,
              to_date: formData.to_date,
              adminId: options.adminId,
              modeOfPayment: options.mode,
            },
          }
        );

        // Use Promise.all to send both requests concurrently
        const [response1, response2] = await Promise.all([request1, request2]);

        // Handle the responses
        setPaymentData(response1.data.data); // Set payment data from the first request
        setTotalFees(response2.data.data); // Set total data from the second request
      } catch (error) {
        setError("Unable to fetch payments. Please try again later.");
      }
    };

    fetchData();
  }, [page, btnClicked, tenant, academicYear]);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setPage(1);
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

  // Function to aggregate similar fees
  const aggregateFees = (totalFees) => {
    const aggregatedFees = {};

    Object.values(totalFees).forEach((categoryFees) => {
      Object.entries(categoryFees).forEach(([feeType, amount]) => {
        if (!aggregatedFees[feeType]) {
          aggregatedFees[feeType] = 0;
        }
        aggregatedFees[feeType] += amount;
      });
    });

    return aggregatedFees;
  };

  // Aggregate the fees
  const aggregatedFees = aggregateFees(totalFees);

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
                type="date"
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
                type="date"
                name="to_date"
                value={formData.to_date}
                className="form-control"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                User:
              </label>
         <select
  name="adminId"
  className="w-full border border-gray-300 py-2.5 rounded-md px-4 font-bold"
  value={options.adminId}
  onChange={handleOptions}
>
  <option value="">Select User</option>
  {admins.map((item, index) => (
    <option key={index} value={item.id}>
      {item.fullName}
    </option>
  ))}
</select>
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
                  <option value="">Payment Mode</option>
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
                <h2 className="text-xl font-bold">
                  Shri Raghubir High School & Junior College
                </h2>
                <p className="text-sm">
                  Yadav Nagar, Boisar (East), Palghar-401501, Maharashtra
                </p>
              </div>
            </div>
            <div className="table-responsive scroll-sm text-xs">
              <table className="table-bordered-custom sm-table mb-0 overflow-y-visible">
                <thead>
                  <tr>
                    <th className="text-center text-xs" scope="col">
                      SrNo.
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Medium
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Trans Date
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Enroll No.
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Student
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Class
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Div
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Recipt No.
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Mode
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Particulars
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Status
                    </th>
                    <th className="text-center text-xs" scope="col">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs text-center">
                  {paymentData.details.length > 0 ? (
                    paymentData.details.map((item, index) => (
                      <tr key={item.id} className="w-full">
                        <td className="px-2 py-2">{index + 1}</td>
                        <td className="px-2 py-2">
                          {item.student.class.mediumName}
                        </td>
                        <td className="px-2 py-2">
                          {item.paymentDate.split("T")[0]}
                        </td>
                        <td className="px-2 py-2">{item.student.enrollNo}</td>
                        <td className="px-2 py-2">
                          <div className="flex flex-col justify-center">
                            <div>
                              {item.student.firstName +
                                " " +
                                item.student.lastName}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <div>{item.student.class.class}</div>
                        </td>
                        <td className="px-2 py-2">
                          <div>{item.student.division}</div>
                        </td>
                        <td className="px-2 py-2">{item.reciptNo}</td>
                        <td className="px-2 py-2">
                          <span className="text-secondary-light">
                            {item.modeOfPayment}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div>
                            {item.collectFees.map((fee, feeIndex) => (
                              <span key={feeIndex}>
                                {fee.feeTypeName}
                                {feeIndex < item.collectFees.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2 ">
                          <span
                            className={`px-3 py-2 text-neutral-100 text-xs rounded-md ${
                              item.status === "SUCCESS"
                                ? "bg-blue-500"
                                : "bg-red-500"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-secondary-light">
                            {item.amount}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="12"
                        className="text-center py-4 text-gray-500"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* total fees  */}
          <div className="flex gap-4 flex-wrap p-24 w-full">
            {Object.entries(totalFees).map(([category, fees]) => {
              const totalAmount = Object.values(fees).reduce(
                (acc, curr) => acc + curr,
                0
              );

              return (
                <div
                  key={category}
                  className="border shadow-md rounded-md flex-grow min-w-60"
                >
                  {/* Category Header */}
                  <div
                    className={`text-white text-center py-2 font-bold ${
                      colors[category] || "bg-gray-500"
                    }`}
                  >
                    {category}
                  </div>
                  {/* Fees Table */}
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {Object.entries(fees).map(([feeType, amount]) => (
                        <tr key={feeType}>
                          <td className="border px-2 py-1">
                            {feeType.charAt(0).toUpperCase() + feeType.slice(1)}
                          </td>
                          <td className="border px-2 py-1 text-right">
                            {amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {/* Total Amount Row */}
                      <tr>
                        <td className="border px-2 py-1 font-bold">
                          Total Amount
                        </td>
                        <td className="border px-2 py-1 text-right font-bold">
                          {totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
          {/*  Add the Overall Summary section to the JSX */}
          <div className="flex flex-col p-24 w-full">
            <h2 className="text-xl font-bold mb-4 text-center bg-blue-400 p-2">
              Overall Summary
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {Object.keys(aggregatedFees).map((feeType) => (
                    <th key={feeType} className="border px-2 py-1">
                      {feeType.charAt(0).toUpperCase() + feeType.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.values(aggregatedFees).map((amount, index) => (
                    <td
                      key={index}
                      className="border px-2 py-1 text-right font-bold"
                    >
                      {amount.toFixed(2)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeReportLayer;
