import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDownToLine } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
const EditFeeStructureLayer = () => {
  const { id } = useParams();
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);
  const accessToken = localStorage.getItem("accessToken");

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  // state variable for when no users are found
  const [error, setError] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        setError("Sorry something went wrong, try again after some time");
      }
    };
    fetchData();
  }, [btnClicked]);

  return (
    <div>
      {" "}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="text-xl font-bold text-slate-800 text-secondary-light mb-0 whitespace-nowrap">
          Fee Structure
        </div>
      </div>
      {/* <div className="text-lg font-bold mt-3 mb-3">Income List</div> */}
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-3">
            <span className="text-sm fw-medium text-secondary-light mb-0">
              From
            </span>
            <div>
              <input
                type="text"
                name="class"
                value={`${id} ${""}(${tenant.split("-")[1]})`}
                className="form-control"
                readOnly
              />
            </div>
          </div>

          <div className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 hover:cursor-pointer ">
            Add Fee
          </div>
        </div>
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <div className="font-bold text-slate-900 text-md mb-28">
              Fee Structure Detail
            </div>
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    Installment Name
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Fee Head
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Amount
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Is Optional
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
                    <td colSpan="5" className="text-red-500 text-center">
                      {error}
                    </td>
                  </tr>
                ) : setData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-blue-500 font-bold text-center"
                    >
                      No Fee Structure exists
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => {
                    return (
                      <tr key={item.index}>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFeeStructureLayer;
