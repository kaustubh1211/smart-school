import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const BonafiedPrintPage = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);

  const [studentData, setStudentData] = useState({});
  const { id } = useParams(); // Grab id from URL

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd-MM-yyyy");
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }students/bonafied-download/${id}`,
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

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    // <div className="max-w-3xl mx-auto p-8 bg-white">
    //   {/* Print Button */}
    //   <div className="text-center pt-32 pb-20">
    //     <button
    //       onClick={() => window.print()}
    //       className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    //     >
    //       Print Form
    //     </button>
    //   </div>
    //   <div className="relative p-36 " id="print-container">
    //     {/* Border Pattern */}
    //     <div className="absolute inset-0 border-4 border-gray-800 m-1"></div>

    //     {/* Header */}
    //     <div className="flex items-center justify-between mb-6">
    //       <div className="w-20 h-20 flex items-center justify-center">
    //         <span className="text-xs">
    //           <img src="/assets/images/school-logo.png" alt="Logo" />
    //         </span>
    //       </div>

    //       <div className="text-center flex-grow">
    //         <h1 className="text-2xl font-bold text-blue-800">
    //           Shri Raghubir Prathamik Vidyalaya
    //         </h1>
    //         <p className="text-sm text-gray-600">
    //           YADAV NAGAR,BOISAR (EAST) , PALGHAR-401501,MAHARASHTRA
    //         </p>
    //       </div>

    //       <div className="w-24 h-28 bg-gray-100 border border-gray-300">
    //         {studentData.studentPhoto && (
    //           <img
    //             src={studentData.studentPhoto}
    //             alt="Student"
    //             className="w-full h-full object-cover"
    //           />
    //         )}
    //       </div>
    //     </div>

    //     {/* Certificate Details */}
    //     <div className="flex justify-between mb-4">
    //       <p className="text-sm">Sr.No. : {studentData.enrollNo}</p>
    //       <h2 className="text-xl font-bold">BONAFIDE CERTIFICATE</h2>
    //       <p className="text-sm">Issue Date : {formatDate(new Date())}</p>
    //     </div>

    //     {/* To Whom Section */}
    //     <div className="text-center mb-6">
    //       <h3 className="text-lg font-semibold underline">
    //         TO WHOM SO EVER IT MAY CONCERN
    //       </h3>
    //     </div>

    //     {/* Certificate Content */}
    //     <div className="mb-6">
    //       <p className="mb-4">
    //         This is to certify that{" "}
    //         {studentData.gender === "Male" ? "Mr." : "Ms."}{" "}
    //         <span className="underline text-lg font-bold">
    //           {studentData.firstName} {studentData.lastName}
    //         </span>{" "}
    //         is a bonafide student of the school studying in Std{" "}
    //         <span className="underline text-lg font-bold">
    //           {studentData.class} - {studentData.division}{" "}
    //         </span>{" "}
    //         during the academic year {studentData.academicYearName}
    //       </p>

    //       <p>Following is the extract from the School Register.</p>
    //     </div>

    //     {/* Student Details Table */}
    //     <div className="mb-6">
    //       <table className="w-full border-collapse">
    //         <tbody>
    //           <tr>
    //             <td className="py-1 pr-4 w-32">Enroll No.</td>
    //             <td className="py-1">: {studentData.enrollNo}</td>
    //           </tr>
    //           <tr>
    //             <td className="py-1 pr-4">GR. No.</td>
    //             <td className="py-1">: {studentData.grNo}</td>
    //           </tr>
    //           <tr>
    //             <td className="py-1 pr-4">Name</td>
    //             <td className="py-1">
    //               : {studentData.firstName} {studentData.lastName}
    //             </td>
    //           </tr>
    //           <tr>
    //             <td className="py-1 pr-4">Date of Birth</td>
    //             <td className="py-1">: {formatDate(studentData.dob)}</td>
    //           </tr>
    //           <tr>
    //             <td className="py-1 pr-4">Place of Birth</td>
    //             <td className="py-1">: BOISAR PALGHAR MAHARASHTRA INDIA</td>
    //           </tr>
    //           <tr>
    //             <td className="py-1 pr-4">Religion</td>
    //             <td className="py-1">: {studentData.religion}</td>
    //           </tr>
    //           <tr>
    //             <td className="py-1 pr-4">Caste</td>
    //             <td className="py-1">: {studentData.caste}</td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </div>

    //     {/* Purpose */}
    //     <div className="mb-8">
    //       <p>
    //         This certificate is issued at the request of guardian for AADHAR
    //         CARD purpose.
    //       </p>
    //     </div>

    //     {/* Signatures */}
    //     <div className="flex justify-between mt-16">
    //       <div className="text-center">
    //         <div className="border-t border-black w-32">
    //           <p className="pt-2">Clerk</p>
    //         </div>
    //       </div>
    //       <div className="text-center">
    //         <div className="border-t border-black w-32">
    //           <p className="pt-2">Head Master</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
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

      <div className="max-w-3xl mx-auto bg-white">
        {/* Print Button - will be hidden when printing */}
        <div className="no-print text-center py-24">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Print Certificate
          </button>
        </div>

        {/* Certificate Content - will be shown when printing */}
        <div className="print-container p-8">
          <div className="print-content relative p-32">
            {/* Border Pattern */}
            <div className="border-pattern absolute inset-0 border-4 border-gray-800 m-1"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src="/assets/images/school-logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center flex-grow px-4">
                <h1 className="text-2xl font-bold text-blue-800">
                  Shri Raghubir Prathamik Vidyalaya
                </h1>
                <p className="text-sm text-gray-600">
                  YADAV NAGAR,BOISAR (EAST) , PALGHAR-401501,MAHARASHTRA
                </p>
              </div>

              <div className="w-24 h-28 border border-gray-300 overflow-hidden">
                {studentData.studentPhoto && (
                  <img
                    src={`${import.meta.env.VITE_SERVER_BASE_URL}${
                      studentData.studentPhoto
                    }`}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Certificate Details */}
            <div className="flex justify-between mb-4">
              <p className="text-sm">Sr.No. : {studentData.enrollNo}</p>
              <h2 className="text-xl font-bold">BONAFIDE CERTIFICATE</h2>
              <p className="text-sm">Issue Date : {formatDate(new Date())}</p>
            </div>

            {/* To Whom Section */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold underline">
                TO WHOM SO EVER IT MAY CONCERN
              </h3>
            </div>

            {/* Certificate Content */}
            <div className="mb-6 text-justify">
              <p className="mb-4">
                This is to certify that{" "}
                {studentData.gender === "Male" ? "Mr." : "Ms."}{" "}
                <span className="underline font-semibold">
                  {studentData.firstName} {studentData.lastName}
                </span>{" "}
                is a bonafide student of the school studying in Std{" "}
                <span className="underline font-semibold">
                  {studentData.class} - {studentData.division}
                </span>{" "}
                during the academic year {studentData.academicYearName}
              </p>
              <p>Following is the extract from the School Register.</p>
            </div>

            {/* Student Details Table */}
            <div className="mb-6">
              <table className="w-full">
                <tbody>
                  {[
                    ["Enroll No.", studentData.enrollNo],
                    ["GR. No.", studentData.grNo],
                    [
                      "Name",
                      `${studentData.firstName} ${studentData.lastName}`,
                    ],
                    ["Date of Birth", formatDate(studentData.dob)],
                    ["Place of Birth", "BOISAR PALGHAR MAHARASHTRA INDIA"],
                    ["Religion", studentData.religion],
                    ["Caste", studentData.caste],
                  ].map(([label, value], index) => (
                    <tr key={index}>
                      <td className="py-1 pr-4 w-32">{label}</td>
                      <td className="py-1">: {value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Purpose */}
            <div className="mb-8">
              <p>
                This certificate is issued at the request of guardian for AADHAR
                CARD purpose.
              </p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-16">
              <div className="text-center">
                <div className="border-t border-black w-32">
                  <p className="pt-2">Clerk</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-black w-32">
                  <p className="pt-2">Head Master</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BonafiedPrintPage;
