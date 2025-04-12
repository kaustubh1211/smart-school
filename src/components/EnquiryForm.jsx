import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function EnquiryForm() {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState({
    referenceId: id,
    studentName: "",
    medium: "",
    standard: "",
    issueDate: new Date().toLocaleDateString(),
    fees: {
      workbook: 0,
      admissionFee: 0,
      term1: 0,
      monthlyFee: 0,
      term2: 0,
      idCardAndOthers: 0,
      computerFee: 0,
      examFee1: 0,
      examFee2: 0,
      sportsFees: 0,
      busFees: 0,
      labCharge: 0,
    },
  });

  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/enquiry/download?enquiryId=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          const { details, feesDetails } = response.data.data;

          const processedFees = {
            workbook: 0,
            admissionFee: 0,
            term1: 0,
            monthlyFee: 0,
            term2: 0,
            idCardAndOthers: 0,
            computerFee: 0,
            examFee1: 0,
            examFee2: 0,
            sportsFees: 0,
            busFees: 0,
            labCharge: 0,
          };

          const monthlyFees = feesDetails.filter(
            (fee) => fee.installmentType === "Monthly fee"
          );
          const totalMonthlyFee = monthlyFees.reduce(
            (sum, fee) => sum + parseFloat(fee.amount),
            0
          );
          processedFees.monthlyFee = totalMonthlyFee / monthlyFees.length;

          feesDetails.forEach((fee) => {
            if (fee.installmentType === "One time") {
              switch (fee.feeTypeName) {
                case "Workbook":
                  processedFees.workbook = parseFloat(fee.amount);
                  break;
                case "Admission Fee":
                  processedFees.admissionFee = parseFloat(fee.amount);
                  break;
                case "Computer Fee":
                  processedFees.computerFee = parseFloat(fee.amount);
                  break;
                case "Sports Fees":
                  processedFees.sportsFees = parseFloat(fee.amount);
                  break;
                case "Bus Fees":
                  processedFees.busFees = parseFloat(fee.amount);
                  break;
                case "Lab Charge":
                  processedFees.labCharge = parseFloat(fee.amount);
                  break;
                default:
                  break;
              }
            }
          });

          const fullName = `${details.firstName} ${details.lastName}`;

          setFormData({
            referenceId: details.enquiryNo,
            studentName: fullName,
            medium: details?.class?.mediumName,
            standard: details?.class?.class,
            issueDate: new Date().toLocaleDateString(),
            fees: processedFees,
          });
        } else {
          navigate("/enquiry");
        }
      } catch (error) {
        console.error("Error fetching enquiry data:", error);
        navigate("/enquiry");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEnquiryData();
    } else {
      navigate("/enquiry");
    }
  }, [id, navigate, accessToken]);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Get the form element
      const element = document.getElementById("enquiry-form");

      if (!element) {
        throw new Error("Form element not found");
      }

      // Use html2canvas to capture the form as an image
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Calculate the PDF dimensions
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`Enquiry_Form_${formData.referenceId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 text-right">
        <Button
          onClick={generatePDF}
          variant="outline"
          className="border border-gray-300"
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>

      <div
        id="enquiry-form"
        className="w-full md:w-[932px] h-auto md:h-[560px] p-4 md:p-8 border-2 border-blue-900 rounded bg-white"
      >
        {/* Your existing form content */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
              <span className="ml-auto text-gray-400">Logo</span>
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-blue-900 text-center">
              SHRI RAGHUBIR JUNIOR COLLEGE OF SCIENCE & COMMERCE
            </h1>
          </div>
          <p className="text-sm text-center mt-1">
            YADAV NAGAR,BOISAR (EAST), PALGHAR-401501,MAHARASHTRA
          </p>
          <p className="text-sm text-center">Contact No: 9657672935</p>
          <div className="w-full h-1 bg-red-800 mt-2"></div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="md:w-1/3"></div>
          <h2 className="text-xl underline font-bold text-center mx-auto">
            Enquiry Form
          </h2>
          <p className="text-right font-bold md:w-1/3">
            Issue Date: {formData.issueDate}
          </p>
        </div>

        <div className="mb-6 text-center">
          <p className="text-sm">
            Your Enquiry Has Been Successfully Registered, Reference Id:{" "}
            <strong>{formData.referenceId}</strong>
          </p>
        </div>
        <div className="text-center">
          <p>
            Name Of Student: <strong>{formData.studentName}</strong>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="text-center md:text-right">
            <p>
              Medium: <strong>{formData.medium}</strong>
            </p>
          </div>
          <div className="text-center md:text-left">
            <p>
              Standard: <strong>{formData.standard}</strong>
            </p>
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs md:text-sm">
                <th className="border border-gray-800 p-1 text-left">
                  Fee Name
                </th>
                <th className="border border-gray-800 p-1 text-left">
                  Workbook
                </th>
                <th className="border border-gray-800 p-1 text-left">
                  Admission Fee
                </th>
                <th className="border border-gray-800 p-1 text-left">
                  Monthly Fee
                </th>
                <th className="border border-gray-800 p-1 text-left">
                  Bus Fees
                </th>
                <th className="border border-gray-800 p-1 text-left">
                  Lab Charge
                </th>
                <th className="border border-gray-800 p-1 text-left">
                  Computer Fee
                </th>
                <th className="border border-gray-800 p-1 text-left">
                  Sports Fees
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xs md:text-sm">
                <td className="border text-center border-gray-800 p-1">
                  Fee Amount
                </td>
                <td className="border text-center border-gray-800 p-1">
                  {(formData.fees.workbook || 0).toFixed(2)}
                </td>
                <td className="border text-center border-gray-800 p-1">
                  {(formData.fees.admissionFee || 0).toFixed(2)}
                </td>
                <td className="border text-center border-gray-800 p-1">
                  {(formData.fees.monthlyFee || 0).toFixed(2)}
                </td>
                <td className="border text-center border-gray-800 p-1">
                  {(formData.fees.busFees || 0).toFixed(2)}
                </td>
                <td className="border text-center border-gray-800 p-1">
                  {(formData.fees.labCharge || 0).toFixed(2)}
                </td>
                <td className="border text-center border-gray-800 p-1">
                  {(formData.fees.computerFee || 0).toFixed(2)}
                </td>
                <td className="border text-center border-gray-800 p-1">
                  {(formData.fees.sportsFees || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6 text-center">
          <p className="font-medium text-sm">
            Kindly Quote your Enquiry Number For Further Admission Process.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <div className="font-bold mb-2">Note:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold text-sm">
              <ul className="list-disc pl-6">
                <li>2 passport size photos</li>
                <li>Original LC</li>
                <li>Affidavit</li>
              </ul>
              <ul className="list-disc pl-6">
                <li>Original Birth Certificate</li>
                <li>1 Xerox Of Birth Certificate</li>
                <li>1 Xerox Of Aadhar Card</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="w-16 h-16 border border-gray-400">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=EnquiryID:${formData.referenceId}`}
                alt="QR Code"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <p className="font-bold underline">Clerk / Admin-Incharge</p>
        </div>
      </div>
    </div>
  );
}
