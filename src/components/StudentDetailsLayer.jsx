import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const StudentDetailsLayer = () => {
  const { std, div } = useParams();

  // access token
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  const [serialNo, setSerialNo] = useState(0);

  const [fetchClass, setFetchClass] = useState([]);

  // state for fetching the data when the page reloads
  // const [studentDetail, setStudentDetail] = useState({}); // studentDetail is an object
  const [studentData, setStudentData] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    details: [],
  });

  // Calculate the starting and ending record numbers
  // const startRecord = (studentData.currentPage - 1) * 12 + 1;
  const startRecord = `${
    studentData.currentPage == 0 ? 0 : (studentData.currentPage - 1) * 12 + 1
  }`;
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
    class: std,
    division: div,
    search_string: "",
  });

  const [validationState, setValidationState] = useState({
    class: true,
    division: true,
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
    const fetchClassData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }class/list?medium=${tenant}&year=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data.data);
        setFetchClass(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClassData();
  }, []);

  // route for fetching student details list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API_URL}students/list-students`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page: page, // Page value here (automatically triggers on page change)
              class: formData.class,
              division: formData.division,
              search_string: formData.search_string,
              mediumName: tenant,
              academicYearName: academicYear,
            },
          }
        );
        setStudentData(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Unable to fetch students. Please try again later.");
      }
    };
    fetchData();
  }, [page, btnClicked, tenant, academicYear]); // Only triggers when page or manualFetch changes

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    console.log("before" + btnClicked);
    setBtnClicked((btnClicked) => !btnClicked);
    setError("");
  };

  console.log("after" + btnClicked);
  const handleStudentInDetail = (id) => {
    // console.log(id);
    navigate(`/student/update/${id}`);
  };

  // console.log(`totalPages ${studentData.totalPages}`);
  // console.log(`Page ${page}`);

  return (
    <div>
      <div className="text-lg font-bold mb-3">Students Details</div>
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
              <option value="">Select</option>
              {fetchClass.map((item, index) => (
                <option key={index} value={item.class}>
                  {item.class}
                </option>
              ))}
            </select>
            <span className="text-sm fw-medium text-secondary-light mb-0">
              Division
            </span>
            <select
              className="form-select form-select-sm w-auto ps-12 py-1 radius-12 h-36-px"
              name="division"
              value={formData.division}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-sm font-medium text-secondary-light mb-0 whitespace-nowrap">
                Search By
              </span>
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
                  <th className="text.center text-sm" scope="col">
                    Sr.No
                  </th>
                  <th className="text.center text-sm" scope="col">
                    Photo
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Student Name
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Class
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Roll No
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Gender
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Enroll No.
                  </th>
                  <th className="text-center text-sm" scope="col">
                    GrNo.
                  </th>
                  <th scope="col" className="text-center text-sm">
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
                ) : studentData.details.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-blue-500 font-bold text-center"
                    >
                      No user Exists
                    </td>
                  </tr>
                ) : (
                  studentData.details.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>{(item.serial = index + 1)}</td>
                        <td>
                          <img
                            src={`${import.meta.env.VITE_SERVER_BASE_URL}${
                              item.studentPhoto
                            }`}
                            className="w-10 h-12 rounded-md"
                          />
                        </td>
                        <td>{item.firstName + " " + item.lastName}</td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.class} {item.division}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.rollNo}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm text-center mb-0 fw-normal text-secondary-light">
                            {item.gender}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.enrollNo}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm mb-0 fw-normal text-secondary-light">
                            {item.grNo}
                          </span>
                        </td>

                        <td className="text-center">
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            <button
                              type="button"
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

export default StudentDetailsLayer;
