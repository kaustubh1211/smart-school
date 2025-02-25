import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "../components/ui/Toast";
import { useRef } from "react";
import { SquareMinus, SquarePlus } from "lucide-react";

const FeesRecordLayer = () => {
  // access token
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  const [year, setYear] = useState("2024-2025");

  // get student Data
  const [studentData, setstudentData] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    details: [],
  });

  const [classId, setClassId] = useState({ id: "" });
  const [selectStudentId, setSelectStudentId] = useState("");

  const [feeStructure, setFeeStructure] = useState([]);

  const [fetchClass, setFetchClass] = useState([]);

  // state variable for when no users are found
  const [apiError, setApiError] = useState("");

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

  const prevTenant = useRef(tenant);
  const prevAcademicYear = useRef(academicYear);

  useEffect(() => {
    // Check if either value has changed
    if (
      prevTenant.current !== tenant ||
      prevAcademicYear.current !== academicYear
    ) {
      console.log("Values changed, reloading page...");
      window.location.reload();
    }

    // Update refs with current values
    prevTenant.current = tenant;
    prevAcademicYear.current = academicYear;
  }, [tenant, academicYear]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  // Update handleInputChange to clear error when changing class
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field based on the input name
    }));

    // Additional logic for class selection
    if (name === "class") {
      const selectedOptionId = event.target.selectedOptions[0]?.id;
      setClassId(selectedOptionId);
      setApiError(""); // Clear error when changing class
      console.log("Selected Class Value:", value);
      console.log("Selected Class ID:", selectedOptionId);
    }

    // Debugging: Log the updated formData
    console.log("Updated formData:", formData);
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

  // fetch student data in student select option
  const handleOnSubmit = async () => {
    setFeeStructure([]);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_LOCAL_API_URL}students/list-student-branchwise`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            classId: formData.class,
            division: formData.division,
            search_string: formData.search_string,
            mediumName: tenant,
            academicYearName: academicYear,
          },
        }
      );
      setstudentData(response.data.data);
    } catch (error) {
      // setError("Unable to fetch students. Please try again later.");
    }
  };

  // Modify the useEffect for fetching fee structure
  useEffect(() => {
    const feeDetail = async () => {
      // Only make the API call if both classId and selectStudentId are available
      if (classId && selectStudentId) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_LOCAL_API_URL
            }fee/fees-details/${selectStudentId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              params: {
                academicYear: year,
              },
            }
          );
          setFeeStructure(response.data.data);
          if (response.data.data.studentDetails) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              class: response.data.data.studentDetails.classId,
              division: response.data.data.studentDetails.division,
            }));
          }
          setApiError("");
        } catch (error) {
          setApiError("Unable to fetch Structure. Please try again later.");
          setFeeStructure([]); // Clear fee structure on error
        }
      } else {
        // Don't show error message when component first loads
        setFeeStructure([]);
        if (btnClicked) {
          setApiError("Please select both class and student.");
        }
      }
    };
    feeDetail();
  }, [btnClicked, year, selectStudentId]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectStudentId(selectedValue);
    setApiError(""); // Clear error when selecting new student
    setBtnClicked(!btnClicked);
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [rowValues, setRowValues] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Update rowValues when selectedRows changes
  useEffect(() => {
    if (selectedRows.length > 0) {
      const totalAmount = selectedRows.reduce(
        (sum, row) => sum + Number(row.amount), // Sum only selected rows
        0
      );

      setRowValues([
        {
          id: selectedRows.map((row) => row.id).join(","),
          modeOfPayment: "cash",
          paymentDate: "",
          instrNo: "",
          instrName: "",
          remark: "",
          selectedFees: selectedRows,
          totalAmount: totalAmount,
        },
      ]);
    } else {
      setRowValues([]);
    }
  }, [selectedRows]);

  // Handle select all checkbox change
  const handleSelectAll = (e) => {
    if (role !== "SUPER_ADMIN") {
      Toast.showErrorToast("Admin don't have access");
      return;
    }

    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Filter out already paid fees from both one-time and monthly fees
      const unpaidOneTimeFees = groupedOneTimeFees.fees.filter(
        (fee) => !fee.paid
      );
      const unpaidMonthlyFees = monthlyFees.filter((fee) => !fee.paid);
      const allUnpaidFees = [...unpaidOneTimeFees, ...unpaidMonthlyFees];

      setSelectedRows(allUnpaidFees);
    } else {
      setSelectedRows([]);
    }
  };

  const handleFeesInputChange = (field, value) => {
    setRowValues((prevValues) =>
      prevValues.map((row) => ({ ...row, [field]: value }))
    );
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (item) => {
    if (role !== "SUPER_ADMIN") {
      Toast.showErrorToast("Admin don't have access");
      return;
    }

    // Only allow selection of unpaid fees
    if (item.paid) return;

    setSelectedRows((prevRows) => {
      const isSelected = prevRows.some((row) => row.id === item.id);

      if (isSelected) {
        const newRows = prevRows.filter((row) => row.id !== item.id);
        // Update selectAll state based on whether all unpaid fees are selected
        const unpaidFees = feeStructure.feesStructure.filter(
          (fee) => !fee.paid
        );
        setSelectAll(newRows.length === unpaidFees.length);
        return newRows;
      } else {
        const newRows = [...prevRows, item];
        // Update selectAll state based on whether all unpaid fees are selected
        const unpaidFees = feeStructure.feesStructure.filter(
          (fee) => !fee.paid
        );
        setSelectAll(newRows.length === unpaidFees.length);
        return newRows;
      }
    });
  };

  const handleFeesSubmit = async () => {
    if (rowValues.length === 0) return;

    // Prepare the payload for all selected fees
    const formDataArray = rowValues[0].selectedFees.map((selectedFee) => ({
      classId,
      feeTypeName: selectedFee.feeTypeName,
      installmentType: selectedFee.installmentType,
      studentId: selectStudentId,
      amount: selectedFee.amount,
      modeOfPayment: rowValues[0].modeOfPayment,
      paymentDate: rowValues[0].paymentDate,
      instrNo: rowValues[0].instrNo,
      instrName: rowValues[0].instrName,
      remark: rowValues[0].remark,
    }));

    try {
      console.log(formDataArray);
      const fees = {
        fees: formDataArray,
      };
      console.log("fees" + fees);
      const response = await axios.post(
        `${
          import.meta.env.VITE_LOCAL_API_URL
        }fee/collect-student-fees?mediumName=${tenant}&academicYearName=${year}`,
        fees,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Toast.showSuccessToast("Fees added successfully!");
      setSelectedRows([]);
      setRowValues([]);
      setSelectAll(false);
      setBtnClicked(!btnClicked);
    } catch (error) {
      console.error("Error submitting data:", error);
      Toast.showErrorToast(`${error.response.data.message}`);
      setBtnClicked(!btnClicked);
    }
  };

  // some changes
  const [expandedGroups, setExpandedGroups] = useState({});

  // Function to group one-time fees
  const groupOneTimeFees = (fees) => {
    const oneTimeFees = fees.filter(
      (fee) => fee.installmentType === "One time"
    );
    const monthlyFees = fees.filter(
      (fee) => fee.installmentType === "Monthly fee"
    );

    const groupedOneTimeFees = {
      installmentType: "One time",
      fees: oneTimeFees,
      totalAmount: oneTimeFees.reduce(
        (sum, fee) => sum + Number(fee.amount),
        0
      ),
    };

    return {
      groupedOneTimeFees,
      monthlyFees,
    };
  };

  const { groupedOneTimeFees, monthlyFees } = groupOneTimeFees(
    feeStructure.feesStructure || []
  );

  const toggleGroup = (installmentType) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [installmentType]: !prev[installmentType],
    }));
  };

  // Handle group checkbox change for one-time fees
  const handleGroupCheckboxChange = (group) => {
    const allUnpaidFeesSelected = group.fees
      .filter((fee) => !fee.paid) // Only consider unpaid fees
      .every((fee) => selectedRows.some((row) => row.id === fee.id));

    if (allUnpaidFeesSelected) {
      // Deselect all unpaid fees in the group
      setSelectedRows((prevRows) =>
        prevRows.filter((row) => !group.fees.some((fee) => fee.id === row.id))
      );
    } else {
      // Select only unpaid fees in the group
      const unpaidFeesInGroup = group.fees.filter((fee) => !fee.paid);
      setSelectedRows((prevRows) => [
        ...prevRows,
        ...unpaidFeesInGroup.filter(
          (fee) => !prevRows.some((row) => row.id === fee.id)
        ),
      ]);
    }
  };

  // Function to check if all sub-rows in the "One-time Fees" group are paid
  const areAllOneTimeFeesPaid = (group) => {
    return group.fees.every((fee) => fee.paid);
  };

  return (
    <div>
      <div className="text-lg font-bold mb-3">Students Details</div>
      <div className="card text-sm h-100 p-0 radius-12">
        <div className="card-header  border-0 bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-x-2 gap-y-4">
            <span className="text-sm fw-medium text-secondary-light mb-0">
              Class
            </span>

            <select
              className="form-select form-select-sm w-auto ps-12 py-1 radius-12 h-36-px"
              name="class"
              id="class-select"
              value={formData.class}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              {fetchClass.map((item) => (
                <option id={item.id} key={item.id} value={item.id}>
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
        {/* search option */}
        <div className="card-header bg-base py-16 px-20 flex flex-row items-center sm:gap-20 gap-2 justify-between">
          <div className="flex items-center gap-3 w-full">
            <span className="text-sm font-medium text-secondary-light">
              Students
            </span>
            <select
              className="form-select form-select-sm sm:w-full px-4 py-2 rounded-lg h-9"
              name="division"
              onChange={handleSelectChange}
            >
              <option value="">Select</option>
              {studentData.details.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.firstName} {item.fatherName} {item.lastName} {""}
                  {`#GRNO : ${item.grNo}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-row justify-between px-24 mt-20">
          <h3 className="mt-20 text-slate-700 font-bold text-lg">
            {`Fees Details : ${year}`}
          </h3>
          <div className="flex flex-row items-center align-middle gap-x-2 text-slate-700 font-bold text-lg">
            <div className="text-lg font-bold text-slate-700 mb-0">Year :</div>
            <select
              className="form-select form-select-sm w-auto ps-12 py-1 radius-12 h-36-px text-md font-bold"
              name="year"
              value={year}
              onChange={handleYearChange}
            >
              {/* <option defaultValue={year} value={year}>{`${year}`}</option> */}
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>
        </div>
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table-bordered-custom sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center text-sm" scope="col">
                    <input
                      type="checkbox"
                      className="w-5 h-5 appearance-none rounded-md border-2 border-neutral-300 bg-gray-100 hover:cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Particulars
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Due Date
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Amount
                  </th>
                  <th className="text-center text-sm" scope="col">
                    Paid
                  </th>
                  <th className="text-center text-sm" scope="col"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-center">
                {!classId || !selectStudentId ? (
                  <tr>
                    <td colSpan="10" className="text-gray-500 text-center">
                      Please select both class and student to view fees
                    </td>
                  </tr>
                ) : apiError ? (
                  <tr>
                    <td colSpan="10" className="text-red-500 text-center">
                      {apiError}
                    </td>
                  </tr>
                ) : !feeStructure.feesStructure ||
                  feeStructure.feesStructure.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-blue-500 font-bold text-center"
                    >
                      No fees exist for this student
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Render grouped one-time fees */}
                    <tr>
                      <td>
                        {!areAllOneTimeFeesPaid(groupedOneTimeFees) && (
                          <input
                            type="checkbox"
                            className="w-5 h-5 appearance-none rounded-md border-2 border-neutral-300 bg-gray-100 hover:cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center"
                            checked={groupedOneTimeFees.fees
                              .filter((fee) => !fee.paid) // Only consider unpaid fees
                              .every((fee) =>
                                selectedRows.some((row) => row.id === fee.id)
                              )}
                            onChange={() =>
                              handleGroupCheckboxChange(groupedOneTimeFees)
                            }
                          />
                        )}
                      </td>
                      <td>One-time Fees</td>
                      <td>DEFAULT</td>
                      <td className="bg-blue-200">
                        {groupedOneTimeFees.totalAmount}
                      </td>
                      <td className="bg-green-200">
                        {groupedOneTimeFees.fees
                          .filter((fee) => fee.paid) // Filter fees where paid is true
                          .reduce(
                            (sum, fee) => sum + Number(fee.amount),
                            0
                          )}{" "}
                      </td>
                      <td>
                        {" "}
                        <button
                          onClick={() => toggleGroup("One time")}
                          className="ml-2"
                        >
                          {expandedGroups["One time"] ? (
                            <SquareMinus size={20} />
                          ) : (
                            <SquarePlus size={20} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedGroups["One time"] &&
                      groupedOneTimeFees.fees.map((fee) => (
                        <tr key={fee.id} style={{ backgroundColor: "#ffffcc" }}>
                          <td>
                            {fee.paid ? (
                              ""
                            ) : (
                              <input
                                type="checkbox"
                                className="w-5 h-5 appearance-none rounded-md border-2 border-neutral-300 bg-gray-100 hover:cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center"
                                checked={selectedRows.some(
                                  (row) => row.id === fee.id
                                )}
                                onChange={() => handleCheckboxChange(fee)}
                              />
                            )}
                          </td>
                          <td>{fee.feeTypeName}</td>
                          <td>{fee.date.split("T")[0]}</td>
                          <td className="bg-blue-200">{fee.amount}</td>
                          <td className="bg-green-200">
                            {fee.paid ? fee.amount : "0"}
                          </td>
                          <td></td>
                        </tr>
                      ))}

                    {/* Render monthly fees as individual rows */}
                    {monthlyFees.map((fee) => (
                      <tr key={fee.id}>
                        <td>
                          {fee.paid ? (
                            ""
                          ) : (
                            <input
                              type="checkbox"
                              className="w-5 h-5 appearance-none rounded-md border-2 border-neutral-300 bg-gray-100 hover:cursor-pointer checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:justify-center checked:before:items-center"
                              checked={selectedRows.some(
                                (row) => row.id === fee.id
                              )}
                              onChange={() => handleCheckboxChange(fee)}
                            />
                          )}
                        </td>
                        <td>{fee.feeTypeName}</td>
                        <td>{fee.date.split("T")[0]}</td>
                        <td className="bg-blue-200">{fee.amount}</td>
                        <td className="bg-green-200">
                          {fee.paid ? fee.amount : "0"}
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
            {/* Payment Details Section */}
            <h3 className="mt-20 text-slate-700 font-bold text-lg mb-4">
              Payment Details
            </h3>

            <div>
              <table className="table-auto w-full border border-gray-400 border-collapse">
                <thead className="bg-slate-100 border border-gray-400">
                  <tr>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Party
                    </th>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Mode
                    </th>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Amount
                    </th>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Payment Date
                    </th>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Instr No.
                    </th>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Instr Name
                    </th>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Remark
                    </th>
                    <th className="border px-6 py-3 text-center text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowValues.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="text-center px-4 py-3 font-medium">
                        Default
                      </td>
                      <td className="border border-gray-400 text-center px-4 py-3">
                        <select
                          className="form-select text-sm border border-gray-300 flex justify-center text-center align-middle h-8 rounded w-full"
                          value={row.modeOfPayment}
                          onChange={(e) =>
                            handleFeesInputChange(
                              "modeOfPayment",
                              e.target.value
                            )
                          }
                        >
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                        </select>
                      </td>
                      <td className="border border-gray-400 text-center px-4 py-4">
                        {row.selectedFees.reduce(
                          (sum, fee) => sum + Number(fee.amount),
                          0
                        )}
                      </td>
                      <td className="border border-gray-400 text-center px-4 py-3">
                        <input
                          type="date"
                          className="border border-gray-300 p-2 rounded w-full"
                          value={row.paymentDate}
                          onChange={(e) =>
                            handleFeesInputChange("paymentDate", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-3">
                        <input
                          type="text"
                          className="border border-gray-300 p-2 rounded w-full"
                          placeholder="Instr No."
                          value={row.instrNo}
                          onChange={(e) =>
                            handleFeesInputChange("instrNo", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-3">
                        <input
                          type="text"
                          className="border border-gray-300 p-2 rounded w-full"
                          placeholder="Instr Name"
                          value={row.instrName}
                          onChange={(e) =>
                            handleFeesInputChange("instrName", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-3">
                        <input
                          type="text"
                          className="border border-gray-300 p-2 rounded w-full"
                          placeholder="Remark"
                          value={row.remark}
                          onChange={(e) =>
                            handleFeesInputChange("remark", e.target.value)
                          }
                        />
                      </td>
                      <td className="border border-gray-400 text-center px-4 py-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
                          onClick={handleFeesSubmit}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesRecordLayer;
