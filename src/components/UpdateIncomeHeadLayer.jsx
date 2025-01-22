import React, { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateIncomeHeadLayer = () => {
  // get accessToken from localstorage
  const accessToken = localStorage.getItem("accessToken");

  const { id } = useParams();

  // loading
  const [isLoading, setIsLoading] = useState(false);

  const initialIncomeInputs = {
    incomeHead: "",
    description: "",
  };

  const [incomeInputs, setIncomeInputs] = useState(initialIncomeInputs);

  const [incomeInputsValidation, setIncomeInputsValidation] = useState({
    incomeHead: true,
    description: true,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setIncomeInputs((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setIncomeInputsValidation((prevData) => ({
      ...prevData,
      [name]: true,
    }));
  };

  // useffect for fetching the incomeheads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}income/income-head/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIncomeInputs(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Unable to fetch Income Heads, Please try again later.");
      }
    };
    fetchData();
  }, [id]); // Only triggers when page or manualFetch changes

  // state variable for when no users are found
  const [error, setError] = useState("");

  const isValid =
    incomeInputsValidation.incomeHead && incomeInputsValidation.description;

  // handleSave logic
  const handleSaveBtn = async (event) => {
    event.preventDefault();
    if (isValid) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }income/update-income-head/${id}`,
          incomeInputs,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Toast.showSuccessToast("IncomeHead Updated  Successfully!");
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

  return (
    <div className="col">
      <div className="text-lg font-bold mt-3 mb-3">Add Income Head</div>
      <div className="card">
        {/* <div className="card-header">
          <h6 className="card-title mb-0">Add Income</h6>
        </div> */}
        <div className="card-body">
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">
                Income Head <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="incomeHead"
                onChange={handleInputChange}
                value={incomeInputs.incomeHead}
                className="form-control  radius-12"
                placeholder=""
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={incomeInputs.description}
                onChange={handleInputChange}
                className="form-control "
                placeholder=""
              />
            </div>
            <div className="col-12 mt-4 flex justify-end">
              <button
                type="submit"
                onClick={handleSaveBtn}
                className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700"
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
    </div>
  );
};

export default UpdateIncomeHeadLayer;
