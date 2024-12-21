import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import Toast from "../../src/components/ui/Toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import moment from "moment";

const CollectFeePaymentLayer = () => {
  // access token from local Storage
  const accessToken = localStorage.getItem("accessToken");

  // get todays date
  const [todaysDate, setTodaysDate] = useState("");

  const [formKey, setFormKey] = useState(0);

  const [feeTypeList, setFeeTypeList] = useState([]);
  const [feeGroupList, setFeeGroupList] = useState([]);

  // useForm Hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const registerOptions = {
    class: { required: "Class is required" },
    section: { required: "Section is required" },
    firstName: { required: "FisrtName is required" },
    lastName: { required: "LastName is required" },
    amount: { required: "Amount is required" },
    feeType: { required: "Fee Type is required" },
    modeOfPayment: {
      required: "Mode of Payment is required",
    },
  };

  useEffect(() => {
    // get todays date
    const date = new moment().format("YYYY-MM-DD");
    setTodaysDate(date);
  }, []);

  useEffect(() => {
    async function fetchApi() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}fee/all-fee-type`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const feeTypes = response.data.data.map((item) => item.feeType); // Extract feeType values
        setFeeTypeList(feeTypes); // Set state with extracted values
      } catch (error) {
        console.error(error);
      }
    }
    fetchApi();
  }, []);
  useEffect(() => {
    async function fetchApi() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}fee/all-fee-group`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const feeGroup = response.data.data.map((item) => item.class); // Extract feeType values
        setFeeGroupList(feeGroup); // Set state with extracted values
      } catch (error) {
        console.error(error);
      }
    }
    fetchApi();
  }, []);

  const handleRegistration = async (data) => {
    try {
      const formData = new FormData();

      // Append form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "file") {
          formData.append(key, value?.[0] || null); // Attach the file directly
        } else if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // Append additional fields
      // formData.append("paymentDate", todaysDate);

      console.log("FormData contents:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Submit the form
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}fee/add-fee`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Toast.showSuccessToast("Payment Collected Successfully!");
      reset(); // Reset the form
      setFormKey((prevKey) => prevKey + 1); // Trigger component re-render
    } catch (error) {
      console.error("Error while collecting payment:", error);
      Toast.showErrorToast("Failed to collect payment. Please try again.");
    }
  };

  return (
    <div key={formKey} className="col-md-6 w-full px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(handleRegistration)}>
        <div className="text-lg font-bold mt-3 mb-3">Collect Fee Payment</div>

        <div className="card ">
          <div className="card-body ">
            <div className="row  grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Class */}
              <div className="col-12">
                <label className="form-label">
                  Class <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                  value=""
                >
                  {/* Class Dropdown */}
                  <select
                    name="class"
                    {...register("class", registerOptions.class)}
                    required
                    className="form-control"
                  >
                    <option value="">Select</option>
                    {feeGroupList.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {/* ChevronDown Icon */}
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
                <small className="text-danger">
                  {errors?.class && errors.class.message}
                </small>
              </div>
              {/* Section */}
              <div className="col-12">
                <label className="form-label">
                  Section <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="section"
                    {...register("section", registerOptions.section)}
                    required
                    className="form-control"
                  >
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>

                  {/* ChevronDown Icon */}
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
                <small className="text-danger">
                  {errors?.section && errors.section.message}
                </small>
              </div>
              {/* Roll No */}
              <div className="col-12">
                <label className="form-label">Roll Number</label>
                <input
                  type="number"
                  name="rollNo"
                  {...register("rollNo")}
                  className="form-control"
                />
              </div>
              {/* First Name */}
              <div className="col-12">
                <label className="form-label">
                  First Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  {...register("firstName", registerOptions.firstName)}
                  required
                  className="form-control"
                />
                <small className="text-danger">
                  {errors?.fisrtName && errors.fisrtName.message}
                </small>
              </div>
              {/* Last Name */}
              <div className="col-12">
                <label className="form-label">
                  Last Name <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  {...register("lastName", registerOptions.lastName)}
                  required
                  className="form-control"
                />
                <small className="text-danger">
                  {errors?.lastName && errors.lastName.message}
                </small>
              </div>
              {/* {Payment Date} */}
              <div className="col-12">
                <label className="form-label">Payment Date</label>
                <div>
                  <input
                    type="text"
                    value={todaysDate}
                    name="paymentDate"
                    {...register("paymentDate")}
                    className="form-control bg-slate-100"
                  />
                </div>
              </div>

              {/* Fee type */}
              <div className="col-12">
                <label className="form-label">
                  Fee type <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="feeType"
                    className="form-control"
                    {...register("feeType", registerOptions.feeType)}
                    required
                    // onChange={handleInputChange}
                    // value={incomeInputs.incomeHead}
                  >
                    {/* <option value="" disabled>
                        Select
                      </option>
                      {incomeHeadOptions.map((item) => (
                        <option key={item.id} value={item.incomeHead}>
                          {item.incomeHead}
                        </option>
                      ))} */}
                    <option value="">Select</option>
                    {feeTypeList.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
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
                <small className="text-danger">
                  {errors?.feeType && errors.feeType.message}
                </small>
              </div>
              {/* Mode of Payment */}
              <div className="col-12">
                <label className="form-label">
                  Mode of Payment <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <select
                    name="modeOfPayment"
                    className="form-control"
                    {...register(
                      "modeOfPayment",
                      registerOptions.modeOfPayment
                    )}
                    required
                    // onChange={handleInputChange}
                    // value={incomeInputs.incomeHead}
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
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
              {/* Amount */}
              <div className="col-12">
                <label className="form-label">
                  Amount <span style={{ color: "#ff0000" }}>*</span>
                </label>
                <div
                  className="form-control-wrapper"
                  style={{ position: "relative" }}
                >
                  <input
                    name="amount"
                    type="number"
                    className="form-control"
                    {...register("amount", registerOptions.amount)}
                    required
                  ></input>
                </div>
                <small className="text-danger">
                  {errors?.amount && errors.amount.message}
                </small>
              </div>
            </div>
            <div className="col-12 mt-4">
              <label className="form-label">Payment Id</label>
              <input
                type="text"
                name="paymentId"
                {...register("paymentId")}
                // value={incomeInputs.description}
                // onChange={handleInputChange}
                className="form-control "
                placeholder=""
              />
            </div>
            <div className="col-12 mt-3">
              <label className="form-label">Payment Proof</label>
              <div className="flex justify-between">
                <input
                  id="file"
                  className="form-control w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  // onChange={handleInputChange}
                  type="file"
                  name="file"
                  accept="image/*"
                  {...register("file")}
                />
              </div>
            </div>
            <div className="col-12 mt-2 mb-2 flex justify-end">
              <button className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 ">
                Submit
              </button>
              {/* {isLoading && (
                  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <div className="loader"></div>
                  </div>
                )} */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CollectFeePaymentLayer;
