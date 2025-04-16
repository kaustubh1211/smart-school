import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const BonafideCertificate = () => {
  const certificateRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch certificate data
  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }certificate/bonafied/download/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setCertificateData(response.data.data);
        } else {
          setError("Failed to fetch certificate data");
        }
      } catch (err) {
        setError(err.message || "Error fetching certificate data");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [id]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `Bonafide_Certificate_${
          certificateData?.student?.firstName || "student"
        }.pdf`
      );
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Error generating PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <p>No certificate data found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Format data from the API response
  const {
    studentId,
    issueDate,
    student: {
      grNo,
      enrollNo,
      dob,
      class: studentClass,
      firstName,
      lastName,
      city,
      state,
      fatherName,
      fatherPhone,
      address,
    },
  } = certificateData;

  const fullName = `${firstName} ${lastName}`;
  const formattedDob = dayjs(dob).format("DD-MM-YYYY");
  const formattedIssueDate = dayjs(issueDate).format("DD-MM-YYYY");
  const place = `${city}, ${state}`;
  const bno = `BON-${studentId}`;

  return (
    <div className="fixed inset-0 flex flex-col space-y-4 items-center justify-center z-50 bg-gray-100 p-4">
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Download size={16} />
          Download Certificate
        </Button>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <X size={16} />
          Close
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-lg max-w-[859px] w-full max-h-screen overflow-auto">
        <div className="p-4">
          <div ref={certificateRef} className="bg-white p-8">
            {/* Certificate with decorative border */}
            <div className="border-[4px] border-[#000] border-dotted p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="School logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-center flex-1">
                  <h1 className="text-xl font-bold">
                    Shri Raghubir Madhyamik Vidyalaya
                  </h1>
                  <p className="text-sm font-light">
                    YADAV NAGAR, BOISAR (EAST), PALGHAR-401501, MAHARASHTRA
                  </p>
                </div>

                <div className="w-[70px] h-[96px] flex-shrink-0 border border-gray-400">
                  <img
                    src="/placeholder.svg?height=128&width=96"
                    alt="Student photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex border font-light border-gray-800 mb-6">
                <div className="border-r border-gray-800 p-1 ">
                  <p className="mr-20">
                    Sr.No.: <strong>{bno}</strong>
                  </p>
                </div>
                <div className="flex-1 text-center border-r border-gray-800 p-1  font-bold ">
                  BONAFIDE CERTIFICATE
                </div>
                <div className="p-1">
                  <p>
                    Issue Date: <strong>{formattedIssueDate}</strong>
                  </p>
                </div>
              </div>

              <div className="mb-1 font-light">
                <p className="text-center font-bold underline mb-1">
                  TO WHOM SO EVER IT MAY CONCERN
                </p>
                <p className="mb-1">
                  This is to certify that{" "}
                  <strong className="underline">{fullName}</strong> is a
                  bonafide student of the school studying in{" "}
                  <strong className="underline">{studentClass.class}</strong>{" "}
                  during the academic year{" "}
                  <strong className="underline">2024-25</strong>
                </p>

                <p className="mb-1">
                  Following is the extract from the School Register.
                </p>

                <table className="w-full border-collapse border border-gray-800 mb-1">
                  <tbody>
                    <tr>
                      <td className="border border-gray-800 w-32">
                        Enroll No.
                      </td>
                      <td className="border border-gray-800 w-4 text-center">
                        :
                      </td>
                      <td className="border border-gray-800 ">{enrollNo}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-800 ">Gr No.</td>
                      <td className="border border-gray-800 text-center">:</td>
                      <td className="border border-gray-800 ">{grNo}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-800 ">Name</td>
                      <td className="border border-gray-800 text-center">:</td>
                      <td className="border border-gray-800 ">{fullName}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-800 ">Date of Birth</td>
                      <td className="border border-gray-800 text-center">:</td>
                      <td className="border border-gray-800 ">
                        {formattedDob}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-800 ">
                        Place of Birth
                      </td>
                      <td className="border border-gray-800 text-center">:</td>
                      <td className="border border-gray-800 ">{place}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-800 ">Father's Name</td>
                      <td className="border border-gray-800 text-center">:</td>
                      <td className="border border-gray-800 ">{fatherName}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-800 ">Address</td>
                      <td className="border border-gray-800 text-center">:</td>
                      <td className="border border-gray-800 ">{address}</td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  This certificate is issued at the request of the student for{" "}
                  <strong>official purposes</strong>.
                </p>
              </div>

              <div className="flex justify-evenly mt-64">
                <div className="text-center">
                  <p className="font-bold">Clerk</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">Head Master</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
