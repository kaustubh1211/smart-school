import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { Search, Printer } from "lucide-react";

const StudentFeesCertificate = () => {
  const accessToken = localStorage.getItem("accessToken");
  const tenant = useSelector((state) => state.branch.tenant);
  const academicYear = useSelector((state) => state.branch.academicYear);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search students with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchStudents();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchStudents = async () => {
    setSearching(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}students/search-student`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: searchQuery,
          },
        }
      );
      setSearchResults(response.data.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.fullName);
    setShowDropdown(false);
    setError("");
    
    // Fetch certificate data
    await fetchCertificateData(student.id);
  };

  const fetchCertificateData = async (studentId) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}fee/${studentId}/fee-structure-report`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCertificateData(response.data.data);
    } catch (error) {
      console.error("Certificate fetch error:", error);
      setError("Unable to fetch fee structure. Please try again.");
      setCertificateData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintCertificate = () => {
    const element = document.getElementById("fee-certificate");
    const opt = {
      margin: 15,
      filename: `Fee_Certificate_${certificateData?.student?.fullName || "Student"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatFeeStructure = () => {
    if (!certificateData) return [];

    const { feeStructure } = certificateData;
    const fees = [];

    if (feeStructure.admissionFee > 0) {
      fees.push({ name: "Admission Fee", amount: feeStructure.admissionFee });
    }
    if (feeStructure.term1Fee > 0) {
      fees.push({ name: "Term 1 Fee", amount: feeStructure.term1Fee });
    }
    if (feeStructure.term2Fee > 0) {
      fees.push({ name: "Term 2 Fee", amount: feeStructure.term2Fee });
    }
    if (feeStructure.monthlyFee > 0) {
      fees.push({ name: "Monthly Fee", amount: feeStructure.monthlyFee });
    }
    
    // Add other fees
    if (feeStructure.others && feeStructure.others.length > 0) {
      feeStructure.others.forEach((other) => {
        fees.push({ name: other.name || "Other Fee", amount: other.amount || 0 });
      });
    }

    return fees;
  };

  return (
    <div>
      <div className="text-lg font-bold mb-3">Student Fees Certificate</div>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      <div className="card text-sm h-100 p-0 radius-12">
        {/* Search Section */}
        <div className="card-header border-bottom bg-base py-16 px-24">
          <div className="mb-3">
            <label className="form-label text-sm fw-medium text-secondary-light mb-2">
              Search Student by Name or GR Number
            </label>
            <div className="position-relative" ref={dropdownRef}>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter student name or GR number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                />
                {searching && (
                  <span className="input-group-text bg-white">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Searching...</span>
                    </div>
                  </span>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div
                  className="position-absolute w-100 bg-white border rounded shadow-lg mt-1"
                  style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}
                >
                  {searchResults.map((student) => (
                    <div
                      key={student.id}
                      className="p-3 border-bottom cursor-pointer hover:bg-gray-100"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStudentSelect(student)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold text-dark">{student.fullName}</div>
                          <div className="text-muted small">
                            GR No: {student.grNo} | Enroll No: {student.enrollNo}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="badge bg-primary">{student.className}</div>
                          {student.division && (
                            <div className="text-muted small mt-1">Div: {student.division}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                <div className="position-absolute w-100 bg-white border rounded shadow-lg mt-1 p-3 text-center text-muted">
                  No students found
                </div>
              )}
            </div>
          </div>

          {selectedStudent && (
            <div className="alert alert-info mb-0">
              <strong>Selected Student:</strong> {selectedStudent.fullName} - {selectedStudent.className}
              {selectedStudent.division && ` (Div: ${selectedStudent.division})`}
            </div>
          )}
        </div>

        {/* Certificate Section */}
        {loading ? (
          <div className="card-body p-24 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading certificate data...</p>
          </div>
        ) : certificateData ? (
          <>
            {/* Print Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handlePrintCertificate}
                className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
              >
                <Printer size={18} />
                Print Certificate
              </button>
            </div>

            {/* Certificate */}
            <div id="fee-certificate" className="card-body p-24">
              <div className="bg-white p-5" style={{ minHeight: "297mm" }}>
                {/* Header */}
                <div className="position-relative mb-5">
                  {/* School Name - Center */}
                  <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold mb-1" style={{ fontSize: "28px", fontWeight: "bold" }}>
                      Shri Raghubir High School & Junior College
                    </h1>
                    <p className="text-sm mb-1">
                      Yadav Nagar, Boisar (East), Palghar-401501, Maharashtra
                    </p>
                    <div className="border-bottom border-2 border-dark mt-3 mb-3"></div>
                  </div>

                  {/* Date - Right Corner */}
                  <div className="position-absolute top-0 end-0">
                    <p className="mb-0 fw-bold">Date: {getTodayDate()}</p>
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="text-center mb-4 mt-5">
                  <h2 className="text-xl font-bold text-decoration-underline">
                    FEE STRUCTURE CERTIFICATE
                  </h2>
                </div>

                {/* Certificate Body */}
                <div className="mb-4" style={{ lineHeight: "2", fontSize: "16px" }}>
                  <p className="mb-3 fw-bold text-center" style={{ fontSize: "18px" }}>
                    TO WHOM SO EVER IT MAY CONCERN
                  </p>

                  <p className="mb-3" style={{ textAlign: "justify", textIndent: "50px" }}>
                    This is to certify that{" "}
                    <span className="fw-bold">{certificateData.student.fullName}</span>{" "}
                    (GR No: <span className="fw-bold">{certificateData.student.grNo}</span>) is a
                    regular student of <span className="fw-bold">{certificateData.student.className}</span>
                    {certificateData.student.division && (
                      <span> Division <span className="fw-bold">{certificateData.student.division}</span></span>
                    )} for the Academic Year -{" "}
                    <span className="fw-bold">{certificateData.student.academicYearName}</span>.
                  </p>

                  <p className="mb-4">The details of Yearly fees is as follows:</p>
                </div>

                {/* Fee Structure Table */}
                <div className="mb-5">
                  <table className="table table-bordered" style={{ width: "100%" }}>
                    <thead>
                      <tr className="bg-light">
                        <th className="text-center py-3" style={{ width: "10%" }}>Sr. No.</th>
                        <th className="text-start py-3" style={{ width: "60%" }}>Particulars</th>
                        <th className="text-end py-3" style={{ width: "30%" }}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formatFeeStructure().map((fee, index) => (
                        <tr key={index}>
                          <td className="text-center py-3">{index + 1}</td>
                          <td className="text-start py-3">{fee.name}</td>
                          <td className="text-end py-3">{fee.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="fw-bold bg-light">
                        <td className="text-center py-3" colSpan="2">
                          TOTAL YEARLY FEES
                        </td>
                        <td className="text-end py-3">
                          ₹ {certificateData.feeStructure.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer - Signatures */}
                <div className="mt-5 pt-5">
                  <div className="d-flex justify-content-between align-items-end">
                    {/* Clerk Signature */}
                    <div className="text-center" style={{ width: "40%" }}>
                      <div className="border-top border-dark pt-2 mt-5">
                        <p className="mb-0 fw-bold">Clerk</p>
                      </div>
                    </div>

                    {/* Head Master Signature */}
                    <div className="text-center" style={{ width: "40%" }}>
                      <div className="border-top border-dark pt-2 mt-5">
                        <p className="mb-0 fw-bold">Head Master</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* School Stamp Note */}
                <div className="text-center mt-5 pt-3">
                  <p className="text-muted small fst-italic">
                    * This is a computer-generated certificate *
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card-body p-24 text-center text-muted">
            <p>Please search and select a student to generate the fee certificate</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeesCertificate;