import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const FeeStructureLayer = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [classData, setClassData] = useState([]);

  // handle navigate with id
  const handleNavigate = (id) => {
    navigate(`/edit/fee/structure/${id}`);
  };

  // state variable for when no users are found
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
        setClassData(response.data.data);
      } catch (error) {
        setError("Sorry try after some time, something went wrong");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mt-4 mb-4">
        <div className="text-lg font-bold text-slate-800 text-secondary-light mb-0 whitespace-nowrap">
          Fee Structure List
        </div>
      </div>
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="bg-base px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between"></div>
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table-bordered-custom sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    Sr No.
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Structure Name
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Academic Year
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Edit
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
                ) : classData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-blue-500 font-bold text-center"
                    >
                      No Fee Structure exists
                    </td>
                  </tr>
                ) : (
                  classData.map((item, index) => {
                    return (
                      <tr key={item.index}>
                        <td>{index + 1}</td>
                        <td>
                          {item.class} {""}({tenant.split("-")[1]})
                        </td>
                        <td>{academicYear}</td>

                        <td className="text-center">
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            <button
                              type="button"
                              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-28-px h-28-px d-flex justify-content-center align-items-center rounded-circle"
                              onClick={() => handleNavigate(item.class)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeStructureLayer;
