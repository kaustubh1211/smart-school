import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink, CSVDownload } from "react-csv";
import { Minus } from "lucide-react";
import { ArrowDownToLine } from "lucide-react";
import Toast from "../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddExpenseHeadLayer = () => {
  // get accessToken from localstorage
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    search_string: "",
    page: 1,
  });
  // loading
  const [isLoading, setIsLoading] = useState(false);

  const initialExpenseInput = {
    expenseHead: "",
    description: "",
  };

  const [expenseInput, setExpenseInput] = useState(initialExpenseInput);

  const [expenseInputValidation, setExpenseInputValidation] = useState({
    expenseHead: false,
    description: true,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setExpenseInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setExpenseInputValidation((prevData) => ({
      ...prevData,
      [name]: true,
    }));
  };

  // search expense part

  const [btnClicked, setBtnClicked] = useState(true);
  // state for fetching the data when the page reloads
  // const [studentDetail, setStudentDetail] = useState({}); // studentDetail is an object
  const [expenseHead, setExpenseHead] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    details: [],
  });

  // csv data
  const csvHeaders = [
    { label: "Sr.No", key: "id" },
    { label: "Expense Head List", key: "expenseHead" },
    { label: "Description", key: "description" },
  ];
  // Map expenseHead details to match CSV format
  const csvData = expenseHead.details.map((item) => ({
    id: item.id,
    expenseHead: item.expenseHead,
    description: item.description,
  }));

  // state variable for when no users are found
  const [error, setError] = useState("");

  // Calculate the starting and ending record numbers
  // const startRecord = (expenseHead.currentPage - 1) * 12 + 1;
  const startRecord = `${
    expenseHead.currentPage == 0 ? 0 : (expenseHead.currentPage - 1) * 12 + 1
  }`;
  const endRecord = Math.min(
    expenseHead.currentPage * 12,
    expenseHead.totalRecords
  );

  // increment studentDetail.currentPage for pagination
  const [page, setPage] = useState(1);
  function incrementPage() {
    if (page !== expenseHead.totalPages) {
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

  const handleNavigate = (id) => {
    navigate(`/update/expenseHead/${id}`);
  };

  const [btnEnable, setBtnEnable] = useState(true);

  // useffect for fetching the expenseHeads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}expense/expense-head`,
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
        setExpenseHead(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Unable to fetch Expense Heads, Please try again later.");
      }
    };
    fetchData();
  }, [page, btnClicked]); // Only triggers when page or manualFetch changes

  const isValid = expenseInputValidation.expenseHead;

  // handleSave logic
  const handleSaveBtn = async (event) => {
    event.preventDefault();
    setBtnEnable(false);
    if (isValid) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}expense/add-expense-head`,
          expenseInput,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Toast.showSuccessToast("Expense Head Added Successfully!");

        setPage(1);
        setBtnClicked(!btnClicked);

        // reset the form
        // setExpenseInput(initialExpenseInput);
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
      <div className="text-lg font-bold mt-3 mb-3">Add Expense Head</div>
      <div className="card">
        {/* <div className="card-header">
          <h6 className="card-title mb-0">Add Expense</h6>
        </div> */}
        <div className="card-body">
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">
                Expense Head <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <input
                type="text"
                name="expenseHead"
                onChange={handleInputChange}
                value={expenseInput.expenseHead}
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
                value={expenseInput.description}
                onChange={handleInputChange}
                className="form-control "
                placeholder=""
              />
            </div>
            <div className="col-12 mt-4 flex justify-end">
              <button
                type="submit"
                disabled={!btnEnable}
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
      {/* Search expense */}
      <div>
        <div className="d-flex align-items-center justify-content-between mt-4 mb-4">
          <div className="text-lg font-bold text-slate-800 text-secondary-light mb-0 whitespace-nowrap">
            Expense Head List
          </div>
          <div className="mr-2">
            <CSVLink
              className=" font-medium text-blue-600 rounded-md px-4 py-2.5 flex items-center gap-1"
              data={csvData}
              headers={csvHeaders}
              filename="expenseHeadList.csv"
            >
              <ArrowDownToLine size={18} />
              <span className="text-sm">Export</span>
            </CSVLink>
          </div>
        </div>
        {/* <div className="text-lg font-bold mt-3 mb-3">Expense Head List</div> */}
        <div className="card text-sm h-100 p-0 radius-12">
          {/* // chatgpt */}
          <div className="card-header border-bottom bg-base py-16 px-24 d-flex flex-column gap-4">
            {/* First row: Search by expense and Download button */}
            {/* <div className="d-flex align-items-center justify-content-between">
              <div className="text-sm font-medium text-secondary-light mb-0 whitespace-nowrap">
                Search
              </div>
              <div>
                <CSVLink
                  className="bg-green-500 font-xl font-medium text-white rounded-md px-4 py-2.5 flex items-center gap-1"
                  data={csvData}
                  headers={csvHeaders}
                  filename="expenseHead.csv"
                >
                  CSV
                  <BsFiletypeCsv />
                </CSVLink>
              </div>
            </div> */}

            {/* Second row: Search bar and Submit button */}
            <div className="d-flex align-items-center gap-4">
              <div>Search</div>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full min-w-[250px] sm:min-w-[300px] lg:min-w-[400px] resize outline-none"
                  name="search_string"
                  value={formData.search_string}
                  onChange={handleSearchString}
                  placeholder="Search by Expense Head"
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
                      Expense Head
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
                  ) : expenseHead.details.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-blue-500 font-bold text-center"
                      >
                        No expense exists
                      </td>
                    </tr>
                  ) : (
                    expenseHead.details.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.id}</td>

                          <td>
                            <span className="text-sm mb-0 fw-normal text-secondary-light">
                              {item.expenseHead}
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
                                onClick={() => handleNavigate(item.id)}
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
                  {`Showing ${startRecord} to ${endRecord} of ${expenseHead.totalRecords} entries`}
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
                      {expenseHead.currentPage}
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
                      disabled={page === expenseHead.totalPages}
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

export default AddExpenseHeadLayer;
