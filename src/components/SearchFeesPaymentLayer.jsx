import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText, ChevronDown, X } from "lucide-react";
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

  // Edit dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    modeOfPayment: "",
    amount: "",
    paymentDate: "",
    instrNo: "",
    InstrName: "",
    Remark: "",
    status: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const [party, setParty] = useState([]);
  const [selected, setSelected] = useState({
    classId: "",
    category: "",
    displayValue: "", // Add this new state property to track what should show in the select
  });

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

  const [formData, setFormData] = useState({
    page: page,
    from_date: "",
    to_date: "",
    search_string: "",
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

  const handleDropdownOpen = (event, itemId) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}fee/search-fee?classId=${
            selected.classId
          }&category=${selected.category}`,
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

  const handleViewReceipt = (id, status) => {
    if (status === "SUCCESS") {
      window.open(`/fees/view/recipt/${id}`, "_blank");
    } else {
      Toast.showErrorToast("No Fee Recipt available");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}fee/update-fees-recipt`,
        {
          feeReciptId: id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        console.log(`Status updated to ${status}`);
        setBtnClicked(!btnClicked);
        setOpenDropdown(null);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Edit functionality
  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditFormData({
      modeOfPayment: item.modeOfPayment || "",
      amount: item.amount || "",
      paymentDate: item.paymentDate ? item.paymentDate.split("T")[0] : "",
      instrNo: item.instrNo || "",
      InstrName: item.InstrName || "",
      Remark: item.Remark || "",
      status: item.status || ""
    });
    setIsEditDialogOpen(true);
    setOpenDropdown(null);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingItem) return;

    setIsUpdating(true);
    try {
      // Prepare the data for API - only send non-empty values
      const updateData = {};
      
      if (editFormData.modeOfPayment.trim()) {
        updateData.modeOfPayment = editFormData.modeOfPayment;
      }
      if (editFormData.amount) {
        updateData.amount = Number(editFormData.amount);
      }
      if (editFormData.paymentDate) {
        // Convert date to datetime string for API
        updateData.paymentDate = new Date(editFormData.paymentDate).toISOString();
      }
      if (editFormData.instrNo.trim()) {
        updateData.instrNo = editFormData.instrNo;
      }
      if (editFormData.InstrName.trim()) {
        updateData.InstrName = editFormData.InstrName;
      }
      if (editFormData.Remark !== null && editFormData.Remark !== undefined) {
        updateData.Remark = editFormData.Remark;
      }
      if (editFormData.status) {
        updateData.status = editFormData.status;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_API_URL}fee/edit-fees/${editingItem.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Toast.showSuccessToast("Fee record updated successfully!");
        setBtnClicked(!btnClicked); // Refresh the data
        setIsEditDialogOpen(false);
        setEditingItem(null);
      } else {
        Toast.showErrorToast("Failed to update fee record");
      }
    } catch (error) {
      console.error("Error updating fee record:", error);
      Toast.showErrorToast("Error updating fee record. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
    setEditFormData({
      modeOfPayment: "",
      amount: "",
      paymentDate: "",
      instrNo: "",
      InstrName: "",
      Remark: "",
      status: ""
    });
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

            {/* Search Input - Takes 50% width on medium screens and above */}
            <div className="flex flex-col w-full md:w-1/2">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Search by:
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full resize outline-none"
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
            <table className="table-bordered-custom sm-table mb-0 overflow-y-visible">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    Date
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Recipt No.
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
                    Status
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Amount
                  </th>
                  <th scope="col" className="text-center text-sm">
                    View Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-center">
                {paymentData.details.length > 0 ? (
                  paymentData.details.map((item) => (
                    <tr key={item.id} className="w-full">
                      <td className="px-4 py-2">
                        {item.paymentDate.split("T")[0]}
                      </td>
                      <td className="px-4 py-2">{item.reciptNo}</td>
                      <td className="px-4 py-2">{item.student.enrollNo}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col justify-center">
                          <div>
                            {item.student.firstName +
                              " " +
                              item.student.fatherName +
                              " " +
                              item.student.lastName}
                          </div>
                          <div className="text-red-500 text-xs font-bold">
                            {item.student.class.academicYearName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col justify-center">
                          <div>
                            {item.student.class.class +
                              " " +
                              "-" +
                              " " +
                              item.student.division}
                          </div>
                          <div className="text-yellow-500 text-xs font-bold">
                            {item.student.class.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-secondary-light">
                          {item.modeOfPayment}
                        </span>
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
                      <td className="px-4 py-2">
                        <div className="dropdown-container relative flex justify-center items-center">
                          <div className="flex flex-col">
                            <div
                              className="bg-success-focus text-success-600 hover:bg-success-200 font-medium flex items-center justify-center rounded-lg px-4 py-2 cursor-pointer"
                              onClick={(e) => handleDropdownOpen(e, item.id)}
                            >
                              <ReceiptText size={16} />
                              <ChevronDown size={16} className="ml-2" />
                            </div>
                            <span className="text-red-400 font-bold text-xs">
                              {item.admin.fullName}
                            </span>
                          </div>

                          {openDropdown === item.id && (
                            <div className="absolute right-0 top-3/4 w-36 bg-white shadow-lg rounded-lg border py-2 z-50">
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleViewReceipt(item.id, item.status)
                                }
                              >
                                View Receipt
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleEditClick(item)}
                              >
                                Edit This
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
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
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
                      className="text-blue-600 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px w-32-px bg-base"
                      disabled={paymentData.currentPage === 1}
                      onClick={decrementPage}
                    >
                      <Icon icon="ep:d-arrow-left" className="text-xl" />
                    </button>
                  </li>
                  <li className="page-item">
                    <div className="page-link bg-primary-600 text-white text-sm radius-4 rounded-circle border-0 px-12 py-10 d-flex align-items-center justify-content-center h-28-px w-28-px">
                      {paymentData.currentPage}
                    </div>
                  </li>
                  <li className="page-item">
                    <button
                      onClick={incrementPage}
                      disabled={page === paymentData.totalPages}
                      className="text-blue-600 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
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

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Fee Record</h3>
              <button
                onClick={closeEditDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode of Payment
                </label>
                <input
                  type="text"
                  name="modeOfPayment"
                  value={editFormData.modeOfPayment}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mode of payment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={editFormData.amount}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={editFormData.paymentDate}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrument Number
                </label>
                <input
                  type="text"
                  name="instrNo"
                  value={editFormData.instrNo}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter instrument number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrument Name
                </label>
                <input
                  type="text"
                  name="InstrName"
                  value={editFormData.InstrName}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter instrument name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILED">FAILED</option>
                  <option value="BOUNCE">BOUNCE</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark
                </label>
                <textarea
                  name="Remark"
                  value={editFormData.Remark}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter remarks (optional)"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFeesPaymentLayer;