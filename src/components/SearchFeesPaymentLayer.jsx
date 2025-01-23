import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { Minus } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const SearchFeesPaymentLayer = () => {
  // access token
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  const [fetchClass, setFetchClass] = useState([]);

  // const [classId, setClassId] = useState("");

  const [showDialog, setShowDialog] = useState(false);

  const [paymentData, setPaymentData] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    details: [],
  });

  // Calculate the starting and ending record numbers
  // const startRecord = (paymentData.currentPage - 1) * 12 + 1;
  const startRecord = `${
    paymentData.currentPage == 0 ? 0 : (paymentData.currentPage - 1) * 12 + 1
  }`;
  const endRecord = Math.min(
    paymentData.currentPage * 12,
    paymentData.totalRecords
  );

  // state variable for when no users are found
  const [error, setError] = useState("");

  // increment paymentDetail.currentPage for pagination
  const [page, setPage] = useState(1);
  function incrementPage() {
    if (page !== paymentData.totalPages) {
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
    // class: "",
    // section: "",
    search_string: "",
  });

  const [validationState, setValidationState] = useState({
    from_date: true,
    to_date: true,
    class: true,
    section: true,
    search_string: true,
  });

  // handleInputChange function
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If the "class" dropdown changes, update classId
    // if (name === "class") {
    //   const selectedOption = event.target.selectedOptions[0]; // Get the selected <option>
    //   const selectedId = selectedOption.id; // Access the id attribute of the selected <option>
    //   setClassId(selectedId);
    // }
  };

  // useEffect for fetching class
  // useEffect(() => {
  //   const fetchClassData = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${
  //           import.meta.env.VITE_LOCAL_API_URL
  //         }class/list?medium=${tenant}&year=${academicYear}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         }
  //       );
  //       console.log(response.data.data);
  //       setFetchClass(response.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchClassData();
  // }, [tenant, academicYear]);

  // fetch collect fees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }fee/search-fee?mediumName=${tenant}&academicYearName=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page: page, // Page value here (automatically triggers on page change)
              from_date: formData.from_date,
              to_date: formData.to_date,
              // classId: classId,
              // section: formData.section,
              search_string: formData.search_string,
            },
          }
        );
        setPaymentData(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Unable to fetch payments. Please try again later.");
      }
    };
    fetchData();
  }, [page, btnClicked, tenant, academicYear]); // Only triggers when page or manualFetch changes

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setBtnClicked(!btnClicked);
  };

  const handlepaymentInDetail = (id) => {
    // console.log(id);
    navigate(`/fees/view/recipt/${id}`);
  };

  // console.log(`totalPages ${paymentData.totalPages}`);
  // console.log(`Page ${page}`);

  return (
    <div>
      <div className="text-lg font-bold mb-3">Search Fees Payment</div>
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          {/* First Row */}
          <div className="d-flex flex-column flex-md-row align-items-start gap-4 mb-3">
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                From
              </label>
              <input
                type="date"
                name="from_date"
                value={formData.from_date}
                className="form-control"
                onChange={handleInputChange}
              />
            </div>
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                To
              </label>
              <input
                type="date"
                name="to_date"
                value={formData.to_date}
                className="form-control"
                onChange={handleInputChange}
                required
              />
            </div>
            {/* <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Class
              </label>
              <select
                className="form-select"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                {fetchClass.map((item) => (
                  <option id={item.id} key={item.id} value={item.class}>
                    {item.class}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          {/* Second Row */}
          <div className="d-flex flex-column flex-md-row align-items-start gap-4 mb-3">
            {/* <div className="w-50">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Section
              </label>
              <select
                className="form-select"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div> */}
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Search by:
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full min-w-[250px] sm:min-w-[300px] lg:min-w-[400px] resize outline-none"
                  name="search_string"
                  value={formData.search_string}
                  onChange={handleInputChange}
                  placeholder="Search by Enroll No/Gr No"
                />

                <Icon
                  icon="ion:search-outline"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              onClick={handleOnSubmit}
              className="btn btn-primary px-5"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            {/* Table and pagination code remains unchanged */}
            <table className="table-bordered-custom sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    Name
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Class
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Roll No
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Payment Date
                  </th>
                  {/* <th className="text-center text-sm" scope="col">
                    Fee Group
                  </th> */}
                  <th className="text-center text-sm" scope="col">
                    Fee Type
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Mode
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Amount
                  </th>
                  <th scope="col" className="text-center text-sm">
                    View Recipt
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-center">
                {/* <tr>
                1st row start
                <td>01</td>
                <td>Rahul Yadav</td>
                <td>
                  <span className="text-sm mb-0 fw-normal text-secondary-light">
                    54
                  </span>
                </td>
                <td>
                  <span className="text-sm mb-0 fw-normal text-secondary-light">
                    Class 2B
                  </span>
                </td>
                <td>Ramesh Yadav</td>
                <td>12/10/2001</td>
                <td>
                  <span className="text-sm text-center mb-0 fw-normal text-secondary-light">
                    Male
                  </span>
                </td>
                <td>
                  <span className="text-sm mb-0 fw-normal text-secondary-light">
                    General
                  </span>
                </td>
                <td>
                  <span className="text-sm mb-0 fw-normal text-secondary-light">
                    994999449
                  </span>
                </td>

                <td className="text-center">
                  <div className="d-flex align-items-center gap-2 justify-content-center">
                    <button
                      type="button"
                      className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                    >
                      <Icon icon="lucide:edit" className="menu-icon" />
                    </button>
                  </div>
                </td>
              </tr> */}
                {/* 1st row end */}

                {/* mapping logic */}
                {error ? (
                  <tr>
                    <td colSpan="10" className="text-red-500 text-center">
                      {error}
                    </td>
                  </tr>
                ) : paymentData.totalRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-blue-500 font-bold text-center"
                    >
                      No payments Exists
                    </td>
                  </tr>
                ) : (
                  paymentData.details.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {item.student.firstName + " " + item.student.lastName}
                        </td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {`${item.student.class}${item.student.division}`}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.student.rollNo}
                          </span>
                        </td>

                        <td>{item.paymentDate.split("T")[0]}</td>
                        <td>{item.feeTypeName}</td>
                        <td>
                          <span className="text-sm text-center mb-0 fw-normal text-secondary-light">
                            {item.modeOfPayment}
                          </span>
                        </td>
                        {/* <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.paymentId === "null" ? (
                              <Minus />
                            ) : (
                              item.paymentId
                            )}
                          </span>
                        </td> */}
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.amount}
                          </span>
                        </td>
                        {/* <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.amount}
                          </span>
                        </td> */}

                        <td className="text-center">
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            <button
                              type="button"
                              onClick={() => handlepaymentInDetail(item.id)}
                              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                            >
                              {/* <Icon icon="lucide:edit" className="menu-icon" /> */}
                              <ReceiptText />
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
                {`Showing ${startRecord} to ${endRecord} of ${paymentData.totalRecords} entries`}
              </span>
              <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                <li className="page-item">
                  <button
                    className=" text-blue-600 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px w-32-px bg-base"
                    disabled={paymentData.currentPage === 1 ? true : false}
                    onClick={decrementPage}
                  >
                    <Icon icon="ep:d-arrow-left" className="text-xl" />
                  </button>
                </li>
                <li className="page-item">
                  <div className="page-link bg-primary-600 text-white text-sm radius-4 rounded-circle border-0 px-12 py-10 d-flex align-items-center justify-content-center  h-28-px w-28-px">
                    {paymentData.currentPage}
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
                    disabled={page === paymentData.totalPages}
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

export default SearchFeesPaymentLayer;
