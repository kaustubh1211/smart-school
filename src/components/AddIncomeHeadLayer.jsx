import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink, CSVDownload } from "react-csv";
import { ChevronDown } from "lucide-react";
import { Minus } from "lucide-react";
import Toast from "../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddIncomeHeadLayer = () => {
  // get accessToken from localstorage
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    search_string: "",
    page: 1,
  });
  // loading
  const [isLoading, setIsLoading] = useState(false);

  const initialIncomeInputs = {
    incomeHead: "",
    description: "",
  };

  const [incomeInputs, setIncomeInputs] = useState(initialIncomeInputs);

  const [incomeInputsValidation, setIncomeInputsValidation] = useState({
    incomeHead: false,
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

  // search income part

  const [btnClicked, setBtnClicked] = useState(false);
  // state for fetching the data when the page reloads
  // const [studentDetail, setStudentDetail] = useState({}); // studentDetail is an object
  const [incomeHead, setIncomeHead] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    details: [],
  });

  // csv data
  const csvHeaders = [
    { label: "Sr.No", key: "id" },
    { label: "Income Head", key: "incomeHead" },
    { label: "Description", key: "description" },
  ];
  // Map incomeHead details to match CSV format
  const csvData = incomeHead.details.map((item) => ({
    id: item.id,
    incomeHead: item.incomeHead,
    description: item.description,
  }));

  // state variable for when no users are found
  const [error, setError] = useState("");

  // Calculate the starting and ending record numbers
  // const startRecord = (incomeHead.currentPage - 1) * 12 + 1;
  const startRecord = `${
    incomeHead.currentPage == 0 ? 0 : (incomeHead.currentPage - 1) * 12 + 1
  }`;
  const endRecord = Math.min(
    incomeHead.currentPage * 12,
    incomeHead.totalRecords
  );

  // increment studentDetail.currentPage for pagination
  const [page, setPage] = useState(1);
  function incrementPage() {
    if (page !== incomeHead.totalPages) {
      setPage((page) => page + 1);
      // console.log(formData.pages);
    } else {
      setPage((page) => page);
    }
  }
  function decrementPage() {
    setPage((page) => page - 1);
  }

  // handleInputChange function
  const handleSearchString = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setBtnClicked(!btnClicked);
  };

  // useffect for fetching the incomeheads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}income/income-head`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page: page, // Page value here (automatically triggers on page change)
              search_string: formData.search_string,
            },
          }
        );
        setIncomeHead(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Unable to fetch Income Heads, Please try again later.");
      }
    };
    fetchData();
  }, [page, btnClicked]); // Only triggers when page or manualFetch changes

  const isValid = incomeInputsValidation.incomeHead;

  // handleSave logic
  const handleSaveBtn = async (event) => {
    event.preventDefault();
    if (isValid) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}income/add-income-head`,
          incomeInputs,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Toast.showSuccessToast("Income Head Added Successfully!");

        setPage(1);
        setBtnClicked(!btnClicked);

        // reset the form
        // setIncomeInputs(initialIncomeInputs);
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
      {/* Search income */}
      <div>
        <div>
          <div>
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="incomeHead.csv"
            >
              Download me
            </CSVLink>
          </div>
          <div></div>
        </div>
        <div className="text-lg font-bold mt-3 mb-3">Search Income Head</div>
        <div className="card text-sm h-100 p-0 radius-12">
          {/* // chatgpt */}
          <div className="card-header border-bottom bg-base py-16 px-24 d-flex flex-column gap-4">
            {/* First row: Search by Income and Download button */}
            <div className="d-flex align-items-center justify-content-between">
              <div className="text-sm font-medium text-secondary-light mb-0 whitespace-nowrap">
                Search By Income
              </div>
              <div>
                <CSVLink
                  className="bg-green-500 font-md text-white rounded-md px-3 py-2 flex items-center gap-1"
                  data={csvData}
                  headers={csvHeaders}
                  filename="incomeHead.csv"
                >
                  Download <BsFiletypeCsv />
                </CSVLink>
              </div>
            </div>

            {/* Second row: Search bar and Submit button */}
            <div className="d-flex align-items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full min-w-[250px] sm:min-w-[300px] lg:min-w-[400px] resize outline-none"
                  name="search_string"
                  value={formData.search_string}
                  onChange={handleSearchString}
                  placeholder="Search by Student Name"
                />
                <Icon
                  icon="ion:search-outline"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700"
                onClick={handleOnSubmit}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="card-body p-24">
            <div className="table-responsive scroll-sm">
              <table className="table bordered-table text-center sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-center text-sm" scope="col">
                      No.
                    </th>
                    <th className="text-center text-sm" scope="col">
                      Income Head
                    </th>
                    <th className="text-center text-sm" scope="col">
                      Description
                    </th>
                    <th className="text-center text-sm" scope="col">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-center">
                  {/* mapping logic */}
                  {error ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-red-500 text-center bg-blue-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : incomeHead.details.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-blue-500 font-bold text-center"
                      >
                        No Income exists
                      </td>
                    </tr>
                  ) : (
                    incomeHead.details.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.id}</td>

                          <td>
                            <span className="text-sm mb-0 fw-normal text-secondary-light">
                              {item.incomeHead}
                            </span>
                          </td>

                          <td>
                            {item.description === "" ? (
                              <span className="flex justify-center">
                                <Minus />
                              </span>
                            ) : (
                              item.description
                            )}
                          </td>

                          <td className="text-center">
                            <div className="d-flex align-items-center gap-2 justify-content-center">
                              <button
                                type="button"
                                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                              >
                                <Icon
                                  icon="lucide:edit"
                                  className="menu-icon"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  {/* mapping logic ends here */}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24 mb-1">
                <span>
                  {`Showing ${startRecord} to ${endRecord} of ${incomeHead.totalRecords} entries`}
                </span>
                <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                  <li className="page-item">
                    <button
                      className=" text-blue-600 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px w-32-px bg-base"
                      disabled={page === 1 ? true : false}
                      onClick={decrementPage}
                    >
                      <Icon icon="ep:d-arrow-left" className="text-xl" />
                    </button>
                  </li>
                  <li className="page-item">
                    <div className="page-link bg-primary-600 text-white text-sm radius-4 rounded-circle border-0 px-12 py-10 d-flex align-items-center justify-content-center  h-28-px w-28-px">
                      {incomeHead.currentPage}
                    </div>
                  </li>
                  {/* <li className="page-item">
                <Link
                  className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                  to="#"
                >
                  2
                </Link>
              </li>
              <li className="page-item">
                <Link
                  className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                  to="#"
                >
                  3
                </Link>
              </li> */}
                  <li className="page-item">
                    <button
                      onClick={incrementPage}
                      disabled={page === incomeHead.totalPages}
                      className=" text-blue-600 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                    >
                      {" "}
                      <Icon icon="ep:d-arrow-right" className="text-xl" />{" "}
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

export default AddIncomeHeadLayer;
