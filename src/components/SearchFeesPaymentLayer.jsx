import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { Minus } from "lucide-react";
import axios from "axios";

const SearchFeesPaymentLayer = () => {
  // access token
  const accessToken = localStorage.getItem("accessToken");

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

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
    class: "",
    section: "",
    rollNo: "",
    paymentId: "",
  });

  const [validationState, setValidationState] = useState({
    from_date: true,
    to_date: true,
    class: true,
    section: true,
    rollNo: true,
    paymentId: true,
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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}fee/search-fee`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page: page, // Page value here (automatically triggers on page change)
              from_date: formData.from_date,
              to_date: formData.to_date,
              class: formData.class,
              section: formData.section,
              rollNo: formData.rollNo,
              paymentId: formData.paymentId,
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
  }, [page, btnClicked]); // Only triggers when page or manualFetch changes

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setBtnClicked(!btnClicked);
  };

  const handlepaymentInDetail = (id) => {
    // console.log(id);
    navigate(`/payment/update/${id}`);
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
            <div className="w-100">
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
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
              </select>
            </div>
          </div>

          {/* Second Row */}
          <div className="d-flex flex-column flex-md-row align-items-start gap-4 mb-3">
            <div className="w-100">
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
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Roll No
              </label>
              <input
                type="text"
                className="form-control"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-100">
              <label className="form-label text-sm fw-medium text-secondary-light">
                Payment Id
              </label>
              <input
                type="text"
                className="form-control"
                name="paymentId"
                value={formData.paymentId}
                onChange={handleInputChange}
              />
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
            <table className="table bordered-table sm-table mb-0">
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
                    Payment Id
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
                ) : paymentData.details.length === 0 ? (
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
                        <td>{item.firstName + " " + item.lastName}</td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {`${item.class.class}${item.section}`}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.rollNo}
                          </span>
                        </td>

                        <td>{item.paymentDate.split("T")[0]}</td>
                        <td>{item.feeType.feeType}</td>
                        <td>
                          <span className="text-sm text-center mb-0 fw-normal text-secondary-light">
                            {item.modeOfPayment}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.paymentId === "null" ? (
                              <Minus />
                            ) : (
                              item.paymentId
                            )}
                          </span>
                        </td>
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
                              onClick={handlepaymentInDetail}
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
