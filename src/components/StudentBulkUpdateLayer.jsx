import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const StudentBulkUpdate = () => {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [fetchClass, setFetchClass] = useState([]);

  const [classSelected, setClassSelected] = useState("");
  const [division, setDivision] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const fields = [
    { name: "Firstname", id: "firstName" },
    { name: "Lastname", id: "lastName" },
    { name: "Roll No", id: "rollNo" },
    { name: "Date of Birth", id: "dob" },
    { name: "Father Phone No.", id: "fatherPhone" },
    { name: "Mother Phone No.", id: "MotherPhone" },
    { name: "Father Name", id: "fatherName" },
    { name: "Mother Name", id: "motherName" },
    { name: "Father Email", id: "fatherEmail" },
    { name: "Mother Email", id: "MotherEmail" },
  ];

  // for fetching class
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
  }, [academicYear, tenant]);

  const handleSubmit = async () => {
    console.log(classSelected);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }admin/get-studentdetails-input?mediumName=${tenant}&academicYearName=${academicYear}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            class: classSelected,
            division: division,
            fields: selectedFields.join(","), // Join the array into a comma-separated string
          },
        }
      );
      console.log(response.data);
      setStudentData(response.data.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleFieldChange = (fieldId) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

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
              value={classSelected}
              onChange={(e) => setClassSelected(e.target.value)}
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
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            >
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        <div className="text-md font-semibold pl-5 pt-10">Fields</div>

        <div className="card-body p-24">
          <div className="flex flex-row flex-wrap gap-x-10 gap-y-7">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={field.id}
                  className="w-5 h-5 appearance-none rounded-md border-2 border-neutral-300 bg-gray-100 hover:cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
                  checked={selectedFields.includes(field.id)}
                  onChange={() => handleFieldChange(field.id)}
                />
                <label htmlFor={field.id} className="text-sm">
                  {field.name}
                </label>
              </div>
            ))}
          </div>

          {/* {studentData.length > 0 && (
            <div className="table-responsive scroll-sm mt-4">
              <table className="table-bordered-custom sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-center text-sm">SrNo</th>
                    {selectedFields.map((field) => (
                      <th key={field} className="text-center text-sm">
                        {fields.find((f) => f.id === field)?.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-center">
                  {studentData.map((student, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {selectedFields.map((field) => (
                        <td key={field}>
                          <input
                            type="text"
                            value={student[field] || ""}
                            onChange={(e) =>
                              handleInputChange(index, field, e.target.value)
                            }
                            className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full resize outline-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )} */}
          {/* <div className="card-body p-24">
            <div className="table-responsive scroll-sm">
              <table className="table-bordered-custom sm-table mb-0">
                <thead>
                  <tr>
                    <th className="text-center text-sm">Sr.No</th>
                    <th className="text-center text-sm">Student Name</th>
                    {studentData.length > 0 &&
                      Object.keys(studentData[0])
                        .filter((key) => key !== "fullName")
                        .map((key) => (
                          <th key={key} className="text-center text-sm">
                            {key}
                          </th>
                        ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-center">
                  {studentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-blue-500 font-bold text-center"
                      >
                        No user exists
                      </td>
                    </tr>
                  ) : (
                    studentData.map((student, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{student.fullName}</td>
                        {Object.keys(student)
                          .filter((key) => key !== "fullName")
                          .map((key) => (
                            <td key={key}>
                              <input
                                type="text"
                                value={student[key]}
                                onChange={(e) =>
                                  handleInputChange(e, index, key)
                                }
                                className="input-field"
                              />
                            </td>
                          ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div> */}
          <div className="card-body p-24">
            {studentData.length === 0 ? (
              <p className="text-blue-500 font-bold text-center">
                No students available
              </p>
            ) : (
              <div className="table-responsive scroll-sm">
                <table className="table-bordered-custom sm-table mb-0">
                  <thead>
                    <tr>
                      <th className="text-center text-sm">Sr.No</th>
                      <th className="text-center text-sm">Full Name</th>
                      <th className="text-center text-sm">Enroll No</th>
                      {/* Dynamically render table headers */}
                      {Object.keys(studentData[0])
                        .filter(
                          (key) => !["fullName", "enrollNo"].includes(key)
                        )
                        .map((key) => (
                          <th key={key} className="text-center text-sm">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-center">
                    {studentData.map((student, index) => (
                      <tr key={student.enrollNo || index}>
                        <td>{index + 1}</td>
                        <td>{student.fullName}</td>
                        <td>{student.enrollNo}</td>
                        {/* Render editable inputs for all fields except 'fullName' and 'enrollNo' */}
                        {Object.keys(student)
                          .filter(
                            (key) => !["fullName", "enrollNo"].includes(key)
                          )
                          .map((key) => (
                            <td key={key}>
                              <input
                                type="text"
                                value={student[key]}
                                onChange={(e) =>
                                  handleInputChange(e, index, key)
                                }
                                className="form-control"
                              />
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={sendUpdatedDataToBackend}
                  className="btn btn-primary mt-4"
                >
                  Update Student Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBulkUpdate;
