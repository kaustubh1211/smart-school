import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import { ArrowDownToLine } from "lucide-react";
import axios from "axios";
import { IndianRupee } from "lucide-react";

import moment from "moment";

const SearchIncomeLayer = () => {
  // access token
  const accessToken = localStorage.getItem("accessToken");

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();
  // state for fetching the data when the page reloads
  // const [studentDetail, setStudentDetail] = useState({}); // studentDetail is an object
  const [incomeData, setIncomeData] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    details: [],
  });

  // handle navigate with id
  const handleNavigate = (id) => {
    navigate(`/update/income/${id}`);
  };

  // Calculate the starting and ending record numbers
  const startRecord = `${
    incomeData.currentPage == 0 ? 0 : (incomeData.currentPage - 1) * 12 + 1
  }`;
  //   const startRecord = (incomeData.currentPage - 1) * 12 + 1;
  const endRecord = Math.min(
    incomeData.currentPage * 12,
    incomeData.totalRecords
  );

  // state variable for when no users are found
  const [error, setError] = useState("");

  // increment studentDetail.currentPage for pagination
  const [page, setPage] = useState(1);
  function incrementPage() {
    if (page !== incomeData.totalPages) {
      setPage((page) => page + 1);
      // console.log(formData.pages);
    } else {
      setPage((page) => page);
    }
  }
  function decrementPage() {
    setPage((page) => page - 1);
  }

  // inputValid
  const [isInputValid, seIsInputValid] = useState(true);

  // state to send the data to the api
  const [formData, setFormData] = useState({
    page: page,
    from_date: "",
    to_date: "",
    search_string: "",
  });

  const [validationState, setValidationState] = useState({
    from_date: true,
    to_date: true,
    search_string: true,
  });

  // handleInputChange function
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // csv data
  const csvHeaders = [
    { label: "Sr.No", key: "id" },
    { label: "Income Name", key: "incomeName" },
    { label: "Invoice No.", key: "invoiceNum" },
    { label: "IncomeHead", key: "incomeHead" },
    { label: "Date", key: "date" },
    { label: "Amount", key: "amount" },
  ];
  // Map incomeHead details to match CSV format
  const csvData = incomeData.details.map((item) => ({
    id: item.id,
    incomeName: item.name,
    invoiceNum: item.invoiceNum,
    incomeHead: item.income.incomeHead,
    // date: item.date,
    date: moment(item.date).format("DD-MM-YY"),
    amount: item.amount,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}income/income-list`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page: page, // Page value here (automatically triggers on page change)
              from_date: formData.from_date,
              to_date: formData.to_date,
              search_string: formData.search_string,
            },
          }
        );
        setIncomeData(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Add new record or search with different criteria");
      }
    };
    fetchData();
  }, [page, btnClicked]); // Only triggers when page or manualFetch changes

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setBtnClicked(!btnClicked);
  };

  // console.log(`totalPages ${incomeData.totalPages}`);
  // console.log(`Page ${page}`);

  return (
    <div>
      {" "}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="text-xl font-bold text-slate-800 text-secondary-light mb-0 whitespace-nowrap">
          Income List
        </div>
        <div className="mr-2">
          <CSVLink
            className=" font-medium text-blue-600 rounded-md px-4 py-2.5 flex items-center gap-1"
            data={csvData}
            headers={csvHeaders}
            filename="incomeList.csv"
          >
            <ArrowDownToLine size={18} />
            <span className="text-sm">Export</span>
          </CSVLink>
        </div>
      </div>
      {/* <div className="text-lg font-bold mt-3 mb-3">Income List</div> */}
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <span className="text-sm fw-medium text-secondary-light mb-0">
              From
            </span>
            {/* <label className="form-label">From</label> */}
            <div className="date-picker-wrapper">
              <input
                type="date"
                name="from_date"
                value={formData.from_date}
                className="form-control date-picker"
                onChange={handleInputChange}
                placeholder=""
              />
            </div>
            {/* <div className="col-12">
              <label className="form-label">
                Date <span style={{ color: "#ff0000" }}>*</span>
              </label>
              <div className="date-picker-wrapper">
                <input
                  type="date"
                  name="from_date"
                  value={formData.from_date}
                  className="form-control date-picker"
                  onChange={handleInputChange}
                  placeholder=""
                  required
                />
              </div>
            </div> */}
            {/* <select
            className="form-select form-select-sm w-auto ps-12 py-1 radius-12 h-36-px"
            name="class"
            value={formData.class}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="1"></option>
            <option value="2">Class 2</option>
            <option value="3">Class 3</option>
            <option value="4">Class 4</option>
            <option value="5">Class 5</option>
          </select> */}
            <span className="text-sm fw-medium text-secondary-light mb-0">
              To
            </span>
            {/* <label className="form-label">
            To
            
          </label> */}
            <div className="date-picker-wrapper">
              <input
                type="date"
                name="to_date"
                value={formData.to_date}
                className="form-control date-picker"
                onChange={handleInputChange}
                placeholder=""
                required
              />
            </div>
            {/* <div className="col-12">
            <label className="form-label">
              To <span style={{ color: "#ff0000" }}>*</span>
            </label>
            <div className="date-picker-wrapper">
              <input
                type="date"
                name="to_date"
                value={formData.to_date}
                className="form-control date-picker"
                onChange={handleInputChange}
                placeholder=""
                required
              />
            </div>
          </div> */}
            {/* <select
            className="form-select form-select-sm w-auto ps-12 py-1 radius-12 h-36-px"
            name="section"
            value={formData.section}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select> */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-sm font-medium text-secondary-light mb-0 whitespace-nowrap">
                Search
              </span>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full min-w-[250px] sm:min-w-[300px] lg:min-w-[400px] resize outline-none"
                  name="search_string"
                  value={formData.search_string}
                  onChange={handleInputChange}
                  placeholder="Search by Income Name"
                />

                <Icon
                  icon="ion:search-outline"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* <input type="text" /> */}

          <button
            type="submit"
            onClick={handleOnSubmit}
            className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 "
          >
            Submit
          </button>
        </div>
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  {/* <th className="text-center text-sm" scope="col">
                    No.
                  </th> */}
                  <th className="text-center text-sm" scope="col">
                    Income Name
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Invoice Number
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Income Head
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Date
                  </th>
                  {/* <th className="text-center text-sm" scope="col">
                    <div className="flex flex-row text-center">
                      <div>Amount</div>
                      <div className="pl-2 mt-1">
                        <IndianRupee size={13} />
                      </div>
                    </div>
                  </th> */}
                  <th className="text-center text-sm" scope="col">
                    Amount{" "}
                    <span>
                      {" "}
                      <IndianRupee className="pt-0.5" size={12} />
                    </span>
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
                    <td colSpan="10" className="text-red-500 text-center">
                      {error}
                    </td>
                  </tr>
                ) : incomeData.details.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-blue-500 font-bold text-center"
                    >
                      No Income exists
                    </td>
                  </tr>
                ) : (
                  incomeData.details.map((item, index) => {
                    return (
                      <tr key={item.index}>
                        {/* <td>{item.id}</td> */}
                        <td>{item.name}</td>
                        <td>{item.invoiceNum}</td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.income.incomeHead}
                          </span>
                        </td>
                        <td>{moment(item.date).format("DD-MM-YY")}</td>
                        <td>{item.amount}</td>
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
                {/* mapping logic ends here */}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24 mb-1">
              <span>
                {`Showing ${startRecord} to ${endRecord} of ${incomeData.totalRecords} entries`}
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
                    {incomeData.currentPage === 0 ? 1 : incomeData.currentPage}
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
                    disabled={incomeData.currentPage === incomeData.totalPages}
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
  );
};

export default SearchIncomeLayer;
