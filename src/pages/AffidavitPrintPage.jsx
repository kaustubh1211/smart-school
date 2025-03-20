import { Button } from "@/components/ui/button";
import { ChevronLeft, Printer } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const getDateInWords = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

const AffidavitPrintPage = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_LOCAL_API_URL
          }students/affidavit/download/${id}`,
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
      }
    };

    fetchStudentData();
  }, [id, accessToken]);

  const handleDownloadPDF = () => {
    const input = document.getElementById("printable-content");

    html2canvas(input, {
      scale: 2, // Increase scale for better quality
      useCORS: true, // Allow cross-origin images
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4"); // A4 size page
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Affidavit_${studentData?.student?.firstName || ""}.pdf`);
    });
  };

  if (!studentData) {
    return (
      <div className="container mx-auto py-10 no-print">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              ⚠️
            </span>
            Student Not Found
          </h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/affidavits")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">
            No student found with enrollment number: {id}
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/affidavits")}
          >
            Return to Affidavit List
          </Button>
        </div>
      </div>
    );
  }

  const dobInWords = getDateInWords(studentData?.student?.dob);
  const issueDate = studentData?.issueDate
    ? new Date(studentData.issueDate).toLocaleDateString("en-GB")
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 no-print">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              📄
            </span>
            Affidavit Preview
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/affidavits")}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Download Affidavit as PDF
            </Button>
          </div>
        </div>

        {/* Content to be printed */}
        <div
          id="printable-content"
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="w-[210mm] mx-auto bg-white">
            <div className="p-8 mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold font-serif text-red-800 print:text-2xl">
                  Shri Raghubir Primary English School
                </h1>
                <p className="text-sm mt-1 print:text-sm">
                  YADAV NAGAR, BOISAR (EAST), PALGHAR-401501 MAHARASHTRA
                </p>
                <p className="text-xs mt-1 print:text-xs">
                  Contact No.: 9657173935
                </p>
                <div className="border-b-2 border-red-800 my-4"></div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-bold underline print:text-xl">
                  SELF AFFIDAVIT
                </h2>
                <div className="px-4 mt-2 space-y-1">
                  <p className="text-xs print:text-xs">
                    (Parents/Guardians Written Promise letter Regarding their
                    Son / Daughter / Wards date of Birth)
                  </p>
                  <p className="text-xs print:text-xs">
                    (Maharashtra Government)
                  </p>
                  <p className="text-xs print:text-xs">
                    Decision Std P.R.E. / 2010 / (215) Primary Education
                    Mantralaya Mumbai - 32, Dated: 11-06-2010
                  </p>
                  <p className="text-sm mt-2 print:text-sm">
                    DATE OF BIRTH (AGE) PROMISE LETTER
                  </p>
                </div>
                <p className="text-sm mt-2 print:text-sm">
                  (To Be Submitted At Time Of Admission If There Is No Birth
                  Certificate /Leaving Certificate)
                </p>
              </div>

              <div className="space-y-6 text-justify leading-relaxed print:text-base">
                <p>
                  I Shri/Smt{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.fatherName || ""}
                  </span>
                  , Father of{" "}
                  <span className="font-bold underline decoration-dotted">
                    {studentData?.student?.firstName || ""}
                  </span>
                  , Residing At{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.address || ""}
                  </span>{" "}
                  Do Here With On Solemn Affirmation State That My Child/ward
                  was born on{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.dob?.split("T")[0] || ""}
                  </span>
                  <span> In words ( </span>
                  <span className="font-bold underline decoration-dotted mx-1">
                    {dobInWords}
                  </span>{" "}
                  ). At{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.city || ""}
                  </span>
                  , ( Place of Birth ), Dist.{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.state || ""}
                  </span>
                  , State{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.state || ""}
                  </span>
                </p>

                <p>
                  I have Not Registered His Birth details At Any Appropriate
                  Authority. Hence I am Giving This Self Affidavit To the School
                  Authority For Admission Of My Child In Standard{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.class?.class || ""}
                  </span>
                  , Medium{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.mediumName || ""}
                  </span>{" "}
                  Academic Year{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.academicYearName || ""}
                  </span>
                  .
                </p>

                <p>
                  I State That Information Given Above is True and Correct To
                  Best Of My Knowledge. I Solely Shall Be Responsible For
                  cancellation Of admission if The information given above is
                  false or incorrect.
                  <br />I Request You to authorize to kind for Grant the
                  admission to my child in Standard{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.class?.class || ""}
                  </span>{" "}
                  Medium{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.mediumName || ""}
                  </span>{" "}
                  Academic Year{" "}
                  <span className="font-bold underline decoration-dotted mx-1">
                    {studentData?.student?.academicYearName || ""}
                  </span>
                  .
                </p>
              </div>

              <div className="mt-16 grid grid-cols-2 gap-8 print:mt-20">
                <div>
                  <p className="mb-2">
                    Date:{" "}
                    <span className="font-bold underline decoration-dotted mx-1">
                      {issueDate}
                    </span>
                  </p>
                  <p>
                    Place:{" "}
                    <span className="font-bold underline decoration-dotted mx-1">
                      PALGHAR
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <div className="flex gap-4 mb-4">
                      <div className="border border-dashed border-gray-400 h-24 w-24 flex items-center justify-center text-xs text-gray-500 print:border-2">
                        Student Image
                      </div>
                      <div className="border border-dashed border-gray-400 h-24 w-24 flex items-center justify-center text-xs text-gray-500 print:border-2">
                        Parent's Image
                      </div>
                    </div>
                    <div className="text-left space-y-2">
                      <p>
                        Parent Name:{" "}
                        <span className="font-bold underline decoration-dotted mx-1">
                          {studentData?.student?.fatherName || ""}
                        </span>
                      </p>
                      <p>Parent's Sign: _________________</p>
                      <p>
                        Mobile No.:{" "}
                        <span className="font-bold underline decoration-dotted mx-1">
                          {studentData?.student?.fatherPhone || ""}
                        </span>
                      </p>
                      <p>
                        Aadhaar No.:{" "}
                        <span className="font-bold underline decoration-dotted mx-1">
                          {studentData?.student?.aadhaarNo || ""}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffidavitPrintPage;
