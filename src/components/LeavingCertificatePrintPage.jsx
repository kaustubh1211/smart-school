import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LeavingCertificate = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);

  const [studentData, setStudentData] = useState({});
  const { id } = useParams();

  // Fetch data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}students/lc-download/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setStudentData(response.data.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 40px !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }
          .print-content {
            padding: 20px !important;
          }
          .border-pattern {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}
      </style>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        {/* Print Button - will be hidden when printing */}
        <div className="no-print text-center py-24">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Print Certificate
          </button>
        </div>
        {/* certificate content */}
        <div className="print-container w-[800px] bg-white p-8 border-2 border-black">
          {/* Header */}
          <div className="print-content text-center mb-6">
            <div className="flex justify-center items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                <img src="/assets/images/school-logo.png" alt="school-logo" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">
                  St. John English High School
                </h1>
                <p className="text-sm">
                  YASHWANT NAGAR VIRAR (EAST), PALGHAR-401501 MAHARASHTRA
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <p>Medium: {studentData.mediumName}</p>
              <p>Section: MADHYAMIK</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>Phone: 9338183838</p>
              <p>Email: stjohn.school.virar@gmail.com</p>
              <p>Website: stjohnschool.com</p>
            </div>
            <p className="text-sm">Board: STATE BOARD</p>
            <p className="text-sm">Affiliation No.: S.S.38.02.0125</p>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold underline">
              SCHOOL LEAVING CERTIFICATE
            </h2>
            <p className="text-xs mt-2">(Section III, Rule 17)</p>
          </div>

          {/* Form Content */}
          <div className="space-y-4">
            <FormRow label="Student ID No.:" value={studentData.enrollNo} />
            <FormRow label="Serial No.:" value={studentData.enrollNo} />
            <FormRow
              label="Student's Full Name:"
              value={`${studentData.firstName} ${studentData.lastName}`}
            />
            <div className="flex gap-8">
              <FormRow label="Father's Name:" value={studentData.fatherName} />
              <FormRow label="Mother's Name:" value={studentData.motherName} />
            </div>
            <div className="flex gap-8">
              <FormRow label="Nationality:" value="INDIAN" />
              <FormRow label="Mother Tongue:" value="HINDI" />
            </div>
            <div className="flex gap-8">
              <FormRow label="Religion:" value={studentData.religion} />
              <FormRow label="Caste:" value={studentData.religion} />
            </div>
            <FormRow
              label="Place of Birth (Village/City):"
              value="VIRAR EAST, MUMBAI"
            />
            <FormRow
              label="Date of Birth, Month & Year:"
              value={studentData.dob.split("T")[0]}
            />

            <FormRow
              label="Last School Attended:"
              value="UTKARSHA VIDYALAYA HIGH SCHOOL, VIRAR(WEST)"
            />
            <FormRow
              label="Last School Standard into admitted:"
              value="8TH (EIGHTH)"
            />
            <FormRow
              label="Date of Admission:"
              value={studentData.admissionDate}
            />
            <FormRow label="Progress (in studies):" value="SATISFACTORY" />
            <FormRow label="Conduct:" value="GOOD" />
            <FormRow label="Date of Leaving:" value="30-08-2024" />
            <FormRow
              label="Standard in which studying and since when:"
              value="STD 10TH (TENTH) SINCE JUNE 2024"
            />
            <FormRow label="Reason of Leaving School:" value="GUARDIAN WISH" />
            <FormRow label="Remarks:" value="PASSED STD 9TH IN APRIL 2024" />
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-between items-end">
            <div className="text-center">
              <div className="border-t border-black w-24">Class Teacher</div>
            </div>
            <div className="text-center">
              <div className="border-t border-black w-24">Clerk</div>
            </div>
            <div className="text-center">
              <div className="border-t border-black w-32">
                Head Master Stamp
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const FormRow = ({ label, value }) => (
  <div className="flex">
    <span className="min-w-48 font-medium">{label}</span>
    <span className="flex-1 border-b border-black">{value}</span>
  </div>
);

export default LeavingCertificate;
