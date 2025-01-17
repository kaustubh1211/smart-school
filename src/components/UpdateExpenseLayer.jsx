import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Toast from "../components/ui/Toast";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateExpenseLayer = () => {
  // get accessToken from localstorage
  const accessToken = localStorage.getItem("accessToken");

  const [expenseHeadOptions, setexpenseHeadOptions] = useState([]);

  // loading
  const [isLoading, setIsLoading] = useState(false);

  // get id of particular id
  const { id } = useParams();

  // image preview
  const [imagePreview, setImagePreview] = useState({});

  const initialexpenseInputs = {
    expenseHead: "",
    name: "",
    invoiceNum: "",
    date: "",
    amount: "",
    file: null,
    description: "",
  };

  const [expenseInputs, setexpenseInputs] = useState(initialexpenseInputs);

  const [originalData, setOriginalData] = useState(initialexpenseInputs);

  const [expenseInputsValidation, setexpenseInputsValidation] = useState({
    expenseHead: true,
    name: true,
    invoiceNum: true,
    date: true,
    amount: true,
    file: true,
    description: true,
  });

  const [btnEnable, setBtnEnable] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_SERVER_API_URL}expense/expense/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const allInputData = res.data.data;

          // Store fetched data in both `formData` and `originalData`
          setexpenseInputs((prevData) => ({
            ...prevData,
            ...allInputData,
          }));
          setOriginalData((prevData) => ({
            ...prevData,
            ...allInputData,
          }));

          // If an image URL exists, set it in the preview state
          if (allInputData.file) {
            setImagePreview((prevPreviews) => ({
              ...prevPreviews,
              file: `${import.meta.env.VITE_SERVER_BASE_URL}${
                allInputData.file
              }`,
            }));
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch student details", error);
          setIsLoading(false);
        });
    }
  }, [id]);
  // useEffect for fetching expenseheads
  useEffect(() => {
    async function fetchexpenseHead() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}expense/expense-head`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setexpenseHeadOptions(response.data.data.details);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
    fetchexpenseHead();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file" && files.length > 0) {
      {
        const selectedFile = files[0];

        setexpenseInputs((prevData) => ({
          ...prevData,
          [name]: selectedFile,
        }));
      }
      setexpenseInputsValidation((prevData) => ({
        ...prevData,
        [name]: true,
      }));
      // Generate file preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview((prevPreviews) => ({
          ...prevPreviews,
          [name]: reader.result, // Map the preview to the specific input name
        }));
      };
      reader.readAsDataURL(selectedFile); // Convert file to Base64 URL
    } else {
      setexpenseInputs((prevData) => ({
        ...prevData,
        [name]: value,
      })),
        setexpenseInputsValidation((prevData) => ({
          ...prevData,
          [name]: true,
        }));
    }
  };

  const isValid =
    expenseInputsValidation.expenseHead &&
    expenseInputsValidation.name &&
    expenseInputsValidation.date &&
    expenseInputsValidation.amount;

  // handleSave logic
  const handleSaveBtn = async (event) => {
    event.preventDefault();
    setBtnEnable(false);

    if (isValid) {
      setIsLoading(true);
      try {
        const updatedFields = {};

        // Compare current `formData` with `originalData`
        Object.entries(expenseInputs).forEach(([key, value]) => {
          // Include only fields that have changed
          if (value !== originalData[key]) {
            updatedFields[key] = value;
          }
        });

        // Check if there are any updates to send
        if (Object.keys(updatedFields).length === 0) {
          Toast.showWarningToast("No changes detected to update.");
          setIsLoading(false);
          return;
        }

        const formDataToSend = new FormData();

        Object.entries(updatedFields).forEach(([key, value]) => {
          if (value instanceof File) {
            formDataToSend.append(key, value, value.name);
          } else {
            formDataToSend.append(key, value);
          }
        });

        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_API_URL}expense/update-expense/${id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Toast.showSuccessToast("Expense Updated Successfully!");

        // reset the form
        // setexpenseInputs(initialexpenseInputs);
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
        setTimeout(() => {
          setBtnEnable(true);
        }, 3000);
      }
    }
  };
  console.log(expenseInputsValidation);

  return (
    <div className="row m-1">
      <div className="text-lg font-bold mt-3 mb-3">Update expense</div>
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
                  value={expenseInputs.expenseHead}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {expenseHeadOptions.map((item) => (
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
                value={expenseInputs.name}
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
                value={expenseInputs.invoiceNum}
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
                  value={expenseInputs.date}
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
                value={expenseInputs.amount}
                onChange={handleInputChange}
                className="form-control"
                placeholder=""
                required
              />
            </div>
            {/* <div className="col-12">
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
            </div> */}
            <div className="col-12">
              <label htmlFor="file" className="form-label">
                Attach Documents
              </label>
              <div className="flex justify-between">
                <input
                  id="file"
                  className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  onChange={handleInputChange}
                  // value={formData.fatherPhoto}
                  type="file"
                  name="file"
                  accept="image/*"
                />
                {/* Image Preview */}
                {imagePreview.file && (
                  <div className="pl-2">
                    <img
                      src={imagePreview.file}
                      alt="Preview"
                      className="w-20 h-16 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={expenseInputs.description}
                onChange={handleInputChange}
                className="form-control "
                placeholder=""
              />
            </div>
            <div className="col-12 mt-4 flex justify-end">
              <button
                type="submit"
                onClick={handleSaveBtn}
                disabled={!btnEnable}
                className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 "
              >
                Update
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

export default UpdateExpenseLayer;
