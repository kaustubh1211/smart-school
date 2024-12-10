import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Toast from "../components/ui/Toast";
import axios from "axios";

const AddExpenseLayer = () => {
  // get accessToken from localstorage
  const accessToken = localStorage.getItem("accessToken");

  const [expenseHeadOption, setExpenseHeadOption] = useState([]);

  // loading
  const [isLoading, setIsLoading] = useState(false);

  const initialExpenseInput = {
    expenseHead: "",
    name: "",
    invoiceNum: "",
    date: "",
    amount: "",
    file: null,
    description: "",
  };

  const [expenseInput, setExpenseInput] = useState(initialExpenseInput);

  const [expenseInputValidation, setExpenseInputValidation] = useState({
    expenseHead: false,
    name: false,
    invoiceNum: true,
    date: false,
    amount: false,
    file: true,
    description: true,
  });

  // useEffect for fetching expenseHead
  useEffect(() => {
    async function fetchExpenseHead() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}expense/expense-head`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setExpenseHeadOption(response.data.data.details);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
    fetchExpenseHead();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file" && files.length > 0) {
      {
        const selectedFile = files[0];

        setExpenseInput((prevData) => ({
          ...prevData,
          [name]: selectedFile,
        }));
      }
      setExpenseInputValidation((prevData) => ({
        ...prevData,
        [name]: true,
      }));
    } else {
      setExpenseInput((prevData) => ({
        ...prevData,
        [name]: value,
      })),
        setExpenseInputValidation((prevData) => ({
          ...prevData,
          [name]: true,
        }));
    }
  };

  const isValid =
    expenseInputValidation.expenseHead &&
    expenseInputValidation.name &&
    expenseInputValidation.date &&
    expenseInputValidation.amount;

  // handleSave logic
  const handleSaveBtn = async (event) => {
    event.preventDefault();
    if (isValid) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();

        Object.entries(expenseInput).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            // Check if the value is a file (for file inputs like images)
            if (value instanceof File) {
              formDataToSend.append(key, value, value.name); // Append file with its name
            } else {
              formDataToSend.append(key, value); // Append other fields as text
            }
          }
        });

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}expense/add-expense`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Toast.showSuccessToast("Expense Added Successfully!");

        // reset the form
        // setexpenseInput(initialexpenseInput);
      } catch (error) {
        if (error.response) {
          Toast.showWarningToast(`${error.response.data.message}`);
          console.log(error.response.data.message);
        } else if (error.request) {
          Toast.showErrorToast("Sorry, our server is down");
        } else {
          Toast.showErrorToast("Sorry, please try again later");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  console.log(expenseInputValidation);

  return (
    <div className="row m-1">
      <div className="text-lg font-bold mt-3 mb-3">Add Expense</div>
      <div className="card">
        {/* <div className="card-header">
          <h6 className="card-title mb-0">Add expense</h6>
        </div> */}
        <div className="card-body">
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">
                Expense Head <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <div
                className="form-control-wrapper"
                style={{ position: "relative" }}
              >
                <select
                  name="expenseHead"
                  className="form-control"
                  onChange={handleInputChange}
                  value={expenseInput.expenseHead}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {expenseHeadOption.map((item) => (
                    <option key={item.id} value={item.expenseHead}>
                      {item.expenseHead}
                    </option>
                  ))}
                  {/* <option value="Donation">Donation</option>
                  <option value="Rent">Rent</option>
                  <option value="Miscellaneus">Miscellaneus</option>
                  <option value="Book Sale">Book Sale</option>
                  <option value="Uniform Sale">Uniform Sale</option> */}
                </select>
                <ChevronDown
                  className="dropdown-icon"
                  size={20}
                  style={{
                    position: "absolute",
                    right: "10px", // Adjust this value for proper spacing
                    top: "50%",
                    transform: "translateY(-50%)", // Vertically center the icon
                    pointerEvents: "none", // Ensures the icon doesn't block interaction with the select
                  }}
                />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">
                Name <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                onChange={handleInputChange}
                value={expenseInput.name}
                className="form-control  radius-12"
                placeholder=""
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">
                Invoice Number <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="invoiceNum"
                value={expenseInput.invoiceNum}
                onChange={handleInputChange}
                className="form-control"
                placeholder=""
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">
                Date <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <div className="date-picker-wrapper">
                <input
                  type="date"
                  name="date"
                  value={expenseInput.date}
                  className="form-control date-picker"
                  onChange={handleInputChange}
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">
                Amount (Rs) <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={expenseInput.amount}
                onChange={handleInputChange}
                className="form-control"
                placeholder=""
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Attach Document</label>
              <div className="flex justify-between">
                <input
                  id="file"
                  className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  onChange={handleInputChange}
                  type="file"
                  name="file"
                  accept="image/*"
                />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={expenseInput.description}
                onChange={handleInputChange}
                className="form-control "
                placeholder=""
              />
            </div>
            <div className="col-12 mt-4 flex justify-end">
              <button
                type="submit"
                onClick={handleSaveBtn}
                className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 "
              >
                Save
              </button>
              {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                  <div className="loader"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* card end */}
      {/* <div className="card mt-24">
        <div className="card-header">
          <h6 className="card-title mb-0">Input Group</h6>
        </div>
        <div className="card-body">
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">Input</label>
              <div className="input-group">
                <span className="input-group-text bg-base">
                  <Icon icon="mynaui:envelope" />
                </span>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="info@gmail.com"
                />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Input</label>
              <div className="input-group">
                <select
                  className="form-select input-group-text w-90-px flex-grow-0"
                  defaultValue="Select Country"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  <option value="US">US</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">UK</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="info@gmail.com"
                />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Input</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="info@gmail.com"
                />
                <select
                  className="form-select input-group-text w-90-px flex-grow-0"
                  defaultValue="Select Country"
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  <option value="US">US</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">UK</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Input</label>
              <div className="input-group">
                <span className="input-group-text bg-base"> http:// </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="www.random.com"
                />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Input</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="www.random.com"
                />
                <button type="button" className="input-group-text bg-base">
                  <Icon icon="lucide:copy" /> Copy
                </button>
              </div>
              <p className="text-sm mt-1 mb-0">
                This is a hint text to help user.
              </p>
            </div>
          </div>
        </div>
      </div> */}
      {/* card end */}
    </div>
  );
};

export default AddExpenseLayer;
