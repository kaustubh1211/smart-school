import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentPrintForm = () => {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("/api/student-details"); // Replace with your API endpoint
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Helper function to render fields with underlined placeholders
  const renderField = (label, value) => (
    <p>
      <strong>{label}:</strong>{" "}
      {value ? (
        <span className="underline">{value}</span>
      ) : (
        <span className="inline-block w-64 border-b border-gray-300"></span>
      )}
    </p>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100">
      {/* Print Button */}
      <div className="text-center pt-32">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Print Form
        </button>
      </div>
      <div
        className="flex items-center justify-center min-h-screen"
        id="print-container"
      >
        <div className="p-6 min-h-screen sm:max-w-4xl m-10 border-3 border-slate-900 bg-white">
          <div className="pl-5 pt-10">
            {/* Header Section */}
            <header className="text-center border-b-2 pb-4 mb-8 mt-3">
              <div className="flex justify-between items-center mb-4">
                {/* Logo Placeholder */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center">
                  <img
                    src="../../public/assets/images/school-logo.png"
                    alt=""
                  />
                  {/* <span className="text-sm text-gray-500">Logo</span> */}
                </div>
                <div>
                  <h1 className="text-2xl font-bold uppercase">
                    Shri Raghubir Prathamik Vidyalaya
                  </h1>
                  <p className="text-md">
                    Yadav Nagar, Boisar (East), Palghar - 401504, Maharashtra
                  </p>
                </div>
                <div className="w-20 h-20"></div>
              </div>
              <div className="text-red-600 text-xl font-semibold">
                Admission Form
              </div>
            </header>

            {/* Form Content */}
            <div className="rounded-lg p-8">
              {/* Student Photo and "To Principal" Section */}
              <div className="flex justify-between items-start mb-8">
                <p className="pt-3">
                  <strong>To,</strong>
                  <br />
                  The Principal,
                  <br />
                  Shri Raghubir Prathamik Vidyalaya.
                  <br />
                  <strong>Dear Sir/Madam,</strong> Be kind to admit my
                  son/daughter/ward in your school.
                </p>
                <div className="w-32 h-40 border border-gray-300 bg-gray-100 flex items-center justify-center mr-8">
                  <span className="text-sm text-gray-500">Student Photo</span>
                </div>
              </div>

              {/* Student Details */}
              <section className="mb-10">
                <h2 className="text-lg font-extrabold underline mb-4">
                  Student Details -
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {renderField("Name", studentData?.name)}
                  {renderField("Enroll No.", studentData?.enrollNo)}
                  {renderField("Gr No.", studentData?.grNo)}
                  {renderField("Aadhar No.", studentData?.aadharNo)}
                  {renderField("Religion", studentData?.religion)}
                  {renderField("Caste", studentData?.caste)}
                  {renderField("Date of Birth", studentData?.dob)}
                  {renderField("Nationality", studentData?.nationality)}
                  {renderField("Place of Birth", studentData?.placeOfBirth)}
                </div>
              </section>

              {/* Parents Details */}
              <section className="mb-10">
                <h2 className="text-lg font-extrabold underline mb-4 mt-10">
                  Parents Details -
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {renderField("Father's Name", studentData?.fatherName)}
                  {renderField("Designation", studentData?.fatherDesignation)}
                  {renderField("Occupation", studentData?.fatherOccupation)}
                  {renderField(
                    "Annual Income",
                    studentData?.fatherAnnualIncome
                  )}
                  {renderField("Mother's Name", studentData?.motherName)}
                  {renderField("Occupation", studentData?.motherOccupation)}
                </div>
              </section>

              {/* Contact Details */}
              <section className="mb-10 flex flex-col gap-4">
                <h2 className="text-lg font-extrabold underline ">
                  Contact Details
                </h2>
                {renderField("Address", studentData?.address)}
                <div className="flex flex-row gap-4">
                  {renderField(
                    "Father's Contact No.",
                    studentData?.fatherContact
                  )}
                  {renderField(
                    "Mother's Contact No.",
                    studentData?.motherContact
                  )}
                </div>
              </section>

              {/* Declaration */}
              <section className="mb-10 mt-4">
                <h2 className="text-lg font-extrabold underline mb-4">
                  Declaration
                </h2>
                <p className="mb-4">
                  I hereby declare that all the information provided above is
                  true and correct to the best of my knowledge.
                </p>
              </section>

              {/* Signature Section */}
              <section className="mt-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p>________________________</p>
                    <p>Parent's Signature</p>
                  </div>
                  <div>
                    <p>________________________</p>
                    <p>Clerk's Signature</p>
                  </div>
                  <div>
                    <p>________________________</p>
                    <p>Principal's Signature</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPrintForm;
