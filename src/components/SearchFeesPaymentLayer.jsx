import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { Minus, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const SearchFeesPaymentLayer = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const dropdownRef = useRef(null);

  const handleDropdownOpen = (event, itemId) => {
    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 20,
      left: rect.left - 60, // Shift the dropdown 20px to the left
    });
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [paymentData, setPaymentData] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
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
  function incrementPage() {
    if (page !== paymentData.totalPages) {
      setPage((page) => page + 1);
    }
  }
  function decrementPage() {
    setPage((page) => page - 1);
  }

  const [formData, setFormData] = useState({
    page: page,
    from_date: "",
    to_date: "",
    search_string: "",
  });

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
          }fee/search-fee?mediumName=${tenant}&academicYearName=${academicYear}`,
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

  const handleViewReceipt = (id) => {
    // Open the receipt in a new tab
    window.open(`/fees/view/recipt/${id}`, "_blank");
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}fee/update-status`, // Replace with your API endpoint
        {
          id: id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        // Handle success (e.g., show a success message or refresh the data)
        console.log(`Status updated to ${status}`);
        setBtnClicked(!btnClicked); // Refresh the data
      } else {
        // Handle error
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
          </div>

          <div className="d-flex flex-column flex-md-row align-items-start gap-4 mb-3">
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Search by:
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full min-w-[250px] sm:min-w-[300px] lg:min-w-[400px] resize outline-none"
                  name="search_string"
                  value={formData.search_string}
                  onChange={handleInputChange}
                  placeholder="Search by Enroll No/Gr No"
                />
                <Icon
                  icon="ion:search-outline"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
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
            <table className="table-bordered-custom sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    Date
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
                    Mode
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Amount
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Status
                  </th>
                  <th scope="col" className="text-center text-sm">
                    View Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-center">
                {paymentData.details.map((item) => (
                  <tr key={item.id} className="w-full relative">
                    <td className="px-4 py-2">
                      {item.paymentDate.split("T")[0]}
                    </td>
                    <td className="px-4 py-2">{item.student.enrollNo}</td>
                    <td className="px-4 py-2">
                      {item.student.firstName + " " + item.student.lastName}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-secondary-light">
                        {item.student.class}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-secondary-light">
                        {item.modeOfPayment}
                      </span>
                    </td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2">
                      <span className="text-secondary-light">
                        {item.amount}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div
                        className="relative flex justify-center items-center"
                        ref={dropdownRef}
                      >
                        <div>
                          <div className="bg-success-focus text-success-600 hover:bg-success-200 font-medium flex items-center justify-center rounded-lg px-4 py-2">
                            <ReceiptText
                              className="hover:cursor-pointer"
                              size={16}
                            />
                            <ChevronDown
                              onClick={(e) => handleDropdownOpen(e, item.id)}
                              size={16}
                              className="ml-2 hover:cursor-pointer"
                            />
                          </div>

                          {openDropdown === item.id && (
                            <div
                              className="fixed w-40 bg-white shadow-lg rounded-lg border py-2 z-50"
                              style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                              }}
                            >
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleViewReceipt(item.id)}
                              >
                                View Recipt
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleUpdateStatus(item.id, "BOUNCE")
                                }
                              >
                                Bounce This
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleUpdateStatus(item.id, "CANCELLED")
                                }
                              >
                                Cancel This
                              </button>
                              {/* {[
                                "View Receipt",
                                "Bounce This",
                                "Cancel This",
                              ].map((option) => (
                                <button
                                  key={option}
                                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    if (option === "View Receipt") {
                                      // Handle View Receipt action
                                      handleViewReceipt(item.id);
                                    } else if (option === "Bounce This") {
                                      // Handle Bounce action
                                      handleUpdateStatus(item.id, "BOUNCE");
                                    } else if (option === "Cancel This") {
                                      // Handle Cancel action
                                      handleUpdateStatus(item.id, "CANCELLED");
                                    }
                                  }}
                                >
                                  {option}
                                </button>
                              ))} */}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex flex-row flex-wrap align-items-center justify-content-between gap-2 mt-24 mb-1">
              <div>
                {`Showing ${startRecord} to ${endRecord} of ${paymentData.totalRecords} entries`}
              </div>
              <div>
                <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                  <li className="page-item">
                    <button
                      className=" text-blue-600 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px w-32-px bg-base"
                      disabled={paymentData.currentPage === 1 ? true : false}
                      onClick={decrementPage}
                    >
                      <Icon icon="ep:d-arrow-left" className="text-xl" />
                    </button>
                  </li>
                  <li className="page-item">
                    <div className="page-link bg-primary-600 text-white text-sm radius-4 rounded-circle border-0 px-12 py-10 d-flex align-items-center justify-content-center  h-28-px w-28-px">
                      {paymentData.currentPage}
                    </div>
                  </li>
                  <li className="page-item">
                    <button
                      onClick={incrementPage}
                      disabled={page === paymentData.totalPages}
                      className=" text-blue-600 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                    >
                      <Icon icon="ep:d-arrow-right" className="text-xl" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFeesPaymentLayer;
