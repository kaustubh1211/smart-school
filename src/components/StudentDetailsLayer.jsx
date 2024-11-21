import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentDetailsLayer = () => {
  // state for fetching the data when the page reloads
  const [studentDetail, setStudentDetail] = useState({}); // studentDetail is an object
  const [studentData, setStudentData] = useState([]); // studentData is an array

  // state variable for when no users are found
  const [error, setError] = useState("");

  // student id
  const [studentId, setStudentId] = useState();

  // increment studentDetail.currentPage for pagination
  const [page, setPage] = useState(1);
  function incrementPage() {
    if (page !== studentDetail.totalPages) {
      setPage((page) => page + 1);
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
    class: "",
    section: "",
    searchByKeyword: "",
  });
  const [validationState, setValidationState] = useState({
    class: true,
    section: true,
    searchByKeyword: true,
  });

  // handleInputChange function
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setValidationState((prevState) => ({
      ...prevState,
    }));
  };

  // to fetch the data on reload
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://88.198.61.79:8080/api/admin/list-students",
          {
            params: {
              page: page,
            },
          }
        );

        if (response.data.data) {
          setStudentDetail(response.data.data);
          setStudentData(response.data.data.details);
        } else {
          setError("No users found");
        }
      } catch (error) {
        setError("Unable to fetch students. Please try again later.");
      }
    };
    fetchData();
  }, [page]);

  const handleOnSubmit = async (event) => {
    // event.preventDefault();
    // if (isInputValid) {
    //   try {
    //     const response = await axios.get(
    //       `http://88.198.61.79:8080/api/admin/student/${20}`,
    //       {
    //         params: {
    //           class: formData.class,
    //           section: formData.section,
    //           search_string: formData.searchByKeyword,
    //         },
    //       }
    //     );
    //     console.log(response.data);
    //     setStudentData(() => [response.data.data]);
    //     // setStudentData();
    //   } catch (error) {
    //     setError("No users found");
    //     if (error.response) {
    //       Toast.showWarningToast(`${error.response.data.message}`);
    //       // console.log(error.response.data.data);
    //       console.log(error.response.data.message);
    //     } else if (error.request) {
    //       Toast.showErrorToast("Sorry, our server is down.");
    //     } else {
    //       Toast.showErrorToast("Sorry, please try again later.");
    //     }
    //   }
    // }
  };

  const handleStudentInDetail = async (id) => {
    // event.preventDefault();

    // const { name, value, id } = event.target;
    // setStudentId(id);
    console.log(id);

    try {
      const response = await axios.get(
        `http://88.198.61.79:8080/api/admin/student/${id}`
      );
      setStudentData(() => [response.data.data]);
      console.log(response.data);
    } catch (error) {
      setError("No users found");
    }
  };

  return (
    <div className="card text-sm h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-sm fw-medium text-secondary-light mb-0">
            Class
          </span>
          <select
            className="form-select form-select-sm w-auto ps-12 py-1 radius-12 h-36-px"
            name="class"
            value={formData.class}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 3">Class 3</option>
            <option value="Class 4">Class 4</option>
            <option value="Class 5">Class 5</option>
          </select>
          <span className="text-sm fw-medium text-secondary-light mb-0">
            Section
          </span>
          <select
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
          </select>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-sm font-medium text-secondary-light mb-0 whitespace-nowrap">
              Search By Keyword
            </span>
            <form className="relative flex-1">
              <input
                type="text"
                className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full max-w-full min-w-[250px] sm:min-w-[300px] lg:min-w-[400px] resize outline-none"
                name="searchByKeyword"
                value={formData.searchByKeyword}
                onClick={handleInputChange}
                placeholder="Search by Student Name, Roll No, Enroll No etc."
              />
              <Icon
                icon="ion:search-outline"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </form>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleOnSubmit}
          className="bg-blue-500 text-md text-white hover:bg-blue-700 px-12 py-2 rounded-md sm:px-8 sm:py-4 md:px-14 md:py-10"
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
                  Admission No
                </th>
                <th className="text-center text-sm" scope="col">
                  Student Name
                </th>
                <th className="text-center text-sm" scope="col">
                  Roll No
                </th>
                <th className="text-center text-sm" scope="col">
                  Class
                </th>
                <th className="text-center text-sm" scope="col">
                  Father Name
                </th>
                <th className="text-center text-sm" scope="col">
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
              ) : studentData.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-blue-500 font-bold text-center"
                  >
                    No user Exists
                  </td>
                </tr>
              ) : (
                studentData.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.admissionNo}</td>
                      <td>{item.firstName + " " + item.lastName}</td>
                      <td>
                        <span className="text-sm mb-0 fw-normal text-secondary-light">
                          {item.rollNo}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm mb-0 fw-normal text-secondary-light">
                          {`Class ${item.class}${item.section}`}
                        </span>
                      </td>
                      <td>{item.fatherName}</td>
                      <td>{item.dob}</td>
                      <td>
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
                      </td>

                      <td className="text-center">
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <button
                            type="button"
                            id={item.id}
                            onClick={() => handleStudentInDetail(item.id)}
                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
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
            <span>{`Showing 1 to 12 of ${studentDetail.totalRecords} entries`}</span>
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
                  {page}
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
                  disabled={page === studentDetail.totalPages}
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
  );
};

export default StudentDetailsLayer;
