import React, { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateFeesTypeLayer = () => {
  // get accessToken from localstorage
  const accessToken = localStorage.getItem("accessToken");

  const { id } = useParams();

  const [btnEnable, setBtnEnable] = useState(true);

  // loading
  const [isLoading, setIsLoading] = useState(false);

  const initialFeeInput = {
    feeType: "",
    description: "",
  };

  const [feeInput, setFeeInput] = useState(initialFeeInput);

  const [feeInputValidation, setFeeInputValidation] = useState({
    feeType: true,
    description: true,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFeeInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFeeInputValidation((prevData) => ({
      ...prevData,
      [name]: true,
    }));
  };

  // useffect for fetching thefeeTypes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}fee/fee-type/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFeeInput(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Unable to fetch fee Type");
      }
    };
    fetchData();
  }, [id]); // Only triggers when page or manualFetch changes

  // state variable for when no users are found
  const [error, setError] = useState("");

  const isValid = feeInputValidation.feeType && feeInputValidation.description;

  // handleSave logic
  const handleSaveBtn = async (event) => {
    event.preventDefault();
    setBtnEnable(false);
    if (isValid) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_LOCAL_API_URL}fee/update-fee-type/${id}`,
          feeInput,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Toast.showSuccessToast("Fee Type Updated  Successfully!");
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

  return (
    <div className="col">
      <div className="text-lg font-bold mt-3 mb-3">Update Fee Type</div>
      <div className="card">
        {/* <div className="card-header">
          <h6 className="card-title mb-0">Add fee</h6>
        </div> */}
        <div className="card-body">
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">
                Fee Type <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="feeType"
                onChange={handleInputChange}
                value={feeInput.feeType}
                className="form-control  radius-12"
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={feeInput.description}
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

export default UpdateFeesTypeLayer;
