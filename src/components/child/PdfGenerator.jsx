import axios from "axios";
import React, { useEffect, useState } from "react";
import generatePDF from "react-to-pdf";
import { useParams, useNavigate } from "react-router-dom";
import { numberToWords } from "amount-to-words";

const options = {
  filename: "receipt.pdf",
  page: {
    margin: 10,
    format: "A5",
  },
};

const getTarget = () => document.getElementById("pdf-container");

const PdfGenerator = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const [reciptDetails, setReciptDetails] = useState({});

  const amount = reciptDetails.amount;

  const downloadPdf = () => {
    generatePDF(getTarget, options);
  };

  useEffect(() => {
    async function fetchFeeReciptDetails() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_LOCAL_API_URL}fee/view-recipt/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setReciptDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching receipt details:", error.message);
      }
    }
    fetchFeeReciptDetails();
  }, [id, accessToken]);

  const handleOnClose = () => {
    navigate("/search/fees/payment");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 lg:w-1/2 h-auto rounded-lg shadow-lg flex flex-col relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Receipt Preview</h2>
        </div>
        <div className="flex justify-center p-20">
          <div
            id="pdf-container"
            className="flex flex-row justify-center text-sm font-sans max-w-md p-2"
          >
            <div className="border-2 border-slate-800 p-2">
              {/* Header */}
              <div className="flex flex-row gap-2 my-2 px-1">
                <div className="img">
                  <img
                    // src={`${import.meta.env.VITE_LOCAL_BASE_URL}${
                    //   reciptDetails.schoolLogo
                    // }`}
                    src="/assets/images/school-logo.png"
                    alt="School Logo"
                    className="md:w-20 mb-2"
                  />
                </div>
                <div className="schoolContent">
                  <h1 className="text-md text-center font-semibold">
                    {reciptDetails.schoolName || "St. John English High School"}
                  </h1>
                  <p className="text-xs pt-1 text-center text-gray-700">
                    {reciptDetails.schoolAddress ||
                      "YASHWANT NAGAR, VIRAR (EAST), PALGHAR, MAHARASHTRA"}
                  </p>
                  <p className="text-sm text-center font-semibold mt-2">
                    Academic Year:{" "}
                    {reciptDetails.student?.academicYearName || ""}
                  </p>
                </div>
              </div>

              <hr className="border-t border-slate-800" />

              {/* Details Section */}
              <div className="relative w-full">
                <div
                  className="absolute inset-0 bg-no-repeat bg-center opacity-10"
                  style={{
                    backgroundImage: reciptDetails.schoolLogo
                      ? `url(${import.meta.env.VITE_LOCAL_BASE_URL}${
                          reciptDetails.schoolLogo
                        })`
                      : `url('/assets/images/school-logo.png')`,
                    backgroundSize: "300px",
                  }}
                ></div>

                <div className="relative grid grid-cols-2 gap-2 text-left pt-3">
                  <p>
                    <span className="font-bold">Rec. No.:</span>{" "}
                    {reciptDetails.id?.split("-")[0] || ""}
                  </p>
                  <p>
                    <span className="font-bold">Rec. Date:</span>{" "}
                    {reciptDetails.paymentDate?.split("T")[0] || ""}
                  </p>
                  <p>
                    <span className="font-bold">Roll No:</span>{" "}
                    {reciptDetails.student?.rollNo || ""}
                  </p>
                  <p>
                    <span className="font-bold">Class:</span>{" "}
                    {reciptDetails.student?.class.class || ""}
                  </p>
                  <p>
                    <span className="font-bold">Division:</span>{" "}
                    {reciptDetails.student?.division || ""}
                  </p>
                  <p className="col-span-2">
                    <span className="font-bold">Student:</span>{" "}
                    {reciptDetails.student?.firstName || ""}{" "}
                    {reciptDetails.student?.fatherName}{" "}
                    {reciptDetails.student?.lastName || ""}
                  </p>
                </div>

                <hr className="my-2 border-t border-gray-300" />

                {/* Fee Details */}
                <table className="relative w-full text-left border border-collapse border-slate-600">
                  <thead>
                    <tr>
                      <th className="border border-slate-600 px-2 py-1 font-semibold">
                        Particulars
                      </th>
                      <th className="border border-slate-600 px-2 py-1 font-semibold">
                        Description
                      </th>
                      <th className="border border-slate-600 px-2 py-1 font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-600 px-2 py-1">
                        {reciptDetails.feeTypeName || ""}
                      </td>
                      <td className="border border-slate-600 px-2 py-1">
                        {/* {reciptDetails.installmentType || ""} */}
                        {reciptDetails.collectFees?.map((item) => {
                          return (
                            <span className="px-0.5">{`${item.installmentType}`}</span>
                          );
                        })}
                      </td>
                      <td className="border border-slate-600 px-2 py-1 text-right">
                        {reciptDetails.amount || ""}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="border border-slate-600 px-2 py-1 font-bold"
                        colSpan="2"
                      >
                        TOTAL
                      </td>
                      <td className="border border-slate-600 px-2 py-1 text-right font-bold">
                        {reciptDetails.amount || ""}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="mt-3 text-sm font-bold">{`Rs. ${numberToWords(
                  amount
                )} Rupees Only`}</p>
                {/* <p className="mt-3 text-sm font-bold">Rs. Three Hundred Only</p> */}

                <p className="text-sm mt-2">
                  <span className="font-bold">Payment Mode:</span>{" "}
                  {reciptDetails.modeOfPayment || ""}
                </p>
              </div>

              <div className="flex justify-end mt-8">
                <div className="text-center">
                  <p className="font-bold pt-4">Receiver's Signature</p>
                </div>
              </div>

              <div className="text-xs text-wrap mt-3 text-center text-gray-600">
                Please safely preserve this Fee Receipt for at least 12 months
                from the date of issue.
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={downloadPdf}
            // onClick={() => window.print()}
          >
            Download PDF
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={handleOnClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfGenerator;
