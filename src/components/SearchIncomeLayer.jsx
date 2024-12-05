import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IndianRupee } from "lucide-react";

const SearchIncomeLayer = () => {
  // access token
  const accessToken = localStorage.getItem("accessToken");

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();
  // state for fetching the data when the page reloads
  // const [studentDetail, setStudentDetail] = useState({}); // studentDetail is an object
  const [studentData, setStudentData] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    details: [],
  });

  // Calculate the starting and ending record numbers
  const startRecord = `${
    studentData.currentPage == 0 ? 0 : (studentData.currentPage - 1) * 12 + 1
  }`;
  //   const startRecord = (studentData.currentPage - 1) * 12 + 1;
  const endRecord = Math.min(
    studentData.currentPage * 12,
    studentData.totalRecords
  );

  // state variable for when no users are found
  const [error, setError] = useState("");

  // increment studentDetail.currentPage for pagination
  const [page, setPage] = useState(1);
  function incrementPage() {
    if (page !== studentData.totalPages) {
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
    startDate: "",
    endDate: "",
    search_string: "",
  });

  const [validationState, setValidationState] = useState({
    startDate: true,
    endDate: true,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page: page, // Page value here (automatically triggers on page change)
            startDate: formData.class,
            endDate: formData.section,
            search_string: formData.search_string,
          },
        });
        setStudentData(response.data.data);
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

  // console.log(`totalPages ${studentData.totalPages}`);
  // console.log(`Page ${page}`);

  return (
    <div>
      <div className="text-lg font-bold mt-3 mb-3">Search Income</div>
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
                name="startDate"
                value={formData.startDate}
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
                name="startDate"
                value={formData.startDate}
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
                name="endDate"
                value={formData.endDate}
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
                name="endDate"
                value={formData.endDate}
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
                Search By Income
              </span>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full min-w-[250px] sm:min-w-[300px] lg:min-w-[400px] resize outline-none"
                  name="search_string"
                  value={formData.search_string}
                  onChange={handleInputChange}
                  placeholder="Search by Student Name"
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
                  <th className="text-center text-sm" scope="col">
                    Name
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
                  <th className="text-center text-sm flex flex-row" scope="col">
                    <div>Amount</div>
                    <div className="pl-2 mt-1">
                      <IndianRupee size={13} />
                    </div>
                    {/* <span className="mt-1"></span> */}
                  </th>
                  {/* <th className="text-center text-sm" scope="col">
                  Date of Birth
                </th>
                <th className="text-center text-sm" scope="col">
                  Gender
                </th>
                <th className="text-center text-sm" scope="col">
                  Category
                </th>
                <th className="text-center text-sm" scope="col">
                  Mobile No
                </th>
                <th scope="col" className="text-center text-sm">
                  Action
                </th> */}
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
                ) : studentData.details.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-blue-500 font-bold text-center"
                    >
                      No Income exists
                    </td>
                  </tr>
                ) : (
                  studentData.details.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.invoiceNo}</td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.incomeHead}
                          </span>
                        </td>
                        {/* <td>
                        <span className="text-sm mb-0 fw-normal text-secondary-light">
                          {`Class ${item.class}${item.section}`}
                        </span>
                      </td> */}
                        <td>{item.date}</td>
                        <td>{item.amount}</td>
                        {/* <td>
                        <span className="text-sm text-center mb-0 fw-normal text-secondary-light">
                          {item.gender}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm mb-0 fw-normal text-secondary-light">
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm mb-0 fw-normal text-secondary-light">
                          {!isNaN(item.fatherPhone) && item.fatherPhone
                            ? item.fatherPhone
                            : item.motherPhone}
                        </span>
                      </td> */}

                        {/* <td className="text-center">
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <button
                            type="button"
                            onClick={() => handleStudentInDetail(item.id)}
                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                          >
                            <Icon icon="lucide:edit" className="menu-icon" />
                          </button>
                        </div>
                      </td> */}
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
                {`Showing ${startRecord} to ${endRecord} of ${studentData.totalRecords} entries`}
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
                    {studentData.currentPage}
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
                    disabled={page === studentData.totalPages}
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
