import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPen } from "lucide-react";

const StudentDetailsLayer = () => {
  // state for fetching the data when the page reloads
  const [studentData, setStudentData] = useState({});

  // state variable for when no users are found
  const [error, setError] = useState("");

  // inputValid
  const [isInputValid, seIsInputValid] = useState(false);

  // state to send the data to the api
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    searchByKeyword: "",
  });
  const [validationState, setValidationState] = useState({
    class: false,
    section: false,
    searchByKeyword: false,
  });
  // to fetch the data on reload
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://88.198.61.79:8080/api/admin/list-students"
        );
        setStudentData(response.data.data);
      } catch (error) {
        setError("No users found");
      }
    };
  });

  // handleInputChange function
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (isInputValid) {
      try {
        const resposne = await axios.get(
          "http://88.198.61.79:8080/api/admin/add-student",
          formData
        );
        console.log(resposne.data);
        // setStudentData()
      } catch (error) {
        setError("No users found");
        if (error.response) {
          Toast.showWarningToast(`${error.response.data.message}`);
          // console.log(error.response.data.data);
          console.log(error.response.data.message);
        } else if (error.request) {
          Toast.showErrorToast("Sorry, our server is down.");
        } else {
          Toast.showErrorToast("Sorry, please try again later.");
        }
      }
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
            <option value="Select Status" disabled>
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
        {/* <Link
          to="/student/create"
          className="btn btn-primary text-xs btn-sm px-8 py-8 radius-8 d-flex align-items-center gap-1"
        >
          <Icon
            icon="ic:baseline-plus"
            className="icon text-lg line-height-1"
          />
          Add New User
        </Link> */}
        <button
          type="submit"
          value={handleOnSubmit}
          className="bg-blue-600 text-md text-white hover:bg-blue-700 px-14 py-10 rounded-md "
        >
          Submit
        </button>
      </div>
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                {/* <th className="text-sm" scope="col ">
                  <div className="d-flex align-items-center gap-10">
                    <div className="form-check style-check d-flex text-center align-items-center">
                      <input
                        className="form-check-input radius-4 border input-form-dark"
                        type="checkbox"
                        name="checkbox"
                        id="selectAll"
                      />
                    </div>
                    Admission No
                  </div>
                </th> */}
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
              <tr>
                <td>
                  {/* <div className="form-check style-check d-flex align-items-center">
                      <input
                        className="form-check-input radius-4 border border-neutral-400"
                        type="checkbox"
                        name="checkbox"
                      />
                    </div> */}
                  01
                </td>
                <td>Rahul Yadav</td>
                <td>
                  {/* <img
                                            src="assets/images/user-list/user-list1.png"
                                            alt="Wowdash"
                                            className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
                                        /> */}

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
                    {/* <button
                      type="button"
                      className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium d-flex justify-content-center w-28-px h-28-px align-items-center rounded-circle"
                    >
                      <Icon
                        icon="majesticons:eye-line"
                        className="icon text-sm"
                      />
                    </button> */}
                    <button
                      type="button"
                      className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                    >
                      <Icon icon="lucide:edit" className="menu-icon" />
                    </button>
                    {/* <button
                      type="button"
                      className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                    >
                      <Icon
                        icon="fluent:delete-24-regular"
                        className="menu-icon"
                      />
                    </button> */}
                  </div>
                </td>
              </tr>
              {/* 1st row end */}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24 mb-1">
            <span>Showing 1 to 10 of 12 entries</span>
            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
              <li className="page-item">
                <Link
                  className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                  to="#"
                >
                  <Icon icon="ep:d-arrow-left" className="text-xl" />
                </Link>
              </li>
              <li className="page-item">
                <Link
                  className="page-link bg-primary-600 text-white fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                  to="#"
                >
                  1
                </Link>
              </li>
              <li className="page-item">
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
              </li>
              <li className="page-item">
                <Link
                  className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                  to="#"
                >
                  {" "}
                  <Icon icon="ep:d-arrow-right" className="text-xl" />{" "}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsLayer;
