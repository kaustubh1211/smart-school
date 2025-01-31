import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const StudentListLayer = () => {
  // access token
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [fetchClass, setFetchClass] = useState([]);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();
  // state for fetching the data when the page reloads
  // const [studentDetail, setStudentDetail] = useState({}); // studentDetail is an object
  const [stats, setStats] = useState([]);

  // state variable for when no users are found
  const [error, setError] = useState("");

  // increment studentDetail.currentPage for pagination

  // inputValid
  const [isInputValid, seIsInputValid] = useState(true);

  // state to send the data to the api
  const [formData, setFormData] = useState({
    class: "",
    division: "",
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

  // useEffect for fetching class
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
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
  }, [tenant, academicYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }students/statistics?medium=${tenant}&year=${academicYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              class: formData.class,
              division: formData.division,
              search_string: formData.search_string,
            },
          }
        );
        setStats(response.data.data);
        // setBtnClicked(false);
      } catch (error) {
        setError("Unable to fetch students. Please try again later.");
      }
    };
    fetchData();
  }, [btnClicked, tenant, academicYear]); // Only triggers when page or manualFetch changes

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setBtnClicked(!btnClicked);
  };

  const handleStudentInDetail = (std, div) => {
    console.log("handle");
    console.log(std);
    console.log(div);
    // console.log(id);
    navigate(`/student/search/${std}/${div}`);
  };

  // console.log(`totalPages ${studentData.totalPages}`);
  // console.log(`Page ${page}`);

  return (
    <div>
      <div className="text-lg font-bold mb-3">Students Details</div>
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-x-2 gap-y-4">
            <span className="text-sm fw-medium text-secondary-light mb-0">
              Class
            </span>
            {/* class */}
            <select
              className="form-select form-select-sm w-auto ps-12 py-1 radius-12 h-36-px"
              name="class"
              id="class-select"
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
            <div className="flex flex-row align-items-center sm:flex-row items-start sm:items-center gap-2">
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
                  placeholder="Search by Enroll/Gr No."
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
            <table className="table-bordered-custom sm-table mb-0">
              <thead>
                <tr>
                  {/* <th className="text-center text-sm" scope="col">
                    division
                  </th> */}
                  <th className="text-center text-sm" scope="col">
                    Standard
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Division
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Girl
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Boy
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Total
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
                    <td colSpan="6" className="text-red-500 text-center">
                      {error}
                    </td>
                  </tr>
                ) : stats.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-blue-500 font-bold text-center"
                    >
                      No user Exists
                    </td>
                  </tr>
                ) : (
                  <>
                    {stats.flatMap((standardItem) => [
                      // Standard with first division row
                      <tr key={`${standardItem.standard}-main`}>
                        <td>{standardItem.standard}</td>
                        <td>{standardItem.divisions[0].division}</td>
                        <td>{standardItem.divisions[0].girls}</td>
                        <td>{standardItem.divisions[0].boys}</td>
                        <td>{standardItem.divisions[0].total}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              handleStudentInDetail(
                                standardItem.standard,
                                standardItem.divisions[0].division
                              )
                            }
                            className="text-blue-500"
                          >
                            View
                          </button>
                        </td>
                      </tr>,
                      // Additional division rows if any
                      ...standardItem.divisions.slice(1).map((divisionItem) => (
                        <tr
                          key={`${standardItem.standard}-${divisionItem.division}`}
                        >
                          <td>{standardItem.standard}</td>
                          <td>{divisionItem.division}</td>
                          <td>{divisionItem.girls}</td>
                          <td>{divisionItem.boys}</td>
                          <td>{divisionItem.total}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() =>
                                handleStudentInDetail(
                                  standardItem.standard,
                                  divisionItem.division
                                )
                              }
                              className="text-blue-500"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )),
                      // Total row for each standard
                      <tr
                        key={`${standardItem.standard}-total`}
                        className="bg-gray-50"
                      >
                        <td colSpan="2" className="font-bold text-slate-900">
                          Total ({standardItem.standard})
                        </td>
                        <td className="text-slate-900 font-bold">
                          {standardItem.totalGirls}
                        </td>
                        <td className="font-bold">{standardItem.totalBoys}</td>
                        <td className="font-bold">
                          {standardItem.totalStudents}
                        </td>
                        <td></td>
                      </tr>,
                    ])}
                    {/* Grand Total Row */}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan="2">GRAND TOTAL</td>
                      <td>
                        {stats.reduce((sum, item) => sum + item.totalGirls, 0)}
                      </td>
                      <td>
                        {stats.reduce((sum, item) => sum + item.totalBoys, 0)}
                      </td>
                      <td>
                        {stats.reduce(
                          (sum, item) => sum + item.totalStudents,
                          0
                        )}
                      </td>
                      <td></td>
                    </tr>
                  </>
                )}
                {/* mapping logic ends here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListLayer;
