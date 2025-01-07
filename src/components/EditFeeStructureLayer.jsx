import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import Toast from "../components/ui/Toast";

const EditFeeStructureLayer = () => {
  const { getClass, id } = useParams();
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const accessToken = localStorage.getItem("accessToken");

  const [btnClicked, setBtnClicked] = useState(false);

  const navigate = useNavigate();

  // state variable for when no users are found
  const [error, setError] = useState("");

  const [data, setData] = useState([]);

  const [fetchFeeType, setFetchFeeType] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [installment, setInstallment] = useState("");
  const [feeType, setfeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [isOptional, setIsOptional] = useState("no");

  // for fetching fee class/type
  useEffect(() => {
    const fetchFeeType = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}fee/all-fee-type`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFetchFeeType(response.data.data);
      } catch (error) {
        setError("Sorry something went wrong, try again after some time");
      }
    };
    fetchFeeType();
  }, [tenant, academicYear]);

  // for fetching fee structure
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }fee/fee-structure/${id}?medium=${tenant}&year=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setData(response.data.data);
      } catch (error) {
        if (error) {
          navigate("/fee/structure");
        }
        setError("Error while fetching fee type");
      }
    };
    fetchData();
  }, [btnClicked, tenant, academicYear, navigate]);

  const handleShow = () => {
    setShowModal(true);
    // setBtnClicked(!btnClicked);
  };
  const handleClose = () => setShowModal(false);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}fee/add-fee-structure/${id}`,
        {
          installmentType: installment, // From state
          feeTypeName: feeType, // Assuming feeTypeName is from state or props
          amount, // From state
          isOptional: isOptional === "no" ? false : true, // Correctly evaluates the state value
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Ensure accessToken is set correctly
          },
        }
      );
      Toast.showSuccessToast("Fee structure added successfully!");
      setBtnClicked(!btnClicked);

      console.log("Structure added successfully", response.data);
    } catch (error) {
      console.error(
        "Error adding structure:",
        error.response?.data || error.message
      );
      Toast.showWarningToast(`${error.response.data.message}`);
    }
    handleClose();
  };

  return (
    <div>
      {" "}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="text-xl font-bold text-slate-800 text-secondary-light mb-0 whitespace-nowrap">
          Fee Structure
        </div>
      </div>
      {/* <div className="text-lg font-bold mt-3 mb-3">Income List</div> */}
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <span className="text-sm fw-medium text-secondary-light mb-0">
              From
            </span>
            <div>
              <input
                type="text"
                name="class"
                value={`${getClass} ${""}(${tenant.split("-")[1]})`}
                className="form-control"
                readOnly
              />
            </div>
          </div>

          <div
            className="bg-blue-600 px-28 py-12 text-white  text-md rounded-md hover:bg-blue-700 hover:cursor-pointer"
            onClick={handleShow}
          >
            Add Fee
          </div>
        </div>
        {/* Modal */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton className="border-b border-gray-200">
            <Modal.Title className="text-xl font-bold text-gray-800">
              Add Fee
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="space-y-4">
            <form>
              {/* Installment Field */}
              <div className="mb-4">
                <label htmlFor="installment" className="block text-gray-600">
                  Installment
                </label>
                <select
                  id="installment"
                  className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={installment}
                  onChange={(e) => setInstallment(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="One time">One Time</option>
                  <optgroup label="Monthly">
                    {[
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
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Fee Head Field */}
              <div className="mb-4">
                <label htmlFor="feeType" className="block text-gray-600">
                  Fee Type
                </label>
                <select
                  id="feeType"
                  className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={feeType}
                  onChange={(e) => setfeeType(e.target.value)}
                >
                  <option value="">-- Fee Type --</option>
                  {fetchFeeType.map((item, index) => (
                    <option key={index} value={item.feeType}>
                      {item.feeType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Field */}
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-600">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-control w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              {/* Is Optional Field */}
              <div className="mb-4">
                <label className="block text-gray-600">Is Optional</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center cursor-pointer space-x-2">
                    <input
                      type="radio"
                      name="isOptional"
                      value="yes"
                      checked={isOptional === "yes"}
                      onChange={(e) => setIsOptional(e.target.value)}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500"></span>
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer space-x-2">
                    <input
                      type="radio"
                      name="isOptional"
                      value="no"
                      checked={isOptional === "no"}
                      onChange={(e) => setIsOptional(e.target.value)}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500"></span>
                    <span>No</span>
                  </label>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="space-x-4">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="py-2 px-20 bg-gray-300 border-0 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSave()}
              className="py-2 px-20 border-0 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <div className="font-bold text-slate-900 text-md mb-28">
              Fee Structure Detail
            </div>
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    Installment Name
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Fee Head
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Amount
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Is Optional
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-center">
                {/* mapping logic */}

                {error ? (
                  <tr>
                    <td colSpan="5" className="text-red-500 text-center">
                      {error}
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-red-500 font-bold text-center"
                    >
                      No Fee Structure exists
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => {
                    return (
                      <tr key={item.index}>
                        <td>{item.installmentType}</td>
                        <td>{item.feeTypeName}</td>
                        <td>{item.amount}</td>
                        <td>{item.isOptional ? "Yes" : "No"}</td>
                        {/* <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.income.incomeHead}
                          </span>
                        </td>
                        <td>{moment(item.date).format("DD-MM-YY")}</td>
                        <td>{item.amount}</td> */}
                        <td className="text-center">
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            <button
                              type="button"
                              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                              onClick={() => handleNavigate(item.id)}
                            >
                              <Icon icon="lucide:edit" className="menu-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFeeStructureLayer;
