import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Toast from "../components/ui/Toast";
import axios from "axios";

const StudentBulkUpdate = () => {
  const accessToken = localStorage.getItem("accessToken");
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
    { name: "Mother Phone No.", id: "motherPhone" },
    { name: "Father Name", id: "fatherName" },
    { name: "Mother Name", id: "motherName" },
    { name: "Father Email", id: "fatherEmail" },
    { name: "Mother Email", id: "motherEmail" },
  ];

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
        setFetchClass(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClassData();
  }, [academicYear, tenant]);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_API_URL
        }admin/get-studentdetails-input?mediumName=${tenant}&academicYearName=${academicYear}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            class: classSelected,
            division: division,
            fields: selectedFields.join(","),
          },
        }
      );

      const studentDetails = response.data.data.map((student) => {
        const updatedFields = selectedFields.reduce((acc, field) => {
          acc[field] = student[field] || ""; // Pre-fill the updatedFields with the current values
          return acc;
        }, {});

        return {
          ...student,
          updatedFields, // Ensure updated fields are prefilled
        };
      });

      setStudentData(studentDetails);
    } catch (error) {
      console.error("Error fetching student data:", error);
      Toast.showErrorToast(`${error.response.data.message}`);
    }
  };

  const handleFieldChange = (fieldId) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleInputChange = (e, index, key) => {
    const { value } = e.target;
    setStudentData((prev) =>
      prev.map((student, idx) =>
        idx === index
          ? {
              ...student,
              updatedFields: { ...student.updatedFields, [key]: value },
            }
          : student
      )
    );
  };

  const sendUpdatedDataToBackend = async () => {
    try {
      const updates = studentData
        .map((student) => ({
          id: student.id,
          updates: Object.fromEntries(
            Object.entries(student.updatedFields).filter(
              ([_, value]) => value !== "" && value !== student[_.key]
            )
          ),
        }))
        .filter((student) => Object.keys(student.updates).length > 0); // Only include students with updates

      if (updates.length > 0) {
        await axios.post(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }admin/update-studentDetails-bulk`,
          { updates },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        Toast.showSuccessToast("Student details updated successfully!");
      } else {
        Toast.showErrorToast("No changes made to the student details.");
      }
    } catch (error) {
      console.error("Error updating student details:", error);
    }
  };

  return (
    <div>
      <div className="text-lg font-bold mb-3">Students Details</div>
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-x-2 gap-y-4">
            <span className="text-sm fw-medium text-secondary-light mb-0">
              Class
            </span>
            <select
              className="form-select form-select-sm w-auto ps-3 py-1 radius-12 h-36-px"
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
                  className="w-5 h-5 appearance-none  rounded-md border-2 border-neutral-300 bg-gray-100 hover:cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center"
                  checked={selectedFields.includes(field.id)}
                  onChange={() => handleFieldChange(field.id)}
                />
                <label htmlFor={field.id} className="text-sm">
                  {field.name}
                </label>
              </div>
            ))}
          </div>

          {studentData.length === 0 ? (
            <p className="text-blue-500 font-bold text-center mt-32">
              No students available
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div className="table-responsive overflow-x-auto scroll-sm mt-4">
                <table className="table-bordered-custom sm-table mb-0 overflow-x-auto">
                  <thead>
                    <tr>
                      <th className="text-center text-sm">Sr.No</th>
                      <th className="text-center text-sm">Full Name</th>
                      <th className="text-center text-sm">Enroll No</th>
                      {selectedFields.map((field) => (
                        <th key={field} className="text-center text-sm">
                          {fields.find((f) => f.id === field)?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-center overflow-x-auto">
                    {studentData.map((student, index) => (
                      <tr key={student.id || index}>
                        <td>{index + 1}</td>
                        <td>{student.fullName}</td>
                        <td>{student.enrollNo}</td>
                        {selectedFields.map((field) => (
                          <td key={field}>
                            <input
                              type="text"
                              value={student.updatedFields[field] || ""}
                              onChange={(e) =>
                                handleInputChange(e, index, field)
                              }
                              className="bg-base border border-gray-300 rounded pl-10 pr-3 h-10 w-full resize outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end items-end">
                  <button
                    onClick={sendUpdatedDataToBackend}
                    className=" bg-blue-600 px-28 py-12 text-white text-md rounded-md hover:bg-blue-700 mt-4"
                  >
                    Update Student Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentBulkUpdate;
