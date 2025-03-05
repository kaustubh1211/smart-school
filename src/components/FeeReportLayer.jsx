import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import Toast from "../../src/components/ui/Toast";
import axios from "axios";

const SearchFeesPaymentLayer = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

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

  // useEffect for fetching admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}admins/user-admin`,
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

  const [paymentData, setPaymentData] = useState({
    details: [],
  });

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
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }fee/search/fees/transaction?classId=${selected.classId}&category=${
            selected.category
          }`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page: page,
              from_date: formData.from_date,
              to_date: formData.to_date,
              search_string: formData.search_string,
            },
          }
        );
        setPaymentData(response.data.data);
        console.log(JSON.stringify(paymentData));
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

  return (
    <div>
      <div className="text-lg font-bold mb-3">Search Fees Payment</div>
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
                {admins.map((item, index) => {
                  <option key={index} value={item.id}>
                    {item.fullName}
                  </option>;
                })}
                {/* <option value="user1">User 1</option>
                <option value="user2">User 2</option> */}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3 w-full">
            {/* Select Dropdown - Takes 50% width on medium screens and above */}
            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Party :
              </label>
              <select
                value={selected.displayValue} // Use the displayValue here
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

        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table-bordered-custom sm-table mb-0 overflow-y-visible">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    SrNo.
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Medium
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Trans Date
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Enroll No.
                  </th>

                  <th className="text-center text-sm" scope="col">
                    Student
                  </th>

                  <th className="text-center text-sm" scope="col">
                    Class
                  </th>

                  <th className="text-center text-sm" scope="col">
                    Div
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Recipt No.
                  </th>

                  <th className="text-center text-sm" scope="col">
                    Mode
                  </th>

                  <th className="text-center text-sm" scope="col">
                    Particulars
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Status
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-center">
                {paymentData.details.length > 0 ? (
                  paymentData.details.map((item, index) => (
                    <tr key={item.id} className="w-full">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        {item.student.class.mediumName}
                      </td>

                      <td className="px-4 py-2">
                        {item.paymentDate.split("T")[0]}
                      </td>
                      <td className="px-4 py-2">{item.student.enrollNo}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col justify-center">
                          <div>
                            {item.student.firstName +
                              " " +
                              item.student.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div>{item.student.class.class}</div>
                      </td>
                      <td className="px-4 py-2">
                        <div>{item.student.division}</div>
                      </td>

                      <td className="px-4 py-2">{item.reciptNo}</td>

                      <td className="px-4 py-2">
                        <span className="text-secondary-light">
                          {item.modeOfPayment}
                        </span>
                      </td>
                      <td className="px-4 py-2">
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
                    <td colSpan="12" className="text-center py-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFeesPaymentLayer;
